const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

// Initialiser Supabase (si configuré)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
}

const localRegistrationsPath = path.resolve(__dirname, '..', 'data', 'registrations.json');

const normalizeValue = (value) => {
  if (!value) return '';
  return value.toString().trim().toLowerCase().replace(/\s+/g, ' ');
};

const loadLocalRegistrations = () => {
  try {
    if (!fs.existsSync(localRegistrationsPath)) {
      return [];
    }
    const content = fs.readFileSync(localRegistrationsPath, 'utf8');
    return JSON.parse(content) || [];
  } catch (error) {
    console.error('Erreur lecture inscriptions locales :', error);
    return [];
  }
};

const saveLocalRegistrations = (registrations) => {
  try {
    fs.mkdirSync(path.dirname(localRegistrationsPath), { recursive: true });
    fs.writeFileSync(localRegistrationsPath, JSON.stringify(registrations, null, 2), 'utf8');
  } catch (error) {
    console.error('Erreur écriture inscriptions locales :', error);
  }
};

const getAllRegistrations = async () => {
  if (supabase) {
    const { data, error } = await supabase.from('registrations').select('*');
    if (error) {
      console.error('Erreur lecture Supabase :', error);
      return [];
    }
    return data || [];
  }
  return loadLocalRegistrations();
};

const deleteRegistrationsByIds = async (ids) => {
  if (!ids || !ids.length) {
    return;
  }

  if (supabase) {
    const { error } = await supabase.from('registrations').delete().in('id', ids);
    if (error) {
      console.error('Erreur suppression Supabase :', error);
    }
    return;
  }

  const registrations = loadLocalRegistrations();
  const filtered = registrations.filter((reg) => !ids.includes(reg.id));
  saveLocalRegistrations(filtered);
};

const saveRegistrationRecord = async (registration) => {
  if (supabase) {
    const { error } = await supabase.from('registrations').insert([registration]);
    if (error) {
      throw error;
    }
    return;
  }

  const registrations = loadLocalRegistrations();
  registrations.push(registration);
  saveLocalRegistrations(registrations);
};

const findMatchingRegistrations = (registrations, normalizedEmail) => {
  return registrations.filter((registration) => {
    const emailMatch = normalizeValue(registration.user_email) === normalizedEmail;
    return emailMatch;
  });
};

exports.handler = async (event, context) => {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Méthode non autorisée' })
    };
  }

  try {
    const params = new URLSearchParams(event.body);
    const formData = {};
    for (const [key, value] of params) {
      formData[key] = value;
    }

    if (formData['bot-field']) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Spam détecté' })
      };
    }

    const action = formData.action || 'register';
    const eventDate = formData.event_date?.trim() || '';
    const eventLocation = formData.event_location?.trim() || '';
    const organizationType = formData.organization_type?.trim() || '';
    const companyName = formData.company_name?.trim() || '';
    const userName = formData.user_name?.trim() || '';
    const userEmail = formData.user_email?.trim() || '';
    const phone = formData.phone?.trim() || '';
    const lunch = formData.lunch?.trim() || '';
    const companions = Number(formData.companions || '0');
    let companionsDetails = [];

    if (formData.companions_details) {
      try {
        companionsDetails = JSON.parse(formData.companions_details);
      } catch (parseError) {
        console.error('Impossible de parser companions_details', parseError);
      }
    }

    if (!eventDate || !eventLocation || !userName || !userEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Les champs date, lieu, nom et email sont obligatoires.' })
      };
    }

    if (action === 'register' && (!organizationType || !companyName || !phone || !lunch)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Veuillez remplir tous les champs requis.' })
      };
    }

    if (companions > 0 && (!Array.isArray(companionsDetails) || companionsDetails.length !== companions)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Veuillez renseigner le prénom et le nom de chaque accompagnant.' })
      };
    }

    const normalizedEmail = normalizeValue(userEmail);
    const registrations = await getAllRegistrations();
    const matches = findMatchingRegistrations(registrations, normalizedEmail);

    const sameSalonMatch = matches.find((registration) => {
      return normalizeValue(registration.event_date) === normalizeValue(eventDate)
        && normalizeValue(registration.event_location) === normalizeValue(eventLocation);
    });

    const otherSalonMatches = matches.filter((registration) => {
      return normalizeValue(registration.event_date) !== normalizeValue(eventDate)
        || normalizeValue(registration.event_location) !== normalizeValue(eventLocation);
    });

    const primaryOtherSalon = otherSalonMatches[0];

    if (action === 'check') {
      if (sameSalonMatch) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            duplicate: true,
            sameSalon: true,
            message: 'Vous êtes déjà inscrit à ce salon.'
          })
        };
      }

      if (primaryOtherSalon) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            duplicate: true,
            sameSalon: false,
            otherSalon: {
              event_date: primaryOtherSalon.event_date,
              event_location: primaryOtherSalon.event_location
            },
            message: `Vous êtes déjà inscrit au salon ${primaryOtherSalon.event_date} à ${primaryOtherSalon.event_location}. Voulez-vous transférer votre inscription vers ce nouveau salon ?`
          })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ duplicate: false })
      };
    }

    if (sameSalonMatch) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Vous êtes déjà inscrit à ce salon.' })
      };
    }

    if (primaryOtherSalon && formData.force_transfer !== 'true') {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: `Vous êtes déjà inscrit au salon ${primaryOtherSalon.event_date} à ${primaryOtherSalon.event_location}. Confirmez le transfert pour vous inscrire à ce nouveau salon.`,
          conflict: true,
          otherSalon: {
            event_date: primaryOtherSalon.event_date,
            event_location: primaryOtherSalon.event_location
          }
        })
      };
    }

    if (primaryOtherSalon && formData.force_transfer === 'true') {
      const idsToDelete = otherSalonMatches
        .map((registration) => registration.id)
        .filter(Boolean);

      if (idsToDelete.length) {
        await deleteRegistrationsByIds(idsToDelete);
      }
    }

    const registrationRecord = {
      event_date: eventDate,
      event_location: eventLocation,
      organization_type: organizationType,
      company_name: companyName,
      user_name: userName,
      user_email: userEmail,
      phone,
      companions,
      companions_details: companionsDetails,
      lunch,
      message: formData.message || '',
      ip_address: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
      registered_at: new Date().toISOString()
    };

    if (!supabase) {
      registrationRecord.id = `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    await saveRegistrationRecord(registrationRecord);

    const companionsListHTML = companionsDetails.length > 0
      ? `<div class='field'><div class='field-label'>Détails des accompagnants :</div><div class='field-value'><ul style="margin:0;padding-left:1.2rem;">${companionsDetails.map((person) => `<li>${person.first_name} ${person.last_name}</li>`).join('')}</ul></div></div>`
      : '';

    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 5px 5px;
        }
        .field {
            margin-bottom: 15px;
        }
        .field-label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .field-value {
            padding: 10px;
            background-color: #f5f5f5;
            border-left: 3px solid #667eea;
            margin-top: 5px;
        }
        .event-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>📅 Nouvelle Inscription EPHI 2026</h2>
        </div>
        <div class='content'>
            <div class='event-info'>
                <h3 style="margin: 0 0 10px 0;">Événement</h3>
                <p style='margin: 5px 0; font-size: 18px;'><strong>${eventDate}</strong></p>
                <p style='margin: 5px 0; font-size: 16px;'>${eventLocation}</p>
            </div>
            <div class='field'>
                <div class='field-label'>Type d'organisation :</div>
                <div class='field-value'>${organizationType === 'commune' ? 'Commune' : 'Société'}</div>
            </div>
            <div class='field'>
                <div class='field-label'>Entreprise / Commune :</div>
                <div class='field-value'>${companyName}</div>
            </div>
            <div class='field'>
                <div class='field-label'>Nom et Prénom :</div>
                <div class='field-value'>${userName}</div>
            </div>
            <div class='field'>
                <div class='field-label'>Email :</div>
                <div class='field-value'>${userEmail}</div>
            </div>
            <div class='field'>
                <div class='field-label'>Téléphone :</div>
                <div class='field-value'>${phone}</div>
            </div>
            <div class='field'>
                <div class='field-label'>Nombre d'accompagnants :</div>
                <div class='field-value'>${companions} personne(s)</div>
            </div>
            ${companionsListHTML}
            <div class='field'>
                <div class='field-label'>Déjeuner sur place :</div>
                <div class='field-value'>${lunch === 'oui' ? 'Oui' : 'Non'}</div>
            </div>
            ${formData.message ? `
            <div class='field'>
                <div class='field-label'>Message :</div>
                <div class='field-value'>${formData.message}</div>
            </div>` : ''}
        </div>
    </div>
</body>
</html>
    `;

    const confirmationHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 5px 5px;
        }
        .event-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>✅ Inscription Confirmée !</h2>
        </div>
        <div class='content'>
            <p>Bonjour ${userName},</p>
            <p>Nous avons bien reçu votre inscription pour le salon EPHI 2026.</p>
            <div class='event-box'>
                <h3 style='margin: 0 0 10px 0;'>📅 ${eventDate}</h3>
                <p style='margin: 5px 0; font-size: 18px;'>📍 ${eventLocation}</p>
            </div>
            <p><strong>Vos informations :</strong></p>
            <ul>
                <li><strong>Organisation :</strong> ${organizationType === 'commune' ? 'Commune' : 'Société'}</li>
                <li><strong>Entreprise/Commune :</strong> ${companyName}</li>
                <li><strong>Email :</strong> ${userEmail}</li>
                <li><strong>Téléphone :</strong> ${phone}</li>
                <li><strong>Accompagnants :</strong> ${companions} personne(s)</li>
                <li><strong>Déjeuner :</strong> ${lunch === 'oui' ? 'Oui' : 'Non'}</li>
            </ul>
            ${companionsListHTML}
            <p>Vous recevrez prochainement plus d'informations concernant le déroulement de l'événement et les modalités pratiques.</p>
            <p>À très bientôt !</p>
            <p style='margin-top: 30px; color: #666; font-size: 14px;'>
                L'équipe EPHI 2026<br>
                Email: info@ephi.pro
            </p>
        </div>
    </div>
</body>
</html>
    `;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const smtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;
    if (!smtpConfigured) {
      console.warn('SMTP non configuré : les emails ne seront pas envoyés.');
    }

    if (smtpConfigured) {
      try {
        await transporter.sendMail({
          from: '"EPHI 2026" <noreply@ephi.pro>',
          to: process.env.NOTIFICATION_EMAIL || 'info@maxiavenue.com',
          subject: `Nouvelle inscription EPHI 2026 - ${eventDate} - ${companyName}`,
          html: emailHTML
        });

        if (userEmail) {
          await transporter.sendMail({
            from: '"EPHI 2026" <noreply@ephi.pro>',
            to: userEmail,
            subject: `Confirmation d'inscription - EPHI 2026 - ${eventDate}`,
            html: confirmationHTML
          });
        }
      } catch (mailError) {
        console.error('Erreur envoi email :', mailError);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        redirect: '/merci-inscription.html'
      })
    };
  } catch (error) {
    console.error('Erreur traitement inscription :', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erreur lors du traitement de l\'inscription',
        error: error.message
      })
    };
  }
};