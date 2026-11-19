/* EvoBuskin - photo de profil (à la place du cadenas) : ajouter, changer, retirer. Le bouton rond de l'en-tête ouvre la fenêtre « Mon profil »
   (avec « Se déconnecter »). La photo est réduite et recompressée sur le téléphone (256 px, JPEG) puis rangée sur le serveur,
   dans une table que seul son propriétaire peut lire ; une copie locale permet de l'afficher sans Internet. */
const Profil = (() => {
  const TAILLE = 256, MAX_CARACTERES = 70000;
  let photo = '';   // data:image/jpeg;base64,…  ('' = pas de photo)
  let uidCharge = '';
  const lire = (k) => { try { return localStorage.getItem(k) || ''; } catch (_) { return ''; } };
  const ecrire = (k, v) => { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (_) {} };
  const uid = () => { try { return DB.uidCourant() || ''; } catch (_) { return ''; } };
  const cle = () => 'evo_photo_' + uid();
  const cleAttente = () => 'evo_photo_attente_' + uid();
  const valide = (d) => typeof d === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(d) && d.length <= 80000;

  function initiales() {
    const n = String((typeof App !== 'undefined' && App.nomComplet) || '').trim();
    if (n) return n.split(/\s+/).slice(0, 2).map((m) => m[0]).join('').toUpperCase();
    const e = String((typeof App !== 'undefined' && App.utilisateurLocal && App.utilisateurLocal.email) || '').trim();
    return e ? e[0].toUpperCase() : '\u{1F464}';
  }
  function contenuAvatar() { return valide(photo) ? '<img src="' + photo + '" alt="Ma photo">' : esc(initiales()); }

  // Bouton rond de l'en-tête
  function majBouton() {
    const b = document.getElementById('btnQuitter'); if (!b) return;
    b.className = 'avatar'; b.setAttribute('aria-label', 'Mon profil'); b.title = 'Mon profil';
    b.innerHTML = contenuAvatar();
  }

  async function envoyer(data) {
    const s = await Auth.ensureFreshSession(); if (!s || !s.access_token) throw new Error('AUTH_REQUIRED');
    await Auth.rpcAvecJeton('v27_set_my_photo', { p_data: data || null }, s.access_token);
  }

  // À l'ouverture de la session : photo locale tout de suite, puis celle du serveur
  async function charger() {
    const u = uid(); if (!u) return;
    uidCharge = u;
    photo = lire(cle());
    majBouton();
    if (!navigator.onLine) return;
    try {
      if (lire(cleAttente()) === '1') { await envoyer(photo); ecrire(cleAttente(), ''); }
      const s = await Auth.ensureFreshSession(); if (!s || !s.access_token || uid() !== u) return;
      const d = await Auth.rpcAvecJeton('v27_get_my_photo', {}, s.access_token);
      if (uid() !== u) return;
      photo = valide(d) ? d : ''; ecrire(cle(), photo); majBouton();
    } catch (_) { /* hors ligne ou serveur occupé : on garde la copie locale */ }
  }

  // Recadre au carré, réduit à 256 px et compresse en JPEG (supprime aussi les infos cachées de la photo)
  function reduire(fichier) {
    return new Promise((resolve, reject) => {
      if (!fichier || !/^image\//.test(fichier.type || '')) return reject(new Error('NOT_IMAGE'));
      if (fichier.size > 15 * 1024 * 1024) return reject(new Error('TOO_BIG'));
      const url = URL.createObjectURL(fichier); const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement('canvas'); c.width = c.height = TAILLE;
          const g = c.getContext('2d'); const cote = Math.min(img.naturalWidth, img.naturalHeight);
          if (!cote) throw new Error('NOT_IMAGE');
          g.fillStyle = '#fff'; g.fillRect(0, 0, TAILLE, TAILLE);
          g.drawImage(img, (img.naturalWidth - cote) / 2, (img.naturalHeight - cote) / 2, cote, cote, 0, 0, TAILLE, TAILLE);
          let q = 0.85, d = c.toDataURL('image/jpeg', q);
          while (d.length > MAX_CARACTERES && q > 0.35) { q -= 0.1; d = c.toDataURL('image/jpeg', q); }
          URL.revokeObjectURL(url);
          valide(d) ? resolve(d) : reject(new Error('NOT_IMAGE'));
        } catch (e) { URL.revokeObjectURL(url); reject(e); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('NOT_IMAGE')); };
      img.src = url;
    });
  }

  async function enregistrer(data) {
    photo = data || ''; ecrire(cle(), photo); majBouton();
    try { await envoyer(photo); ecrire(cleAttente(), ''); }
    catch (_) { ecrire(cleAttente(), '1'); toast('Photo enregistrée sur ce téléphone ; elle sera envoyée dès que la connexion revient.'); return false; }
    return true;
  }

  function ouvrir() {
    if (typeof App === 'undefined' || !App.role) return;
    const quoi = App.role === 'patron' ? 'Propriétaire' : 'Vendeur';
    const contact = String((App.utilisateurLocal && (App.utilisateurLocal.phone || App.utilisateurLocal.email)) || '');
    const f = ouvrirFenetre('Mon profil',
      '<div class="avatar avatar-grand" id="pfAvatar">' + contenuAvatar() + '</div>' +
      '<div class="profil-nom">' + esc(App.nomComplet || 'Mon compte') + '</div>' +
      '<div class="profil-info">' + esc(quoi) + (contact ? ' · ' + esc(contact) : '') + '</div>' +
      '<div class="bandeau rouge" id="pfErr" hidden></div>' +
      '<input type="file" id="pfFichier" accept="image/*" hidden>' +
      '<div class="profil-actions">' +
        '<button class="btn" id="pfChoisir">' + (valide(photo) ? '\u{1F4F7} Changer la photo' : '\u{1F4F7} Ajouter une photo') + '</button>' +
        (valide(photo) ? '<button class="btn contour" id="pfRetirer">Retirer la photo</button>' : '') +
        '<button class="btn gris" id="pfQuitter">Se déconnecter</button>' +
      '</div>');
    const err = (m) => { const e = $('#pfErr', f.el); e.textContent = m; e.hidden = !m; };
    const rafraichir = () => { f.fermer(); ouvrir(); };
    $('#pfChoisir', f.el).addEventListener('click', () => $('#pfFichier', f.el).click());
    $('#pfFichier', f.el).addEventListener('change', async (e) => {
      const fichier = e.target.files && e.target.files[0]; if (!fichier) return;
      err('');
      try { const d = await reduire(fichier); await enregistrer(d); rafraichir(); }
      catch (x) { err(x.message === 'TOO_BIG' ? 'Cette photo est trop lourde (15 Mo maximum).' : 'Ce fichier n’est pas une photo valide. Choisissez une image (JPG, PNG).'); }
    });
    const r = $('#pfRetirer', f.el);
    if (r) r.addEventListener('click', async () => { await enregistrer(''); rafraichir(); });
    $('#pfQuitter', f.el).addEventListener('click', async () => {
      f.fermer();
      if (await confirmer('Se déconnecter', 'Vous devrez retaper votre mot de passe pour revenir dans l’application.', 'Se déconnecter')) App.deconnecter();
    });
  }

  function reinitialiser() { photo = ''; uidCharge = ''; }
  return { charger, majBouton, ouvrir, reinitialiser, reduire, valide };
})();
window.Profil = Profil;
