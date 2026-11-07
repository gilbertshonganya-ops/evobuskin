/* EvoBuskin - page AIDE : recherche, accès rapides, parcours débutant, procédures pas à pas, glossaire, FAQ. */
const VueAide = {
  sujetDemande: null,
  _recherche: '',

  // [[Bouton]] -> pastille verte ; {{Champ}} -> pastille grise
  fmt(texte) {
    return String(texte)
      .replace(/\[\[([^\]]+)\]\]/g, '<span class="clic">$1</span>')
      .replace(/\{\{([^}]+)\}\}/g, '<span class="champ">$1</span>');
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

  sujetHtml(s, ouvert) {
    let h = '<details class="aide-sujet" id="aide-' + s.id + '"' + (ouvert ? ' open' : '') + '><summary>' + esc(s.t) +
      (s.pub === 'patron' ? ' <span class="aide-tag">Patron</span>' : s.pub === 'vendeur' ? ' <span class="aide-tag">Vendeur</span>' : '') + '</summary><div class="aide-corps">';
    if (s.intro) h += '<p class="aide-intro">' + this.fmt(s.intro) + '</p>';
    if (s.tableau) {
      h += '<div class="aide-tab-wrap"><table class="aide-tab"><thead><tr>' + s.tableau.entetes.map((e) => '<th>' + esc(e) + '</th>').join('') + '</tr></thead><tbody>' +
        s.tableau.lignes.map((l) => '<tr>' + l.map((c, i) => (i ? '<td>' : '<th scope="row">') + esc(c) + (i ? '</td>' : '</th>')).join('') + '</tr>').join('') + '</tbody></table></div>';
    }
    if (s.etapes) h += '<ol class="aide-etapes">' + s.etapes.map((e) => '<li>' + this.fmt(e) + '</li>').join('') + '</ol>';
    if (s.apres) h += '<div class="aide-note ok"><b>Résultat :</b> ' + this.fmt(s.apres) + '</div>';
    if (s.astuce) h += '<div class="aide-note astuce"><b>💡 Astuce :</b> ' + this.fmt(s.astuce) + '</div>';
    if (s.attention) h += '<div class="aide-note attention"><b>⚠️ Attention :</b> ' + this.fmt(s.attention) + '</div>';
    if (s.voir && s.voir.length) {
      const liens = s.voir.map((id) => { const t = this.trouver(id); return t ? '<a href="#" class="aide-lien" data-sujet="' + id + '">' + esc(t.s.t) + '</a>' : ''; }).filter(Boolean);
      if (liens.length) h += '<div class="aide-voir">À lire aussi : ' + liens.join(' · ') + '</div>';
    }
    return h + '</div></details>';
  },

  sectionHtml(sec) {
    let h = '<section class="aide-section" id="sec-' + sec.id + '"><h3><span>' + sec.icone + '</span> ' + esc(sec.titre) + '</h3><p class="petit">' + esc(sec.resume) + '</p>';
    if (sec.sujets) {
      const l = sec.sujets.filter((s) => this.visible(s));
      if (!l.length) return '';
      h += l.map((s) => this.sujetHtml(s)).join('');
    }
    if (sec.glossaire) h += '<dl class="aide-gloss">' + sec.glossaire.map((g) => '<dt>' + esc(g[0]) + '</dt><dd>' + esc(g[1]) + '</dd>').join('') + '</dl>';
    if (sec.faq) h += sec.faq.map((q) => '<details class="aide-sujet"><summary>' + esc(q[0]) + '</summary><div class="aide-corps"><p>' + esc(q[1]) + '</p></div></details>').join('');
    return h + '</section>';
  },

  accueilHtml() {
    const rapide = AIDE_CONTENU.rapide.filter((r) => this.trouver(r[2])).map((r) =>
      '<button class="aide-rapide" data-sujet="' + r[2] + '"><span>' + r[0] + '</span>' + esc(r[1]) + '</button>').join('');
    const parcours = AIDE_CONTENU.parcours.map((id, i) => { const t = this.trouver(id); return t ? '<li><a href="#" class="aide-lien" data-sujet="' + id + '"><b>' + (i + 1) + '.</b> ' + esc(t.s.t) + '</a></li>' : ''; }).join('');
    const sommaire = AIDE_CONTENU.sections.map((sec) => '<a href="#" class="aide-chip" data-section="' + sec.id + '">' + sec.icone + ' ' + esc(sec.titre) + '</a>').join('');
    return '<div class="carte aide-hero"><h3>Je veux…</h3><div class="aide-rapides">' + rapide + '</div></div>' +
      '<div class="carte"><h3>🎓 Parcours du débutant</h3><p class="petit">Lisez ces sujets dans l’ordre : en 20 minutes vous maîtrisez l’essentiel.</p><ol class="aide-parcours">' + parcours + '</ol></div>' +
      '<div class="aide-sommaire">' + sommaire + '</div>' +
      '<div class="carte"><h3>Comment lire cette Aide</h3><p class="petit">Un bouton à toucher s’écrit comme ceci : <span class="clic">Encaisser</span>. Un champ à remplir ou une information à lire s’écrit comme ceci : <span class="champ">Montant reçu</span>. Les étapes sont à suivre dans l’ordre.</p></div>';
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
      (sec.faq || []).forEach((f) => { const t = this.norm(f[0] + ' ' + f[1]); if (mots.every((m) => t.includes(m))) r.push({ sec, faq: f, score: 2 }); });
      (sec.glossaire || []).forEach((g) => { const t = this.norm(g[0] + ' ' + g[1]); if (mots.every((m) => t.includes(m))) r.push({ sec, gloss: g, score: 2 }); });
    });
    r.sort((a, b) => b.score - a.score);
    if (!r.length) return '<div class="carte"><h3>Aucun résultat</h3><p class="petit">Essayez un mot plus simple (« vente », « produit », « dette », « abonnement », « vendeur »…) ou parcourez les rubriques ci-dessous.</p></div>';
    return '<p class="petit">' + r.length + ' résultat(s) pour « ' + esc(q) + ' »</p>' + r.slice(0, 25).map((x) => {
      if (x.s) return '<div class="aide-res"><div class="aide-res-sec">' + x.sec.icone + ' ' + esc(x.sec.titre) + '</div>' + this.sujetHtml(x.s) + '</div>';
      if (x.faq) return '<div class="aide-res"><div class="aide-res-sec">❓ Question fréquente</div><details class="aide-sujet"><summary>' + esc(x.faq[0]) + '</summary><div class="aide-corps"><p>' + esc(x.faq[1]) + '</p></div></details></div>';
      return '<div class="aide-res"><div class="aide-res-sec">📖 Glossaire</div><div class="carte"><b>' + esc(x.gloss[0]) + '</b><br>' + esc(x.gloss[1]) + '</div></div>';
    }).join('');
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
      '<div class="aide-recherche"><input type="search" id="aideQ" placeholder="🔍 Chercher : vendre, produit, dette, abonnement…" autocomplete="off" value="' + esc(this._recherche) + '"></div>' +
      '<div id="aideCorps"></div>' +
      '<div class="carte"><h3>Besoin d’un coup de main ?</h3><p class="petit">Si vous ne trouvez pas la réponse, patron : <b>Plus → Réglages → Copier le rapport pour le support</b>, puis envoyez-le avec une description de votre problème.</p></div>';
    this.dessiner(conteneur);
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
