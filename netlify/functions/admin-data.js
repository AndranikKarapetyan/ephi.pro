const { createClient } = require('@supabase/supabase-js');

// Credentials admin (à configurer dans les variables d'environnement Netlify)
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'ephi2026').trim();

// Initialiser Supabase si les variables sont configurées
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
}

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

    // Récupérer les données depuis Supabase
    let registrations = [];
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .order('registered_at', { ascending: false });
        
        if (error) {
          console.error('Erreur Supabase:', error);
          throw error;
        }
        
        if (data) {
          registrations = data;
        }
      } catch (supaError) {
        console.error('Supabase error:', supaError.message);
        
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({
            error: 'Database error',
            message: 'Erreur lors de la récupération des données de Supabase',
            details: supaError.message,
            registrations: [],
            stats: {
              total_inscriptions: 0,
              total_participants: 0,
              by_salon: {}
            }
          })
        };
      }
    } else {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          error: 'Supabase not configured',
          message: 'Les variables SUPABASE_URL et SUPABASE_KEY doivent être configurées dans Netlify',
          registrations: [],
          stats: {
            total_inscriptions: 0,
            total_participants: 0,
            by_salon: {}
          }
        })
      };
    }

    // Les données sont déjà triées par Supabase (order by registered_at desc)

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
