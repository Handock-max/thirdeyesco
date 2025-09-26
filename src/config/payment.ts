// Configuration des paiements mobiles pour Third Eyes Co.
// Ce fichier contient toutes les constantes liées aux paiements

/**
 * CONFIGURATION DES OPERATEURS DE PAIEMENT MOBILE
 * Modifiez ces valeurs selon vos besoins
 */
export const PAYMENT_CONFIG = {
  // Numéros de réception des paiements (MODIFIEZ CES VALEURS)
  FLOOZ_NUMBER: "96933995", // Votre numéro Flooz
  MIXX_NUMBER: "91383066",  // Votre numéro Mixx
  
  // Codes USSD pour déclencher les paiements
  // Format: *code*options*montant*numero*confirmation#
  USSD_CODES: {
    // Flooz: *155*1*1*numero_destinataire*numero_expediteur*montant#
    FLOOZ: (montant: number, numeroDestinataire: string, numeroExpediteur: string) => 
      `*155*1*1*${numeroDestinataire}*${numeroDestinataire}*${montant}#`,
    
    // Mixx: *145*1*montant*numero_destinataire*2#
    MIXX: (montant: number, numeroDestinataire: string) => 
      `*145*1*${montant}*${numeroDestinataire}*2#`
  },
  
  // Montant fixe des frais d'inscription (en FCFA)
  // Peut être configuré via VITE_FRAIS_INSCRIPTION dans .env
  FRAIS_INSCRIPTION_MONTANT: parseInt(import.meta.env.VITE_FRAIS_INSCRIPTION) || 5000, // 5 000 FCFA par défaut
  
  // Messages et textes (MODIFIEZ SELON VOS BESOINS)
  MESSAGES: {
    TITRE_PAIEMENT: "Réservez votre place maintenant !",
    DESCRIPTION_PAIEMENT: "Sécurisez votre inscription en payant dès maintenant.",
    
    OPTION_TOTALE: "Payer le montant total",
    OPTION_FRAIS: "Payer les frais d'inscription seulement",
    
    DISCLAIMER: {
      FRAIS: "⚠️ Les frais d'inscription ne sont pas remboursables",
      FORMATION: "✅ Les frais de formation sont remboursables jusqu'à 48h avant le début (15/10/2025)",
      PREUVE: "📱 Merci d'envoyer la preuve de paiement après la transaction"
    },
    
    INSTRUCTIONS_MOBILE: "Cliquez sur votre opérateur pour effectuer le paiement :",
    INSTRUCTIONS_DESKTOP: "Envoyez votre paiement sur l'un de ces numéros :",
    
    APRES_PAIEMENT: {
      TITRE: "Paiement en cours...",
      DESCRIPTION: "Merci d'envoyer la preuve de paiement.",
      CONTACT: "Notre équipe vous contactera dans les 15 minutes."
    }
  }
};

/**
 * CONFIGURATION SLACK WEBHOOK
 * Pour envoyer des notifications automatiques
 */
export const SLACK_CONFIG = {
  // URL du webhook Slack (VOUS DEVEZ ME FOURNIR CETTE URL)
  WEBHOOK_URL: process.env.VITE_SLACK_WEBHOOK_URL || "", // À configurer dans .env
  
  // Canal Slack où envoyer les notifications
  CHANNEL: "#inscriptions", // Modifiez selon votre canal
  
  // Nom du bot qui envoie les messages
  BOT_NAME: "Third Eyes Bot",
  
  // Emoji pour le bot
  BOT_EMOJI: ":brain:",
  
  // Templates de messages
  TEMPLATES: {
    NOUVELLE_INSCRIPTION: (data: InscriptionData) => ({
      text: `🎓 Nouvelle inscription - ${data.nom_complet}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎓 Nouvelle inscription Third Eyes Co."
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Nom:* ${data.nom_complet}`
            },
            {
              type: "mrkdwn", 
              text: `*Email:* ${data.email}`
            },
            {
              type: "mrkdwn",
              text: `*Téléphone:* ${data.telephone}`
            },
            {
              type: "mrkdwn",
              text: `*Ville:* ${data.ville}`
            },
            {
              type: "mrkdwn",
              text: `*Formation:* ${data.formation_specifique}`
            },
            {
              type: "mrkdwn",
              text: `*Prix:* ${data.prix.toLocaleString()} FCFA`
            }
          ]
        }
      ]
    }),
    
    TENTATIVE_PAIEMENT: (data: InscriptionData, typePaiement: string, montant: number) => ({
      text: `💳 Tentative de paiement - ${data.nom_complet}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "💳 Tentative de paiement"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Nom:* ${data.nom_complet}`
            },
            {
              type: "mrkdwn",
              text: `*Téléphone:* ${data.telephone}`
            },
            {
              type: "mrkdwn",
              text: `*Type:* ${typePaiement}`
            },
            {
              type: "mrkdwn",
              text: `*Montant:* ${montant.toLocaleString()} FCFA`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `⏰ *Action requise:* Contacter dans 15 min\n📞 Téléphone: ${data.telephone}\n📧 Email: ${data.email}`
          }
        }
      ]
    })
  }
};

/**
 * UTILITAIRES POUR LES PAIEMENTS
 */
export const PaymentUtils = {
  // Calculer les frais d'inscription (montant fixe)
  calculerFraisInscription: (prixTotal: number): number => {
    // Les frais d'inscription sont fixes à 5 000 FCFA pour toutes les formations
    // Peu importe si c'est une formation à 25 000 FCFA ou 100 000 FCFA
    // Les frais restent toujours 5 000 FCFA
    return PAYMENT_CONFIG.FRAIS_INSCRIPTION_MONTANT;
  },
  
  // Détecter si l'utilisateur est sur mobile
  estSurMobile: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  // Générer le code USSD pour Flooz (sans indicatif 228)
  genererUSSDFlooz: (montant: number, numeroExpediteur: string = "96933995"): string => {
    // Nettoyer le numéro expéditeur (supprimer +228 si présent)
    const numeroClean = numeroExpediteur.replace(/^\+?228/, '');
    return PAYMENT_CONFIG.USSD_CODES.FLOOZ(montant, PAYMENT_CONFIG.FLOOZ_NUMBER, numeroClean);
  },
  
  // Générer le code USSD pour Mixx
  genererUSSDMixx: (montant: number): string => {
    return PAYMENT_CONFIG.USSD_CODES.MIXX(montant, PAYMENT_CONFIG.MIXX_NUMBER);
  },
  
  // Déclencher l'appel USSD (sur mobile uniquement)
  declencherUSSD: (code: string): void => {
    if (PaymentUtils.estSurMobile()) {
      // Sur mobile, on peut déclencher l'USSD via tel:
      window.location.href = `tel:${encodeURIComponent(code)}`;
    } else {
      console.log("Code USSD généré:", code);
      // Sur desktop, on affiche juste le code
    }
  }
};

/**
 * TYPES TYPESCRIPT POUR LA GESTION DES PAIEMENTS
 */

// Interface pour les données d'inscription (utilisée dans les templates Slack)
export interface InscriptionData {
  nom_complet: string;
  email: string;
  telephone: string;
  ville: string;
  formation_specifique: string;
  prix: number;
  type_formation: string;
  mode_formation: string;
}

export interface OptionPaiement {
  type: 'total' | 'frais';
  montant: number;
  description: string;
}

export interface OperateurPaiement {
  nom: 'flooz' | 'mixx';
  numero: string;
  logo: string;
  couleur: string;
}

export const OPERATEURS: OperateurPaiement[] = [
  {
    nom: 'flooz',
    numero: PAYMENT_CONFIG.FLOOZ_NUMBER,
    logo: '/src/assets/images/flooz.png', // Chemin vers votre logo Flooz
    couleur: '#FF6B35' // Couleur orange de Flooz
  },
  {
    nom: 'mixx',
    numero: PAYMENT_CONFIG.MIXX_NUMBER,
    logo: '/src/assets/images/mixx.png', // Chemin vers votre logo Mixx
    couleur: '#1E40AF' // Couleur bleue de Mixx
  }
];