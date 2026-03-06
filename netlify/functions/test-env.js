// Fonction de test pour vérifier les variables d'environnement
// Accès: /.netlify/functions/test-env

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Vérifier les variables d'environnement (sans afficher les mots de passe complets)
  const envStatus = {
    ADMIN_USERNAME: {
      exists: !!process.env.ADMIN_USERNAME,
      value: process.env.ADMIN_USERNAME || 'admin (default)',
      length: (process.env.ADMIN_USERNAME || 'admin').length
    },
    ADMIN_PASSWORD: {
      exists: !!process.env.ADMIN_PASSWORD,
      length: (process.env.ADMIN_PASSWORD || 'ephi2026').length,
      firstChar: (process.env.ADMIN_PASSWORD || 'ephi2026').charAt(0),
      lastChar: (process.env.ADMIN_PASSWORD || 'ephi2026').slice(-1)
    },
    SMTP_HOST: {
      exists: !!process.env.SMTP_HOST,
      value: process.env.SMTP_HOST || 'not set'
    },
    SMTP_USER: {
      exists: !!process.env.SMTP_USER,
      value: process.env.SMTP_USER || 'not set'
    },
    NOTIFICATION_EMAIL: {
      exists: !!process.env.NOTIFICATION_EMAIL,
      value: process.env.NOTIFICATION_EMAIL || 'not set'
    }
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: 'Environment variables status',
      timestamp: new Date().toISOString(),
      variables: envStatus,
      note: 'Password is partially masked for security'
    }, null, 2)
  };
};
