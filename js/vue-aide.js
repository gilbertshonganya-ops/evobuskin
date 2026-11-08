/* EvoBuskin - page AIDE : recherche, accès rapides, parcours débutant, procédures pas à pas,
   mots expliqués, questions fréquentes et contact du support (WhatsApp / email). */
const VueAide = {
  sujetDemande: null,
  _recherche: '',

  SUJETS_SUPPORT: ['Problème avec la caisse ou une vente', 'Abonnement ou paiement', 'Stock ou produits', 'Dettes, clients ou fournisseurs',
    'Boutiques ou vendeurs', 'Rapports ou chiffres', 'Connexion ou compte', 'Suggestion ou question'],

  // [[Bouton]] -> pastille verte ; {{Champ}} -> pastille grise
  fmt(texte) {
    return String(texte)
      .replace(/\[\[([^\]]+)\]\]/g, '<span class="aide-clic">$1</span>')
      .replace(/\{\{([^}]+)\}\}/g, '<span class="aide-champ">$1</span>');
  },
  brut(texte) { return String(texte).replace(/<[^>]+>/g, '').replace(/\[\[|\]\]|\{\{|\}\}/g, ''); },
  norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' '); },

  role() { return App.role || 'patron'; },
  visible(s) {
    const r = this.role() === 'vendeur' ? 'vendeur' : 'patron';
    return s.pub === undefined || s.pub === 'tous' || s.pub === r;
  },
  tousSujets() {
    const liste = [];
    AIDE_CONTENU.sections.forEach((sec) => (sec.sujets || []).forEach((s) => { if (this.visible(s)) liste.push({ sec, s }); }));
    return liste;
  },
  trouver(id) { return this.tousSujets().find((x) => x.s.id === id); },

  bloc(titre, corpsHtml, id, ouvert, tag) {
    return '<details class="aide-sujet"' + (id ? ' id="aide-' + id + '"' : '') + (ouvert ? ' open' : '') + '><summary>' + esc(titre) +
      (tag ? ' <span class="aide-tag">' + tag + '</span>' : '') + '</summary><div class="aide-corps">' + corpsHtml + '</div></details>';
  },

  note(type, icone, titre, texte) {
    return '<div class="aide-note ' + type + '"><span class="aide-note-ico">' + Icones.svg(icone, 18) + '</span><div><b>' + titre + '</b> ' + this.fmt(texte) + '</div></div>';
  },

  sujetHtml(s, ouvert) {
    let h = '';
    if (s.intro) h += '<p class="aide-intro">' + this.fmt(s.intro) + '</p>';
    if (s.tableau) {
      h += '<div class="aide-tab-wrap"><table class="aide-tab"><thead><tr>' + s.tableau.entetes.map((e) => '<th>' + esc(e) + '</th>').join('') + '</tr></thead><tbody>' +
        s.tableau.lignes.map((l) => '<tr>' + l.map((c, i) => (i ? '<td>' : '<th scope="row">') + esc(c) + (i ? '</td>' : '</th>')).join('') + '</tr>').join('') + '</tbody></table></div>';
    }
    if (s.etapes) h += '<ol class="aide-etapes">' + s.etapes.map((e) => '<li>' + this.fmt(e) + '</li>').join('') + '</ol>';
    if (s.images) h += '<div class="aide-images">' + s.images.map((im) => '<figure><img src="' + im.src + '" alt="' + esc(im.legende) + '" loading="lazy"><figcaption>' + esc(im.legende) + '</figcaption></figure>').join('') + '</div>';
    if (s.apres) h += this.note('ok', 'check-circle-outline', 'Résultat :', s.apres);
    if (s.astuce) h += this.note('astuce', 'lightbulb-on-outline', 'Astuce :', s.astuce);
    if (s.attention) h += this.note('attention', 'alert-outline', 'Attention :', s.attention);
    if (s.voir && s.voir.length) {
      const liens = s.voir.map((id) => { const t = this.trouver(id); return t ? '<a href="#" class="aide-lien" data-sujet="' + id + '">' + esc(t.s.t) + '</a>' : ''; }).filter(Boolean);
      if (liens.length) h += '<div class="aide-voir">À lire aussi : ' + liens.join(' · ') + '</div>';
    }
    return this.bloc(s.t, h, s.id, ouvert, s.pub === 'patron' ? 'Patron' : s.pub === 'vendeur' ? 'Vendeur' : '');
  },

  simpleHtml(titre, texte) { return this.bloc(titre, '<p>' + esc(texte) + '</p>'); },

  sectionHtml(sec) {
    let h = '<section class="aide-section" id="sec-' + sec.id + '"><h3><span class="aide-ico">' + Icones.svg(sec.icone, 22) + '</span> ' + esc(sec.titre) + '</h3><p class="petit">' + esc(sec.resume) + '</p>';
    if (sec.sujets) {
      const l = sec.sujets.filter((s) => this.visible(s));
      if (!l.length) return '';
      h += l.map((s) => this.sujetHtml(s)).join('');
    }
    if (sec.glossaire) h += sec.glossaire.map((g) => this.simpleHtml(g[0], g[1])).join('');
    if (sec.faq) h += sec.faq.map((q) => this.simpleHtml(q[0], q[1])).join('');
    return h + '</section>';
  },

  accueilHtml() {
    const rapide = AIDE_CONTENU.rapide.filter((r) => this.trouver(r[2])).map((r) =>
      '<button class="aide-rapide" data-sujet="' + r[2] + '"><span>' + Icones.svg(r[0], 26) + '</span>' + esc(r[1]) + '</button>').join('');
    const parcours = AIDE_CONTENU.parcours.map((id, i) => { const t = this.trouver(id); return t ? '<li><a href="#" class="aide-lien" data-sujet="' + id + '"><b>' + (i + 1) + '.</b> ' + esc(t.s.t) + '</a></li>' : ''; }).join('');
    const sommaire = AIDE_CONTENU.sections.map((sec) => '<a href="#" class="aide-chip" data-section="' + sec.id + '">' + Icones.svg(sec.icone, 18) + '<span>' + esc(sec.titre) + '</span></a>').join('');
    return '<div class="carte aide-hero"><h3>Je veux…</h3><div class="aide-rapides">' + rapide + '</div></div>' +
      '<div class="carte"><h3>Parcours du débutant</h3><p class="petit">Lisez ces sujets dans l’ordre : en 20 minutes vous maîtrisez l’essentiel.</p><ol class="aide-parcours">' + parcours + '</ol></div>' +
      '<div class="aide-sommaire">' + sommaire + '</div>' +
      '<div class="carte"><h3>Comment lire cette Aide</h3><p class="petit">Un bouton à toucher s’écrit comme ceci : <span class="aide-clic">Encaisser</span>. Un champ à remplir ou une information à lire s’écrit comme ceci : <span class="aide-champ">Montant reçu</span>. Les étapes sont à suivre dans l’ordre.</p></div>';
  },

  resultatsHtml(q) {
    const mots = this.norm(q).split(/\s+/).filter((m) => m.length > 1);
    const r = [];
    this.tousSujets().forEach(({ sec, s }) => {
      const titre = this.norm(s.t), reste = this.norm([s.mots, s.intro, (s.etapes || []).join(' '), s.apres, s.astuce, s.attention].map((x) => this.brut(x || '')).join(' '));
      let score = 0;
      for (const m of mots) {
        if (titre.includes(m)) score += 5; else if (this.norm(s.mots).includes(m)) score += 3; else if (reste.includes(m)) score += 1; else { score = -1; break; }
      }
      if (score > 0) r.push({ sec, s, score });
    });
    AIDE_CONTENU.sections.forEach((sec) => {
      (sec.faq || []).forEach((f) => { const t = this.norm(f[0] + ' ' + f[1]); if (mots.every((m) => t.includes(m))) r.push({ sec, simple: f, etiq: 'Question fréquente', score: 2 }); });
      (sec.glossaire || []).forEach((g) => { const t = this.norm(g[0] + ' ' + g[1]); if (mots.every((m) => t.includes(m))) r.push({ sec, simple: g, etiq: 'Mots expliqués', score: 2 }); });
    });
    r.sort((a, b) => b.score - a.score);
    if (!r.length) return '<div class="carte"><h3>Aucun résultat</h3><p class="petit">Essayez un mot plus simple (« vente », « produit », « dette », « abonnement », « vendeur »…) ou parcourez les rubriques, ou écrivez-nous en bas de cette page.</p></div>';
    return '<p class="petit">' + r.length + ' résultat(s) pour « ' + esc(q) + ' »</p>' + r.slice(0, 25).map((x) =>
      '<div class="aide-res"><div class="aide-res-sec">' + esc(x.etiq || x.sec.titre) + '</div>' + (x.s ? this.sujetHtml(x.s) : this.simpleHtml(x.simple[0], x.simple[1])) + '</div>').join('');
  },

  supportHtml() {
    return '<div class="carte aide-support" id="aideSupport"><h3><span class="aide-ico">' + Icones.svg('headset', 22) + '</span> Besoin d’un coup de main ?</h3>' +
      '<p class="petit">Vous n’avez pas trouvé la réponse ? Écrivez-nous : choisissez le sujet, décrivez votre problème, puis envoyez le message par WhatsApp ou par email. Il est déjà prêt à partir.</p>' +
      '<label class="champ"><span>Sujet</span><select id="supSujet">' + this.SUJETS_SUPPORT.map((x) => '<option>' + esc(x) + '</option>').join('') + '</select></label>' +
      '<label class="champ"><span>Votre message</span><textarea id="supMsg" rows="4" placeholder="Expliquez ce que vous faisiez et ce qui s’est passé."></textarea></label>' +
      '<label class="aide-case"><input type="checkbox" id="supInfos" checked> Ajouter automatiquement les informations utiles (boutique, rôle, version)</label>' +
      '<div class="pile"><button class="btn aide-wa" id="supWa">' + Icones.svg('whatsapp', 20) + '<span>Envoyer par WhatsApp</span></button>' +
      '<button class="btn contour aide-wa" id="supMail">' + Icones.svg('email-outline', 20) + '<span>Envoyer par email</span></button></div></div>';
  },

  messageSupport(conteneur) {
    const sujet = $('#supSujet', conteneur).value, msg = ($('#supMsg', conteneur).value || '').trim();
    let t = 'Bonjour l’équipe EvoBuskin,\n\nSujet : ' + sujet + '\n\n' + (msg || '(décrivez votre problème ici)');
    if ($('#supInfos', conteneur).checked) {
      t += '\n\n— Informations —\nBoutique : ' + (($('#nomBoutique') || {}).textContent || '-') + '\nRôle : ' + (App.role || '-') + '\nVersion : 2.4.0\nEn ligne : ' + (navigator.onLine ? 'oui' : 'non');
      try { const c = Diag.dernierCode && Diag.dernierCode(); if (c) t += '\nCode d’erreur : ' + c; } catch (e) { /* facultatif */ }
    }
    return { sujet, texte: t };
  },

  brancherSupport(conteneur) {
    const cfg = window.SUPPORT_CONFIG || {};
    $('#supWa', conteneur).addEventListener('click', () => {
      const m = this.messageSupport(conteneur);
      if (!cfg.whatsapp) return toast('Le contact WhatsApp du support sera bientôt disponible.', 'erreur');
      window.open('https://wa.me/' + String(cfg.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(m.texte), '_blank');
    });
    $('#supMail', conteneur).addEventListener('click', () => {
      const m = this.messageSupport(conteneur);
      if (!cfg.email) return toast('L’adresse email du support sera bientôt disponible.', 'erreur');
      window.location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent('EvoBuskin — ' + m.sujet) + '&body=' + encodeURIComponent(m.texte);
    });
  },

  ouvrirSujet(id, conteneur) {
    const t = this.trouver(id);
    if (!t) return;
    const champ = $('#aideQ', conteneur);
    if (champ && champ.value) { champ.value = ''; this._recherche = ''; this.dessiner(conteneur); }
    const d = document.getElementById('aide-' + id);
    if (!d) return;
    d.open = true;
    d.scrollIntoView({ behavior: 'smooth', block: 'start' });
    d.classList.add('aide-flash');
    setTimeout(() => d.classList.remove('aide-flash'), 1800);
  },

  dessiner(conteneur) {
    const zone = $('#aideCorps', conteneur);
    const q = this._recherche.trim();
    zone.innerHTML = q.length >= 2 ? this.resultatsHtml(q) : this.accueilHtml() + AIDE_CONTENU.sections.map((s) => this.sectionHtml(s)).join('');
    this.lier(conteneur);
  },

  lier(conteneur) {
    $$('[data-sujet]', conteneur).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); this.ouvrirSujet(a.dataset.sujet, conteneur); }));
    $$('[data-section]', conteneur).forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const el = document.getElementById('sec-' + a.dataset.section);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  },

  async afficher(conteneur) {
    const retour = App.ongletAvantAide && App.ongletAvantAide !== 'aide' ? App.ongletAvantAide : null;
    conteneur.innerHTML =
      '<div class="aide-tete">' + (retour ? '<button class="btn gris petit" id="aideRetour">← Retour</button>' : '') + '<h2>Aide</h2></div>' +
      '<p class="petit">Tout ce qu’il faut savoir pour utiliser EvoBuskin, pas à pas.</p>' +
      '<div class="aide-recherche"><input type="search" id="aideQ" placeholder="Chercher : vendre, produit, dette, abonnement…" autocomplete="off" value="' + esc(this._recherche) + '"></div>' +
      '<div id="aideCorps"></div>' + this.supportHtml();
    this.dessiner(conteneur);
    this.brancherSupport(conteneur);
    const champ = $('#aideQ', conteneur);
    let timer = null;
    champ.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { this._recherche = champ.value; this.dessiner(conteneur); }, 150);
    });
    const rb = $('#aideRetour', conteneur);
    if (rb) rb.addEventListener('click', () => { const o = App.ongletAvantAide; App.ongletAvantAide = null; App.aller(o); });
    if (this.sujetDemande) {
      const id = this.sujetDemande; this.sujetDemande = null;
      setTimeout(() => this.ouvrirSujet(id, conteneur), 50);
    }
  }
};
window.VueAide = VueAide;
