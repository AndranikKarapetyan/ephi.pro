const { sendMail, isMailConfigured, notificationEmail } = require('../lib/mailer');
const wrap = require('./_adapter');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value) =>
  String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const isSameSite = (event) => {
  const host = (event.headers.host || event.headers['x-forwarded-host'] || '').toLowerCase();
  const origin = event.headers.origin || event.headers.referer;
  if (!host || !origin) return false;
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch (e) {
    return false;
  }
};

const redirect = (location) => ({ statusCode: 303, headers: { Location: location }, body: '' });
const json = (statusCode, message) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ success: false, message })
});

const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, 'Méthode non autorisée');
  if (!isSameSite(event)) return json(403, 'Requête refusée');

  const p = new URLSearchParams(event.body);
  const get = (k) => (p.get(k) || '').trim();

  // Honeypot : on fait semblant de réussir pour les bots
  if (get('bot-field')) return redirect('/merci-contact.html');

  const company = get('company_name');
  const name = get('user_name');
  const email = get('user_email');
  const phone = get('phone');
  const message = get('message');

  if (!company || !name || !phone || !message || !EMAIL_PATTERN.test(email)) {
    return json(400, 'Champs invalides ou manquants');
  }

  if (!isMailConfigured()) {
    console.error('RESEND_API_KEY non configurée');
    return json(500, 'Service indisponible');
  }

  try {
    await sendMail({
      to: notificationEmail(),
      replyTo: email,
      subject: `Contact EPHI 2026 - ${company}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Entreprise :</strong> ${escapeHtml(company)}</p>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(phone)}</p>
        <p><strong>Message :</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`
    });
  } catch (error) {
    console.error('Erreur envoi email contact :', error);
    return json(502, "L'envoi du message a échoué, veuillez réessayer.");
  }

  return redirect('/merci-contact.html');
};

module.exports = wrap(handler);
module.exports.config = { api: { bodyParser: false } };
