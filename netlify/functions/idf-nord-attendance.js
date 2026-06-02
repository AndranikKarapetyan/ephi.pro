const { createClient } = require('@supabase/supabase-js');

const ATTENDANCE_SECRET = (process.env.ATTENDANCE_SECRET || 'idf-nord-4juin-2026').trim();

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

function isIdfNordEvent(registration) {
  const eventDate = String(registration.event_date || '').toLowerCase();
  const eventLocation = String(registration.event_location || '').toLowerCase();

  const isJune4 = eventDate.includes('4 juin');
  const isIdfNord = /idf\s*nord|enghien|\(95\)|\b95\b/.test(eventLocation);

  return isJune4 || isIdfNord;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  const token = (event.queryStringParameters && event.queryStringParameters.token) || '';
  if (token.trim() !== ATTENDANCE_SECRET) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Accès refusé' })
    };
  }

  if (!supabase) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        error: 'Supabase non configuré',
        message: 'Configurez SUPABASE_URL et SUPABASE_KEY dans Netlify.'
      })
    };
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, event_date, event_location, organization_type, company_name, user_name, user_email, phone, companions, registered_at')
      .order('registered_at', { ascending: true });

    if (error) {
      throw error;
    }

    const registrations = (data || [])
      .filter(isIdfNordEvent)
      .map((item, index) => ({
        id: item.id || `idf_nord_${index + 1}`,
        event_date: item.event_date || '',
        event_location: item.event_location || '',
        organization_type: item.organization_type || '',
        company_name: item.company_name || '',
        user_name: item.user_name || '',
        user_email: item.user_email || '',
        phone: item.phone || '',
        companions: Number.isFinite(Number(item.companions)) ? Math.max(0, Number(item.companions)) : 0,
        registered_at: item.registered_at || ''
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, registrations })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur serveur',
        message: err.message || 'Erreur inconnue'
      })
    };
  }
};
