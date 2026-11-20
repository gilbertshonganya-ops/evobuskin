/* EvoBuskin - écrans inscription / connexion / récupération du mot de passe. */
const AuthUI = (() => {
  let mode = 'login';
  let inviteOuverte = false;
  let accountType = 'patron';
  let busy = false;

  const passwordRules = [
    { key: 'length', label: '12 caractères minimum', test: p => p.length >= 12 },
    { key: 'upper', label: 'une lettre majuscule', test: p => /[A-Z]/.test(p) },
    { key: 'lower', label: 'une lettre minuscule', test: p => /[a-z]/.test(p) },
    { key: 'number', label: 'un chiffre', test: p => /\d/.test(p) },
    { key: 'special', label: 'un caractère spécial', test: p => /[^A-Za-z0-9]/.test(p) }
  ];

  function strength(password) {
    const passed = passwordRules.filter(r => r.test(password)).length;
    const score = passed;
    const percent = passed * 20;
    if (!password) return { score, percent: 0, label: 'Aucun mot de passe', cls: '' };
    if (passed < 3) return { score, percent, label: percent + '% — Faible', cls: 'faible' };
    if (passed < 5) return { score, percent, label: percent + '% — Moyen', cls: 'moyen' };
    return { score, percent, label: '100% — Très fort', cls: 'tres-fort' };
  }

  function passwordHTML(id = 'motDePasse', confirmId = '') {
    return `
      <label class="champ-auth">
        <span>Mot de passe</span>
        <div class="auth-password-wrap">
          <input id="${id}" type="password" autocomplete="new-password" minlength="12" required placeholder="12 caractères minimum">
          <button type="button" class="auth-eye" data-toggle-password="${id}" aria-label="Afficher le mot de passe">👁</button>
        </div>
        <div class="password-meter" aria-hidden="true"><i></i></div>
        <div id="passwordStrength" class="password-strength">Aucun mot de passe</div>
        <ul class="password-rules" id="passwordRules">${passwordRules.map(r => `<li data-rule="${r.key}">○ ${r.label}</li>`).join('')}</ul>
      </label>
      ${confirmId ? `<label class="champ-auth"><span>Confirmer le mot de passe</span><div class="auth-password-wrap"><input id="${confirmId}" type="password" autocomplete="new-password" required placeholder="Répétez le mot de passe"><button type="button" class="auth-eye" data-toggle-password="${confirmId}" aria-label="Afficher le mot de passe">👁</button></div></label>` : ''}
    `;
  }

  function shell(content, slogan) {
    if (typeof arreterAttente === 'function') arreterAttente();
    const vue = $('#vue');
    $('#menu').hidden = true;
    $('#btnQuitter').hidden = true;
    const bAide = $('#btnAide'); if (bAide) bAide.hidden = true;
    $('#infoRole').textContent = 'Compte sécurisé';
    vue.innerHTML = `<section class="auth-page"><div class="auth-card"><img class="auth-logo" src="icons/logo.png" alt="EvoBuskin" width="86" height="86"><div class="auth-brand">EvoBuskin</div>${slogan ? `<p class="auth-slogan"><b>${slogan}</b></p>` : ''}${content}</div></section>`;
    bindCommon();
  }

  function bindCommon() {
    $$('.auth-eye').forEach(btn => btn.addEventListener('click', () => {
      const input = $('#' + btn.dataset.togglePassword);
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁' : '🙈';
    }));
    const pwd = $('#motDePasse');
    if (pwd) pwd.addEventListener('input', updatePasswordMeter);
    const confirm = $('#confirmationMotDePasse');
    if (confirm) confirm.addEventListener('input', updatePasswordMeter);
  }

  function updatePasswordMeter() {
    const pwd = $('#motDePasse');
    if (!pwd) return;
    const s = strength(pwd.value);
    const meter = $('.password-meter i');
    if (meter) meter.style.width = s.percent + '%';
    const label = $('#passwordStrength');
    if (label) { label.textContent = s.label; label.className = 'password-strength ' + s.cls; }
    $$('.password-rules li').forEach(li => {
      const rule = passwordRules.find(r => r.key === li.dataset.rule);
      const ok = rule && rule.test(pwd.value);
      li.textContent = (ok ? '✓ ' : '○ ') + rule.label;
      li.classList.toggle('ok', ok);
    });
    const confirm = $('#confirmationMotDePasse');
    const match = $('#passwordMatch');
    if (confirm && match) {
      match.textContent = !confirm.value ? '' : (confirm.value === pwd.value ? '✓ Les mots de passe correspondent.' : 'Les mots de passe ne correspondent pas.');
      match.className = 'password-match ' + (confirm.value && confirm.value === pwd.value ? 'ok' : 'bad');
    }
  }

  const MESSAGE_MDP = 'Le mot de passe doit avoir 12 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.';
  function validPassword(password) {
    return passwordRules.every(r => r.test(password));
  }

  function errorText(err) {
    if (window.Reseau && Reseau.estErreurReseau(err)) return Reseau.MESSAGE;
    if (err && err.evo && err.code !== 'INVALID' && err.code !== 'AAL2_REQUIRED') return err.message;
    const msg = String(err?.message || err || 'Une erreur est survenue.');
    if (/HORS_LIGNE_COMPTE_INCONNU/.test(msg)) return 'Pas de connexion Internet. Ce compte doit d’abord être ouvert une fois avec Internet sur cet appareil.';
    if (/CUSTOMER_HAS_DEBT/.test(msg)) return 'Ce client a encore une dette : suppression impossible.';
    if (/invalid login credentials/i.test(msg)) return (mode === 'login' || mode === 'signup2') && err && err.evo ? 'Numéro ou code secret incorrect.' : (document.getElementById('tel') ? 'Numéro ou code secret incorrect.' : 'Adresse email ou mot de passe incorrect.');
    if (/EMAIL_NOT_CONFIRMED|email not confirmed/i.test(msg)) return 'Votre adresse email doit être confirmée avant la connexion.';
    if (/AAL2_REQUIRED/i.test(msg)) return 'Une authentification à deux facteurs est requise pour ce compte.';
    if (/user already registered/i.test(msg)) return 'Un compte existe déjà avec cette adresse email.';
    if (/database error saving new user|unexpected_failure/i.test(msg)) return accountType === 'vendeur' ? 'Code d’invitation invalide, expiré ou déjà utilisé, ou limite d’utilisateurs atteinte. Demandez un nouveau code au propriétaire.' : 'Impossible de créer le compte pour le moment. Réessayez plus tard.';
    if (/rate limit/i.test(msg)) return 'Trop de demandes. Patientez quelques instants avant de réessayer.';
    const lisible = Reseau.lisible(msg);
    return lisible === Reseau.GENERIQUE ? lisible + ' (code : ' + (Diag.dernierCode() || 'X') + ')' : lisible;
  }

  function notice(message, type = '') {
    const el = $('#authMessage');
    if (!el) return;
    el.textContent = message;
    el.className = 'auth-message ' + type;
    // Pour un incident technique : bouton qui copie le rapport à envoyer au support
    let b = $('#authRapport');
    const technique = type === 'erreur' && /\(code : |momentanément|mise à jour|ouverture de votre boutique|n’a pas pu/i.test(message || '');
    if (technique) {
      if (!b) {
        b = document.createElement('button');
        b.type = 'button'; b.id = 'authRapport'; b.className = 'btn gris'; b.style.marginTop = '8px';
        b.textContent = 'Copier le rapport pour le support';
        b.addEventListener('click', async () => { const ok = await Diag.copier(); toast(ok ? 'Rapport copié : envoyez-le au support.' : 'Copie impossible : notez le code affiché.', ok ? 'ok' : 'erreur'); });
        el.insertAdjacentElement('afterend', b);
      }
    } else if (b) b.remove();
  }

  function submitButton(text) { return `<button class="btn auth-submit" id="authSubmit" type="submit">${esc(text)}</button>`; }

  function afficherConnexionEmail() {
    mode = 'login-email';
    shell(`
      <h1>Connexion par e-mail</h1>
      <p class="auth-subtitle">Pour les comptes créés avec une adresse e-mail.</p>
      <div id="authMessage" class="auth-message" role="alert"></div>
      <form id="loginForm" novalidate>
        <label class="champ-auth"><span>Adresse email</span><input id="email" type="email" autocomplete="email" inputmode="email" required placeholder="vous@exemple.com"></label>
        <label class="champ-auth"><span>Mot de passe</span><div class="auth-password-wrap"><input id="motDePasse" type="password" autocomplete="current-password" required placeholder="Votre mot de passe"><button type="button" class="auth-eye" data-toggle-password="motDePasse" aria-label="Afficher le mot de passe">👁</button></div></label>
        ${submitButton('Se connecter')}
      </form>
      <button class="auth-link" id="forgotPassword">Mot de passe oublié ?</button>
      <div class="auth-separator"><span>Nouveau ici ?</span></div>
      <button class="btn contour" id="versTel">Utiliser mon numéro de téléphone</button>
    `, 'Continuez à faire avancer votre commerce.');
    $('#loginForm').addEventListener('submit', connexion);
    $('#forgotPassword').addEventListener('click', afficherRecuperation);
    $('#versTel').addEventListener('click', afficherConnexion);
  }

    // ============ Connexion et inscription par numéro de téléphone ============
  const CODE_REGLES = [
    { key: 'chiffres', label: '4 chiffres', test: (p) => (p.match(/\d/g) || []).length === 4 },
    { key: 'lettre', label: '1 lettre majuscule', test: (p) => (p.match(/[A-Z]/g) || []).length === 1 }
  ];
  const FAIBLES = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '2345', '3456', '4567', '5678', '6789', '4321', '5432', '6543', '7654', '8765', '9876', '0123', '3210', '1212', '2580'];
  // Retourne '' si le code secret est correct, sinon la phrase d'explication
  function verifierCode(p) {
    p = String(p || '');
    if (p.length !== 5 || !CODE_REGLES.every((r) => r.test(p)) || /[^0-9A-Z]/.test(p)) return 'Le code secret doit avoir 5 caractères : 4 chiffres et 1 lettre majuscule (exemple : 4827K).';
    if (FAIBLES.includes(p.replace(/\D/g, ''))) return 'Ce code est trop facile à deviner (1234, 1111…). Choisissez-en un autre.';
    return '';
  }
  const champCode = (id, libelle, ph) => `
    <label class="champ-auth"><span>${libelle}</span>
      <div class="auth-password-wrap"><input id="${id}" type="password" maxlength="5" autocomplete="off" autocapitalize="characters" spellcheck="false" required placeholder="${ph || '4 chiffres + 1 lettre'}" class="champ-code">
      <button type="button" class="auth-eye" data-toggle-password="${id}" aria-label="Afficher le code">👁</button></div></label>`;
  const champTel = (id = 'tel') => `
    <label class="champ-auth"><span>Numéro de téléphone</span>
      <div class="champ-tel"><b>+243</b><input id="${id}" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" required placeholder="812 345 678"></div></label>`;
  // Les lettres sont mises en majuscules automatiquement, les autres symboles sont refusés
  function brancherCode(id) {
    const el = $('#' + id); if (!el) return;
    el.addEventListener('input', () => { const v = el.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 5); if (v !== el.value) el.value = v; });
  }
  function marquerCompte() { try { localStorage.setItem('evo_deja_compte', '1'); } catch (_) {} }
  function aDejaUnCompte() { try { return localStorage.getItem('evo_deja_compte') === '1'; } catch (_) { return false; } }
  // Numéro tapé : « 812 345 678 » (le +243 est affiché), ou numéro complet avec indicatif pour un autre pays
  function lireNumero(valeur) { const v = String(valeur || '').trim(); return Auth.normaliserNumero(/^(\+|00)/.test(v) ? v : (v.replace(/\D/g, '').startsWith('243') && v.replace(/\D/g, '').length === 12 ? v : '0' + v.replace(/\D/g, '').replace(/^0+/, ''))); }

  function afficherAccueil() {
    mode = 'accueil';
    shell(`
      <h1>Bienvenue</h1>
      <p class="auth-subtitle">Gérez votre commerce simplement, même sans Internet.</p>
      <div class="accueil-actions">
        <button class="btn auth-submit" id="goSignup">Créer un compte</button>
        <button class="btn contour" id="goLogin">Me connecter</button>
      </div>
      <button class="auth-link" id="versEmail">Ancien compte avec adresse e-mail</button>
    `, 'Votre commerce sous vos yeux.');
    $('#goSignup').addEventListener('click', afficherInscription);
    $('#goLogin').addEventListener('click', afficherConnexion);
    $('#versEmail').addEventListener('click', afficherConnexionEmail);
  }

  function afficherConnexion() {
    if (!inviteOuverte && new URLSearchParams(window.location.search).get('invite')) { inviteOuverte = true; return afficherInscription(); }
    mode = 'login';
    shell(`
      <h1>Connexion</h1>
      <p class="auth-subtitle">Entrez votre numéro et votre code secret.</p>
      <div id="authMessage" class="auth-message" role="alert"></div>
      <form id="loginForm" novalidate>
        ${champTel('tel')}
        ${champCode('pin', 'Code secret')}
        ${submitButton('Se connecter')}
      </form>
      <button class="auth-link" id="forgotPin">Code secret oublié ?</button>
      <div class="auth-separator"><span>Pas encore de compte ?</span></div>
      <button class="btn contour" id="goSignup">Créer un compte</button>
      <button class="auth-link" id="versEmail">Ancien compte avec adresse e-mail</button>
    `, 'Continuez à faire avancer votre commerce.');
    brancherCode('pin');
    $('#loginForm').addEventListener('submit', connexion);
    $('#forgotPin').addEventListener('click', afficherRecupTel);
    $('#goSignup').addEventListener('click', afficherInscription);
    $('#versEmail').addEventListener('click', afficherConnexionEmail);
    if (AuthHorsLigne.attente() > 0) afficherAttente();
  }

  // Point d'entrée : première visite = page d'accueil (Créer un compte / Me connecter) ; ensuite = connexion directe
  function demarrer() {
    if (new URLSearchParams(window.location.search).get('invite')) { inviteOuverte = true; return afficherInscription(); }
    let auto = true; try { auto = !navigator.webdriver; } catch (_) {}
    if (auto && !aDejaUnCompte()) return afficherAccueil();
    afficherConnexion();
  }

  // ----- Inscription, page 1 : qui êtes-vous ? -----
  let brouillon = { type: 'patron', nom: '', boutique: '', invitation: '' };
  function afficherInscription() {
    mode = 'signup';
    accountType = brouillon.type;
    shell(`
      <div class="etapes-auth" aria-label="Étape 1 sur 2"><i class="on"></i><i></i></div>
      <h1>Créer votre compte</h1>
      <p class="auth-subtitle">Étape 1 sur 2 — Qui êtes-vous ?</p>
      <div id="authMessage" class="auth-message" role="alert"></div>
      <form id="signupForm" novalidate>
        <div class="role-title">Je suis :</div>
        <div class="account-types">
          <button type="button" class="account-type" data-type="patron"><b>👑 Patron</b><small>Je crée et gère ma boutique.</small></button>
          <button type="button" class="account-type" data-type="vendeur"><b>🧾 Vendeur</b><small>Je rejoins une boutique avec un code.</small></button>
        </div>
        <label class="champ-auth"><span>Votre nom</span><input id="nomComplet" type="text" autocomplete="name" maxlength="100" required placeholder="Ex. Gilbert Mukendi"></label>
        <div id="businessFields"><label class="champ-auth"><span>Nom de la boutique</span><input id="nomBoutiqueAuth" type="text" autocomplete="organization" maxlength="120" placeholder="Ex. Boutique Gilbert"></label></div>
        <div id="inviteFields" hidden><label class="champ-auth"><span>Code d'invitation</span><input id="codeInvitation" type="text" autocomplete="off" maxlength="80" placeholder="Code reçu du patron"></label></div>
        ${submitButton('Continuer')}
      </form>
      <div class="auth-separator"><span>Déjà un compte ?</span></div>
      <button class="btn contour" id="goLogin">Me connecter</button>
    `, 'Sachez ce que vous vendez et ce que vous gagnez.');
    const appliquer = (t) => {
      accountType = brouillon.type = t;
      $$('.account-type').forEach((x) => x.classList.toggle('actif', x.dataset.type === t));
      $('#businessFields').hidden = t !== 'patron'; $('#inviteFields').hidden = t !== 'vendeur';
    };
    $$('.account-type').forEach((b) => b.addEventListener('click', () => appliquer(b.dataset.type)));
    $('#nomComplet').value = brouillon.nom; $('#nomBoutiqueAuth').value = brouillon.boutique; $('#codeInvitation').value = brouillon.invitation;
    const invitation = new URLSearchParams(window.location.search).get('invite');
    if (invitation) { brouillon.type = 'vendeur'; $('#codeInvitation').value = invitation.slice(0, 40); }
    appliquer(brouillon.type);
    $('#signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const nom = $('#nomComplet').value.trim(), boutique = $('#nomBoutiqueAuth').value.trim(), code = $('#codeInvitation').value.trim();
      if (nom.length < 2) return notice('Indiquez votre nom.', 'erreur');
      if (accountType === 'patron' && !boutique) return notice('Indiquez le nom de votre boutique.', 'erreur');
      if (accountType === 'vendeur' && !code) return notice('Un code d’invitation est requis pour un vendeur.', 'erreur');
      Object.assign(brouillon, { nom, boutique, invitation: code });
      afficherInscription2();
    });
    $('#goLogin').addEventListener('click', afficherConnexion);
  }

  // ----- Inscription, page 2 : numéro et code secret -----
  function afficherInscription2() {
    mode = 'signup2';
    shell(`
      <div class="etapes-auth" aria-label="Étape 2 sur 2"><i class="on"></i><i class="on"></i></div>
      <h1>Votre numéro</h1>
      <p class="auth-subtitle">Étape 2 sur 2 — Il vous servira à vous connecter.</p>
      <div id="authMessage" class="auth-message" role="alert"></div>
      <form id="signupForm2" novalidate>
        ${champTel('tel')}
        ${champCode('pin', 'Créez votre code secret')}
        <ul class="password-rules" id="regles">${CODE_REGLES.map((r) => `<li data-r="${r.key}">○ ${r.label}</li>`).join('')}</ul>
        ${champCode('pin2', 'Confirmez le code secret', 'Même code')}
        <div id="passwordMatch" class="password-match"></div>
        <p class="petit">Exemple : <b>4827K</b>. Ne le partagez avec personne. Après 5 erreurs, le compte est bloqué un moment.</p>
        <label class="auth-check"><input id="conditions" type="checkbox" required><span>J’accepte les <a href="conditions.html" target="_blank" rel="noopener">conditions d’utilisation</a> et la <a href="confidentialite.html" target="_blank" rel="noopener">politique de confidentialité</a>.</span></label>
        ${submitButton('Créer mon compte')}
      </form>
      <button class="auth-link" id="retourEtape1">‹ Retour</button>
    `, '');
    brancherCode('pin'); brancherCode('pin2');
    const maj = () => {
      const p = $('#pin').value;
      $$('#regles li').forEach((li) => { const r = CODE_REGLES.find((x) => x.key === li.dataset.r); const ok = r.test(p); li.textContent = (ok ? '✓ ' : '○ ') + r.label; li.classList.toggle('ok', ok); });
      const c = $('#pin2').value, m = $('#passwordMatch');
      m.textContent = !c ? '' : (c === p ? '✓ Les codes correspondent.' : 'Les codes ne correspondent pas.'); m.className = 'password-match ' + (c && c === p ? 'ok' : 'bad');
    };
    $('#pin').addEventListener('input', maj); $('#pin2').addEventListener('input', maj);
    $('#retourEtape1').addEventListener('click', afficherInscription);
    $('#signupForm2').addEventListener('submit', inscriptionTel);
  }

  async function inscriptionTel(e) {
    e.preventDefault(); if (busy) return;
    let numero; try { numero = lireNumero($('#tel').value); } catch (err) { return notice(err.message, 'erreur'); }
    const pin = $('#pin').value, pin2 = $('#pin2').value;
    const pb = verifierCode(pin); if (pb) return notice(pb, 'erreur');
    if (pin !== pin2) return notice('Les deux codes ne correspondent pas.', 'erreur');
    if (!$('#conditions').checked) return notice('Vous devez accepter les conditions d’utilisation.', 'erreur');
    busy = true; $('#authSubmit').disabled = true; notice('');
    try {
      const session = await Auth.signUpTel({ phone: numero, pin, fullName: brouillon.nom, accountType: brouillon.type, businessName: brouillon.boutique, inviteCode: brouillon.invitation });
      marquerCompte();
      await AuthHorsLigne.memoriser(Auth.emailTech(numero), pin, session.user);
      const suite = () => Chargeur.pendant(async () => { await App.apresAuthentification(Auth.getSession() || session); }, 'Ouverture de votre boutique…');
      brouillon = { type: 'patron', nom: '', boutique: '', invitation: '' };
      afficherEmailRecup(suite);
    } catch (err) {
      const m = errorText(err); notice(m, 'erreur');
      if (err.code === 'INVITE_INVALID' || err.code === 'INVITE_REQUIRED') setTimeout(afficherInscription, 1800);
    }
    finally { busy = false; if ($('#authSubmit')) $('#authSubmit').disabled = false; }
  }

  // ----- Après l'inscription : e-mail de récupération (facultatif) -----
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
  function afficherEmailRecup(suite) {
    mode = 'email-recup';
    shell(`
      <div class="ob-icone-auth" aria-hidden="true">🛡️</div>
      <h1>Protégez votre compte</h1>
      <p class="auth-subtitle">Ajoutez une adresse e-mail : si vous oubliez votre code secret, nous vous y enverrons un code pour le refaire.</p>
      <div id="authMessage" class="auth-message" role="alert"></div>
      <form id="emailForm" novalidate>
        <label class="champ-auth"><span>Adresse e-mail</span><input id="emailRecup" type="email" autocomplete="email" inputmode="email" maxlength="254" placeholder="vous@exemple.com"></label>
        <div id="zoneCodeEmail" hidden><label class="champ-auth"><span>Code reçu par e-mail</span><input id="codeEmail" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="123456"></label></div>
        ${submitButton('Envoyer le code')}
      </form>
      <button class="auth-link" id="plusTard">Plus tard</button>
    `, '');
    let envoye = false, adresse = '';
    $('#plusTard').addEventListener('click', () => suite());
    $('#emailForm').addEventListener('submit', async (e) => {
      e.preventDefault(); if (busy) return;
      busy = true; $('#authSubmit').disabled = true; notice('');
      try {
        if (!envoye) {
          adresse = $('#emailRecup').value.trim().toLowerCase();
          if (!EMAIL_RE.test(adresse)) throw Object.assign(new Error('Cette adresse e-mail n’est pas valide.'), { evo: true });
          await Auth.emailDebut(adresse); envoye = true;
          $('#zoneCodeEmail').hidden = false; $('#emailRecup').readOnly = true; $('#authSubmit').textContent = 'Confirmer';
          notice('Un code vient d’être envoyé à ' + adresse + '. Regardez aussi dans les courriers indésirables.', 'succes');
          $('#codeEmail').focus();
        } else {
          await Auth.emailConfirmer(adresse, $('#codeEmail').value);
          notice('Adresse enregistrée. Merci !', 'succes'); setTimeout(() => suite(), 700);
        }
      } catch (err) { notice(errorText(err), 'erreur'); }
      finally { busy = false; if ($('#authSubmit')) $('#authSubmit').disabled = false; }
    });
  }

  // ----- Code secret oublié : numéro → code reçu par e-mail → nouveau code -----
  function afficherRecupTel() {
    mode = 'recup-tel';
    shell(`
      <h1>Code secret oublié</h1>
      <p class="auth-subtitle">Entrez votre numéro. Si une adresse e-mail est enregistrée sur votre compte, nous lui envoyons un code.</p>
      <div id="authMessage" class="auth-message" role="alert"></div>
      <form id="recupForm" novalidate>
        ${champTel('tel')}
        <div id="zoneRecup" hidden>
          <label class="champ-auth"><span>Code reçu par e-mail</span><input id="codeRecup" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="123456"></label>
          ${champCode('pin', 'Nouveau code secret')}
        </div>
        ${submitButton('Envoyer le code')}
      </form>
      <p class="petit" id="aideRecup">Pas d’adresse e-mail enregistrée ? Contactez le support, ou demandez à votre patron.</p>
      <button class="auth-link" id="backLogin">← Retour à la connexion</button>
    `);
    brancherCode('pin');
    let envoye = false;
    $('#backLogin').addEventListener('click', afficherConnexion);
    $('#recupForm').addEventListener('submit', async (e) => {
      e.preventDefault(); if (busy) return;
      let numero; try { numero = lireNumero($('#tel').value); } catch (err) { return notice(err.message, 'erreur'); }
      busy = true; $('#authSubmit').disabled = true; notice('');
      try {
        if (!envoye) {
          await Auth.recupDebut(numero); envoye = true;
          $('#zoneRecup').hidden = false; $('#tel').readOnly = true; $('#authSubmit').textContent = 'Enregistrer le nouveau code';
          notice('Si une adresse e-mail est enregistrée pour ce numéro, un code vient d’y être envoyé. Entrez-le ci-dessous avec votre nouveau code secret.', 'succes');
        } else {
          const pb = verifierCode($('#pin').value); if (pb) throw Object.assign(new Error(pb), { evo: true });
          const session = await Auth.recupFin(numero, $('#codeRecup').value, $('#pin').value);
          marquerCompte(); AuthHorsLigne.effacerEssais(); await AuthHorsLigne.memoriser(Auth.emailTech(numero), $('#pin').value, session.user);
          await Chargeur.pendant(async () => { await App.apresAuthentification(Auth.getSession() || session); }, 'Ouverture de votre boutique…');
        }
      } catch (err) { notice(errorText(err), 'erreur'); }
      finally { busy = false; if ($('#authSubmit')) $('#authSubmit').disabled = false; }
    });
  }

  function afficherRecuperation() {
    mode = 'recovery';
    shell(`
      <h1>Mot de passe oublié ?</h1>
      <p class="auth-subtitle">Entrez l'adresse email de votre compte. Si elle existe, nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe.</p>
      <div id="authMessage" class="auth-message" role="alert"></div>
      <form id="recoveryForm" novalidate>
        <label class="champ-auth"><span>Adresse email</span><input id="email" type="email" autocomplete="email" inputmode="email" required placeholder="vous@exemple.com"></label>
        ${submitButton('Envoyer le lien de récupération')}
      </form>
      <button class="auth-link" id="backLogin">← Retour à la connexion</button>
    `);
    $('#recoveryForm').addEventListener('submit', recuperation);
    $('#backLogin').addEventListener('click', afficherConnexionEmail);
  }

  let minuteurAttente = null;
  function arreterAttente() { if (minuteurAttente) clearInterval(minuteurAttente); minuteurAttente = null; }
  // Après 5 erreurs : pause de 60 secondes (conservée même si la page est rechargée)
  function afficherAttente() {
    arreterAttente();
    const maj = () => {
      const reste = AuthHorsLigne.attente();
      const bouton = $('#authSubmit');
      if (reste <= 0) { arreterAttente(); notice(''); if (bouton) bouton.disabled = false; return; }
      if (bouton) bouton.disabled = true;
      notice('Trop de tentatives. Patientez ' + reste + ' seconde' + (reste > 1 ? 's' : '') + ' avant de réessayer.', 'erreur');
    };
    maj();
    minuteurAttente = setInterval(maj, 1000);
  }

  async function connexionHorsLigne(email, password) {
    const r = await AuthHorsLigne.verifier(email, password);
    if (r && r.inconnu) throw (navigator.onLine ? Reseau.erreur() : new Error('HORS_LIGNE_COMPTE_INCONNU'));
    if (!r) throw new Error('Invalid login credentials');
    await Chargeur.pendant(() => App.ouvrirSessionHorsLigne(r.user, r.profil), 'Ouverture de votre boutique…');
    Audit.log('connexion', { mode: 'sans Internet' });
  }

  async function connexion(e) {
    e.preventDefault(); if (busy) return;
    const parNumero = !!$('#tel');
    let email, password;
    if (parNumero) {
      try { email = Auth.emailTech(lireNumero($('#tel').value)); } catch (err) { return notice(err.message, 'erreur'); }
      password = $('#pin').value;
      if (!password) return notice('Renseignez votre numéro et votre code secret.', 'erreur');
    } else {
      email = $('#email').value.trim(); password = $('#motDePasse').value;
      if (!email || !password) return notice('Renseignez votre email et votre mot de passe.', 'erreur');
    }
    if (AuthHorsLigne.attente() > 0) return afficherAttente();
    busy = true; $('#authSubmit').disabled = true; notice('');
    let ouverture = false; // true une fois le mot de passe accepté : une erreur ensuite concerne l'ouverture de la boutique
    try {
      if (!navigator.onLine) { await connexionHorsLigne(email, password); return; }
      let data;
      try { data = await Auth.signIn(email, password); }
      catch (err) {
        if (err.reseau) { await connexionHorsLigne(email, password); return; } // coupure pendant la connexion : mode hors ligne
        if (/invalid login credentials/i.test(String(err.message))) {
          AuthHorsLigne.compterEchec();
          if (!parNumero) Auth.rpcPublic('v19_log_auth_failure', { p_email: email, p_kind: 'connexion_echec' }).catch(() => {}); // visible dans le journal du patron (les comptes « numéro » sont journalisés par le serveur)
        }
        throw err;
      }
      if (!data.access_token) throw new Error('Connexion non terminée. Vérifiez votre adresse email.');
      AuthHorsLigne.effacerEssais(); marquerCompte();
      ouverture = true;
      await Chargeur.pendant(async () => {
        await AuthHorsLigne.memoriser(email, password, data.user);
        if (typeof App.apresAuthentification === 'function') await App.apresAuthentification(data);
        else App.afficherConnexion();
      }, 'Ouverture de votre boutique…');
      Audit.log('connexion', { mode: 'avec Internet' });
      AuthHorsLigne.envoyerEchecsEnAttente();
    } catch (err) {
      try { Diag.noter(ouverture ? 'ouverture' : 'connexion', err); } catch (_) {}
      const base = errorText(err);
      notice((ouverture && !/session a expiré|incorrect/i.test(base) ? 'Connexion réussie, mais l’ouverture de votre boutique a échoué. ' : '') + base, 'erreur');
      if (AuthHorsLigne.attente() > 0) afficherAttente();
    }
    finally { busy = false; if ($('#authSubmit') && AuthHorsLigne.attente() <= 0) $('#authSubmit').disabled = false; }
  }

  // Mot de passe oublié : le système vérifie si le compte existe, puis envoie le lien.
  // Après 5 essais, pause de 60 secondes (aussi contrôlée par le serveur).
  let minuteurRecup = null;
  function afficherAttenteRecup() {
    if (minuteurRecup) clearInterval(minuteurRecup);
    const maj = () => {
      const reste = AuthHorsLigne.attente('recup');
      const bouton = $('#authSubmit');
      if (reste <= 0) { clearInterval(minuteurRecup); minuteurRecup = null; notice(''); if (bouton) bouton.disabled = false; return; }
      if (bouton) bouton.disabled = true;
      notice('Trop de tentatives. Patientez ' + reste + ' seconde' + (reste > 1 ? 's' : '') + ' avant de réessayer.', 'erreur');
    };
    maj(); minuteurRecup = setInterval(maj, 1000);
  }

  async function recuperation(e) {
    e.preventDefault(); if (busy) return;
    const email = $('#email').value.trim();
    if (!email) return notice('Renseignez votre adresse email.', 'erreur');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return notice('Cette adresse email n’est pas valide.', 'erreur');
    if (AuthHorsLigne.attente('recup') > 0) return afficherAttenteRecup();
    busy = true; $('#authSubmit').disabled = true; notice('');
    try {
      let existe;
      try { existe = await Auth.rpcPublic('v19_account_exists', { p_email: email }); }
      catch (err) {
        if (/RATE_LIMITED/.test(String(err.message))) { AuthHorsLigne.forcerPause('recup'); afficherAttenteRecup(); return; }
        throw err;
      }
      AuthHorsLigne.compterEchec('recup');
      if (!existe) {
        notice('Aucun compte n’est associé à cette adresse email. Vérifiez l’adresse ou créez un compte.', 'erreur');
        if (AuthHorsLigne.attente('recup') > 0) afficherAttenteRecup();
        return;
      }
      await Auth.resetPassword(email);
      AuthHorsLigne.effacerEssais('recup');
      notice('Compte trouvé. Un lien de récupération vient d’être envoyé à ' + email + '. Consultez votre boîte mail (et les courriers indésirables).', 'succes');
    } catch (err) { notice(Reseau.estErreurReseau(err) ? Reseau.MESSAGE : 'Impossible de traiter la demande pour le moment. Réessayez plus tard.', 'erreur'); }
    finally { busy = false; if ($('#authSubmit') && AuthHorsLigne.attente('recup') <= 0) $('#authSubmit').disabled = false; }
  }


  async function afficherMfaSetup(status,onDone){
    mode='mfa';
    if(!status.enrolled){
      shell(`<h1>Protection renforcée</h1><p class="auth-subtitle">Votre compte propriétaire nécessite une authentification à deux facteurs.</p><div id="authMessage" class="auth-message" role="alert"></div><button class="btn auth-submit" id="startMfa">Activer la double authentification</button><div class="auth-security-box">Utilisez une application TOTP. La clé secrète ne doit jamais être partagée.</div>`);
      $('#startMfa').addEventListener('click',async()=>{try{$('#startMfa').disabled=true;const f=await Auth.enrollTotp();const q0=f?.totp?.qr_code||'';const qr=q0.startsWith('data:image/svg+xml')?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(q0.slice(q0.indexOf(',')+1)):q0;const secret=f?.totp?.secret||'';shell(`<h1>Configurer la 2FA</h1><p class="auth-subtitle">Scannez le QR code, puis saisissez le code à 6 chiffres.</p><div id="authMessage" class="auth-message" role="alert"></div>${qr?`<img class="mfa-qr" src="${esc(qr)}" alt="QR code TOTP">`:''}<div class="auth-security-box"><b>Clé TOTP de secours</b><br><code class="mfa-secret">${esc(secret)}</code></div><form id="mfaForm"><label class="champ-auth"><span>Code à 6 chiffres</span><input id="mfaCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required></label>${submitButton('Vérifier et activer')}</form>`);$('#mfaForm').addEventListener('submit',async e=>{e.preventDefault();try{const fs=await Auth.listFactors();const latest=(fs?.all||[]).filter(x=>x.factor_type==='totp').sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)))[0];if(!latest)throw new Error('MFA_FACTOR_NOT_FOUND');const ch=await Auth.challengeFactor(latest.id);await Auth.verifyFactor(latest.id,ch.id,$('#mfaCode').value);notice('Double authentification activée.','succes');setTimeout(onDone,400)}catch(err){notice('Code invalide ou activation impossible.','erreur')}})}catch(err){notice(errorText(err),'erreur');$('#startMfa').disabled=false}})
    }else{
      shell(`<h1>Vérification 2FA</h1><p class="auth-subtitle">Entrez le code de votre application d’authentification.</p><div id="authMessage" class="auth-message" role="alert"></div><form id="mfaForm"><label class="champ-auth"><span>Code à 6 chiffres</span><input id="mfaCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required autofocus></label>${submitButton('Vérifier')}</form><button class="auth-link" id="mfaLogout">Annuler et se déconnecter</button>`);
      $('#mfaForm').addEventListener('submit',async e=>{e.preventDefault();try{$('#authSubmit').disabled=true;const ch=status.challenge||await Auth.challengeFactor(status.factor.id);await Auth.verifyFactor(status.factor.id,ch.id,$('#mfaCode').value);notice('Vérification réussie.','succes');setTimeout(onDone,300)}catch(err){notice('Code invalide. Réessayez.','erreur');$('#authSubmit').disabled=false}});$('#mfaLogout').addEventListener('click',()=>App.verrouiller())
    }
  }

  async function afficherNouveauMotDePasse(accessToken) {
    mode = 'reset';
    shell(`
      <h1>Nouveau mot de passe</h1>
      <p class="auth-subtitle">Choisissez un nouveau mot de passe fort pour sécuriser votre compte.</p>
      <div id="authMessage" class="auth-message" role="alert"></div>
      <form id="resetForm" novalidate>
        ${passwordHTML('motDePasse', 'confirmationMotDePasse')}
        <div id="passwordMatch" class="password-match"></div>
        ${submitButton('Enregistrer le nouveau mot de passe')}
      </form>
    `);
    $('#resetForm').addEventListener('submit', async (e) => {
      e.preventDefault(); if (busy) return;
      const password = $('#motDePasse').value; const confirm = $('#confirmationMotDePasse').value;
      if (!validPassword(password)) return notice('Votre nouveau mot de passe doit atteindre 100% : 12 caractères minimum, majuscule, minuscule, chiffre et caractère spécial.', 'erreur');
      if (password !== confirm) return notice('Les deux mots de passe ne correspondent pas.', 'erreur');
      busy = true; $('#authSubmit').disabled = true; notice('Mise à jour sécurisée en cours…');
      try {
        await Auth.updatePassword(accessToken, password);
        notice('Mot de passe modifié avec succès. Vous pouvez maintenant vous connecter.', 'succes');
        setTimeout(() => afficherConnexionEmail(), 1200);
      } catch (err) { notice(errorText(err), 'erreur'); }
      finally { busy = false; if ($('#authSubmit')) $('#authSubmit').disabled = false; }
    });
  }

  function recupererTokenDeRecuperation() {
    const hash = new URLSearchParams(String(location.hash || '').replace(/^#/, ''));
    if (hash.get('type') !== 'recovery') return null;
    return hash.get('access_token');
  }

  return { demarrer, afficherAccueil, afficherConnexionEmail, afficherInscription2, afficherRecupTel, afficherEmailRecup, verifierCode, brancherCode, afficherConnexion, afficherInscription, afficherRecuperation, afficherNouveauMotDePasse, afficherMfaSetup, recupererTokenDeRecuperation, strength, validPassword, MESSAGE_MDP, montrerErreur: (e) => notice(errorText(e), 'erreur') };
})();
window.AuthUI = AuthUI;
