// Proxy Netlify simple pour Slack webhook
// Déployez ce fichier sur Netlify Functions pour contourner CORS

exports.handler = async (event, context) => {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // URL du webhook Slack (à configurer dans les variables d'environnement Netlify)
    const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
    
    if (!SLACK_WEBHOOK_URL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Slack webhook URL not configured' })
      };
    }

    // Parser le body de la requête
    const payload = JSON.parse(event.body);

    // Envoyer à Slack
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: result
    };

  } catch (error) {
    console.error('Erreur proxy Slack:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};