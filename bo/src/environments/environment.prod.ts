const front_url: any = "https://syscomplet.com/bo/";
const api_url: any = "https://syscomplet.com";
export const environment = {
  production: false,
  FRONT_URL: `${front_url}`,
  /* -------------------------------- Les apis -------------------------------- */
  API_BASE_URL_GENERAL: `${api_url}/api/`,
  API_BASE_URL_USER: `${api_url}/api_user/`,
  API_BASE_URL_CONFIGURATIONS: `${api_url}/api_configurations/`,
  API_BASE_URL_PARTENAIRES: `${api_url}/api_partenaire/`,
  API_BASE_URL_NEWSLETTERS: `${api_url}/api_newsletter/`,
  API_BASE_URL_FOURNISSEUR: `${api_url}/api_fournisseurs/`,
  API_BASE_URL_ARTICLES: `${api_url}/api_articles/`,
  API_BASE_URL_MARQUES: `${api_url}/api_marques/`,
  API_BASE_URL_CONTACT: `${api_url}/api_contact/`,
  API_BASE_URL_STORAGE_PARTENAIRES: `${api_url}/storage/partenaires/`,
  /* --------------------------------- Claims --------------------------------- */
  unique_claim: 'Vnh0ohapK8pKusj7618QJKKjh4PTm0ploK',
  KEY_CRYPTO:
    'eyJhbGciOiJIUzI1NiIsIJleHAiOjEz81729fza9182jOUcmiWwYrAKt1NjX0.KS3v5g8idzdhzdz81729flucjOUcmiWwYrAKtS0zc8j-g0_HbqVh6U',
  urlMenuMap: {
    /* --------------------------- Le module d'accueil -------------------------- */
    '/accueil': '/accueil',
    /* ----------------------- Le module gestion de compte ---------------------- */
    '/compte': '/compte',
    /* ---------------------- Le module des configurations ---------------------- */
    '/configurations': '/configurations',
    /* ----------------------- Le module des partenaires ----------------------- */
    '/partenaires': '/partenaires',
    /* --------------------- Le module de gestion du contenu -------------------- */
    '/contenus': '/contenus',
    /* ---------------- Le module des gestion demande de contact ---------------- */
    '/contacts': '/contacts',
    /* ----------------- Le module des bulletins d'informations ----------------- */
    '/newsletters': '/newsletters',
    /* ------------------------------- fournisseur ------------------------------ */
    '/fournisseurs': '/fournisseurs',
    '/fournisseurs/liste_fournisseur': '/fournisseurs',
    /* -------------------------------- articles -------------------------------- */
    '/articles': '/articles',
    '/articles/liste_articles': '/articles',
    /* --------------------------------- marques -------------------------------- */
    '/marques': '/marques',
    '/marques/liste_marque': '/marques'
  },
  api: {
    general: {
      telecharger: 'TelechargerDocument',
      LoadParamsForList: 'LoadParamsForList',
      AfficherLogs: 'AfficherLogs',
    },
    contacts: {
      AfficherContactsAdmins: 'AfficherContactsAdmins',
      ModifierContacts: 'ModifierContacts',
      afficherDemandesDemo: "afficherDemandesDemo",
      marqueVuDemandesDemo: "marqueVuDemandesDemo"
    },
    contenus: {
      AfficherContenusAdmins: 'AfficherContenusAdmins',
      ModifierContenu: 'ModifierContenu',
      AjouterContenus: 'AjouterContenus',
      ManageImage: 'ManageImage',
      SupprimerImage: 'SupprimerImage',
    },
    /* ------------------------ Les apis des utilisateurs ----------------------- */
    user: {
      user_restaurer: 'RestaurerUser',
      login: 'LoginUtilisateur',
      user_info: 'GetMyInfo',
      modifier: 'ModifierUtilisateur',
      modifier_password: 'ChangePassword',
      afficherimage: 'AfficherMonImage',
      supprimerimage: 'SupprimerMonImage',
      modifierimage: 'ModifierMonImage',
      afficher: 'AfficherUtilisateur',
      supprimer: 'SupprimerUtilisateur',
      ajouter: 'AjouterUtilisateur',
      modifier_params: 'ModifierParmsUtilisateur',
    },
    role: {
      afficher: 'AfficherRole',
      ajouter: 'AjouterRole',
      modfier: 'ModifierRole',
    },
    /* ---------------------------- Les paramétrages ---------------------------- */
    ville: {
      afficher: 'AfficherVille',
      ajouter: 'AjouterVille',
      RestaurerVille: 'RestaurerVille',
      supprimer: 'SupprimerVille',
      modifier: 'ModifierVille',
    },
    /* ---------------------------- les partenaires ---------------------------- */
    partenaire: {
      afficher: 'AfficherPartenaires',
      restaurer: 'RestaurerPartenaire',
      ajouter: 'AjouterPartenaire',
      supprimer: 'SupprimerPartenaire',
      modifier: 'ModifierPartenaire',
      ModifierImagepartenaire: 'ModifierImagePartenaire',
      SupprimerImagepartenaire: 'SupprimerImagePartenaire',
    },
    newsletters: {
      AfficherNewslettersAdmins: 'AfficherNewslettersAdmins',
      SupprimerNewsletter: 'SupprimerNewsletter',
    },
    fournisseurs: {
      AfficherFournisseur: "AfficherFournisseur",
      AjouterFournisseur: "AjouterFournisseur",
      ModifierFournisseur: "ModifierFournisseur",
      SupprimerFournisseur: "SupprimerFournisseur",
      ManageImage: "ManageImage"
    },
    articles: {
      AfficherArticle: "AfficherArticle",
      AjouterArticle: "AjouterArticle",
      ModifierArticle: "ModifierArticle",
      SupprimerArticle: "SupprimerArticle",
      ManageImage: "ManageImage"
    },
    marques: {
      AfficherMarque: "AfficherMarque",
      AjouterMarque: "AjouterMarque",
      ModifierMarque: "ModifierMarque",
      SupprimerMarque: "SupprimerMarque",
      ManageLogo: "ManageLogo"
    },

  },
  /* -------------------------------------------------------------------------- */
  /*                                 LES LISTES                                 */
  /* -------------------------------------------------------------------------- */
  liste_type_societe: [
    { value: 1, label: 'Particulier' },
    { value: 2, label: 'Entreprise' },
  ],
  liste_autorisations: [
    { value: 1, label: 'Autorisé', badge: 'bg-success' },
    { value: 2, label: 'Non autorisé', badge: 'bg-danger' },
  ],
  liste_sujet_contact: [
    { value: 1, label: 'Demande de renseignements généraux' },
    { value: 2, label: "Demande de devis ou d'une demo" },
    { value: 3, label: 'Réclamations et feedback' },
    { value: 4, label: 'Demandes commerciales' },
    { value: 5, label: 'Assistance technique' },
    { value: 6, label: 'Modification de commande' },
    { value: 7, label: 'Autres demandes' },
  ],
  liste_status_contact: [
    { value: 1, label: 'En cours', badge: 'bg-orange' },
    { value: 2, label: 'Terminé', badge: 'bg-success' },
  ],
  liste_multimedias_type: [
    {
      value: 1,
      label: "Image",
      allowed_size: 25, // mb
      max_comporess_value: 1,
      can_compress: true,
      allowed: ".png,.jpg,.jpeg,.gif,.jfif,.svg,.webp",
    },
    {
      value: 2,
      label: "Audio",
      allowed_size: 2, // mb
      can_compress: false,
      allowed: ".mp3,.ogg,.opus",
    },
    {
      value: 3,
      label: "Video",
      allowed_size: 2, // mb
      can_compress: false,
      allowed: ".mp4,.mov",
    },
    {
      value: 4,
      label: "Fichier",
      can_compress: false,
      allowed: ".json,.xlsx,.pdf,.docx,.txt",
      allowed_size: 2 // mb
    },
  ]
};
