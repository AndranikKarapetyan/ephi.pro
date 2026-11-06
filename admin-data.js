const wrap = require('./_adapter');
const { handler } = require('../netlify/functions/admin-data');

module.exports = wrap(handler);
module.exports.config = { api: { bodyParser: false } };
