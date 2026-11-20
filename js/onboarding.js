/* EvoBuskin - présentation en 3 pages, affichée une seule fois à la toute première ouverture (avant la connexion). */
const Onboarding = (() => {
  const CLE = 'evo_onboarding_vu';
  const img = (n) => '<div class="ob-illus"><img src="img/onb' + n + '.jpg" alt="" width="400" height="270" decoding="async"></div>';
  const carte = (ico, t, d) => '<li class="ob-cadre ob-carte"><span class="ob-ico">' + ico + '</span><span><b>' + t + '</b>' + d + '</span></li>';
  const ligne = (ico, t, d, cl) => '<li class="ob-cadre ' + (cl || '') + '"><span class="ob-ico">' + ico + '</span><span><b>' + t + '</b>' + d + '</span></li>';
  const etape = (n, t, d, cl) => '<li class="ob-cadre"><span class="ob-num ' + (cl || '') + '">' + n + '</span><span><b>' + t + '</b>' + d + '</span></li>';
  const PAGES = [
    { html: img(1) +
      '<h2>Votre commerce,<br>sous <b class="o"><i>contrôle</i></b> !</h2>' +
      '<p class="ob-sous">Gérez vos <b class="o">ventes</b>, vos <b class="o">stocks</b>, vos dépenses et vos <b class="o">bénéfices</b> depuis une seule application.</p>' +
      '<ul class="ob-grille">' + carte('\u{1F6D2}', 'Ventes', 'Suivez vos ventes') + carte('\u{1F4E6}', 'Stock', 'Maîtrisez vos produits') + carte('\u{1F45B}', 'Dépenses', 'Contrôlez vos sorties') + carte('\u{1F4C8}', 'Bénéfices', 'Analysez vos résultats') + '</ul>' },
    { html: img(2) +
      '<h2>Ne dirigez plus votre boutique <b class="o">à l’aveugle</b> !</h2>' +
      '<ul class="ob-liste">' + ligne('\u{1F4E6}', 'Stock actualisé automatiquement', 'Chaque vente met à jour votre stock.', 'v') + ligne('\u{1F514}', 'Alertes de stock intelligentes', 'Soyez averti avant la rupture.', 'o') + ligne('\u{1F465}', 'Suivi des dettes clients', 'Sachez qui vous doit de l’argent.', 'b') + '</ul>' +
      '<div class="ob-puce">\u{1F4F6} Fonctionne aussi sans Internet</div>' },
    { html: img(3) +
      '<h2>Prêt à prendre le <b class="o">contrôle</b> de votre commerce ?</h2>' +
      '<p class="ob-sous">Effectuez votre <b class="o">première vente</b> en quelques étapes simples.</p>' +
      '<ol class="ob-etapes">' + etape('1', 'Sélectionnez vos produits', 'Ajoutez les articles au panier.') + etape('2', 'Choisissez le paiement', 'Espèces, Mobile Money ou crédit.') + etape('3', 'Validez votre vente', 'Votre stock et caisse sont mis à jour.', 'v') + '</ol>' +
      '<div class="ob-merite"><b>Votre commerce mérite une meilleure gestion !</b>Simple, rapide et efficace.</div>' }
  ];
  const lire = () => { try { return localStorage.getItem(CLE) === '1'; } catch (_) { return false; } };
  const marquer = () => { try { localStorage.setItem(CLE, '1'); } catch (_) {} };

  function afficher(apres) {
    let i = 0;
    const el = document.createElement('div');
    el.className = 'onboarding';
    el.innerHTML =
      '<div class="ob-haut"><button type="button" data-ob="passer">Passer</button></div>' +
      '<div class="ob-piste"><div class="ob-glisse">' + PAGES.map((p) =>
        '<div class="ob-page"><div class="ob-contenu">' + p.html + '</div></div>').join('') + '</div></div>' +
      '<div class="ob-bas"><div class="ob-points">' + PAGES.map(() => '<i></i>').join('') + '</div><button type="button" class="btn" data-ob="suivant"></button></div>';
    document.body.appendChild(el);
    const glisse = el.querySelector('.ob-glisse'), points = el.querySelectorAll('.ob-points i'), bouton = el.querySelector('[data-ob="suivant"]');
    const maj = () => {
      glisse.style.transform = 'translateX(' + (-100 * i) + '%)';
      points.forEach((p, k) => p.classList.toggle('on', k === i));
      bouton.textContent = i === PAGES.length - 1 ? 'Commencer' : 'Suivant';
      el.querySelector('[data-ob="passer"]').style.visibility = i === PAGES.length - 1 ? 'hidden' : 'visible';
    };
    const fin = () => { marquer(); el.remove(); if (apres) apres(); };
    bouton.addEventListener('click', () => { if (i < PAGES.length - 1) { i++; maj(); } else fin(); });
    el.querySelector('[data-ob="passer"]').addEventListener('click', fin);
    // Glissement du doigt
    let x0 = null;
    el.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (dx < -50 && i < PAGES.length - 1) { i++; maj(); } else if (dx > 50 && i > 0) { i--; maj(); }
    }, { passive: true });
    maj();
  }

  return { afficher, dejaVu: lire, reinitialiser: () => { try { localStorage.removeItem(CLE); } catch (_) {} } };
})();
window.Onboarding = Onboarding;
