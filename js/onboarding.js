/* EvoBuskin - présentation en 3 pages, affichée une seule fois à la toute première ouverture (avant la connexion). */
const Onboarding = (() => {
  const CLE = 'evo_onboarding_vu';
  const PAGES = [
    { icone: '\u{1F6D2}', titre: 'Vendez en quelques touches', texte: 'Touchez les produits, encaissez en espèces, mobile money ou à crédit, et envoyez le reçu par WhatsApp. Scannez les codes-barres avec le téléphone.' },
    { icone: '\u{1F4E6}', titre: 'Votre stock et vos dettes sous contrôle', texte: 'Le stock baisse tout seul à chaque vente. Soyez prévenu quand un produit est presque fini, et gardez la trace de ce que vos clients vous doivent.' },
    { icone: '\u{1F4F6}', titre: 'Même sans Internet', texte: 'Travaillez partout : tout est enregistré sur le téléphone et envoyé dès que la connexion revient. Plusieurs boutiques, plusieurs vendeurs, des rapports clairs.' }
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
        '<div class="ob-page"><div class="ob-image" aria-hidden="true">' + p.icone + '</div><h2>' + p.titre + '</h2><p>' + p.texte + '</p></div>').join('') + '</div></div>' +
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
