/* EvoBuskin V23 — le serveur Supabase est la source de vérité multi-appareils.
 * Les écritures métier continuent à passer par les RPC sécurisées de SyncManager.
 * Ce module ne fait que télécharger un snapshot autorisé et le projeter dans IndexedDB.
 *
 * V23 : VITESSE.
 *  - les tables locales sont lues UNE seule fois et indexées en mémoire (avant : relues pour chaque ligne reçue) ;
 *  - seules les lignes réellement modifiées sont réécrites, en une seule transaction par table ;
 *  - deux demandes simultanées partagent le même téléchargement (plus de faux « échec ») ;
 *  - le résultat indique si quelque chose a changé (« modifie »), pour ne redessiner l'écran que si nécessaire.
 */
const CloudSnapshotSync = (() => {
  let businessId = null, lastSyncAt = 0, timer = null, enCours = null, signatureAudit = '';
  const ms = (v) => {
    if (v === null || v === undefined || v === '') return Date.now();
    const n = typeof v === 'number' ? v : Date.parse(v);
    return Number.isFinite(n) ? n : Date.now();
  };
  const n = (v, d = 0) => v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? d : Number(v);
  const arr = (v) => Array.isArray(v) ? v : [];
  const object = (v) => v && typeof v === 'object' && !Array.isArray(v) ? v : {};

  // ---------- Index en mémoire d'une table locale ----------
  function creerIndex(lignes) {
    const x = { byId: new Map(), byCloud: new Map(), byIdem: new Map(), byVente: new Map(), nouveaux: [], aEcrire: new Map(), modifie: false };
    lignes.forEach((r) => enregistrer(x, r));
    return x;
  }
  function enregistrer(x, r) {
    if (r.id !== undefined && r.id !== null) x.byId.set(Number(r.id), r);
    if (r.cloudId !== undefined && r.cloudId !== null) x.byCloud.set(String(r.cloudId), r);
    if (r.idempotencyKey) x.byIdem.set(r.idempotencyKey, r);
    if (r.venteId !== undefined && r.venteId !== null && r.type === 'dette') {
      const l = x.byVente.get(r.venteId) || []; if (!l.includes(r)) l.push(r); x.byVente.set(r.venteId, l);
    }
  }
  function remplacer(x, ancien, nouveau) {
    // L'ancienne version est remplacée partout par la nouvelle
    const l = x.byVente.get(ancien.venteId);
    if (l) { const i = l.indexOf(ancien); if (i >= 0) l[i] = nouveau; }
    enregistrer(x, nouveau);
    x.aEcrire.set(Number(nouveau.id), nouveau);
    x.modifie = true;
  }

  // Équivalent de l'ancien « saveCloud », mais sans aucune lecture de la base : tout se fait dans l'index.
  function sauver(x, row, cloudId, preferredId, options = {}) {
    let local = cloudId === null || cloudId === undefined ? null : (x.byCloud.get(String(cloudId)) || null);
    if (!local && options.match) {
      const candidats = options.candidats ? options.candidats() : [...x.byId.values()];
      local = candidats.find(options.match) || null;
    }
    if (!local && options.preferLocalId && Number.isInteger(Number(preferredId)) && Number(preferredId) !== 0) {
      const candidate = x.byId.get(Number(preferredId)) || null;
      if (candidate) {
        if (!options.collision || !options.collision(candidate, row)) local = candidate;
      } else {
        // Entité au local_id stable (produit, client, fournisseur) : on garde la clé locale d'origine
        const fresh = Object.assign({}, row, { id: Number(preferredId), cloudId: cloudId == null ? null : cloudId });
        if (options.finaliser) options.finaliser(fresh);
        enregistrer(x, fresh);
        x.aEcrire.set(Number(fresh.id), fresh);
        x.modifie = true;
        return fresh;
      }
    }
    if (local) {
      if (local.id === undefined || local.id === null) {
        // ligne nouvelle de ce même téléchargement, pas encore écrite : on la complète sur place
        Object.assign(local, row, { cloudId: cloudId == null ? local.cloudId : cloudId });
        enregistrer(x, local);
        return local;
      }
      const saved = Object.assign({}, local, row, { id: local.id, cloudId: cloudId == null ? local.cloudId : cloudId });
      if (options.finaliser) options.finaliser(saved);
      if (JSON.stringify(saved) === JSON.stringify(local)) return local;   // rien n'a changé : aucune écriture
      remplacer(x, local, saved);
      return saved;
    }
    const fresh = Object.assign({}, row, { cloudId: cloudId == null ? null : cloudId });
    delete fresh.id;
    x.nouveaux.push(fresh);
    enregistrer(x, fresh);
    x.modifie = true;
    return fresh;
  }

  // Écrit en une seule fois tout ce qui a changé dans une table
  async function vider(table, x) {
    const lot = x.nouveaux.concat([...x.aEcrire.values()]);
    x.aEcrire = new Map();
    const nouveaux = x.nouveaux; x.nouveaux = [];
    if (!lot.length) return;
    await DB.ecrireLot(table, lot);
    nouveaux.forEach((r) => x.byId.set(Number(r.id), r));
  }

  async function telechargerEtProjeter() {
    const linkedBusiness = await DB.lireParam('cloudBusinessId', null);
    if (linkedBusiness && String(linkedBusiness) !== String(businessId)) {
      return { ok: false, raison: 'appareil-autre-boutique' };
    }
    const snapshot = object(await CloudDB.rpc('v18_business_snapshot', { p_business_id: businessId }));
    if (snapshot.business_id && String(snapshot.business_id) !== String(businessId)) throw new Error('BUSINESS_ACCESS_DENIED');
    const rawProducts = arr(snapshot.products), rawCustomers = arr(snapshot.customers), rawSuppliers = arr(snapshot.suppliers);

    // Toutes les tables locales sont lues UNE fois
    const noms = ['produits', 'clients', 'fournisseurs', 'ventes', 'dettes', 'achats', 'dettesFournisseurs', 'depenses', 'mouvements'];
    const lues = await Promise.all(noms.map((t) => DB.tout(t)));
    const I = {}; noms.forEach((t, i) => { I[t] = creerIndex(lues[i]); });
    const pending = await DB.syncQueueListe({ businessId });
    const productLocal = new Map(), customerLocal = new Map(), supplierLocal = new Map(), saleLocal = new Map(), purchaseLocal = new Map();
    const pendingProductIds = new Set();
    const pendingCancelKeys = new Set();
    for (const op of pending.filter((x) => x.status !== 'synced')) {
      for (const line of arr(op.payload?.p_lignes)) {
        const id = n(line.produitLocalId || line.produitId, 0); if (id) pendingProductIds.add(id);
      }
      if (op.type === 'sale_cancel') {
        if (op.payload?.p_sale_idempotency_key) pendingCancelKeys.add(String(op.payload.p_sale_idempotency_key));
        const localSale = op.payload?.p_sale_local_id != null ? I.ventes.byId.get(Number(op.payload.p_sale_local_id)) : null;
        for (const line of arr(localSale?.lignes)) { const id = n(line.produitId, 0); if (id) pendingProductIds.add(id); }
      }
    }

    // ----- Produits -----
    const prod = rawProducts.map((r) => {
      const localId = n(r.local_id, 0);
      const beforeProduct = localId ? (I.produits.byId.get(localId) || null) : null;
      const beforeStock = beforeProduct ? beforeProduct.stock : null;
      const p = {
        nom: r.nom || 'Produit', categorie: r.categorie || '', codeBarres: r.code_barres || '',
        unite: r.unite || '', devise: r.devise || 'USD', prixVente: n(r.prix_vente), prixAchat: n(r.prix_achat),
        stock: n(r.stock), seuil: n(r.stock_min), image: r.image_url || null, actif: r.actif !== false,
        prixGros: n(r.prix_gros ?? object(r.metadata).prixGros, null), seuilGros: n(r.seuil_gros ?? object(r.metadata).seuilGros, null),
        cartonQte: n(r.carton_qte ?? object(r.metadata).cartonQte, null), prixCarton: n(r.prix_carton ?? object(r.metadata).prixCarton, null)
      };
      const saved = sauver(I.produits, p, r.id, localId || null, {
        preferLocalId: !!localId,
        collision: (candidate) => candidate.cloudId && String(candidate.cloudId) !== String(r.id),
        // Une vente locale en attente garde son stock local jusqu'à sa confirmation serveur.
        finaliser: (s) => { if ((pendingProductIds.has(s.id) || pendingProductIds.has(localId)) && beforeProduct) s.stock = beforeStock; }
      });
      return { r, localId, saved };
    });
    await vider('produits', I.produits);
    prod.forEach(({ r, localId, saved }) => { productLocal.set(String(r.id), saved.id); if (localId) productLocal.set(String(localId), saved.id); });

    // ----- Clients et fournisseurs -----
    const clients = rawCustomers.map((r) => {
      const localId = n(r.local_id, 0);
      const saved = sauver(I.clients, {
        nom: r.nom || 'Client', tel: r.tel || '', email: r.email || '', adresse: r.adresse || '',
        actif: r.deleted_at ? false : r.actif !== false
      }, r.id, localId || null, { preferLocalId: !!localId, collision: (candidate) => candidate.cloudId && String(candidate.cloudId) !== String(r.id) });
      return { r, localId, saved };
    });
    const fournisseurs = rawSuppliers.map((r) => {
      const localId = n(r.local_id, 0);
      const saved = sauver(I.fournisseurs, {
        nom: r.nom || 'Fournisseur', tel: r.tel || '', email: r.email || '', adresse: r.adresse || '', actif: r.deleted_at ? false : true
      }, r.id, localId || null, { preferLocalId: !!localId, collision: (candidate) => candidate.cloudId && String(candidate.cloudId) !== String(r.id) });
      return { r, localId, saved };
    });
    await Promise.all([vider('clients', I.clients), vider('fournisseurs', I.fournisseurs)]);
    clients.forEach(({ r, localId, saved }) => { customerLocal.set(String(r.id), saved.id); if (localId) customerLocal.set('local:' + localId, saved.id); });
    fournisseurs.forEach(({ r, localId, saved }) => { supplierLocal.set(String(r.id), saved.id); if (localId) supplierLocal.set('local:' + localId, saved.id); });

    // ----- Ventes -----
    const ventes = arr(snapshot.sales).map((r) => {
      const meta = object(r.metadata), localId = n(r.local_id, 0), idem = r.idempotency_key || null;
      const lines = arr(r.lignes).map((l) => ({
        produitId: productLocal.get(String(l.produitLocalId || l.produitId)) || n(l.produitLocalId || l.produitId),
        nom: l.nom || 'Produit', qte: n(l.qte), facteur: n(l.facteur, 1),
        prixUnitaireUSD: n(l.prixUnitaireUSD ?? l.prixUnitaire ?? l.prix_unitaire),
        prixAchatUSD: n(l.prixAchatUSD ?? l.prixAchat ?? l.prix_achat)
      }));
      const existing = I.ventes.byCloud.get(String(r.id)) || (idem ? I.ventes.byIdem.get(idem) : null) || null;
      const preferred = localId ? (I.ventes.byId.get(localId) || null) : null;
      const existingId = existing ? existing.id : null, preferredId = preferred ? preferred.id : null;
      const saved = sauver(I.ventes, {
        date: ms(r.date), clientId: customerLocal.get(String(r.client_id)) || null, lignes: lines,
        totalUSD: n(r.total), payeUSD: n(r.paye), resteUSD: n(r.reste), coutUSD: n(meta.cost),
        mode: meta.mode || 'especes', devisePaiement: meta.devise_paiement || r.devise || 'USD',
        reference: meta.reference || '', vendeur: meta.vendeur || (r.vendeur_user_id ? 'Vendeur' : 'Patron'),
        annulee: r.annulee === true || (idem && pendingCancelKeys.has(String(idem))), idempotencyKey: idem, dateAnnulation: meta.cancelled_at ? ms(meta.cancelled_at) : null
      }, r.id, null, {
        match: (v) => (idem && v.idempotencyKey === idem) || String(v.cloudId) === String(r.id),
        candidats: () => (idem && I.ventes.byIdem.get(idem)) ? [I.ventes.byIdem.get(idem)] : [],
        collision: (candidate) => Boolean(candidate && existing && candidate.id !== existing.id)
      });
      return { r, localId, saved, existingId, preferredId };
    });
    await vider('ventes', I.ventes);
    ventes.forEach(({ r, localId, saved, existingId, preferredId }) => {
      saleLocal.set(String(r.id), saved.id);
      if (localId) saleLocal.set('local:' + localId, saved.id);
      if (preferredId != null && existingId != null && preferredId === existingId && preferredId !== saved.id) saleLocal.set(String(r.id), preferredId);
    });

    // ----- Dettes clients -----
    arr(snapshot.customer_debts).forEach((r) => {
      const localId = n(r.local_id, 0);
      const mappedSaleId = saleLocal.get(String(r.sale_id)) || null;
      const amountUSD = n(r.montant_usd ?? r.montant);
      sauver(I.dettes, {
        clientId: customerLocal.get(String(r.customer_id)) || null,
        venteId: mappedSaleId,
        date: ms(r.date), type: r.type, montantUSD: amountUSD,
        devise: r.devise || 'USD', mode: object(r.metadata).mode || null, note: r.note || '',
        cloudSaleId: r.sale_id || null
      }, r.id, localId || null, {
        preferLocalId: !!localId,
        match: (d) => r.type === 'dette' && mappedSaleId != null && d.venteId === mappedSaleId && d.type === 'dette' && Math.abs(n(d.montantUSD) - amountUSD) < 0.02,
        candidats: () => (r.type === 'dette' && mappedSaleId != null) ? (I.dettes.byVente.get(mappedSaleId) || []) : [],
        collision: () => true
      });
    });

    // ----- Achats -----
    const achats = arr(snapshot.purchases).map((r) => {
      const localId = n(r.local_id, 0), meta = object(r.metadata);
      const saved = sauver(I.achats, {
        fournisseurId: supplierLocal.get(String(r.supplier_id)) || null, date: ms(r.date),
        totalUSD: n(r.total), payeUSD: n(r.paye), resteUSD: n(r.reste), devise: r.devise || 'USD',
        lignes: arr(r.lignes).map((l) => Object.assign({}, l, { produitId: productLocal.get(String(l.produitLocalId || l.produitId)) || n(l.produitLocalId || l.produitId) })),
        note: meta.note || '', cloudSellerId: r.vendeur_user_id || null
      }, r.id, localId || null, { preferLocalId: !!localId, collision: () => true });
      return { r, localId, saved };
    });
    await vider('achats', I.achats);
    achats.forEach(({ r, localId, saved }) => { purchaseLocal.set(String(r.id), saved.id); if (localId) purchaseLocal.set('local:' + localId, saved.id); });

    // ----- Dettes fournisseurs, dépenses, mouvements de stock -----
    arr(snapshot.supplier_debts).forEach((r) => {
      sauver(I.dettesFournisseurs, {
        fournisseurId: supplierLocal.get(String(r.supplier_id)) || null,
        achatId: purchaseLocal.get(String(r.purchase_id)) || null, date: ms(r.date), type: r.type,
        montantUSD: n(r.montant_usd ?? r.montant), devise: r.devise || 'USD', note: r.note || ''
      }, r.id, n(r.local_id, 0) || null, { preferLocalId: !!n(r.local_id, 0), collision: () => true });
    });
    arr(snapshot.expenses).forEach((r) => {
      const meta = object(r.metadata);
      sauver(I.depenses, {
        date: ms(r.date), categorie: r.categorie || 'Autre', montantUSD: n(r.montant_usd ?? r.montant),
        devise: r.devise || 'USD', note: r.note || meta.note || '',
        vendeur: r.author_user_id || null
      }, r.id, n(r.local_id, 0) || null, { preferLocalId: !!n(r.local_id, 0), collision: () => true });
    });
    arr(snapshot.stock_movements).forEach((r) => {
      const productLocalId = productLocal.get(String(r.product_id)) || n(r.product_id);
      const localProduct = I.produits.byId.get(Number(productLocalId));
      sauver(I.mouvements, {
        produitId: productLocalId,
        nom: object(r.metadata).product_name || localProduct?.nom || '', date: ms(r.date), type: r.type, qte: n(r.qte),
        note: r.note || '', vendeur: r.vendeur_user_id || ''
      }, r.id, n(r.local_id, 0) || null, { preferLocalId: !!n(r.local_id, 0), collision: () => true });
    });
    await Promise.all([vider('dettes', I.dettes), vider('dettesFournisseurs', I.dettesFournisseurs), vider('depenses', I.depenses), vider('mouvements', I.mouvements)]);

    // ----- Réglages partagés, journal, repères -----
    const settingsRow = object(snapshot.business_settings);
    const settings = object(settingsRow.settings);
    let reglagesChanges = false;
    if (Object.keys(settings).length) {
      for (const [k, v] of Object.entries(settings)) {
        if (['taux', 'nomBoutique', 'telBoutique', 'affichage', 'derniereSauvegarde'].includes(k) && JSON.stringify(App.reglages[k]) !== JSON.stringify(v)) {
          App.reglages[k] = v; await DB.ecrireParam(k, v); reglagesChanges = true;
        }
      }
      if (reglagesChanges) $('#nomBoutique').textContent = App.reglages.nomBoutique || App.reglages.business_name || 'EvoBuskin';
    }
    const audits = arr(snapshot.audit_logs);
    const signature = audits.length + ':' + (audits.length ? String(audits[audits.length - 1].id) : '');
    if (signature !== signatureAudit) { await DB.ecrireParam('cloudAuditLogs', audits); signatureAudit = signature; }
    await DB.ecrireParam('cloudBusinessId', businessId);
    await DB.ecrireParam('cloudSnapshotSyncedAt', Date.now());
    lastSyncAt = Date.now();
    const modifie = reglagesChanges || noms.some((t) => I[t].modifie);
    return { ok: true, modifie, ventes: arr(snapshot.sales).length, dettes: arr(snapshot.customer_debts).length };
  }

  function tirer(options = {}) {
    if (enCours) return enCours;                                  // un téléchargement est déjà en route : on le partage
    if (!businessId || !navigator.onLine || !CloudDB.ready()) return Promise.resolve({ ok: false, raison: 'hors-ligne' });
    if (!options.force && Date.now() - lastSyncAt < 15000) return Promise.resolve({ ok: true, cache: true, modifie: false });
    enCours = (async () => {
      try { return await telechargerEtProjeter(); }
      catch (e) { console.error('Téléchargement des données cloud :', e); return { ok: false, raison: 'erreur', erreur: e }; }
      finally { enCours = null; }
    })();
    return enCours;
  }

  async function demarrer(id, options = {}) {
    arreter(); businessId = id || null;
    timer = setInterval(() => {
      if (window.TempsReel && TempsReel.actif() && Date.now() - lastSyncAt < 120000) return; // le temps réel s'en charge
      tirer().then((r) => { if (r.ok && r.modifie && window.TempsReel) TempsReel.rafraichirVue(); });
    }, 20000);
    window.addEventListener('online', onOnline);
    const promesse = tirer({ force: true });
    if (options.sansAttendre) return promesse;
    const result = await promesse;
    if (!result.ok && result.raison !== 'hors-ligne') console.warn('Snapshot cloud non téléchargé :', result.erreur || result.raison);
    return result;
  }
  function onOnline() { tirer({ force: true }).then((r) => { if (r.ok && r.modifie && window.TempsReel) TempsReel.rafraichirVue(); }); }
  function arreter() { if (timer) clearInterval(timer); timer = null; window.removeEventListener('online', onOnline); businessId = null; lastSyncAt = 0; signatureAudit = ''; }
  function derniereMiseAJour() { return lastSyncAt; }
  return { tirer, demarrer, arreter, derniereMiseAJour };
})();
window.CloudSnapshotSync = CloudSnapshotSync;
