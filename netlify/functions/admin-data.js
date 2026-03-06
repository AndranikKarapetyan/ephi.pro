const { getStore } = require('@netlify/blobs');

// Credentials admin (à configurer dans les variables d'environnement Netlify)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ephi2026';

exports.handler = async (event, context) => {
  // Autoriser CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Gérer les requêtes OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Vérifier l'authentification
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }

    // Décoder les credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Vérifier les credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }

    // Récupérer les données
    const store = getStore('registrations');
    let registrations = await store.get('all', { type: 'json' });
    
    if (!registrations) {
      registrations = [];
    }

    // Trier par date (plus récent en premier)
    registrations.sort((a, b) => {
      return new Date(b.registered_at) - new Date(a.registered_at);
    });

    // Calculer les statistiques
    const stats = {
      total_inscriptions: registrations.length,
      total_participants: registrations.reduce((sum, reg) => {
        return sum + 1 + parseInt(reg.companions || 0);
      }, 0),
      by_salon: {}
    };

    // Grouper par salon
    registrations.forEach(reg => {
      const event = `${reg.event_date} - ${reg.event_location}`;
      if (!stats.by_salon[event]) {
        stats.by_salon[event] = {
          count: 0,
          participants: 0,
          communes: 0,
          societes: 0
        };
      }
      stats.by_salon[event].count++;
      stats.by_salon[event].participants += 1 + parseInt(reg.companions || 0);
      
      if (reg.organization_type === 'commune') {
        stats.by_salon[event].communes++;
      } else {
        stats.by_salon[event].societes++;
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        stats,
        registrations
      })
    };

  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
