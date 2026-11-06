const wrap = require('./_adapter');
const { handler } = require('../netlify/functions/inscription');

module.exports = wrap(handler);
module.exports.config = { api: { bodyParser: false } };
