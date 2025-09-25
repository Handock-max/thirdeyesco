// Configuration du site Third Eyes Co.
// Ce fichier contient les URLs et configurations publiques

export const SITE_CONFIG = {
  // URL de base pour GitHub Pages
  BASE_URL: 'https://handock-max.github.io/thirdeyesco/',
  
  // Nom du site
  SITE_NAME: 'Third Eyes Co.',
  
  // Description
  DESCRIPTION: 'Formations professionnelles en Data Science et Intelligence Artificielle',
  
  // Contact
  WHATSAPP_NUMBER: '+22896933995',
  CONTACT_EMAIL: 'contact@thirdeyesco.com',
  
  // Réseaux sociaux (à personnaliser)
  SOCIAL: {
    linkedin: 'https://linkedin.com/company/thirdeyesco',
    twitter: 'https://twitter.com/thirdeyesco',
    facebook: 'https://facebook.com/thirdeyesco'
  }
};

// Fonction pour obtenir l'URL complète
export const getFullUrl = (path: string = '') => {
  return `${SITE_CONFIG.BASE_URL}${path}`.replace(/\/+/g, '/');
};

// Fonction pour obtenir l'URL WhatsApp
export const getWhatsAppUrl = (message: string) => {
  return `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
