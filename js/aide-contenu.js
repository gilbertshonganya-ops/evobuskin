/* EvoBuskin — CONTENU DE L'AIDE.
 * Écriture : [[Texte]] = un bouton / un menu à toucher ; {{Texte}} = un champ à remplir ou une information à lire.
 * Chaque sujet : id, t (titre), pub ('tous' | 'patron' | 'vendeur'), mots (mots-clés pour la recherche),
 *   intro, etapes (liste numérotée), apres (ce que vous devez voir), astuce, attention, voir (autres sujets).
 */
const AIDE_CONTENU = {
  sections: [

    /* =============================================================== 1. DÉMARRER */
    { id: 'demarrer', icone: 'rocket-launch', titre: 'Bien démarrer', resume: 'Créer votre compte, vous connecter, comprendre l’écran, travailler sans Internet.', sujets: [
      { id: 'ecran', t: 'Comprendre l’écran et le menu', pub: 'tous', mots: 'menu navigation boutons barre haut bas interface',
        intro: 'EvoBuskin se pilote avec une barre en haut et un menu en bas. Tout le reste s’ouvre en touchant.',
        etapes: [
          'En haut à gauche : le <b>nom de votre boutique</b>. Pour le patron, toucher ce nom ouvre {{Mes boutiques}}.',
          'En haut à droite : un petit voyant qui indique si vous êtes <b>en ligne</b> ou <b>sans Internet</b> et si des opérations attendent d’être envoyées.',
          'Le bouton [[?]] ouvre cette Aide depuis n’importe quel écran. Le bouton [[🔒]] vous déconnecte.',
          'Menu du bas pour le <b>patron</b> : [[Caisse]] (vendre), [[Stock]] (produits), [[Dettes]] (clients qui doivent), [[Rapports]] (chiffres), [[Plus]] (tout le reste).',
          'Menu du bas pour le <b>vendeur</b> : [[Caisse]], [[Stock]], [[Dettes]] et [[Réglages]] (son compte).',
          'Dans [[Plus]] (patron) : Dépenses, Achats et fournisseurs, Importer des produits, Journal d’activité, Mon abonnement, Mes boutiques, Équipe, Réglages et Aide.'
        ],
        astuce: 'Sur un écran de détail ou un formulaire, le bouton <b>×</b> en haut à droite ou un toucher en dehors de la fenêtre la ferme sans rien enregistrer.' },

      { id: 'creer-compte', t: 'Créer mon compte propriétaire (patron)', pub: 'tous', mots: 'inscription créer compte propriétaire patron boutique email mot de passe',
        intro: 'Le propriétaire crée le compte et la première boutique. Il est le seul à voir les finances (rapports, achats, dépenses, réglages).',
        etapes: [
          'Ouvrez l’application <b>EvoBuskin</b> sur votre téléphone.',
          'Sur l’écran de connexion, touchez [[Créer un compte]].',
          'Choisissez la carte [[Propriétaire]] (« Je crée et gère ma boutique »).',
          'Remplissez {{Nom complet}}, {{Adresse email}} (une adresse que vous consultez vraiment) et {{Nom de la boutique}} (par exemple « Boutique Gilbert »).',
          'Choisissez un {{mot de passe}} d’<b>au moins 12 caractères</b> avec une majuscule, une minuscule, un chiffre et un caractère spécial (par exemple <i>Boutique#2026a</i>), puis répétez-le. Le bouton [[👁]] permet de vérifier ce que vous tapez.',
          'Cochez la case qui accepte les <b>conditions d’utilisation</b> et la <b>politique de confidentialité</b>.',
          'Touchez [[Créer mon compte]].',
          'Si l’application vous demande de confirmer votre adresse email, ouvrez le message reçu et touchez le lien, puis revenez vous connecter.'
        ],
        apres: 'Vous arrivez sur la Caisse de votre boutique, avec un <b>essai gratuit</b> du niveau supérieur si votre compte y a droit (voir « Essai gratuit »).',
        attention: 'Notez votre mot de passe dans un endroit sûr. Sans lui et sans l’adresse email, personne ne peut récupérer votre compte à votre place.',
        voir: ['connexion', 'config-initiale'] },

      { id: 'compte-vendeur', t: 'Créer mon compte vendeur avec une invitation', pub: 'tous', mots: 'vendeur invitation code lien rejoindre boutique employé',
        intro: 'Un vendeur ne peut pas créer de boutique : il rejoint celle de son patron grâce à un code d’invitation à usage unique.',
        etapes: [
          'Demandez à votre patron de vous envoyer l’invitation (un <b>lien</b> et un <b>code</b>, souvent par WhatsApp).',
          'Ouvrez l’application EvoBuskin (installée depuis le Play Store) puis touchez [[Créer un compte]].',
          'Choisissez la carte [[Vendeur]] (« Je rejoins une boutique avec une invitation »).',
          'Remplissez {{Nom complet}}, {{Adresse email}} et {{Code d’invitation}} (collez le code reçu).',
          'Choisissez votre mot de passe (12 caractères minimum, majuscule, minuscule, chiffre, caractère spécial) et répétez-le.',
          'Cochez les conditions puis touchez [[Créer mon compte]].'
        ],
        apres: 'Vous voyez la Caisse, le Stock et les Dettes de la boutique de votre patron.',
        attention: 'Un code ne marche qu’une fois et pendant une durée limitée (24 heures ou 7 jours). S’il est refusé, demandez-en un nouveau au patron.',
        voir: ['inviter-vendeur', 'depannage-invitation'] },

      { id: 'connexion', t: 'Me connecter, mot de passe oublié', pub: 'tous', mots: 'connexion login mot de passe oublié réinitialiser déconnecter',
        etapes: [
          'Sur l’écran de connexion, tapez votre {{Adresse email}} et votre {{mot de passe}}.',
          'Touchez [[Se connecter]].',
          '<b>Mot de passe oublié ?</b> Touchez [[Mot de passe oublié ?]], tapez votre email et suivez le message reçu pour choisir un nouveau mot de passe.',
          'Pour quitter votre session (par exemple sur le téléphone d’un autre), touchez [[🔒]] en haut à droite.'
        ],
        astuce: 'Une fois connecté sur un téléphone, vous pouvez rouvrir l’application <b>sans Internet</b> avec le même mot de passe : vos données sont gardées sur l’appareil.' },

      { id: 'mfa', t: 'Double authentification (si elle est demandée)', pub: 'patron', mots: 'double authentification 2fa google authenticator code 6 chiffres sécurité',
        intro: 'Selon la configuration de votre application, le propriétaire peut devoir confirmer sa connexion avec un code à 6 chiffres.',
        etapes: [
          'Après votre mot de passe, si l’écran « Activer la double authentification » apparaît, installez l’application <b>Google Authenticator</b> (ou équivalente) sur votre téléphone.',
          'Touchez [[Activer la double authentification]] et scannez le QR code affiché (ou saisissez la clé indiquée).',
          'Tapez le {{Code à 6 chiffres}} que l’application d’authentification affiche, puis validez.',
          'Aux connexions suivantes, ouvrez Google Authenticator, lisez le code du moment et tapez-le.'
        ],
        attention: 'Ne désinstallez pas Google Authenticator sans avoir noté votre accès de secours. Les codes changent toutes les 30 secondes : tapez-le rapidement.' },

      { id: 'installer', t: 'Installer et mettre à jour l’application', pub: 'tous', mots: 'installer play store télécharger application mise à jour android téléphone',
        etapes: [
          'Sur votre téléphone Android, ouvrez le <b>Play Store</b>.',
          'Tapez <b>EvoBuskin</b> dans la recherche et touchez l’application.',
          'Touchez [[Installer]] et attendez la fin du téléchargement.',
          'Touchez [[Ouvrir]], ou l’icône <b>EvoBuskin</b> apparue sur votre écran d’accueil.',
          'Pour les mises à jour : Play Store → votre photo de profil → [[Gérer les applications et l’appareil]] → [[Mises à jour disponibles]] → [[Mettre à jour]] à côté d’EvoBuskin. Vous pouvez aussi activer la mise à jour automatique sur la page de l’application.'
        ],
        astuce: 'Gardez l’application à jour : chaque version apporte des améliorations et des corrections. Vos données ne sont pas perdues lors d’une mise à jour.' },

      { id: 'config-initiale', t: 'Les 6 premières choses à faire (patron)', pub: 'patron', mots: 'configuration première démarrage checklist commencer débuter',
        intro: 'Dans cet ordre, vous serez prêt à vendre en 15 minutes.',
        etapes: [
          '<b>Nom et téléphone de la boutique</b> : [[Plus]] → [[Réglages]] → {{Ma boutique}} → [[Enregistrer]]. Ils apparaissent sur les reçus.',
          '<b>Taux de change</b> : dans [[Réglages]] → {{Taux de change}}, tapez « 1 dollar ($) = combien de francs (FC) ? » (par exemple 2800), puis [[Enregistrer]].',
          '<b>Ajouter vos produits</b> : [[Stock]] → [[+]] (voir « Ajouter un produit »), ou en une fois avec [[Plus]] → [[Importer des produits]] si votre niveau l’inclut.',
          '<b>Fixer les prix de vente</b> manquants : [[Stock]] → filtre [[Prix à fixer]].',
          '<b>Ajouter vos vendeurs</b> : [[Plus]] → [[Équipe]] → [[Générer une invitation]].',
          '<b>Faire une première vente d’essai</b> dans [[Caisse]], puis l’annuler (Rapports → la vente → [[Annuler cette vente]]) pour vérifier que tout fonctionne.'
        ],
        voir: ['ajouter-produit', 'taux', 'inviter-vendeur', 'vente-especes'] },

      { id: 'hors-ligne', t: 'Travailler sans Internet', pub: 'tous', mots: 'hors ligne offline sans internet connexion coupure synchronisation envoi en attente',
        intro: 'EvoBuskin est conçu pour continuer à vendre quand le réseau est coupé.',
        etapes: [
          'Vendez normalement dans [[Caisse]]. Le message « Vente enregistrée sur ce téléphone ; elle sera envoyée automatiquement dès que possible » confirme que la vente est gardée.',
          'Le voyant en haut à droite indique le nombre d’opérations en attente d’envoi.',
          'Dès que le téléphone retrouve Internet, tout est envoyé <b>automatiquement</b> au serveur : vous n’avez rien à faire.',
          'Les autres téléphones de la boutique reçoivent ensuite ces ventes (quelques secondes avec Internet).'
        ],
        attention: 'Pour inviter un vendeur, gérer les boutiques, payer un abonnement ou voir le journal d’activité, Internet est nécessaire. Évitez aussi de vendre le même article au même moment sur deux téléphones hors ligne : le stock ne se mettra à jour qu’au retour du réseau.' }
    ] },

    /* =============================================================== 2. CAISSE */
    { id: 'caisse', icone: 'cart', titre: 'Vendre (Caisse)', resume: 'Espèces, Mobile Money, vente à crédit, panier, cartons, reçu WhatsApp, annulation.', sujets: [
      { id: 'vente-especes', t: 'Faire une vente en espèces', pub: 'tous', mots: 'vendre vente caisse espèces encaisser panier payer',
        etapes: [
          'Touchez [[Caisse]] dans le menu du bas.',
          'Touchez le <b>produit</b> vendu : il est ajouté au panier avec une quantité de 1. Touchez-le plusieurs fois pour augmenter la quantité.',
          'Une barre verte {{Panier (n)}} avec le total apparaît en bas : touchez-la.',
          'Vérifiez les lignes. Réglez la quantité avec [[−]] et [[+]] ou tapez le nombre directement.',
          'Touchez [[Encaisser]].',
          'Choisissez [[Espèces]] et la monnaie reçue : [[Dollars ($)]] ou [[Francs (FC)]].',
          'Le champ {{Montant reçu}} est déjà rempli avec le total. Si le client donne plus, tapez la somme reçue : « Monnaie à rendre » s’affiche.',
          'Touchez [[Valider la vente]].'
        ],
        apres: 'La fenêtre « Vente enregistrée » s’affiche avec le reçu. Touchez [[Nouvelle vente]] pour continuer. Le stock diminue automatiquement.',
        astuce: 'Le prix est celui de la fiche produit. Les totaux sont affichés en dollars et en francs, avec le taux du jour.',
        voir: ['panier', 'vente-mobile', 'vente-credit', 'caisse-grise'] },

      { id: 'vente-mobile', t: 'Encaisser par M-Pesa, Airtel Money ou Orange Money', pub: 'tous', mots: 'mobile money mpesa airtel orange paiement référence transaction',
        etapes: [
          'Ajoutez les produits au panier puis touchez [[Encaisser]].',
          'Choisissez [[M-Pesa]], [[Airtel Money]] ou [[Orange Money]].',
          'Dans {{Référence de la transaction (facultatif)}}, tapez le code reçu par SMS (par exemple le numéro de transaction). Cela aide à retrouver la vente plus tard.',
          'Vérifiez {{Montant reçu}}, puis touchez [[Valider la vente]].'
        ],
        attention: 'EvoBuskin <b>enregistre</b> le moyen de paiement utilisé : il ne déclenche pas le paiement lui-même. Vérifiez toujours le SMS de réception avant de remettre la marchandise.' },

      { id: 'vente-credit', t: 'Vendre à crédit (client qui paie plus tard)', pub: 'tous', mots: 'crédit dette acompte client reste à payer nouveau client',
        intro: 'Si le client ne paie pas tout, la différence devient une <b>dette</b> à son nom.',
        etapes: [
          'Dans le panier, touchez [[Encaisser]].',
          'Pour une vente entièrement à crédit, choisissez [[À crédit]] : le champ devient {{Acompte versé maintenant (0 si rien)}}.',
          'Pour un paiement partiel avec un autre mode (Espèces, M-Pesa…), tapez simplement dans {{Montant reçu}} une somme <b>inférieure au total</b>.',
          'Le texte rouge « Reste à payer (dette) » indique ce que le client devra.',
          'Dans {{Client (obligatoire s’il reste une dette)}}, choisissez le client dans la liste. S’il n’existe pas encore, choisissez [[+ Nouveau client]], écrivez son {{Nom}} et son {{Téléphone}} (numéro congolais, par exemple 0895006995).',
          'Touchez [[Valider la vente]].'
        ],
        apres: 'La dette apparaît dans [[Dettes]] au nom du client. Vous pouvez lui envoyer le reçu par WhatsApp depuis la fenêtre « Vente enregistrée ».',
        attention: 'Deux clients ne peuvent pas avoir le même nom ou le même numéro. Selon votre niveau d’abonnement, le nombre de clients à crédit est limité (voir « Limites et verrouillage »).',
        voir: ['dettes-paiement', 'recu-whatsapp', 'limites'] },

      { id: 'panier', t: 'Modifier le panier : quantités, cartons, vider', pub: 'tous', mots: 'panier quantité carton gros vider retirer',
        etapes: [
          'Touchez la barre {{Panier (n)}} en bas de la Caisse.',
          '[[−]] retire 1 ; [[+]] ajoute 1 ; vous pouvez aussi taper la quantité exacte (par exemple 2,5 pour un produit vendu au poids).',
          'Mettre la quantité à 0 ou toucher [[−]] jusqu’à 0 retire la ligne.',
          'Si le produit a un carton défini, le bouton [[+ 1 carton (n)]] ajoute d’un coup toutes les unités d’un carton.',
          'Pour tout recommencer, touchez [[Vider]] puis confirmez.'
        ],
        astuce: 'La ligne indique le tarif appliqué (unité, gros ou carton). Le prix de gros se déclenche tout seul quand la quantité atteint le seuil défini sur la fiche produit.' },

      { id: 'chercher-scanner', t: 'Trouver un produit : recherche, catégories, code-barres', pub: 'tous', mots: 'chercher recherche scanner code-barres catégorie lecteur caméra',
        etapes: [
          'Dans [[Caisse]], tapez le début du nom (ou le code) dans {{Chercher ou taper un code-barres}} : la liste se réduit.',
          'Si vos produits ont des catégories, des boutons de catégories apparaissent sous la barre de recherche : touchez-en un pour filtrer ; [[Tous]] pour tout revoir.',
          'Touchez [[📷]] pour <b>scanner un code-barres</b> avec la caméra : le produit est ajouté au panier.',
          'Avec un lecteur de code-barres, placez le curseur dans la recherche, scannez, puis le produit est ajouté.',
          'Si le code est inconnu, le patron peut créer le produit tout de suite ; le vendeur doit demander au patron de l’ajouter.'
        ] },

      { id: 'recu-whatsapp', t: 'Envoyer un reçu à un client sur WhatsApp', pub: 'tous', mots: 'reçu whatsapp envoyer client facture',
        etapes: [
          'Après une vente à crédit avec un client enregistré, la fenêtre « Vente enregistrée » propose [[Envoyer le reçu à … sur WhatsApp]].',
          'Touchez ce bouton : WhatsApp s’ouvre avec le message prêt (articles, total, payé, reste à payer).',
          'Envoyez-le. Vous pouvez aussi le retrouver plus tard : [[Rapports]] → touchez la vente → même bouton.'
        ],
        attention: 'Le client doit avoir un numéro de téléphone enregistré. Cette fonction fait partie du niveau Pro.' },

      { id: 'annuler-vente', t: 'Annuler une vente (erreur de caisse)', pub: 'patron', mots: 'annuler vente erreur supprimer remboursement',
        etapes: [
          'Touchez [[Rapports]] et choisissez la période de la vente ([[Aujourd’hui]] ou [[Autre date]]).',
          'Descendez jusqu’à « Ventes de la période » et touchez la vente concernée.',
          'Touchez [[Annuler cette vente]] et confirmez.'
        ],
        apres: 'La vente reste visible avec la mention <b>Annulée</b> (pour l’historique), le <b>stock est remis</b> et la dette éventuelle est supprimée. Elle n’est plus comptée dans vos chiffres.',
        attention: 'Seul le patron peut annuler. Une vente annulée ne peut pas être « désannulée » : refaites une nouvelle vente si besoin.' },

      { id: 'caisse-grise', t: 'Un produit est grisé ou refuse de s’ajouter', pub: 'tous', mots: 'grisé rupture prix verrouillé impossible ajouter caisse',
        intro: 'Un produit grisé dans la Caisse a toujours une raison, indiquée sous son nom :',
        etapes: [
          '<b>Rupture de stock</b> : il n’en reste plus. Faites une entrée de stock ([[Stock]] → le produit → [[+ Entrée]]) ou un achat.',
          '<b>Prix à fixer</b> : aucun prix de vente. Patron : [[Stock]] → le produit → [[Modifier]] → {{Prix de vente}}.',
          '<b>🔒 Verrouillé (niveau)</b> : votre niveau d’abonnement limite le nombre de produits utilisables. Le produit est conservé, il se débloque en passant au niveau supérieur (voir « Limites et verrouillage »).',
          '<b>Stock insuffisant</b> : la quantité demandée dépasse ce qu’il reste.'
        ],
        voir: ['limites', 'entree-stock', 'prix-a-fixer'] }
    ] },

    /* =============================================================== 3. STOCK */
    { id: 'stock', icone: 'package-variant-closed', titre: 'Stock et produits', resume: 'Ajouter, modifier, entrées et sorties, alertes, gros et cartons, inventaire, import.', sujets: [
      { id: 'ajouter-produit', t: 'Ajouter un produit', pub: 'patron', mots: 'ajouter créer produit nouveau article prix stock catégorie code-barres',
        etapes: [
          'Touchez [[Stock]] puis le bouton [[+]] à droite de la recherche.',
          'Remplissez {{Nom du produit *}} (obligatoire).',
          '{{Catégorie}} (facultatif) : par exemple « Boissons ». Les catégories déjà utilisées sont proposées.',
          '{{Code-barres (facultatif)}} : tapez-le, ou touchez [[📷]] pour le scanner.',
          '{{Les prix sont en}} : choisissez [[Dollars ($)]] ou [[Francs congolais (FC)]]. Cette monnaie s’applique aux deux prix.',
          '{{Prix d’achat}} (ce que le produit vous coûte) et {{Prix de vente}} (ce que le client paie). Laissez le prix de vente vide si vous ne le connaissez pas encore : le produit sera marqué « Prix à fixer ».',
          '{{Stock de départ}} : la quantité que vous avez en rayon. {{Alerte quand il reste}} : le niveau à partir duquel vous voulez être prévenu (par exemple 5).',
          'Touchez [[Enregistrer]].'
        ],
        apres: 'Le produit apparaît dans la liste du Stock et dans la Caisse.',
        attention: 'Si le prix d’achat est plus grand que le prix de vente, l’application vous demande de confirmer (vous vendriez à perte). Le nombre de produits est limité selon votre niveau.',
        voir: ['limites', 'gros-carton', 'import'] },

      { id: 'modifier-produit', t: 'Modifier un produit (nom, prix, seuil)', pub: 'patron', mots: 'modifier produit changer prix nom',
        etapes: [
          'Touchez [[Stock]] et touchez le produit dans la liste.',
          'Dans la fenêtre du produit, touchez [[Modifier]].',
          'Changez ce qui doit l’être (nom, catégorie, code-barres, prix, seuil d’alerte).',
          'Touchez [[Enregistrer]].'
        ],
        attention: 'Le <b>stock actuel</b> ne se modifie pas ici : utilisez [[+ Entrée]] ou [[− Sortie]] (ou l’inventaire). Cela garde une trace de chaque mouvement. Les anciennes ventes gardent le prix auquel elles ont été faites.',
        voir: ['entree-stock'] },

      { id: 'entree-stock', t: 'Ajouter ou retirer du stock (entrée / sortie)', pub: 'patron', mots: 'entrée sortie stock réception casse perte mouvement',
        etapes: [
          'Touchez [[Stock]] puis le produit.',
          'Touchez [[+ Entrée]] pour <b>ajouter</b> (réception de marchandise) ou [[− Sortie]] pour <b>retirer</b> (casse, perte, usage personnel).',
          'Tapez la {{Quantité reçue}} (ou {{Quantité sortie}}).',
          'Ajoutez une {{Note (facultatif)}} : par exemple « livraison du 12 » ou « bouteilles cassées ».',
          'Validez.'
        ],
        apres: 'Le stock est mis à jour et le mouvement apparaît dans « Derniers mouvements » de la fiche du produit.',
        attention: 'Une sortie supérieure au stock disponible est refusée (« Impossible : il ne reste que… »).',
        voir: ['inventaire'] },

      { id: 'prix-a-fixer', t: 'Fixer les prix manquants', pub: 'patron', mots: 'prix à fixer manquant vide vendre',
        etapes: [
          'Touchez [[Stock]] puis le filtre [[Prix à fixer (n)]] : il liste tous les produits sans prix de vente.',
          'Touchez un produit puis [[Modifier]].',
          'Remplissez {{Prix de vente}} puis [[Enregistrer]].'
        ],
        astuce: 'Un produit sans prix ne peut pas être vendu : il reste grisé dans la Caisse. C’est volontaire pour éviter de vendre à 0.' },

      { id: 'gros-carton', t: 'Prix de gros et vente par carton', pub: 'patron', mots: 'gros carton prix de gros seuil quantité remise',
        intro: 'Disponible à partir du niveau Pro. Les prix saisis sont conservés si votre niveau change, mais ne s’appliquent que si le niveau les inclut.',
        etapes: [
          'Ouvrez la fiche du produit puis [[Modifier]].',
          'Touchez la zone {{Prix de gros et cartons (facultatif)}} pour la déplier.',
          '{{Prix de gros (par unité)}} et {{à partir de (unités)}} : par exemple 2 $ l’unité à partir de 12 unités. Le tarif de gros s’applique tout seul dans le panier dès que la quantité atteint le seuil.',
          '{{Unités par carton}} et {{Prix du carton}} : par exemple 24 unités pour 40 $. Dans le panier, le bouton [[+ 1 carton (24)]] apparaît.',
          'Touchez [[Enregistrer]].'
        ] },

      { id: 'alertes-stock', t: 'Alertes de stock bas et ruptures', pub: 'tous', mots: 'alerte seuil rupture stock bas réapprovisionner',
        etapes: [
          'Dans [[Stock]], le bouton [[Alertes (n)]] affiche seulement les produits en <b>rupture</b> ou dont le stock est <b>à ou sous le seuil</b>.',
          'Dans [[Rapports]], une carte orange « produit(s) en rupture ou stock bas » mène directement à cette liste.',
          'Pour changer le seuil d’un produit : fiche produit → [[Modifier]] → {{Alerte quand il reste}}.'
        ],
        astuce: 'Un bon seuil = ce que vous vendez en une semaine. Ainsi vous réapprovisionnez avant la rupture.' },

      { id: 'inventaire', t: 'Faire l’inventaire (comparer le stock compté au stock de l’application)', pub: 'patron', mots: 'inventaire comptage écart stock réel perte différence',
        intro: 'Disponible à partir du niveau Pro.',
        etapes: [
          'Touchez [[Stock]] puis [[Faire l’inventaire]].',
          'Comptez chaque produit sur l’étagère et tapez la quantité réelle dans le champ {{Compté}}. Laissez vide un produit que vous ne comptez pas aujourd’hui.',
          'Touchez [[Terminer l’inventaire]].',
          'L’application affiche le <b>résultat</b> : les écarts (manque ou surplus) et leur valeur. Confirmez pour que le stock prenne la valeur comptée.',
          'Pour relire les anciens inventaires : [[Stock]] → [[Écarts passés]].'
        ],
        astuce: 'Un écart négatif régulier sur un produit = vol, casse ou erreur de caisse à surveiller.' },

      { id: 'supprimer-produit', t: 'Supprimer un produit', pub: 'patron', mots: 'supprimer retirer produit désactiver',
        etapes: [
          'Touchez [[Stock]], puis le produit.',
          'Touchez [[Supprimer]] et confirmez.'
        ],
        apres: 'Le message « Produit désactivé » s’affiche. Le produit disparaît du Stock et de la Caisse mais <b>reste dans vos anciennes ventes et rapports</b>.',
        astuce: 'Supprimer des produits inutiles libère de la place dans la limite de votre niveau d’abonnement.' },

      { id: 'import', t: 'Importer beaucoup de produits depuis Excel ou CSV', pub: 'patron', mots: 'import excel csv fichier produits en masse modèle',
        intro: 'Réservé au niveau Premium.',
        etapes: [
          'Touchez [[Plus]] → [[Importer des produits]].',
          'Touchez [[Télécharger un modèle de fichier]] : ouvrez-le dans Excel et remplissez une ligne par produit.',
          'Choisissez {{Devise des prix si le fichier n’a pas de colonne « devise »}}.',
          'Touchez [[Choisir mon fichier Excel ou CSV]] et sélectionnez votre fichier (un ancien fichier .xls doit d’abord être enregistré en .xlsx ou .csv).',
          'Contrôlez l’{{Aperçu}} : produits nouveaux et produits mis à jour.',
          'Touchez [[Importer n produit(s)]].'
        ],
        attention: 'Si votre niveau limite le nombre de produits, l’import est refusé quand il dépasserait la limite.' },

      { id: 'stock-vendeur', t: 'Consulter le stock (vendeur)', pub: 'vendeur', mots: 'vendeur stock consulter lecture',
        etapes: [
          'Touchez [[Stock]] : vous voyez les produits et les quantités.',
          'Utilisez la recherche et les filtres [[Tous]] et [[Alertes]] pour trouver rapidement.',
          'Touchez un produit pour voir son stock et ses derniers mouvements.'
        ],
        attention: 'Le vendeur ne peut pas modifier les produits ni les prix : il prévient le patron.' }
    ] },

    /* =============================================================== 4. DETTES */
    { id: 'dettes', icone: 'notebook-outline', titre: 'Dettes des clients', resume: 'Clients, paiements, anciennes dettes, rappels WhatsApp.', sujets: [
      { id: 'dettes-ajouter-client', t: 'Ajouter un client', pub: 'tous', mots: 'client ajouter nouveau créer téléphone',
        etapes: [
          'Touchez [[Dettes]] puis [[+]].',
          'Tapez {{Nom *}} et {{Téléphone WhatsApp}} (numéro congolais, par exemple 0895006995).',
          'Touchez [[Enregistrer]].'
        ],
        astuce: 'Vous pouvez aussi créer le client directement pendant une vente à crédit ([[+ Nouveau client]]).',
        attention: 'Deux clients ne peuvent pas avoir le même nom ni le même numéro. Le nombre de clients à crédit dépend de votre niveau.',
        voir: ['limites'] },

      { id: 'dettes-voir', t: 'Voir qui me doit de l’argent', pub: 'tous', mots: 'dette voir liste total qui doit solde',
        etapes: [
          'Touchez [[Dettes]] : la carte du haut donne le <b>total que les clients vous doivent</b> et le nombre de clients débiteurs.',
          'La liste montre chaque client avec son solde, les plus gros débiteurs d’abord.',
          'Touchez un client pour voir son <b>historique</b> : dettes (ventes à crédit) et paiements.'
        ] },

      { id: 'dettes-paiement', t: 'Enregistrer le paiement d’une dette', pub: 'tous', mots: 'paiement dette encaisser rembourser versement client',
        etapes: [
          'Touchez [[Dettes]] puis le client.',
          'Touchez [[Enregistrer un paiement]].',
          'Choisissez la monnaie ([[Dollars ($)]] ou [[Francs (FC)]]) et tapez le {{Montant}}.',
          'Choisissez le {{Moyen de paiement}} : {{Espèces}}, {{M-Pesa}}, {{Airtel Money}} ou {{Orange Money}}.',
          'Ajoutez une {{Note ou référence (facultatif)}}.',
          'Touchez [[Enregistrer le paiement]].'
        ],
        apres: 'Le solde du client baisse. Si vous tapez plus que la dette, l’application refuse (« Le montant dépasse la dette »).',
        astuce: 'Un paiement de dette compte dans « Argent encaissé » de vos rapports, au jour où il est enregistré.' },

      { id: 'dettes-ancienne', t: 'Reporter une ancienne dette (cahier papier)', pub: 'patron', mots: 'ancienne dette cahier reprendre reporter historique',
        etapes: [
          'Touchez [[Dettes]] puis le client.',
          'Touchez [[Ajouter une dette (ancien cahier)]].',
          'Tapez le {{Montant}} et une {{Note (facultatif)}} (par exemple « marchandises du 12 »).',
          'Touchez [[Enregistrer la dette]].'
        ],
        attention: 'Cette dette n’est liée à aucune vente : elle n’augmente pas vos ventes, seulement ce que le client doit.' },

      { id: 'dettes-rappel', t: 'Envoyer un rappel de dette par WhatsApp', pub: 'tous', mots: 'rappel whatsapp relance dette message client',
        intro: 'Fonction du niveau Pro.',
        etapes: [
          'Touchez [[Dettes]] puis le client qui doit de l’argent.',
          'Touchez [[Envoyer un rappel WhatsApp]].',
          'WhatsApp s’ouvre avec le message prêt (montant dû, nom de la boutique). Relisez et envoyez.'
        ],
        attention: 'Le client doit avoir un numéro WhatsApp enregistré.' },

      { id: 'dettes-modifier-client', t: 'Modifier ou supprimer un client', pub: 'tous', mots: 'client modifier supprimer effacer dette impossible',
        etapes: [
          'Touchez [[Dettes]] puis le client.',
          '[[Modifier]] permet de corriger le nom ou le téléphone.',
          '[[Supprimer]] retire le client. <b>Impossible tant qu’il reste une dette</b> (« Suppression impossible ») : encaissez d’abord son paiement.'
        ],
        voir: ['limites'] }
    ] },

    /* =============================================================== 5. ACHATS */
    { id: 'achats', icone: 'truck-delivery', titre: 'Achats et fournisseurs', resume: 'Enregistrer vos achats, remplir le stock, suivre ce que vous devez.', sujets: [
      { id: 'fournisseur-ajouter', t: 'Ajouter un fournisseur', pub: 'patron', mots: 'fournisseur ajouter créer',
        intro: 'Fonction du niveau Pro.',
        etapes: [
          'Touchez [[Plus]] → [[Achats et fournisseurs]] puis l’onglet [[Fournisseurs]].',
          'Touchez [[+ Nouveau fournisseur]].',
          'Tapez {{Nom *}} et {{Téléphone}}, puis [[Enregistrer]].'
        ],
        astuce: 'Vous pouvez aussi créer un fournisseur au moment d’un achat : choisissez [[+ Nouveau fournisseur]] dans la liste.' },

      { id: 'achat-nouveau', t: 'Enregistrer un achat de marchandises', pub: 'patron', mots: 'achat marchandise réapprovisionner entrée stock fournisseur payer',
        etapes: [
          'Touchez [[Plus]] → [[Achats et fournisseurs]] → onglet [[Achats]] → [[+ Nouvel achat]].',
          'Choisissez le {{Fournisseur}} ([[-- Sans fournisseur --]] est possible si vous payez tout).',
          'Touchez [[+ Ajouter un produit]], choisissez le produit ([[-- Choisir le produit --]]) ou « Nouveau produit », puis tapez la {{Quantité achetée}} et le {{Prix d’achat unitaire}}.',
          'Cochez, si vous le souhaitez, « Mettre à jour le prix d’achat » de la fiche produit.',
          'Répétez pour chaque produit ; [[Retirer]] supprime une ligne.',
          'Dans {{Montant payé maintenant}}, tapez ce que vous payez tout de suite ([[Payé en $]] ou [[Payé en FC]]). Si vous payez moins que le total, la différence devient une <b>dette envers le fournisseur</b> (un fournisseur est alors obligatoire).',
          'Touchez [[Enregistrer l’achat]].'
        ],
        apres: 'Le stock des produits augmente automatiquement et l’achat apparaît dans l’historique.' },

      { id: 'fournisseur-payer', t: 'Payer un fournisseur (rembourser une dette)', pub: 'patron', mots: 'payer fournisseur dette remboursement',
        etapes: [
          'Onglet [[Fournisseurs]] : touchez le fournisseur (le montant en rouge est ce que vous lui devez).',
          'Touchez [[Enregistrer un paiement]].',
          'Choisissez la monnaie, tapez le {{Montant}} puis [[Enregistrer le paiement]].'
        ],
        attention: 'Le montant ne peut pas dépasser ce que vous devez (« Le montant dépasse ce que vous devez »).' }
    ] },

    /* =============================================================== 6. DEPENSES */
    { id: 'depenses', icone: 'cash-multiple', titre: 'Dépenses', resume: 'Noter loyer, transport, salaires… pour connaître votre vrai bénéfice.', sujets: [
      { id: 'depense-ajouter', t: 'Enregistrer une dépense', pub: 'patron', mots: 'dépense loyer transport électricité salaire frais',
        intro: 'Fonction du niveau Pro.',
        etapes: [
          'Touchez [[Plus]] → [[Dépenses]].',
          'Touchez [[+ Ajouter une dépense]].',
          'Choisissez la {{Catégorie}} : Loyer, Électricité, Eau, Transport, Salaires, Internet et crédit téléphone, Taxes et patentes, Entretien et réparations, Emballages et sacs, ou Autre.',
          'Choisissez la monnaie ([[Dollars ($)]] ou [[Francs (FC)]]) et tapez le {{Montant}}.',
          'Vérifiez la {{Date}} (elle ne peut pas être dans le futur) et ajoutez une {{Note (facultatif)}}.',
          'Touchez [[Enregistrer]].'
        ],
        apres: 'La dépense réduit votre <b>Bénéfice net</b> dans les Rapports, pour la période concernée.',
        attention: 'Une dépense enregistrée ne peut pas être effacée : cela protège vos comptes. Vérifiez le montant avant d’enregistrer.' },

      { id: 'depense-voir', t: 'Voir les dépenses par période et par catégorie', pub: 'patron', mots: 'dépenses période catégorie total',
        etapes: [
          'Dans [[Dépenses]], choisissez la période : [[Aujourd’hui]] ou [[Autre date]] (voir « Changer la période »).',
          'Le total apparaît en haut, puis le détail « Par catégorie » et la liste des dépenses.'
        ],
        voir: ['periode'] }
    ] },

    /* =============================================================== 7. RAPPORTS */
    { id: 'rapports', icone: 'chart-box', titre: 'Rapports et chiffres', resume: 'Lire et interpréter vos résultats, choisir une période, PDF et exports.', sujets: [
      { id: 'periode', t: 'Changer la période affichée', pub: 'patron', mots: 'période date calendrier aujourd’hui mois semaine rapports',
        etapes: [
          'En haut de [[Rapports]] (ou de [[Dépenses]]), deux boutons : [[Aujourd’hui]] et [[Autre date]].',
          'Touchez [[Autre date]] : un calendrier s’ouvre.',
          'Touchez <b>une date</b> pour voir cette seule journée, ou touchez <b>une 2ᵉ date</b> pour une période (du premier au dernier jour).',
          'Pour changer de mois ou d’année rapidement, touchez le nom du mois en haut du calendrier. Les jours avec de l’activité sont marqués.',
          'Validez avec le bouton du calendrier.'
        ] },

      { id: 'lire-rapports', t: 'Lire et comprendre les chiffres de « Rapports »', pub: 'patron', mots: 'rapports chiffres bénéfice ventes interpréter comprendre marge panier moyen encaissé crédit',
        intro: 'Voici ce que signifie chaque case, avec un exemple. Imaginons : vous avez vendu pour 100 $ de marchandises achetées 60 $, dépensé 15 $ (transport) et 30 $ de ces 100 $ sont restés à crédit.',
        etapes: [
          '<b>Ventes</b> = total de toutes les ventes de la période (annulées exclues) → <b>100 $</b>.',
          '<b>Bénéfice sur ventes</b> = ventes − coût d’achat des produits vendus → 100 − 60 = <b>40 $</b>.',
          '<b>Dépenses</b> = dépenses enregistrées sur la période → <b>15 $</b>.',
          '<b>Bénéfice net</b> = bénéfice sur ventes − dépenses → 40 − 15 = <b>25 $</b> (vert si positif, rouge si négatif). C’est votre <b>vrai gain</b>.',
          '<b>Nombre de ventes</b> et <b>Panier moyen</b> = ventes ÷ nombre de ventes : combien un client dépense en moyenne.',
          '<b>Argent encaissé</b> = ce qui est réellement entré (paiements des ventes + dettes payées ce jour-là) → 70 $ ici (100 − 30 restés à crédit), plus les dettes payées.',
          '<b>Vendu à crédit (période)</b> = la part des ventes pas encore payée → <b>30 $</b>.',
          '<b>Dettes clients (total)</b> = tout ce que vos clients vous doivent aujourd’hui, toutes périodes confondues.',
          '<b>Dettes fournisseurs (total)</b> = tout ce que vous devez à vos fournisseurs.',
          '<b>Achats de la période</b> = marchandises achetées (c’est de l’argent sorti, mais pas encore une dépense : elles deviennent du stock).'
        ],
        astuce: 'Ne confondez pas <b>bénéfice</b> (ce que vous gagnez) et <b>argent encaissé</b> (ce qui est entré en caisse). Vous pouvez avoir un beau bénéfice sur le papier mais peu d’argent si beaucoup de ventes sont à crédit.',
        voir: ['graphique', 'decisions'] },

      { id: 'graphique', t: 'Graphique, produits les plus vendus, moyens de paiement', pub: 'patron', mots: 'graphique barres top produits vendus moyen paiement',
        etapes: [
          'Le <b>graphique</b> montre les ventes par jour (période de moins de 31 jours), par mois au-delà, ou les 7 derniers jours pour une très courte période.',
          '« Produits les plus vendus » classe vos 5 meilleurs produits par quantité vendue, avec le chiffre d’affaires de chacun.',
          '« Par moyen de paiement » additionne les ventes par Espèces, M-Pesa, Airtel Money, Orange Money et À crédit.'
        ],
        astuce: 'Les produits les plus vendus sont ceux à ne jamais laisser tomber en rupture.' },

      { id: 'detail-vente', t: 'Retrouver et consulter une vente', pub: 'patron', mots: 'vente détail reçu historique retrouver',
        etapes: [
          'Dans [[Rapports]], choisissez la période.',
          'Descendez à « Ventes de la période (n) » : chaque ligne indique le numéro, la date, le moyen de paiement et le vendeur.',
          'Touchez une vente pour voir le reçu complet, le <b>bénéfice</b> de cette vente et le nom du vendeur.',
          'S’il y a beaucoup de ventes, touchez [[Voir plus de ventes (n restantes)]].'
        ] },

      { id: 'pdf', t: 'Télécharger le rapport PDF', pub: 'patron', mots: 'pdf rapport télécharger imprimer exporter',
        intro: 'Fonction du niveau Pro.',
        etapes: [
          'Dans [[Rapports]], choisissez la période.',
          'Touchez [[Télécharger le rapport PDF]].',
          'Le fichier est enregistré sur votre téléphone ; partagez-le ou imprimez-le.'
        ] },

      { id: 'export-csv', t: 'Exporter les ventes ou le stock vers Excel', pub: 'patron', mots: 'export csv excel ventes stock tableur',
        intro: 'Fonction du niveau Pro.',
        etapes: [
          'Touchez [[Plus]] → [[Réglages]] et descendez à la zone d’export.',
          'Touchez [[Exporter les ventes (Excel/CSV)]] ou [[Exporter le stock (Excel/CSV)]].',
          'Ouvrez le fichier reçu avec Excel ou Google Sheets.'
        ] },

      { id: 'decisions', t: 'Prendre de bonnes décisions avec vos chiffres', pub: 'patron', mots: 'conseils décisions gestion marge stock rentabilité',
        etapes: [
          '<b>Chaque semaine</b>, regardez « Bénéfice net ». S’il est rouge, vos dépenses mangent votre marge : réduisez-les ou ajustez vos prix.',
          '<b>Chaque matin</b>, mettez à jour le taux de change (Réglages) : un taux faux fausse vos prix en francs.',
          'Surveillez « Dettes clients » : relancez par WhatsApp les gros débiteurs avant d’accorder un nouveau crédit.',
          'Comparez « Ventes » et « Argent encaissé » : un grand écart signale trop de crédit.',
          'Faites l’inventaire une fois par mois et regardez les écarts.',
          'Réapprovisionnez d’abord les produits les plus vendus et ceux de la carte orange « stock bas ».'
        ] }
    ] },

    /* =============================================================== 8. BOUTIQUES */
    { id: 'boutiques', icone: 'store', titre: 'Plusieurs boutiques', resume: 'Créer une seconde boutique, passer de l’une à l’autre, renommer.', sujets: [
      { id: 'boutique-creer', t: 'Créer une seconde boutique', pub: 'patron', mots: 'boutique créer ajouter seconde deuxième nouvelle succursale magasin',
        intro: 'Chaque boutique a ses propres produits, clients, ventes, dettes et vendeurs. Le nombre de boutiques dépend de votre niveau.',
        etapes: [
          'Touchez [[Plus]] → [[Mes boutiques]] (ou touchez le nom de votre boutique en haut).',
          'Touchez [[+ Ajouter une boutique]].',
          'Tapez le {{Nom de la boutique}} (2 lettres minimum), par exemple « Boutique Gombe ».',
          'Touchez [[Créer la boutique]].',
          'Une question vous propose de l’ouvrir tout de suite : touchez [[Ouvrir]].'
        ],
        apres: 'L’application affiche la nouvelle boutique, vide, prête à recevoir ses produits. Vous pouvez y inviter d’autres vendeurs.',
        attention: 'Internet est nécessaire pour créer une boutique. Si la limite de votre niveau est atteinte, l’application vous le dit et vous propose de passer au niveau supérieur.',
        voir: ['limites'] },

      { id: 'boutique-changer', t: 'Passer d’une boutique à une autre', pub: 'patron', mots: 'changer boutique ouvrir basculer switch',
        etapes: [
          'Touchez le <b>nom de la boutique</b> en haut, ou [[Plus]] → [[Mes boutiques]].',
          'Sur la boutique voulue, touchez [[Ouvrir]].',
          'Attendez le message « Ouverture de la boutique… » puis « Boutique ouverte ».'
        ],
        astuce: 'La boutique marquée <b>Ouverte</b> est celle dans laquelle vous travaillez. Les invitations de vendeurs et les rapports concernent la boutique ouverte.' },

      { id: 'boutique-renommer', t: 'Renommer une boutique', pub: 'patron', mots: 'renommer boutique nom changer',
        etapes: [
          '[[Plus]] → [[Mes boutiques]].',
          'Touchez [[Renommer]] sur la boutique, tapez le {{Nouveau nom}} puis [[Enregistrer]].'
        ] },

      { id: 'boutique-verrouillee', t: 'Une boutique est « verrouillée »', pub: 'patron', mots: 'boutique verrouillée bloquée niveau limite',
        intro: 'Si votre niveau d’abonnement autorise moins de boutiques que vous n’en avez (fin d’essai ou d’abonnement), les boutiques en trop sont <b>verrouillées, pas supprimées</b>.',
        etapes: [
          'Les boutiques les plus <b>anciennes</b> restent ouvertes, dans la limite autorisée.',
          'Les autres affichent 🔒 <b>Verrouillée</b> dans [[Mes boutiques]] : impossible de les ouvrir ou d’y vendre.',
          'Toutes leurs données (produits, clients, ventes, dettes) sont conservées.',
          'Pour les débloquer : [[Plus]] → [[Mon abonnement]] → choisissez un niveau qui autorise plus de boutiques, et payez.'
        ],
        apres: 'Dès que le paiement est confirmé, les boutiques se débloquent toutes seules, sans rien perdre.',
        voir: ['limites', 'payer'] }
    ] },

    /* =============================================================== 9. EQUIPE */
    { id: 'equipe', icone: 'account-group', titre: 'Équipe et vendeurs', resume: 'Inviter, surveiller, retirer des vendeurs ; ce que chacun peut faire.', sujets: [
      { id: 'inviter-vendeur', t: 'Ajouter un vendeur (invitation)', pub: 'patron', mots: 'vendeur ajouter inviter invitation code lien employé équipe',
        intro: 'Le vendeur crée lui-même son compte avec un code à usage unique : vous n’avez jamais à connaître son mot de passe.',
        etapes: [
          'Vérifiez que la bonne boutique est ouverte (nom en haut de l’écran). Les invitations concernent la boutique ouverte.',
          'Touchez [[Plus]] → [[Équipe]]. (Internet nécessaire.)',
          'Dans « Inviter un vendeur », tapez le {{Nom du vendeur (facultatif, pour vous repérer)}}.',
          'Choisissez la {{Durée de validité du code}} : 24 heures ou 7 jours.',
          'Choisissez le {{Nombre de codes à générer}} (1 à 50).',
          'Touchez [[Générer une invitation]].',
          'Transmettez l’invitation : [[Copier le code]], [[Copier le lien]] ou le bouton <b>WhatsApp</b> qui prépare le message. [[Copier tous les codes et liens]] sert si vous en avez généré plusieurs.',
          'Le vendeur suit « Créer mon compte vendeur avec une invitation ».'
        ],
        apres: 'Quand le vendeur a créé son compte, il apparaît dans « Votre équipe ».',
        attention: 'Selon votre niveau, le nombre de vendeurs (au total et par boutique) est limité. Un code partagé ne sert qu’une fois : ne le donnez qu’à la bonne personne.',
        voir: ['permissions', 'limites'] },

      { id: 'permissions', t: 'Qui peut faire quoi ? (patron / vendeur)', pub: 'patron', mots: 'permissions droits vendeur patron accès autorisations rôle',
        etapes: [
          '<b>Patron</b> : tout — caisse, stock, prix, dettes, achats, dépenses, rapports, équipe, boutiques, abonnement, réglages, sauvegardes, annulation de ventes.',
          '<b>Vendeur</b> : vendre dans la Caisse, consulter le Stock, gérer les Dettes (ajouter un client, enregistrer un paiement) et son propre compte.',
          'Le vendeur <b>ne voit pas</b> : bénéfices, rapports, achats, dépenses, abonnement, équipe, réglages de la boutique ; il ne peut pas modifier un produit, un prix ni annuler une vente.'
        ],
        astuce: 'Chaque action importante est notée dans le <b>Journal d’activité</b> avec le nom de la personne.' },

      { id: 'equipe-activite', t: 'Suivre l’activité de vos vendeurs', pub: 'patron', mots: 'activité vendeur ventes suivre journal surveiller',
        etapes: [
          'Touchez [[Plus]] → [[Équipe]] et descendez à « Activité des vendeurs ».',
          'Pour un vendeur, touchez [[Voir toutes ses ventes]] pour lister ce qu’il a vendu.',
          'Le [[Journal d’activité]] (Plus → Journal d’activité) montre <b>qui a fait quoi, quand et dans quelle boutique</b> ; filtrez par {{Boutique}}, {{Vendeur / utilisateur}} et {{Type d’activité}}, puis [[Exporter (CSV)]] si besoin.'
        ],
        attention: 'La durée de conservation du journal dépend de votre niveau (par exemple 7 jours en Gratuit, 180 jours en Pro). Il s’affiche quand vous êtes connecté à Internet.' },

      { id: 'retirer-vendeur', t: 'Retirer l’accès d’un vendeur', pub: 'patron', mots: 'retirer vendeur supprimer accès renvoyer licencier bloquer',
        etapes: [
          '[[Plus]] → [[Équipe]] → « Votre équipe ».',
          'Sur la ligne du vendeur, touchez [[Retirer l’accès]] et confirmez.'
        ],
        apres: 'Il ne peut plus se connecter à la boutique. Ses anciennes ventes restent dans vos rapports.' },

      { id: 'invitations-gerer', t: 'Annuler ou nettoyer des invitations', pub: 'patron', mots: 'invitation révoquer supprimer expirée code',
        etapes: [
          'Dans [[Équipe]] → « Invitations », chaque invitation indique son état.',
          '[[Révoquer]] annule une invitation pas encore utilisée.',
          '[[Supprimer]] efface une invitation ancienne ; [[Supprimer les n invitation(s) expirée(s) ou révoquée(s)]] fait le ménage d’un coup.'
        ] },

      { id: 'vendeur-suspendu', t: 'Un vendeur est « Suspendu »', pub: 'patron', mots: 'vendeur suspendu bloqué limite niveau',
        intro: 'Si votre niveau autorise moins de vendeurs que vous n’en avez, les plus récents sont <b>suspendus</b> (jamais supprimés).',
        etapes: [
          'Les vendeurs les plus <b>anciens</b> restent actifs, dans la limite autorisée (au total et par boutique).',
          'Les autres affichent <b>Suspendu</b> dans [[Équipe]] et ne peuvent plus utiliser la boutique.',
          'Ils sont <b>réactivés automatiquement</b> dès que votre niveau (ou un nouveau paiement) l’autorise.'
        ],
        voir: ['limites'] }
    ] },

    /* =============================================================== 10. ABONNEMENT */
    { id: 'abonnement', icone: 'credit-card-outline', titre: 'Abonnement et paiement', resume: 'Niveaux, essai gratuit, payer avec Mobile Money, limites et verrouillage.', sujets: [
      { id: 'niveaux', t: 'Les niveaux : Gratuit, Pro, Premium', pub: 'patron', mots: 'niveaux gratuit pro premium plan abonnement prix fonctions différences',
        intro: 'Votre niveau décide des fonctions disponibles et des limites. Les valeurs ci-dessous sont indicatives : l’écran <b>Mon abonnement</b> affiche toujours celles de votre compte.',
        tableau: { entetes: ['', 'Gratuit', 'Pro', 'Premium'], lignes: [
          ['Boutiques', '2', '3', 'Illimité'],
          ['Vendeurs (total)', '2', '5', 'Illimité'],
          ['Vendeurs par boutique', '1', '—', 'Illimité'],
          ['Produits', '50', '250', 'Illimité'],
          ['Clients à crédit', '10', '50', 'Illimité'],
          ['Fournisseurs', '0', '50', 'Illimité'],
          ['Journal d’activité', '7 jours', '180 jours', 'Illimité'],
          ['Caisse, stock, dettes, rapports, hors ligne', 'Oui', 'Oui', 'Oui'],
          ['Achats, dépenses, prix de gros et cartons, rappels WhatsApp, inventaire, PDF, export Excel/CSV', 'Non', 'Oui', 'Oui'],
          ['Import de produits Excel/CSV', 'Non', 'Non', 'Oui']
        ] },
        etapes: [
          'Ouvrez [[Plus]] → [[Mon abonnement]] pour voir votre niveau actuel, la date de fin, votre utilisation (par exemple « Produits 38 / 50 ») et les niveaux disponibles.',
          'Les prix indicatifs : Pro 12 500 FC par mois (≈ 5 $), Premium 37 500 FC par mois (≈ 15 $) ; des durées de 3 et 12 mois sont moins chères au mois.'
        ] },

      { id: 'essai', t: 'L’essai gratuit', pub: 'patron', mots: 'essai gratuit trial test découverte période',
        etapes: [
          'À la création d’un compte, un <b>essai gratuit d’un niveau supérieur</b> peut être offert (une seule fois par compte). Un bandeau « essai gratuit » indique les jours restants.',
          'Pendant l’essai, les limites du niveau d’essai s’appliquent : vous pouvez dépasser les limites du niveau Gratuit (plus de produits, de clients, de vendeurs…).',
          'À la fin, si vous n’avez pas payé, vous revenez au niveau Gratuit : <b>tout ce que vous avez saisi est conservé</b>, mais ce qui dépasse les limites du Gratuit est <b>verrouillé</b> jusqu’au prochain abonnement.'
        ],
        voir: ['limites', 'payer'] },

      { id: 'payer', t: 'Payer mon abonnement avec Mobile Money', pub: 'patron', mots: 'payer abonnement paiement pawapay mobile money orange airtel mpesa vodacom activer renouveler retourner marchand',
        intro: 'Le paiement se fait sur une page sécurisée du prestataire de paiement <b>pawaPay</b>. Vos codes secrets ne sont jamais saisis dans EvoBuskin.',
        etapes: [
          'Vérifiez que vous avez Internet, puis touchez [[Plus]] → [[Mon abonnement]].',
          'Choisissez la durée : <b>1 mois</b>, <b>3 mois</b> ou <b>12 mois</b>.',
          'Sur la carte du niveau voulu (Pro ou Premium), touchez [[Choisir Pro]] (ou [[Choisir Premium]]).',
          'Une fenêtre « Payer » résume le {{Niveau}}, la {{Durée}} et le {{Montant}}. Touchez [[Payer 12 500 FC]] (le montant affiché).',
          'La <b>page de paiement pawaPay</b> s’ouvre (première image ci-dessous). Elle rappelle le bénéficiaire (EvoBuskin), l’abonnement choisi et le {{Montant}}.',
          'Dans {{Numéro de téléphone}}, tapez votre numéro Mobile Money. L’indicatif <b>+243</b> est déjà choisi : tapez le numéro <b>sans le 0 du début</b>. <b>L’opérateur (Airtel, Orange ou Vodacom M-Pesa) est choisi automatiquement</b> d’après votre numéro.',
          'Touchez [[Payer]], puis confirmez sur votre téléphone avec votre code secret Mobile Money quand l’opérateur vous le demande.',
          'Quand le paiement est reçu, la page « <b>Paiement réussi</b> » s’affiche (deuxième image ci-dessous). Touchez [[Retourner chez le marchand]].',
          'Vous revenez dans EvoBuskin : « Vérification de votre paiement… » puis <b>« Paiement confirmé »</b>. L’abonnement est activé.'
        ],
        images: [
          { src: 'img/aide-pawapay-1.jpg', legende: 'Étape 5 et 6 : la page de paiement pawaPay. Tapez votre numéro ; l’opérateur se choisit tout seul.' },
          { src: 'img/aide-pawapay-2.jpg', legende: 'Étape 8 : paiement reçu. Touchez « Retourner chez le marchand » pour revenir dans EvoBuskin.' }
        ],
        apres: 'Votre niveau est activé immédiatement ; les éléments verrouillés sont débloqués. La date de fin est affichée dans « Mon abonnement ».',
        attention: 'Seul le <b>Mobile Money</b> est accepté (pas de carte bancaire). Le montant est fixé par le serveur : il ne peut pas être modifié depuis le téléphone. N’oubliez pas de toucher « Retourner chez le marchand ». Si le paiement est en attente, ne payez pas une 2ᵉ fois : voir « Paiement en attente ou échoué ».',
        voir: ['paiement-attente', 'limites'] },

      { id: 'paiement-attente', t: 'Paiement en attente, échoué ou non confirmé', pub: 'patron', mots: 'paiement attente échoué non confirmé problème vérifier maintenant débité',
        etapes: [
          '<b>« En attente de confirmation »</b> : confirmez sur votre téléphone (parfois il faut taper votre code secret Mobile Money). Patientez 1 à 2 minutes.',
          'Touchez [[Vérifier maintenant]] dans « Mon abonnement » ou rouvrez simplement l’application : la vérification se refait automatiquement.',
          '<b>« Le paiement n’a pas abouti »</b> : solde insuffisant, refus ou délai dépassé. Rien n’est activé et rien n’est débité ; recommencez avec [[Payer]].',
          'Si votre opérateur vous a <b>débité</b> mais que l’abonnement ne s’active pas après 10 minutes : gardez le SMS de transaction et contactez le support (voir « Contacter le support »).'
        ],
        astuce: 'Ne payez jamais deux fois « pour être sûr » : l’application active l’abonnement une seule fois par paiement et vérifie toute seule.' },

      { id: 'limites', t: 'Limites et verrouillage : ce qui se passe quand on dépasse', pub: 'tous', mots: 'limites verrouillage verrouillé dépasser retour gratuit fin essai niveau produits clients boutiques vendeurs débloquer',
        intro: 'Chaque niveau a des limites (voir « Les niveaux »). EvoBuskin ne <b>supprime jamais</b> vos données à cause d’une limite : il <b>verrouille</b> ce qui dépasse, et le <b>débloque</b> dès que votre niveau le permet.',
        etapes: [
          '<b>Produits</b> : les plus anciens restent utilisables, dans la limite. Les autres affichent 🔒 : ils ne peuvent plus être vendus, modifiés ni sortis du stock (vous pouvez encore les supprimer).',
          '<b>Clients</b> : les plus anciens restent utilisables. Un client 🔒 ne peut plus recevoir de vente à crédit ni de nouvelle dette, ni être modifié ; vous pouvez toujours <b>enregistrer ses paiements</b>.',
          '<b>Fournisseurs</b> : un fournisseur 🔒 ne peut plus recevoir de nouvel achat ni être modifié ; vous pouvez toujours le <b>payer</b>.',
          '<b>Boutiques</b> : les plus anciennes restent ouvertes ; les autres sont 🔒 et ne s’ouvrent plus.',
          '<b>Vendeurs</b> : les plus anciens restent actifs (au total et par boutique) ; les autres sont <b>Suspendus</b>.',
          '<b>Fonctions</b> (achats, dépenses, gros et cartons, WhatsApp, inventaire, PDF, exports, import) : réservées aux niveaux qui les incluent. Les données déjà saisies restent visibles et conservées.',
          '<b>Journal d’activité</b> : seule la durée prévue par votre niveau est affichée ; le reste n’est pas effacé.',
          '<b>Pendant un essai ou un niveau plus élevé</b>, vous pouvez dépasser les limites du Gratuit. En revenant au Gratuit, la règle ci-dessus s’applique automatiquement.',
          '<b>Pour tout débloquer</b> : payez un niveau qui autorise ces quantités ([[Plus]] → [[Mon abonnement]]). Le déblocage est immédiat et sans perte.',
          '<b>Pour libérer de la place sans payer</b> : supprimez des produits, clients ou fournisseurs devenus inutiles ; les éléments verrouillés suivants redeviennent utilisables dans l’ordre d’ancienneté.'
        ],
        astuce: 'Un bandeau « 🔒 n produits… verrouillés » en haut des écrans et le détail dans « Mon abonnement » vous indiquent exactement combien d’éléments sont concernés.',
        attention: 'Le serveur applique aussi ces règles : même si une ancienne version de l’application est ouverte, une vente d’un produit verrouillé sera refusée.' },

      { id: 'abonnement-fin', t: 'Mon abonnement va se terminer ou s’est terminé', pub: 'patron', mots: 'fin abonnement expiré renouveler prolonger rappel',
        etapes: [
          'Un bandeau vous prévient quelques jours avant la fin, puis après l’expiration.',
          'Pour renouveler : [[Plus]] → [[Mon abonnement]] → choisissez la durée → [[Choisir Pro]] (ou Premium) → [[Payer]].',
          'Si vous payez avant la fin, la nouvelle période s’ajoute à la suite de la précédente.',
          'Après l’expiration, vous passez au niveau Gratuit : voir « Limites et verrouillage » pour ce qui change.'
        ] }
    ] },

    /* =============================================================== 11. REGLAGES */
    { id: 'reglages', icone: 'cog-outline', titre: 'Réglages et sécurité', resume: 'Boutique, taux de change, sauvegarde, mot de passe, suppression de compte.', sujets: [
      { id: 'boutique-infos', t: 'Nom et téléphone de la boutique (reçus)', pub: 'patron', mots: 'nom boutique téléphone reçu réglages',
        etapes: [
          '[[Plus]] → [[Réglages]] → carte {{Ma boutique}}.',
          'Modifiez {{Nom de la boutique (sur les reçus)}} et {{Téléphone de la boutique}}.',
          'Touchez [[Enregistrer]] : « Boutique enregistrée ».'
        ] },

      { id: 'taux', t: 'Taux de change dollar / franc', pub: 'patron', mots: 'taux change dollar franc fc usd conversion',
        etapes: [
          '[[Plus]] → [[Réglages]] → carte {{Taux de change}}.',
          'Tapez la réponse à « 1 dollar ($) = combien de francs (FC) ? » (par exemple 2800).',
          'Touchez [[Enregistrer]] : « Taux enregistré : 1 $ = … ».',
          'Choisissez aussi la {{Devise affichée en grand}} : [[Dollars ($)]] ou [[Francs (FC)]].'
        ],
        astuce: 'Les anciennes ventes gardent le taux du jour où elles ont été faites. Pensez à mettre à jour le taux chaque matin.' },

      { id: 'sauvegarde', t: 'Faire une sauvegarde et la restaurer', pub: 'patron', mots: 'sauvegarde backup restaurer exporter fichier mot de passe chiffré',
        etapes: [
          '[[Plus]] → [[Réglages]] → carte {{Sauvegarde}}.',
          'Touchez [[Sauvegarder]] : un fichier de sauvegarde est créé sur votre téléphone.',
          'Gardez ce fichier en lieu sûr (Google Drive, WhatsApp à vous-même, ordinateur).',
          'Pour restaurer : [[Restaurer une sauvegarde]], choisissez le fichier, confirmez. <b>Attention : cela remplace les données actuelles de l’appareil.</b>'
        ],
        attention: 'Vos données sont déjà sauvegardées en ligne ; ce fichier est une sécurité supplémentaire.' },

      { id: 'mot-de-passe', t: 'Changer mon mot de passe', pub: 'tous', mots: 'mot de passe changer modifier sécurité',
        etapes: [
          'Patron : [[Plus]] → [[Réglages]]. Vendeur : [[Réglages]] dans le menu du bas.',
          'Dans la carte {{Changer mon mot de passe}}, tapez {{Mot de passe actuel}}, {{Nouveau mot de passe}} et {{Confirmer le nouveau mot de passe}}.',
          'Le nouveau mot de passe doit avoir 12 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.',
          'Touchez [[Changer mon mot de passe]] : « Mot de passe modifié ».'
        ],
        astuce: 'Le patron voit dans son journal quand un vendeur change son mot de passe.' },

      { id: 'supprimer-compte', t: 'Supprimer mon compte (30 jours de réflexion)', pub: 'tous', mots: 'supprimer compte effacer désinscription annuler suppression',
        etapes: [
          'Réglages → carte {{Supprimer mon compte}}.',
          'Tapez votre {{Mot de passe}} puis le mot {{SUPPRIMER}} et touchez [[Demander la suppression]].',
          'Votre compte est effacé définitivement après <b>30 jours</b> ; pour un patron, toutes ses boutiques et leurs données sont effacées.',
          'Pendant ces 30 jours, touchez [[Annuler la suppression]] pour tout conserver.'
        ],
        attention: 'Faites une sauvegarde avant. Après 30 jours, plus rien n’est récupérable.' },

      { id: 'journal', t: 'Le journal d’activité', pub: 'patron', mots: 'journal audit activité historique qui a fait quoi',
        etapes: [
          '[[Plus]] → [[Journal d’activité]] (Internet nécessaire).',
          'Filtrez par {{Boutique}}, {{Vendeur / utilisateur}} et {{Type d’activité}}, et par période.',
          'Les 400 plus récentes lignes sont affichées : réduisez la période pour voir le reste.',
          '[[Exporter (CSV)]] enregistre la liste dans un fichier.'
        ] }
    ] },

    /* =============================================================== 12. DEPANNAGE */
    { id: 'depannage', icone: 'wrench-outline', titre: 'Dépannage : en cas de problème', resume: 'Les messages d’erreur les plus courants et quoi faire.', sujets: [
      { id: 'depannage-chargement', t: 'L’écran reste sur « Chargement… » ou les données sont lentes', pub: 'tous', mots: 'chargement lent lenteur bloqué attend écran',
        etapes: [
          'Les écrans s’affichent d’abord avec les données déjà présentes sur le téléphone ; la mise à jour se fait ensuite en arrière-plan. Attendez quelques secondes.',
          'Vérifiez le voyant en haut à droite : si vous êtes sans Internet, l’application travaille avec ce qu’elle a.',
          'Passez de Wi-Fi à données mobiles (ou inversement), puis touchez [[Réessayer]] si ce bouton apparaît.',
          'Fermez complètement l’application et rouvrez-la. Vérifiez aussi sur le Play Store qu’aucune mise à jour n’est disponible.',
          'Si le problème persiste, utilisez le formulaire « Contacter le support » en bas de cette Aide.'
        ] },

      { id: 'depannage-erreur', t: 'Un message d’erreur ou de connexion s’affiche', pub: 'tous', mots: 'erreur survenue connexion réessayer problème message vérifiez',
        etapes: [
          'Si Internet est lent ou coupé, c’est normal : vos ventes continuent d’être enregistrées sur le téléphone et seront envoyées plus tard.',
          'Touchez [[Réessayer]] ; sinon revenez au menu et rouvrez l’écran.',
          'Si le message parle de <b>verrouillage</b>, de <b>limite</b> ou d’<b>accès refusé</b>, lisez-le : il dit exactement quoi faire (voir « Limites et verrouillage »).',
        ] },

      { id: 'depannage-sync', t: 'Mes ventes n’apparaissent pas sur l’autre téléphone', pub: 'tous', mots: 'synchronisation autre téléphone ventes manquantes différent envoi attente',
        etapes: [
          'Regardez le voyant en haut à droite : des opérations en attente signifient que le téléphone d’origine n’a pas encore envoyé.',
          'Connectez ce téléphone à Internet et laissez l’application ouverte une minute.',
          'Sur l’autre téléphone, fermez et rouvrez l’application ou changez d’écran : les données se rafraîchissent.',
          'Vérifiez que les deux téléphones sont connectés au <b>même compte et à la même boutique</b> (nom en haut).'
        ] },

      { id: 'depannage-invitation', t: 'Le code d’invitation est refusé', pub: 'tous', mots: 'invitation refusée code invalide expiré vendeur',
        etapes: [
          'Vérifiez que le code est copié en entier, sans espace.',
          'Un code ne marche qu’<b>une seule fois</b> et expire (24 heures ou 7 jours). Demandez-en un nouveau au patron.',
          'Le patron peut avoir atteint la limite de vendeurs de son niveau : il doit passer au niveau supérieur ou retirer un accès.',
          'Choisissez bien la carte [[Vendeur]] à l’inscription (pas Propriétaire).'
        ] },

      { id: 'depannage-limite', t: '« Limite atteinte » ou « Verrouillé »', pub: 'tous', mots: 'limite atteinte verrouillé niveau abonnement ajouter impossible',
        etapes: [
          'Le message indique ce qui est limité (produits, clients, fournisseurs, boutiques, vendeurs).',
          'Patron : [[Plus]] → [[Mon abonnement]] pour voir où vous en êtes et choisir un niveau plus large.',
          'Vendeur : prévenez le patron.',
          'Rien n’est perdu : voir « Limites et verrouillage ».'
        ],
        voir: ['limites'] },

      { id: 'depannage-paiement', t: 'Le paiement de l’abonnement ne marche pas', pub: 'patron', mots: 'paiement erreur indisponible momentanément abonnement échec page pawapay',
        etapes: [
          'Message « Le service de paiement est momentanément indisponible » : réessayez dans quelques minutes ; si cela se répète, envoyez le code indiqué entre parenthèses au support.',
          'Page de paiement qui ne s’ouvre pas : vérifiez Internet et touchez à nouveau [[Payer]].',
          'Vous revenez dans l’application sans confirmation : touchez [[Vérifier maintenant]] (voir « Paiement en attente »).',
          'Votre opérateur refuse : vérifiez le solde, le numéro (indicatif 243) et que le compte Mobile Money est actif.'
        ],
        voir: ['paiement-attente'] },

      { id: 'depannage-stock', t: 'Le stock affiché semble faux', pub: 'patron', mots: 'stock faux incorrect différence erreur inventaire',
        etapes: [
          'Ouvrez la fiche du produit et lisez « Derniers mouvements » : chaque vente, entrée, sortie et annulation y apparaît.',
          'Vérifiez s’il y a des opérations en attente d’envoi (voyant en haut à droite).',
          'Corrigez avec [[+ Entrée]] ou [[− Sortie]] (avec une note), ou faites un [[Inventaire]].',
          'Une vente annulée remet le stock : vérifiez dans Rapports si elle porte la mention Annulée.'
        ] },

      { id: 'depannage-whatsapp', t: 'WhatsApp ne s’ouvre pas', pub: 'tous', mots: 'whatsapp ne s’ouvre pas reçu rappel numéro',
        etapes: [
          'Vérifiez que WhatsApp est installé sur le téléphone.',
          'Vérifiez que le client a un numéro enregistré (fiche client).'
        ] },

      { id: 'depannage-appareil', t: 'Message « Cet appareil contient déjà les données d’une autre boutique »', pub: 'tous', mots: 'appareil autre boutique mélanger données téléphone partagé',
        etapes: [
          'Pour éviter de mélanger deux commerces, un même appareil ne garde qu’une boutique à la fois (hors changement de boutique par le patron).',
          'Utilisez un autre téléphone, ou un autre profil du navigateur, pour l’autre compte.',
          'Patron : pour changer de boutique, utilisez [[Mes boutiques]] → [[Ouvrir]] plutôt que de vous reconnecter.'
        ] },

      { id: 'rapport-support', t: 'Envoyer un rapport au support', pub: 'tous', mots: 'support rapport diagnostic aide contact copier',
        etapes: [
          'Patron : [[Plus]] → [[Réglages]]. Descendez à la carte {{Aide}}.',
          'Touchez [[Copier le rapport pour le support]].',
          'Collez-le dans un message au support. Il ne contient <b>ni mot de passe ni adresse email</b>.'
        ] }
    ] },

    /* =============================================================== 13. GLOSSAIRE */
    { id: 'glossaire', icone: 'book-alphabet', titre: 'Mots expliqués', resume: 'Le sens des mots utilisés dans l’application, expliqué simplement.', glossaire: [
      ['Panier', 'La liste des articles du client avant de payer.'],
      ['Encaisser', 'Recevoir l’argent du client et enregistrer la vente.'],
      ['Acompte', 'Une partie du prix payée tout de suite quand le reste est à crédit.'],
      ['Dette (client)', 'Ce qu’un client vous doit après une vente à crédit ou une ancienne dette.'],
      ['Dette (fournisseur)', 'Ce que vous devez à un fournisseur après un achat pas entièrement payé.'],
      ['Prix d’achat', 'Ce que le produit vous coûte.'],
      ['Prix de vente', 'Ce que le client paie.'],
      ['Prix de gros', 'Prix par unité, plus bas, quand le client achète une grande quantité.'],
      ['Carton', 'Lot de plusieurs unités vendu d’un coup à un prix défini.'],
      ['Marge / Bénéfice sur ventes', 'Prix de vente moins prix d’achat, sur les produits vendus.'],
      ['Bénéfice net', 'Bénéfice sur ventes moins les dépenses : votre vrai gain.'],
      ['Chiffre d’affaires (Ventes)', 'Le total des ventes, avant de retirer les coûts.'],
      ['Panier moyen', 'Montant moyen d’une vente.'],
      ['Stock bas / rupture', 'Stock égal ou inférieur au seuil d’alerte / stock à zéro.'],
      ['Inventaire', 'Compter le stock réel et le comparer à celui de l’application.'],
      ['Écart', 'Différence entre le stock compté et le stock attendu.'],
      ['Entrée / Sortie de stock', 'Ajout (réception) ou retrait (casse, perte) de marchandise hors vente.'],
      ['Synchronisation', 'Envoi de vos opérations au serveur et réception de celles des autres appareils.'],
      ['Hors ligne', 'Sans Internet : l’application continue et enverra plus tard.'],
      ['Niveau (abonnement)', 'Gratuit, Pro ou Premium : décide des fonctions et des limites.'],
      ['Verrouillé', 'Conservé mais inutilisable, car au-delà de la limite du niveau. Se débloque en passant à un niveau supérieur.'],
      ['Suspendu', 'Se dit d’un vendeur au-delà de la limite : il n’a plus accès tant que le niveau ne le permet pas.'],
      ['Essai gratuit', 'Période où vous profitez d’un niveau supérieur sans payer.'],
      ['Mobile Money', 'Paiement par téléphone : M-Pesa, Airtel Money, Orange Money.'],
      ['Journal d’activité', 'Liste de qui a fait quoi, quand, dans quelle boutique.'],
      ['Sauvegarde', 'Copie de vos données dans un fichier que vous gardez.']
    ] },

    /* =============================================================== 14. FAQ */
    { id: 'faq', icone: 'help-circle-outline', titre: 'Questions fréquentes', resume: 'Les réponses rapides aux questions qu’on se pose le plus.', faq: [
      ['Puis-je utiliser EvoBuskin sur plusieurs téléphones ?', 'Oui. Connectez-vous avec le même compte (ou invitez des vendeurs) : les données se synchronisent automatiquement dès qu’il y a Internet.'],
      ['Que se passe-t-il si je perds mon téléphone ?', 'Rien n’est perdu : vos données sont en ligne. Connectez-vous sur un autre téléphone avec votre email et votre mot de passe.'],
      ['Mes données sont-elles supprimées si mon abonnement se termine ?', 'Non. Vous revenez au niveau Gratuit. Ce qui dépasse ses limites est verrouillé, pas supprimé, et se débloque quand vous payez.'],
      ['Puis-je vendre sans Internet ?', 'Oui. Les ventes sont gardées sur le téléphone et envoyées automatiquement au retour du réseau.'],
      ['Pourquoi je ne vois pas les bénéfices en tant que vendeur ?', 'Les finances sont réservées au patron : bénéfices, rapports, achats, dépenses.'],
      ['Comment corriger une vente faite par erreur ?', 'Le patron l’annule : Rapports → la vente → Annuler cette vente. Le stock est remis.'],
      ['Puis-je modifier une dépense enregistrée ?', 'Non, pour protéger vos comptes. Vérifiez avant d’enregistrer.'],
      ['Comment retrouver un produit supprimé ?', 'Un produit supprimé est désactivé et n’apparaît plus ; il reste dans les anciennes ventes et rapports. Recréez-le si vous en avez de nouveau besoin.'],
      ['Combien de temps un code d’invitation est-il valable ?', '24 heures ou 7 jours selon votre choix, et une seule utilisation.'],
      ['L’application accepte-t-elle les cartes bancaires pour l’abonnement ?', 'Non, seulement le Mobile Money (M-Pesa, Airtel Money, Orange Money).'],
      ['Le prix peut-il être changé par un vendeur ?', 'Non. Le prix vient de la fiche produit, modifiable seulement par le patron, et le serveur recalcule le total d’une vente.'],
      ['Mes données sont-elles protégées ?', 'Oui : connexion chiffrée, accès par compte et par boutique, journal d’activité et sauvegarde chiffrable. Voir la politique de confidentialité.']
    ] }
  ],

  // Accès rapides « Je veux… » (id du sujet à ouvrir)
  rapide: [
    ['cart', 'Vendre', 'vente-especes'], ['package-variant-closed', 'Ajouter un produit', 'ajouter-produit'], ['notebook-outline', 'Encaisser une dette', 'dettes-paiement'],
    ['credit-card-outline', 'Payer l’abonnement', 'payer'], ['account-plus-outline', 'Ajouter un vendeur', 'inviter-vendeur'], ['store-plus-outline', 'Créer une boutique', 'boutique-creer'],
    ['chart-box', 'Lire mes rapports', 'lire-rapports'], ['lock-outline', 'Comprendre les limites', 'limites'], ['wrench-outline', 'J’ai un problème', 'depannage-erreur']
  ],

  // Parcours conseillé pour un débutant
  parcours: ['creer-compte', 'config-initiale', 'ajouter-produit', 'vente-especes', 'dettes-paiement', 'lire-rapports', 'inviter-vendeur', 'sauvegarde']
};
window.AIDE_CONTENU = AIDE_CONTENU;
