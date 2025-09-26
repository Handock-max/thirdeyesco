// Service Slack pour les notifications Third Eyes Co.
// Ce fichier gère l'envoi de notifications vers Slack

import { SLACK_CONFIG } from '@/config/payment';

/**
 * INTERFACES POUR LES DONNÉES SLACK
 */

// Structure d'un message Slack
interface SlackMessage {
  text: string;
  blocks?: Array<{
    type: string;
    text?: {
      type: string;
      text: string;
    };
    fields?: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

// Interface pour les données d'inscription (utilisée dans Slack)
interface InscriptionData {
  nom_complet: string;
  email: string;
  telephone: string;
  ville: string;
  formation_specifique: string;
  prix: number;
  type_formation: string;
  mode_formation: string;
}

/**
 * SERVICE SLACK
 * Classe qui gère toutes les interactions avec Slack
 */
export class SlackService {
  private webhookUrl: string;

  constructor() {
    // Récupération de l'URL du webhook depuis les variables d'environnement
    this.webhookUrl = SLACK_CONFIG.WEBHOOK_URL;
    
    console.log('🔧 Configuration Slack:', {
      webhookConfigured: !!this.webhookUrl,
      webhookUrl: this.webhookUrl ? 'Configuré' : 'Non configuré'
    });
    
    if (!this.webhookUrl) {
      console.warn('⚠️ URL Slack webhook non configurée. Les notifications ne seront pas envoyées.');
    }
  }

  /**
   * MÉTHODE PRIVÉE: Envoyer un message à Slack
   * @param payload - Le contenu du message à envoyer
   */
  private async envoyerMessage(payload: SlackMessage): Promise<boolean> {
    console.log('📤 Tentative envoi Slack:', {
      webhookUrl: this.webhookUrl ? 'Configuré' : 'Non configuré',
      payload: payload
    });

    // Si pas d'URL configurée, on simule l'envoi
    if (!this.webhookUrl || this.webhookUrl.trim() === '') {
      console.log('📱 Simulation envoi Slack (pas d\'URL):', payload);
      return true;
    }

    try {
      const messageComplet = {
        ...payload,
        username: SLACK_CONFIG.BOT_NAME,
        icon_emoji: SLACK_CONFIG.BOT_EMOJI,
        channel: SLACK_CONFIG.CHANNEL
      };

      console.log('📡 Envoi vers Slack:', {
        url: this.webhookUrl,
        message: messageComplet
      });

      // Envoi de la requête POST vers Slack
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageComplet)
      });

      const responseText = await response.text();
      
      console.log('📨 Réponse Slack:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });

      if (response.ok) {
        console.log('✅ Message Slack envoyé avec succès');
        return true;
      } else {
        console.error('❌ Erreur envoi Slack:', response.status, response.statusText, responseText);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur réseau Slack:', error);
      return false;
    }
  }

  /**
   * NOTIFIER UNE NOUVELLE INSCRIPTION
   * Envoie une notification quand quelqu'un s'inscrit
   * @param data - Les données de l'inscription
   */
  async notifierNouvelleInscription(data: InscriptionData): Promise<boolean> {
    console.log('📤 Envoi notification nouvelle inscription pour:', data.nom_complet);
    
    // Génération du message à partir du template
    const message = SLACK_CONFIG.TEMPLATES.NOUVELLE_INSCRIPTION(data);
    
    return await this.envoyerMessage(message);
  }

  /**
   * NOTIFIER UNE TENTATIVE DE PAIEMENT
   * Envoie une notification quand quelqu'un essaie de payer
   * @param data - Les données de l'inscription
   * @param typePaiement - 'total' ou 'frais'
   * @param montant - Le montant du paiement
   * @param operateur - 'flooz' ou 'mixx'
   */
  async notifierTentativePaiement(
    data: InscriptionData, 
    typePaiement: 'total' | 'frais',
    montant: number,
    operateur: 'flooz' | 'mixx'
  ): Promise<boolean> {
    console.log('📤 Envoi notification tentative paiement pour:', data.nom_complet);
    
    // Formatage du type de paiement pour l'affichage
    const typePaiementTexte = typePaiement === 'total' 
      ? `Paiement total (${operateur.toUpperCase()})` 
      : `Frais d'inscription (${operateur.toUpperCase()})`;
    
    // Génération du message à partir du template
    const message = SLACK_CONFIG.TEMPLATES.TENTATIVE_PAIEMENT(data, typePaiementTexte, montant);
    
    return await this.envoyerMessage(message);
  }

  /**
   * TESTER LA CONNEXION SLACK
   * Envoie un message de test pour vérifier que tout fonctionne
   */
  async testerConnexion(): Promise<boolean> {
    console.log('🧪 Test de connexion Slack...');
    
    const messageTest = {
      text: "🧪 Test de connexion Third Eyes Bot",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "✅ La connexion Slack fonctionne correctement !\n🤖 Bot configuré pour les notifications d'inscription."
          }
        }
      ]
    };

    return await this.envoyerMessage(messageTest);
  }
}

/**
 * INSTANCE SINGLETON DU SERVICE SLACK
 * Une seule instance partagée dans toute l'application
 */
export const slackService = new SlackService();

/**
 * FONCTIONS UTILITAIRES POUR L'EXPORT
 * Fonctions simples à utiliser dans les composants
 */

// Notifier une nouvelle inscription (fonction simple)
export const notifierInscription = async (data: InscriptionData): Promise<boolean> => {
  return await slackService.notifierNouvelleInscription(data);
};

// Notifier une tentative de paiement (fonction simple)
export const notifierPaiement = async (
  data: InscriptionData,
  typePaiement: 'total' | 'frais',
  montant: number,
  operateur: 'flooz' | 'mixx'
): Promise<boolean> => {
  return await slackService.notifierTentativePaiement(data, typePaiement, montant, operateur);
};

// Tester la connexion Slack (fonction simple)
export const testerSlack = async (): Promise<boolean> => {
  return await slackService.testerConnexion();
};

/**
 * CONFIGURATION REQUISE POUR SLACK:
 * 
 * 1. Créez un webhook Slack:
 *    - Allez sur https://api.slack.com/apps
 *    - Créez une nouvelle app
 *    - Activez "Incoming Webhooks"
 *    - Créez un webhook pour votre canal #inscriptions
 * 
 * 2. Ajoutez l'URL dans votre fichier .env:
 *    VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
 * 
 * 3. Testez la connexion en appelant testerSlack()
 */