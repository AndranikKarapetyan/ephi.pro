const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');
const path = require('path');

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

function normalizeRegistration(item, index) {
  return {
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
  };
}

async function readLocalRegistrations() {
  const candidatePaths = [
    path.resolve(process.cwd(), 'data', 'registrations.json'),
    path.resolve(__dirname, '..', '..', 'data', 'registrations.json')
  ];

  for (const filePath of candidatePaths) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  return [];
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

  try {
    let sourceRegistrations = [];
    let source = 'supabase';

    if (supabase) {
      const { data, error } = await supabase
        .from('registrations')
        .select('id, event_date, event_location, organization_type, company_name, user_name, user_email, phone, companions, registered_at')
        .order('registered_at', { ascending: true });

      if (error) {
        throw error;
      }

      sourceRegistrations = data || [];
    } else {
      source = 'local-json';
      sourceRegistrations = await readLocalRegistrations();
    }

    const registrations = sourceRegistrations
      .filter(isIdfNordEvent)
      .map(normalizeRegistration);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, source, registrations })
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
