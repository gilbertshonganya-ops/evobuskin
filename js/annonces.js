/* EvoBuskin - annonces de l'équipe (bandeau discret). Écrites dans l'interface d'administration, lues ici.
   Jamais bloquant : si le réseau ou le serveur échoue, rien ne s'affiche et l'application continue normalement. */
const Annonces = (() => {
  let timer = null, bid = null, liste = [], vues = {};
  const CLE = (b) => 'evobuskin.annonces.' + b;
  const zone = () => document.getElementById('annonces');
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ICONE = { info: 'information-outline', success: 'check-circle-outline', warning: 'alert-outline', important: 'alert-outline' };

  function lireCache(b) { try { return JSON.parse(localStorage.getItem(CLE(b)) || '[]'); } catch (_) { return []; } }
  function ecrireCache(b, l) { try { localStorage.setItem(CLE(b), JSON.stringify(l)); } catch (_) {} }

  function afficher() {
    const z = zone(); if (!z) return;
    z.innerHTML = liste.slice(0, 3).map((a) => {
      const lien = a.link_url && /^https:\/\/\S+$/.test(a.link_url) ? ' <a href="' + esc(a.link_url) + '" target="_blank" rel="noopener noreferrer">' + esc(a.link_label || 'En savoir plus') + '</a>' : '';
      return '<div class="annonce annonce-' + esc(a.level) + '" role="note" data-id="' + esc(a.id) + '"><span class="annonce-ico">' + Icones.svg(ICONE[a.level] || ICONE.info, 18) + '</span><div class="annonce-txt"><b>' + esc(a.title) + '</b> ' + esc(a.body) + lien + '</div>' +
        (a.dismissible ? '<button class="annonce-x" aria-label="Fermer ce message" data-x="' + esc(a.id) + '">&times;</button>' : '') + '</div>';
    }).join('');
    z.querySelectorAll('[data-x]').forEach((b) => b.addEventListener('click', () => fermer(b.dataset.x)));
    // clic sur le lien : compté côté serveur (silencieux, ne bloque jamais l'ouverture du lien)
    z.querySelectorAll('.annonce a[href]').forEach((l) => l.addEventListener('click', () => {
      const id = l.closest('.annonce') && l.closest('.annonce').dataset.id;
      if (id && navigator.onLine) { try { CloudDB.rpc('app_click_announcement', { p_id: id }).catch(() => {}); } catch (_) { /* ignoré */ } }
    }));
    // « vue » : une seule fois par annonce et par session de l'application
    liste.slice(0, 3).forEach((a) => {
      if (vues[a.id] || !navigator.onLine) return; vues[a.id] = 1;
      CloudDB.rpc('app_ack_announcement', { p_id: a.id, p_dismiss: false }).catch(() => { delete vues[a.id]; });
    });
  }

  async function fermer(id) {
    liste = liste.filter((a) => String(a.id) !== String(id)); ecrireCache(bid, liste); afficher();
    try { await CloudDB.rpc('app_ack_announcement', { p_id: id, p_dismiss: true }); } catch (_) { /* sera retenté à la prochaine ouverture : l'annonce réapparaît seulement si le serveur la renvoie */ }
  }

  async function charger() {
    if (!bid || !navigator.onLine || document.hidden) return;
    const b = bid;
    try {
      const r = await CloudDB.rpc('app_get_announcements', { p_business_id: b });
      if (b !== bid || !Array.isArray(r)) return;
      liste = r; ecrireCache(b, liste); afficher();
    } catch (_) { /* silencieux : fonction absente ou réseau coupé */ }
  }

  function demarrer(businessId) {
    arreter(); bid = businessId; vues = {};
    liste = navigator.onLine ? [] : lireCache(bid); afficher();   // hors ligne seulement : dernier état connu
    charger();
    timer = setInterval(charger, 10 * 60 * 1000);
    document.addEventListener('visibilitychange', onVis);
  }
  function onVis() { if (!document.hidden) charger(); }
  function arreter() {
    clearInterval(timer); timer = null; document.removeEventListener('visibilitychange', onVis);
    bid = null; liste = []; const z = zone(); if (z) z.innerHTML = '';
  }
  return { demarrer, arreter };
})();
window.Annonces = Annonces;
