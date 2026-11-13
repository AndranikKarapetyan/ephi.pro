// Envoi d'emails via l'API Resend (https://resend.com/docs/api-reference/emails/send-email).
// Variables d'environnement :
//   RESEND_API_KEY      clé API Resend (obligatoire)
//   MAIL_FROM           expéditeur, sur un domaine vérifié dans Resend
//                       (défaut : "EPHI 2026 <noreply@ephi.pro>")
//   NOTIFICATION_EMAIL  destinataire des notifications internes

const DEFAULT_FROM = 'EPHI 2026 <noreply@ephi.pro>';
const DEFAULT_NOTIFICATION_EMAIL = 'info@maxiavenue.com';

// trim : un espace ou un retour à la ligne collé avec la clé la rend invalide
const apiKey = () => (process.env.RESEND_API_KEY || '').trim();

const isMailConfigured = () => Boolean(apiKey());

const notificationEmail = () => process.env.NOTIFICATION_EMAIL || DEFAULT_NOTIFICATION_EMAIL;

const sendMail = async ({ to, subject, html, replyTo }) => {
  if (!isMailConfigured()) {
    throw new Error('RESEND_API_KEY non configurée');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || DEFAULT_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {})
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Resend ${response.status} : ${detail}`);
  }

  return response.json();
};

module.exports = { sendMail, isMailConfigured, notificationEmail };
