/* EvoBuskin - visites guidées : chaque écran s'explique tout seul.
   Un projecteur éclaire le bouton concerné, une main le montre, et une fenêtre en bas explique en quelques mots.
   Boutons : Suivant, Précédent (dès la 2e étape), Passer, ✕ (annuler). Le point d'interrogation « ? » de l'en-tête relance la visite de l'écran ouvert.
   Chaque visite se lance automatiquement la 1re fois qu'un écran est ouvert (mémorisé par utilisateur sur l'appareil). */
const Visites = (() => {
  const CLE = 'evo_visite_';
  const lire = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };
  const uid = () => { try { return (typeof DB !== 'undefined' && DB.uidCourant && DB.uidCourant()) || 'local'; } catch (_) { return 'local'; } };
  const vu = (id) => lire(CLE + uid() + '_' + id) === '1';
  const marquerVu = (id) => ecrire(CLE + uid() + '_' + id, '1');

  /* ---------- Contenu : une liste d'étapes par écran ----------
     sel   : élément à éclairer (si absent à l'écran, la fenêtre s'affiche seule)
     clic  : on touche l'élément pour passer à l'étape suivante (ouvre un formulaire pour montrer ses champs ; il est refermé à la fin sans rien enregistrer)
     texte : explication courte */
  const TOURS = {
    caisse: [
      { sel: '#rech', titre: 'Chercher un produit', texte: 'Écrivez ici le <b>nom</b> d’un produit, ou tapez son <b>code-barres</b>. La liste se réduit tout de suite.' },
      { sel: '#btnScan', titre: 'Scanner un code-barres', texte: 'Touchez l’appareil photo, visez le code-barres : le produit est ajouté à la vente sans rien taper.' },
      { sel: '#cats', titre: 'Les catégories', texte: 'Touchez une catégorie pour ne voir que ses produits. « Tous » les affiche à nouveau.' },
      { sel: '#grille', titre: 'Ajouter au panier', texte: 'Touchez un produit pour l’<b>ajouter à la vente</b>. Touchez-le encore pour augmenter la quantité.' },
      { sel: '#barrePanier', titre: 'Le panier', texte: 'Dès qu’un produit est ajouté, cette barre apparaît. Touchez-la pour voir le panier, choisir le paiement (espèces, mobile money, crédit) puis <b>Encaisser</b>.' }
    ],
    stock: [
      { sel: '#rechStock', titre: 'Chercher dans le stock', texte: 'Tapez le nom d’un produit pour le retrouver vite.' },
      { sel: '#filtres', titre: 'Filtrer', texte: 'Voyez seulement les produits <b>en alerte</b> (presque finis) ou ceux dont le <b>prix reste à fixer</b>.' },
      { sel: '#btnAjout', clic: true, titre: 'Ajouter un produit', texte: 'Touchez le bouton vert <b>+</b> pour créer un produit. Touchez « Suivant » : le formulaire s’ouvre pour vous le montrer.' },
      { sel: '#fNom', titre: 'Le nom', texte: 'Écrivez le nom du produit, par exemple « Sucre 1 kg ».' },
      { sel: '#fVente', titre: 'Le prix de vente', texte: 'Le prix auquel vous vendez. Vous pouvez aussi noter le prix d’achat pour connaître votre bénéfice.' },
      { sel: '#fStock', titre: 'La quantité en stock', texte: 'Combien d’unités vous avez maintenant. Le stock baisse tout seul à chaque vente.' },
      { sel: '#fOk', titre: 'Enregistrer', texte: 'Touchez <b>Enregistrer</b> pour finir. (Pendant cette visite rien n’est enregistré.)' },
      { sel: '#listeStock', titre: 'Votre liste', texte: 'Touchez un produit pour <b>entrer</b> ou <b>sortir</b> du stock, le modifier ou le supprimer.' }
    ],
    dettes: [
      { sel: '#btnClient', clic: true, titre: 'Ajouter un client à crédit', texte: 'Touchez le bouton vert <b>+</b> pour enregistrer un client qui achète à crédit. Touchez « Suivant » pour voir le formulaire.' },
      { sel: '#cNom', titre: 'Son nom', texte: 'Écrivez le nom du client.' },
      { sel: '#cTel', titre: 'Son téléphone', texte: 'Facultatif, mais utile pour lui envoyer un <b>rappel</b> par WhatsApp ou SMS.' },
      { sel: '#cOk', titre: 'Enregistrer', texte: 'Touchez <b>Enregistrer</b>. (Pendant cette visite rien n’est enregistré.)' },
      { sel: '#listeClients', titre: 'Les dettes', texte: 'Touchez un client pour voir ce qu’il doit, <b>enregistrer un paiement</b> ou lui envoyer un rappel.' }
    ],
    rapports: [
      { sel: '.periode-barre', titre: 'Choisir la période', texte: 'Touchez <b>Aujourd’hui</b> ou <b>Autre date</b>. Pour une période : touchez la date de début puis la date de fin.' },
      { sel: '#plusVentes', titre: 'Les produits qui se vendent le plus', texte: 'Voyez vos meilleurs produits sur la période choisie.' },
      { sel: '#btnPdf', titre: 'Créer un PDF', texte: 'Touchez ici pour créer le rapport en PDF et le partager (WhatsApp, e-mail…).' },
      { titre: 'Lire le rapport', texte: 'En haut : le <b>chiffre d’affaires</b> (ce que vous avez vendu), les <b>dépenses</b> et le <b>bénéfice</b>. En dessous : le détail des ventes, que vous pouvez ouvrir une par une.' }
    ],
    plus: [
      { sel: '[data-aller="depenses"]', titre: 'Dépenses', texte: 'Notez le loyer, le transport, l’électricité, les salaires… pour connaître votre vrai bénéfice.' },
      { sel: '[data-aller="achats"]', titre: 'Achats et fournisseurs', texte: 'Enregistrez ce que vous achetez : le stock augmente tout seul, et vous suivez ce que vous devez aux fournisseurs.' },
      { sel: '[data-aller="boutiques"]', titre: 'Mes boutiques', texte: 'Ajoutez d’autres boutiques et passez de l’une à l’autre.' },
      { sel: '[data-aller="equipe"]', titre: 'Équipe', texte: 'Invitez des vendeurs avec un code, et choisissez ce qu’ils peuvent faire.' },
      { sel: '[data-aller="abonnement"]', titre: 'Mon abonnement', texte: 'Voyez votre niveau, vos limites et payez par mobile money pour passer au niveau supérieur.' }
    ],
    boutiques: [
      { sel: '#bAjout', clic: true, titre: 'Créer une boutique', texte: 'Touchez <b>Ajouter une boutique</b>. Touchez « Suivant » : le formulaire s’ouvre pour vous le montrer.' },
      { sel: '#bNom', titre: 'Le nom de la boutique', texte: 'Écrivez le nom de la nouvelle boutique, par exemple « Boutique Marché ».' },
      { sel: '#bOk', titre: 'Enregistrer', texte: 'Touchez <b>Créer</b> pour finir. (Pendant cette visite rien n’est créé.)' },
      { sel: '[data-ouvrir]', titre: 'Ouvrir une boutique', texte: 'Touchez <b>Ouvrir</b> sur une boutique pour travailler dedans : son stock, ses ventes et ses dettes sont séparés des autres.' }
    ],
    depenses: [
      { sel: '#btnDep', clic: true, titre: 'Ajouter une dépense', texte: 'Touchez ce bouton pour noter une dépense. Touchez « Suivant » pour voir le formulaire.' },
      { sel: '#dMontant', titre: 'Le montant', texte: 'Combien vous avez payé.' },
      { sel: '#dCat', titre: 'Le type de dépense', texte: 'Loyer, transport, électricité… Cela classe vos dépenses dans les rapports.' },
      { sel: '#dOk', titre: 'Enregistrer', texte: 'Touchez <b>Enregistrer</b>. (Pendant cette visite rien n’est enregistré.)' }
    ],
    achats: [
      { sel: '#ongletsA', titre: 'Achats ou fournisseurs', texte: 'Passez de la liste de vos <b>achats</b> à celle de vos <b>fournisseurs</b>.' },
      { sel: '#btnAchat', titre: 'Nouvel achat', texte: 'Touchez ici quand vous recevez de la marchandise : choisissez le fournisseur, les produits et les quantités. Le stock augmente tout seul.' },
      { sel: '#btnFour', titre: 'Nouveau fournisseur', texte: 'Ajoutez un fournisseur pour suivre ce que vous lui devez et ce que vous lui avez payé.' }
    ],
    import: [
      { titre: 'Importer vos produits', texte: 'Au lieu de les taper un par un, <b>choisissez un fichier Excel ou CSV</b> qui contient vos produits (nom, prix, quantité).' },
      { titre: 'Vérifier avant d’importer', texte: 'L’application vous montre ce qu’elle a compris. Corrigez si besoin, puis confirmez : les produits arrivent dans le stock.' }
    ],
    audit: [
      { titre: 'Le journal d’activité', texte: 'Il garde <b>qui a fait quoi, quand et dans quelle boutique</b> : ventes, suppressions, connexions. Utile pour surveiller vos vendeurs.' }
    ],
    reglages: [
      { sel: '#rNom', titre: 'Votre boutique', texte: 'Le nom et le téléphone de la boutique. Ils s’affichent sur les reçus.' },
      { sel: '#rTaux', titre: 'Le taux de change', texte: 'Le taux entre le dollar et le franc congolais, pour les prix et les rapports en deux monnaies.' },
      { sel: '#rExport', titre: 'La sauvegarde', texte: 'Créez une copie de vos données et gardez-la ailleurs (WhatsApp, e-mail). Pensez à le faire chaque semaine.' },
      { sel: '#rImport', titre: 'Restaurer une sauvegarde', texte: 'Si vous changez de téléphone, retrouvez vos données depuis une sauvegarde.' }
    ],
    equipe: [
      { sel: '#eqNom', titre: 'Inviter un vendeur', texte: 'Écrivez le nom du vendeur que vous voulez inviter.' },
      { sel: '#eqCreer', titre: 'Créer l’invitation', texte: 'Touchez ici : un <b>code d’invitation</b> est créé. Donnez-le au vendeur, il l’utilisera pour créer son compte.' },
      { sel: '#eqInvitations', titre: 'Les invitations', texte: 'Voyez les codes en attente, copiez-les ou annulez-les.' },
      { sel: '#eqEquipe', titre: 'Votre équipe', texte: 'Les vendeurs déjà dans votre boutique. Touchez-en un pour voir son activité ou retirer son accès.' }
    ],
    abonnement: [
      { sel: '#abDuree', titre: 'Choisir la durée', texte: 'Plus la durée est longue, plus vous économisez.' },
      { sel: '#abPayer', titre: 'Payer', texte: 'Touchez <b>Payer</b> : la page de paiement mobile money s’ouvre. Après le paiement vous revenez ici et le niveau s’active.' },
      { titre: 'Ce que vous gardez', texte: 'Si vous dépassez les limites de votre niveau, rien n’est supprimé : les éléments en trop sont simplement <b>verrouillés</b> jusqu’au paiement.' }
    ],
    compte: [
      { sel: '#mcAncien', titre: 'Changer votre mot de passe', texte: 'Écrivez l’ancien mot de passe, puis le nouveau.' },
      { sel: '#mcOk', titre: 'Enregistrer', texte: 'Touchez ce bouton pour valider.' }
    ]
  };
  const TITRES = {
    caisse: 'Comment vendre', stock: 'Comment gérer le stock', dettes: 'Comment suivre les dettes', rapports: 'Comment lire les rapports',
    plus: 'Les autres fonctions', boutiques: 'Comment créer une boutique', depenses: 'Comment noter une dépense', achats: 'Comment enregistrer un achat',
    import: 'Comment importer vos produits', audit: 'Le journal d’activité', reglages: 'Les réglages', equipe: 'Comment gérer l’équipe',
    abonnement: 'Comment payer l’abonnement', compte: 'Votre compte'
  };
  const SANS_VISITE_AUTO = ['aide'];

  /* ---------- Moteur ---------- */
  let etat = null; // { id, etapes, i, base, pile, el... }
  let rafId = 0;

  const q = (s) => { try { return s ? document.querySelector(s) : null; } catch (_) { return null; } };
  const visible = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const nbFenetres = () => document.querySelectorAll('.fond-fenetre').length;
  const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

  function fermerDerniereFenetre() {
    const f = document.querySelectorAll('.fond-fenetre'); const d = f[f.length - 1];
    if (!d) return;
    const b = d.querySelector('.fermer');
    if (b) b.click(); else { d.remove(); if (!document.querySelector('.fond-fenetre')) document.body.classList.remove('modal-ouvert'); }
  }

  async function chercher(sel, delai = 1500) {
    if (!sel) return null;
    const fin = Date.now() + delai;
    do { const el = q(sel); if (visible(el)) return el; await attendre(100); } while (Date.now() < fin);
    return null;
  }

  function ancetreDefilable(el) {
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const o = getComputedStyle(n).overflowY;
      if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight + 2) return n;
    }
    return null;
  }

  // Amène l'élément dans la zone visible au-dessus de la fenêtre d'explication
  function faireVoir(el) {
    const bas = window.innerHeight - (etat.carte.offsetHeight || 300) - 12;
    const r = el.getBoundingClientRect();
    if (r.top >= 70 && r.bottom <= bas) return;
    if (el.closest('#menu, #barre, .barre-panier')) return; // éléments fixes
    const souhaite = 80 + Math.max(0, (bas - 80 - Math.min(r.height, bas - 80)) / 2);
    const delta = r.top - souhaite;
    const sc = ancetreDefilable(el);
    if (sc) sc.scrollTop += delta; else window.scrollBy(0, delta);
  }

  // Zone libre à l'écran : au-dessus de la fenêtre d'explication (placée en bas)
  function zoneLibre() { return { haut: 60, bas: etat.carte.getBoundingClientRect().top - 8 }; }

  function dessiner() {
    if (!etat) return;
    const { trou, main, voile, el } = etat;
    const masquer = () => { trou.hidden = true; main.hidden = true; voile.hidden = false; };
    if (!el || !visible(el)) return masquer();
    const z = zoneLibre(), r0 = el.getBoundingClientRect(), m = 6;
    // un grand élément (liste, grille) : on n'éclaire que sa partie visible dans la zone libre
    const haut = Math.max(r0.top, z.haut), bas = Math.min(r0.bottom, z.bas);
    if (bas - haut < 24) return masquer(); // caché derrière la fenêtre : l'aperçu dans la fenêtre le montre
    voile.hidden = true;
    const r = { left: r0.left, width: r0.width, top: haut, bottom: bas, height: bas - haut };
    Object.assign(trou.style, { left: (r.left - m) + 'px', top: (r.top - m) + 'px', width: (r.width + 2 * m) + 'px', height: (r.height + 2 * m) + 'px' });
    trou.hidden = false;
    const dessous = r.bottom + m + 44 < z.bas;
    main.textContent = dessous ? '\u{1F446}' : '\u{1F447}';
    main.className = 'visite-main ' + (dessous ? 'dessous' : 'dessus');
    main.style.left = Math.min(window.innerWidth - 44, Math.max(4, r.left + r.width / 2 - 20)) + 'px';
    main.style.top = (dessous ? r.bottom + m - 2 : Math.max(4, r.top - m - 44)) + 'px';
    main.hidden = false;
  }
  const replanifier = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(dessiner); };

  function construire() {
    const racine = document.createElement('div');
    racine.className = 'visite';
    racine.innerHTML =
      '<div class="visite-fond"></div><div class="visite-voile"></div><div class="visite-trou" hidden></div><div class="visite-main" hidden></div>' +
      '<div class="visite-carte" role="dialog" aria-modal="true" aria-live="polite"></div>';
    document.body.appendChild(racine);
    document.body.classList.add('visite-active');
    etat.racine = racine;
    etat.trou = racine.querySelector('.visite-trou'); etat.main = racine.querySelector('.visite-main');
    etat.voile = racine.querySelector('.visite-voile'); etat.carte = racine.querySelector('.visite-carte');
    etat.carte.addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      const a = b.dataset.v;
      if (a === 'suiv') suivant(); else if (a === 'prec') precedent(); else if (a === 'passer' || a === 'fermer') terminer();
      else if (a === 'aide') { terminer(); if (typeof App !== 'undefined' && App.ouvrirAide) App.ouvrirAide(); }
    });
    window.addEventListener('resize', replanifier);
    window.addEventListener('scroll', replanifier, true);
    document.addEventListener('keydown', surTouche);
  }
  function surTouche(e) { if (!etat) return; if (e.key === 'Escape') terminer(); else if (e.key === 'ArrowRight') suivant(); else if (e.key === 'ArrowLeft') precedent(); }

  // Aperçu : une copie (non cliquable) du bouton ou du champ concerné, avec la main qui le montre
  function apercu(el, s) {
    if (!el || !visible(el)) return '<div class="visite-apercu vide"><span class="visite-grandicone">' + (s.icone || '\u{1F4A1}') + '</span></div>';
    return '<div class="visite-apercu"><div class="visite-copie"></div><span class="visite-main-apercu">\u{1F446}</span></div>';
  }
  function remplirApercu(el) {
    const zone = etat.carte.querySelector('.visite-copie'); if (!zone) return;
    const c = el.cloneNode(true);
    c.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id')); c.removeAttribute('id');
    c.querySelectorAll('input,textarea,select,button,a').forEach((n) => { n.tabIndex = -1; n.setAttribute('aria-hidden', 'true'); });
    c.setAttribute('aria-hidden', 'true'); c.style.pointerEvents = 'none'; c.style.margin = '0'; c.hidden = false;
    const w = el.getBoundingClientRect().width;
    c.style.width = w + 'px'; c.style.maxWidth = 'none';
    zone.appendChild(c);
    const dispo = Math.max(120, (zone.clientWidth || 300));
    const k = Math.min(1, dispo / w);
    c.style.transform = 'scale(' + k + ')'; c.style.transformOrigin = 'top left';
    const h = Math.min(c.getBoundingClientRect().height, 150);
    zone.style.height = h + 'px'; zone.style.width = Math.min(dispo, w * k) + 'px';
  }

  function carte(el) {
    const { etapes, i, carte: c } = etat; const s = etapes[i]; const n = etapes.length; const fin = i === n - 1;
    c.innerHTML =
      '<div class="visite-tete"><span class="visite-rond" aria-hidden="true">?</span>' +
        '<div class="visite-tetetxt"><div class="visite-sujet">' + (TITRES[etat.id] || 'Aide') + '</div><div class="visite-compteur">Étape ' + (i + 1) + ' sur ' + n + '</div></div>' +
        '<button class="visite-x" data-v="fermer" aria-label="Annuler la visite">&times;</button></div>' +
      apercu(el, s) +
      '<h3>' + s.titre + '</h3><p>' + s.texte + '</p>' +
      '<div class="visite-points">' + etapes.map((_, k) => '<i class="' + (k === i ? 'on' : k < i ? 'fait' : '') + '"></i>').join('') + '</div>' +
      '<div class="visite-actions">' +
        (fin ? '<button class="visite-passer" data-v="fermer">Fermer</button>' : '<button class="visite-passer" data-v="passer">Passer</button>') +
        (i > 0 ? '<button class="btn contour" data-v="prec">&lsaquo; Retour</button>' : '') +
        '<button class="btn" data-v="suiv">' + (fin ? 'Terminer' : 'Suivant') + '</button>' +
      '</div>' +
      (fin && etat.id !== 'aide' ? '<button class="auth-link visite-aide" data-v="aide">Ouvrir l’aide complète</button>' : '');
    if (el && visible(el)) remplirApercu(el);
  }

  async function afficherEtape() {
    const jeton = ++etat.jeton;
    const s = etat.etapes[etat.i];
    const el = s.sel ? await chercher(s.sel, etat.i === 0 ? 800 : 1500) : null;
    if (!etat || jeton !== etat.jeton) return;
    carte(el);
    if (el) { faireVoir(el); await attendre(30); }
    etat.el = el;
    dessiner();
  }

  async function suivant() {
    if (!etat || etat.occupe) return;
    etat.occupe = true;
    try {
      const s = etat.etapes[etat.i];
      if (s.clic) {
        const el = q(s.sel);
        if (visible(el)) {
          const avant = nbFenetres();
          el.click();
          await attendre(150);
          if (nbFenetres() > avant) etat.pile.push(etat.i);
          else await attendre(250);
        }
      }
      if (etat.i >= etat.etapes.length - 1) { terminer(); return; }
      etat.i++;
      await afficherEtape();
    } finally { if (etat) etat.occupe = false; }
  }

  async function precedent() {
    if (!etat || etat.occupe || etat.i === 0) return;
    etat.occupe = true;
    try {
      if (etat.pile.length && etat.pile[etat.pile.length - 1] === etat.i - 1) { fermerDerniereFenetre(); etat.pile.pop(); await attendre(150); }
      etat.i--;
      await afficherEtape();
    } finally { if (etat) etat.occupe = false; }
  }

  function terminer() {
    if (!etat) return;
    const e = etat; etat = null;
    marquerVu(e.id);
    window.removeEventListener('resize', replanifier);
    window.removeEventListener('scroll', replanifier, true);
    document.removeEventListener('keydown', surTouche);
    cancelAnimationFrame(rafId);
    e.racine.remove();
    document.body.classList.remove('visite-active');
    // Referme les formulaires ouverts pendant la visite (rien n'a été enregistré)
    let garde = 6;
    while (nbFenetres() > e.base && garde-- > 0) fermerDerniereFenetre();
  }

  /* ---------- Interface publique ---------- */
  function existe(id) { return !!TOURS[id]; }

  function lancer(id, options = {}) {
    const etapes = TOURS[id];
    if (!etapes || etat) return false;
    if (!options.force && vu(id)) return false;
    etat = { id, etapes, i: 0, base: nbFenetres(), pile: [], jeton: 0, occupe: false, el: null };
    construire();
    afficherEtape();
    return true;
  }

  // Appelé par l'application à chaque ouverture d'un écran : la visite ne se lance que la 1re fois.
  // (Désactivée dans les navigateurs automatisés des tests : navigator.webdriver.)
  function auto(id) {
    try { if (navigator.webdriver || lire('evo_visites_off') === '1') return; } catch (_) {}
    if (etat || !TOURS[id] || SANS_VISITE_AUTO.includes(id) || vu(id)) return;
    setTimeout(() => {
      if (etat || vu(id) || typeof App === 'undefined' || App.onglet !== id || nbFenetres() > 0 || document.querySelector('.onboarding')) return;
      lancer(id);
    }, 700);
  }

  function reinitialiser() {
    try {
      const pref = CLE + uid() + '_';
      Object.keys(localStorage).filter((k) => k.indexOf(pref) === 0).forEach((k) => localStorage.removeItem(k));
    } catch (_) {}
  }

  return { lancer, auto, existe, reinitialiser, vu, ids: () => Object.keys(TOURS), actif: () => !!etat };
})();
window.Visites = Visites;
