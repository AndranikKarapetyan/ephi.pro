const wrap = require('./_adapter');
const { handler } = require('../netlify/functions/idf-nord-attendance');

module.exports = wrap(handler);
module.exports.config = { api: { bodyParser: false } };
