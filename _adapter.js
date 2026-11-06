// Adaptateur Netlify -> Vercel : exécute un handler (event, context) Netlify
// dans une fonction Node Vercel (req, res). Les handlers existants restent inchangés.
module.exports = (handler) => async (req, res) => {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const url = new URL(req.url, 'http://localhost');

    const event = {
      httpMethod: req.method,
      headers: req.headers,
      body: Buffer.concat(chunks).toString('utf8'),
      queryStringParameters: Object.fromEntries(url.searchParams),
      isBase64Encoded: false
    };

    const result = (await handler(event, {})) || {};
    res.statusCode = result.statusCode || 200;
    for (const [key, value] of Object.entries(result.headers || {})) {
      res.setHeader(key, value);
    }
    res.end(result.body || '');
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Erreur serveur' }));
  }
};
