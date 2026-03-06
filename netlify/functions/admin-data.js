const { getStore } = require('@netlify/blobs');

// Credentials admin (à configurer dans les variables d'environnement Netlify)
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'ephi2026').trim();

// Log pour debug (à retirer en production si souhaité)
console.log('Admin config loaded - Username:', ADMIN_USERNAME, '| Password length:', ADMIN_PASSWORD.length);

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
      console.log('Missing or invalid Authorization header');
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

    console.log('Login attempt - Username:', username);

    // Vérifier les credentials (trim pour éviter les espaces)
    if (username.trim() !== ADMIN_USERNAME || password.trim() !== ADMIN_PASSWORD) {
      console.log('Invalid credentials - Expected:', ADMIN_USERNAME, '| Received:', username.trim());
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid credentials',
          debug: {
            receivedUsername: username.trim(),
            expectedUsername: ADMIN_USERNAME,
            usernameMatch: username.trim() === ADMIN_USERNAME,
            passwordMatch: password.trim() === ADMIN_PASSWORD
          }
        })
      };
    }

    console.log('Authentication successful');

    // Récupérer les données
    let registrations = [];
    
    try {
      const store = getStore('registrations');
      const data = await store.get('all', { type: 'json' });
      
      if (data) {
        registrations = data;
      }
    } catch (blobError) {
      console.error('Netlify Blobs error:', blobError.message);
      
      // Si Blobs n'est pas configuré, retourner un message d'erreur explicite
      if (blobError.message.includes('MissingBlobsEnvironmentError')) {
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({
            error: 'Netlify Blobs not configured',
            message: 'Netlify Blobs doit être activé pour ce site. Consultez DEBUG_ADMIN.md pour les instructions.',
            instructions: 'Allez dans Site Configuration > Environment Variables et activez Netlify Blobs',
            registrations: [],
            stats: {
              total_inscriptions: 0,
              total_participants: 0,
              by_salon: {}
            }
          })
        };
      }
      
      // Autre erreur
      throw blobError;
    }
    
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
