/* EvoBuskin - présentation en 3 pages, affichée une seule fois à la toute première ouverture (avant la connexion). */
const Onboarding = (() => {
  const CLE = 'evo_onboarding_vu';
  const cadre = (ico, txt, cl) => '<li class="ob-cadre ' + (cl || '') + '"><span class="ob-ico">' + ico + '</span><span>' + txt + '</span></li>';
  const PAGES = [
    { html:
      '<div class="ob-halo" aria-hidden="true">\u{1F441}️</div>' +
      '<h2>Sachez à tout moment ce que vous <b class="o">vendez</b>, ce qui reste <b class="o">en stock</b>, ce qu’on <b class="o">vous doit</b> et ce que vous <b class="o">gagnez</b> réellement.</h2>' +
      '<ul class="ob-grille">' + cadre('\u{1F6D2}', '<b>Ventes</b>du jour en direct') + cadre('\u{1F4E6}', '<b>Stock</b>toujours à jour') + cadre('\u{1F9FE}', '<b>Dettes</b>clients suivies') + cadre('\u{1F4B0}', '<b>Bénéfice</b>réel calculé') + '</ul>' },
    { html:
      '<div class="ob-halo ob-aveugle" aria-hidden="true">\u{1F576}️</div>' +
      '<h2>Ne dirigez plus votre boutique <b class="o">à l’aveugle</b> !</h2>' +
      '<ul class="ob-liste">' + cadre('\u{1F4C9}', 'Le stock <b>baisse tout seul</b> à chaque vente', 'v') + cadre('\u{1F514}', 'Soyez <b>prévenu</b> quand un produit est presque fini', 'o') + cadre('\u{1F4D2}', 'Gardez la <b>trace de ce que vos clients vous doivent</b>', 'b') + '</ul>' +
      '<div class="ob-puce">\u{1F4F6} Fonctionne aussi sans Internet</div>' },
    { html:
      '<div class="ob-halo" aria-hidden="true">\u{1F680}</div>' +
      '<h2>Prêt à prendre le <b class="o">contrôle</b> de votre commerce ?</h2>' +
      '<p class="ob-sous">Quelques touches suffisent pour faire votre première vente :</p>' +
      '<ol class="ob-etapes">' +
        '<li class="ob-cadre"><span class="ob-num">1</span><span><b>Touchez les produits</b>Ils s’ajoutent au panier.</span></li>' +
        '<li class="ob-cadre"><span class="ob-num">2</span><span><b>Choisissez le paiement</b>Espèces, mobile money ou crédit.</span></li>' +
        '<li class="ob-cadre"><span class="ob-num v">✓</span><span><b>Vente terminée !</b>Stock et caisse sont déjà à jour.</span></li>' +
      '</ol>' }
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
