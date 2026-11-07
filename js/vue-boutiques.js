/* EvoBuskin - MES BOUTIQUES (patron) : ajouter plusieurs boutiques et passer de l'une à l'autre.
   Chaque boutique a ses propres produits, clients, ventes et vendeurs. */
const VueBoutiques = {
  async afficher(conteneur) {
    // Liste gardée sur l'appareil : affichée tout de suite, puis actualisée depuis le serveur
    let boutiques = (await DB.lireParam('boutiquesCache', null)) || null;
    if (!boutiques) conteneur.innerHTML = App.entete('Mes boutiques') + '<div class="chargement-ecran"><span class="rond"></span><span>Chargement…</span></div>';
    else this.dessiner(conteneur, boutiques);
    try {
      if (!navigator.onLine) throw Reseau.erreur();
      const frais = await CloudDB.rpc('v19_my_shops', {}) || [];
      await DB.ecrireParam('boutiquesCache', frais);
      if (App.onglet !== 'boutiques') return;
      boutiques = frais;
    } catch (e) {
      if (!boutiques) conteneur.innerHTML = App.entete('Mes boutiques') + '<div class="bandeau rouge">' + esc(Reseau.traduire(e)) + '</div>';
      return;
    }
    this.dessiner(conteneur, boutiques);
  },

  dessiner(conteneur, boutiques) {
    const nbVerr = boutiques.filter((b) => b.is_locked).length;
    conteneur.innerHTML = App.entete('Mes boutiques') +
      (nbVerr ? '<div class="bandeau"><b>🔒 ' + nbVerr + ' boutique' + (nbVerr > 1 ? 's' : '') + ' verrouillée' + (nbVerr > 1 ? 's' : '') + '.</b> Votre niveau d’abonnement est limité à ' + esc(String(Abonnement.limite('shops'))) + ' boutique(s). Les autres sont conservées avec toutes leurs données, mais ne peuvent plus être ouvertes ni utilisées. Elles se débloquent au passage à un niveau supérieur.<button class="btn contour" data-aller-abonnement style="margin-top:8px">Débloquer</button></div>' : '') +
      '<p class="petit">Chaque boutique a ses produits, ses clients, ses ventes et ses vendeurs. Les invitations de vendeurs concernent la boutique ouverte.</p>' +
      '<div class="liste">' + boutiques.map((b) => {
        const active = String(b.id) === String(App.businessId);
        return '<div class="ligne' + (b.is_locked ? ' verrouille' : '') + '" style="cursor:default;align-items:center"><div><div class="nom">' + (b.is_locked ? '🔒 ' : '') + esc(b.name) + (active ? ' <span class="badge">Ouverte</span>' : '') + (b.is_locked ? ' <span class="badge rouge">Verrouillée</span>' : '') + '</div>' +
          '<div class="sous">' + Number(b.sellers) + ' vendeur(s)</div></div><div style="display:flex;gap:6px">' +
          (active || b.is_locked ? '' : '<button class="btn" data-ouvrir="' + esc(b.id) + '" style="padding:6px 12px">Ouvrir</button>') +
          '<button class="btn gris" data-renommer="' + esc(b.id) + '" data-nom="' + esc(b.name) + '" style="padding:6px 12px">Renommer</button></div></div>';
      }).join('') + '</div>' +
      '<button class="btn" id="bAjout" style="margin-top:12px">+ Ajouter une boutique</button>';

    $$('[data-ouvrir]', conteneur).forEach((b) => b.addEventListener('click', () => this.ouvrir(b.dataset.ouvrir)));
    $$('[data-renommer]', conteneur).forEach((b) => b.addEventListener('click', () => this.renommer(b.dataset.renommer, b.dataset.nom)));
    $('#bAjout', conteneur).addEventListener('click', () => this.ajouter());
  },

  async ouvrir(id) {
    try {
      await Chargeur.pendant(() => App.changerBoutique(id), 'Ouverture de la boutique…');
      toast('Boutique ouverte', 'ok');
    } catch (e) { toast(Equipe.messageErreur(e), 'erreur'); }
  },

  async ajouter() {
    if (!(await Abonnement.verifierLimite('shops'))) return;
    const f = ouvrirFenetre('Nouvelle boutique',
      '<label class="champ"><span>Nom de la boutique</span><input id="bNom" maxlength="120" autocomplete="off" placeholder="Ex : Boutique Gombe"></label>' +
      '<div class="bandeau rouge" id="bErr" hidden></div><button class="btn" id="bOk">Créer la boutique</button>');
    $('#bOk', f.el).addEventListener('click', async () => {
      const nom = $('#bNom', f.el).value.trim();
      const err = (m) => { const e = $('#bErr', f.el); e.textContent = m; e.hidden = false; };
      if (nom.length < 2) return err('Écrivez le nom de la boutique (2 lettres minimum).');
      try {
        if (!navigator.onLine) throw Reseau.erreur();
        const r = await CloudDB.rpc('v19_create_business', { p_name: nom });
        f.fermer();
        if (await confirmer('Boutique créée', '« ' + nom + ' » est créée. L’ouvrir maintenant ?', 'Ouvrir')) await this.ouvrir(r.id);
        else App.rafraichir();
      } catch (e) { err(Equipe.messageErreur(e)); }
    });
  },

  renommer(id, ancien) {
    const f = ouvrirFenetre('Renommer la boutique',
      '<label class="champ"><span>Nouveau nom</span><input id="bNom" maxlength="120" autocomplete="off" value="' + esc(ancien) + '"></label>' +
      '<div class="bandeau rouge" id="bErr" hidden></div><button class="btn" id="bOk">Enregistrer</button>');
    $('#bOk', f.el).addEventListener('click', async () => {
      const nom = $('#bNom', f.el).value.trim();
      const err = (m) => { const e = $('#bErr', f.el); e.textContent = m; e.hidden = false; };
      if (nom.length < 2) return err('Écrivez le nom de la boutique (2 lettres minimum).');
      try {
        if (!navigator.onLine) throw Reseau.erreur();
        await CloudDB.rpc('v19_rename_business', { p_business_id: id, p_name: nom });
        if (String(id) === String(App.businessId)) { await App.sauverReglage('nomBoutique', nom); }
        f.fermer(); toast('Boutique renommée', 'ok'); App.rafraichir();
      } catch (e) { err(Equipe.messageErreur(e)); }
    });
  }
};
