/* Page de retour après le paiement pawaPay.
   - Sur Android avec l'application EvoBuskin installée : rouvre l'application (evobuskin://paiement?depositId=…).
   - Sinon : ouvre la version web (index.html?depositId=…).
   Seul un identifiant de paiement au bon format est transmis. */
(function () {
  var m = /[?&]depositId=([0-9a-f-]{36})(?:&|$)/i.exec(location.search || '');
  var q = m ? '?depositId=' + m[1] : '';
  var web = 'index.html' + q;
  var lienWeb = document.getElementById('web');
  var lienApp = document.getElementById('app');
  lienWeb.href = web;
  if (!/Android/i.test(navigator.userAgent || '')) { location.replace(web); return; }
  var secours = location.origin + location.pathname.replace(/[^/]*$/, '') + web;
  var intent = 'intent://paiement' + q + '#Intent;scheme=evobuskin;package=com.evobuskin.app;S.browser_fallback_url=' + encodeURIComponent(secours) + ';end';
  lienApp.href = intent;
  try { location.href = intent; } catch (e) { /* le bouton reste disponible */ }
})();
