// Configuration des formations Third Eyes Co.
// MODIFIER ce fichier pour personnaliser les formations, prix et paramètres

export const COMPANY_CONFIG = {
  // INFORMATIONS DE L'ENTREPRISE - À PERSONNALISER
  nom: "Third Eyes Co.",
  whatsappNumber: "+22896933995", // REMPLACER par votre numéro WhatsApp réel
  email: "cthirdeyes@gmail.com", // REMPLACER par votre email

  // MESSAGE DE BIENVENUE
  tagline: "Formations Data Science & Intelligence Artificielle",
  description: "Développez vos compétences en Data Science et IA avec nos formations professionnelles. Des programmes conçus pour vous donner une longueur d'avance dans l'économie numérique.",

  // STATISTIQUES AFFICHÉES
  stats: {
    modules: 4,
    jours: 8,
    pratique: "100%",
    perspectives: "∞"
  }
};

// CONFIGURATION DES FORMATIONS - MODIFIER SELON VOS BESOINS
export const FORMATIONS_CONFIG = {
  // Formations individuelles (2 jours chacune)
  individuelle: [
    {
      id: 'data-debutant',
      nom: 'Data Débutant (2 jours)',
      prix: 25000,
      description: 'Introduction à la Data Science : Excel, Power BI, bases SQL'
    },
    {
      id: 'data-intermediaire',
      nom: 'Data Intermédiaire (2 jours)',
      prix: 35000,
      description: 'Python pour la Data, Pandas, visualisation avancée'
    },
    {
      id: 'ia-debutant',
      nom: 'IA Débutant (2 jours)',
      prix: 25000,
      description: 'Introduction à l\'IA : Machine Learning, algorithmes de base, prompting'
    },
    {
      id: 'ia-intermediaire',
      nom: 'IA Intermédiaire (2 jours)',
      prix: 35000,
      description: 'Chatbot, projets pratiques'
    }
  ],

  // Packs combinés (4 jours) - ÉCONOMIE GARANTIE
  pack: [
    {
      id: 'pack-debutant',
      nom: 'Pack Débutant (Data + IA, 4 jours)',
      prix: 40000, // Économie de 5 000 FCFA vs prix individuel
      description: 'Combinaison parfaite pour débuter : Data + IA niveau débutant'
    },
    {
      id: 'pack-intermediaire',
      nom: 'Pack Intermédiaire (Data + IA, 4 jours)',
      prix: 65000, // Économie de 5 000 FCFA vs prix individuel
      description: 'Programme intensif : Data + IA niveau intermédiaire'
    }
  ],

  // Cycle complet (8 jours) - FORMATION COMPLÈTE
  cycle: [
    {
      id: 'cycle-complet',
      nom: 'Cycle complet (8 jours)',
      prix: 100000, // Économie de 20 000 FCFA vs tous les modules
      description: 'Formation complète : tous les modules du débutant à l\'intermédiaire'
    }
  ]
};

// CENTRES D'INTÉRÊT DISPONIBLES - AJOUTER/MODIFIER SELON VOS BESOINS
export const CENTRES_INTERET = [
  'Analyse de Données',
  'Data Visualization',
  'Business Intelligence',
  'Intelligence Artificielle',
  'Storytelling & Communication avec les données',
  'Machine Learning',
  'Deep Learning',
  'Python pour la Data',
  'Power BI & Dashboards'
];

// MODES DE FORMATION DISPONIBLES
export const MODES_FORMATION = [
  {
    id: 'presentiel',
    nom: 'En présentiel',
    description: 'Formation en classe, interaction directe',
    icon: 'Users'
  },
  {
    id: 'enligne',
    nom: 'En ligne',
    description: 'Formation à distance, flexible',
    icon: 'Eye'
  },
  {
    id: 'mixte',
    nom: 'Les deux me conviennent',
    description: 'Nous choisirons ensemble le meilleur format',
    icon: 'Sparkles'
  }
];

// MESSAGES PERSONNALISÉS
export const MESSAGES = {
  welcome: {
    titre: "Prêt à transformer votre carrière ?",
    description: "Rejoignez notre programme de formation et maîtrisez les outils de demain.",
    cta: "Je m'inscris",
    subtext: "🎯 Places limitées • ⚡ Inscription rapide • 📞 Support personnel"
  },

  success: {
    titre: "Inscription réussie !",
    description: "Vous recevrez un email de confirmation sous 24h.",
    whatsappCta: "Nous contacter sur WhatsApp",
    newInscription: "Nouvelle inscription"
  },

  form: {
    etapes: [
      "Vos informations",
      "Votre formation",
      "Modalités",
      "Confirmation"
    ],

    placeholders: {
      nomComplet: "Votre nom et prénom",
      email: "votre@email.com",
      telephone: "+228 XX XX XX XX",
      ville: "Votre ville",
      motivation: "Partagez vos motivations et objectifs avec cette formation..."
    }
  }
};

// VALIDATIONS ET RÈGLES MÉTIER
export const VALIDATION_RULES = {
  nomComplet: {
    minLength: 2,
    maxLength: 100,
    required: true
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  telephone: {
    required: true,
    minLength: 8,
    maxLength: 20
  },
  ville: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  motivation: {
    required: true,
    minLength: 10,
    maxLength: 1000
  }
};

// CONFIGURATION SUPABASE - À CONFIGURER APRÈS CONNEXION
export const SUPABASE_CONFIG = {
  tableInscriptions: 'inscriptions_formation',

  // Structure de données pour Supabase
  colonnes: [
    'nom_complet',
    'email',
    'telephone',
    'ville',
    'type_formation',
    'formation_specifique',
    'prix',
    'mode_formation',
    'motivation',
    'centres_interet',
    'accepte_conditions',
    'date_inscription',
    'statut'
  ]
};