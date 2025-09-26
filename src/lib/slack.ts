// Service Slack pour les notifications Third Eyes Co.
// Ce fichier gère l'envoi de notifications vers Slack

import { SLACK_CONFIG } from '@/config/payment';

/**
 * INTERFACES POUR LES DONNÉES SLACK
 */

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

    console.log('🔧 Configuration Slack DEBUG:', {
      webhookConfigured: !!this.webhookUrl,
      webhookUrl: this.webhookUrl ? `Configuré (${this.webhookUrl.substring(0, 50)}...)` : 'Non configuré',
      allEnvVars: {
        VITE_SLACK_WEBHOOK_URL: import.meta.env.VITE_SLACK_WEBHOOK_URL ? 'Présent' : 'Absent',
        NODE_ENV: import.meta.env.NODE_ENV,
        MODE: import.meta.env.MODE
      }
    });

    if (!this.webhookUrl || this.webhookUrl.trim() === '') {
      console.error('❌ URL Slack webhook non configurée ou vide !');
      console.log('🔍 Variables d\'environnement disponibles:', Object.keys(import.meta.env));
    }
  }

  /**
   * MÉTHODE PRIVÉE: Envoyer un message à Slack
   * @param payload - Le contenu du message à envoyer
   */
  private async envoyerMessage(message: string): Promise<boolean> {
    console.log('📤 Tentative envoi Slack:', {
      webhookUrl: this.webhookUrl ? 'Configuré' : 'Non configuré',
      message: message
    });

    // Si pas d'URL configurée, on simule l'envoi
    if (!this.webhookUrl || this.webhookUrl.trim() === '') {
      console.log('📱 Simulation envoi Slack (pas d\'URL):', message);
      return true;
    }

    try {
      // Format simple recommandé par Slack : {"text":"Hello, World!"}
      const payload = {
        text: message
      };

      console.log('📡 Envoi vers Slack via proxy CORS:', {
        originalUrl: this.webhookUrl,
        payload: payload
      });

      // SOLUTION CORS: Utiliser un proxy qui gère les POST correctement
      // Utilisation de corsproxy.io qui transmet correctement les POST
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(this.webhookUrl)}`;

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      console.log('📨 Réponse Slack via proxy:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });

      if (response.ok) {
        console.log('✅ Message Slack envoyé avec succès via proxy');
        return true;
      } else {
        console.error('❌ Erreur envoi Slack via proxy:', response.status, response.statusText, responseText);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur réseau Slack via proxy:', error);

      // FALLBACK: Essayer avec un autre proxy
      try {
        console.log('🔄 Tentative avec proxy alternatif...');
        return await this.envoyerMessageFallback(message);
      } catch (fallbackError) {
        console.error('❌ Tous les proxies ont échoué:', fallbackError);

        // FALLBACK ULTIME: Envoyer par email
        console.log('📧 Fallback: Tentative d\'envoi par email...');
        this.envoyerParEmail(message);
        return false; // On retourne false car Slack n'a pas marché, mais l'email est envoyé
      }
    }
  }

  // Méthode de fallback avec un autre proxy
  private async envoyerMessageFallback(message: string): Promise<boolean> {
    const payload = { text: message };

    // Proxy alternatif: proxy-cors.isomorphic-git.org
    const proxyUrl = `https://proxy-cors.isomorphic-git.org/${this.webhookUrl}`;

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📨 Réponse proxy alternatif:', {
      status: response.status,
      statusText: response.statusText,
      body: await response.text()
    });

    return response.ok;
  }

  // Fallback ultime: ouvrir l'email avec le message
  private envoyerParEmail(message: string): void {
    const subject = encodeURIComponent('🎓 Notification Third Eyes Co.');
    const body = encodeURIComponent(message);
    const emailUrl = `mailto:thirdeyesco@gmail.com?subject=${subject}&body=${body}`;

    console.log('📧 Ouverture email de fallback...');
    window.open(emailUrl, '_blank');
  }
}

  /**
   * NOTIFIER UNE NOUVELLE INSCRIPTION
   * Envoie une notification quand quelqu'un s'inscrit
   * @param data - Les données de l'inscription
   */
  async notifierNouvelleInscription(data: InscriptionData): Promise < boolean > {
  console.log('📤 Envoi notification nouvelle inscription pour:', data.nom_complet);

  // Message simple et clair pour Slack
  const message = `🎓 NOUVELLE INSCRIPTION - Third Eyes Co.

👤 Nom: ${data.nom_complet}
📧 Email: ${data.email}
📱 Téléphone: ${data.telephone}
🏙️ Ville: ${data.ville}
📚 Formation: ${data.formation_specifique}
💰 Prix: ${data.prix.toLocaleString()} FCFA
📍 Mode: ${data.mode_formation}

✅ Inscription enregistrée avec succès !`;

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
): Promise < boolean > {
  console.log('📤 Envoi notification tentative paiement pour:', data.nom_complet);

  // Formatage du type de paiement pour l'affichage
  const typePaiementTexte = typePaiement === 'total'
    ? 'Paiement total'
    : 'Frais d\'inscription (5 000 FCFA)';

  // Message simple et urgent pour Slack
  const message = `💳 TENTATIVE DE PAIEMENT - Third Eyes Co.

🚨 ACTION REQUISE DANS 15 MINUTES !

👤 Nom: ${data.nom_complet}
📱 Téléphone: ${data.telephone}
📧 Email: ${data.email}
💰 Type: ${typePaiementTexte}
💵 Montant: ${montant.toLocaleString()} FCFA
📱 Opérateur: ${operateur.toUpperCase()}

⏰ Contacter le client maintenant pour confirmer le paiement !`;

  return await this.envoyerMessage(message);
}

  /**
   * TESTER LA CONNEXION SLACK
   * Envoie un message de test pour vérifier que tout fonctionne
   */
  async testerConnexion(): Promise < boolean > {
  console.log('🧪 Test de connexion Slack...');

  const messageTest = `🧪 TEST DE CONNEXION - Third Eyes Bot

✅ La connexion Slack fonctionne correctement !
🤖 Bot configuré pour les notifications d'inscription.
📅 Test effectué le ${new Date().toLocaleString('fr-FR')}

🎯 Prêt à recevoir les notifications d'inscription et de paiement !`;

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
 * FONCTION DE TEST GLOBAL POUR DEBUG
 * Appelez cette fonction depuis la console du navigateur pour tester Slack
 */
(window as Window & { testSlackDebug?: () => Promise<boolean> }).testSlackDebug = async () => {
  console.log('🧪 TEST SLACK DEBUG');
  console.log('URL configurée:', import.meta.env.VITE_SLACK_WEBHOOK_URL);

  if (!import.meta.env.VITE_SLACK_WEBHOOK_URL) {
    console.error('❌ Variable VITE_SLACK_WEBHOOK_URL non trouvée !');
    return false;
  }

  try {
    const response = await fetch(import.meta.env.VITE_SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        text: `🧪 TEST DIRECT - ${new Date().toLocaleString()}`
      })
    });

    const result = await response.text();
    console.log('📨 Réponse Slack:', { status: response.status, body: result });
    return response.ok;
  } catch (error) {
    console.error('❌ Erreur test Slack:', error);
    return false;
  }
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
 * 2. Ajoutez l'URL dans GitHub Variables (pas Secrets !):
 *    VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
 * 
 * 3. Testez avec: testSlackDebug() dans la console du navigateur
 */