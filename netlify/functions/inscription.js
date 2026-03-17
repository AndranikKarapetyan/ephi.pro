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

exports.handler = async (event, context) => {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Méthode non autorisée' })
    };
  }

  try {
    // Parser les données du formulaire
    const params = new URLSearchParams(event.body);
    const formData = {};
    
    for (const [key, value] of params) {
      formData[key] = value;
    }

    // Ignorer si c'est le bot-field (anti-spam)
    if (formData['bot-field']) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Spam détecté' })
      };
    }

    // Sauvegarder l'inscription dans Supabase
    if (supabase) {
      try {
        const registration = {
          event_date: formData.event_date || null,
          event_location: formData.event_location || null,
          organization_type: formData.organization_type || null,
          company_name: formData.company_name || null,
          user_name: formData.user_name || null,
          user_email: formData.user_email || null,
          phone: formData.phone || null,
          companions: parseInt(formData.companions || 0),
          lunch: formData.lunch || null,
          message: formData.message || null,
          ip_address: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
          registered_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('registrations')
          .insert([registration]);
        
        if (error) {
          console.error('Erreur sauvegarde Supabase:', error);
        } else {
          console.log('Inscription sauvegardée dans Supabase');
        }
      } catch (supaError) {
        console.error('Erreur Supabase:', supaError);
        // Continue même si la sauvegarde échoue
      }
    } else {
      console.log('Supabase non configuré - inscription non sauvegardée');
    }

    // Construire l'email HTML
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
                <p style='margin: 5px 0; font-size: 18px;'><strong>${formData.event_date || 'Non spécifié'}</strong></p>
                <p style='margin: 5px 0; font-size: 16px;'>${formData.event_location || 'Non spécifié'}</p>
            </div>
            
            <div class='field'>
                <div class='field-label'>Type d'organisation :</div>
                <div class='field-value'>${formData.organization_type === 'commune' ? 'Commune' : 'Société'}</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Entreprise / Commune :</div>
                <div class='field-value'>${formData.company_name || 'Non spécifié'}</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Nom et Prénom :</div>
                <div class='field-value'>${formData.user_name || 'Non spécifié'}</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Email :</div>
                <div class='field-value'>${formData.user_email || 'Non spécifié'}</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Téléphone :</div>
                <div class='field-value'>${formData.phone || 'Non spécifié'}</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Nombre d'accompagnants :</div>
                <div class='field-value'>${formData.companions || '0'} personne(s)</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Déjeuner sur place :</div>
                <div class='field-value'>${formData.lunch === 'oui' ? 'Oui' : 'Non'}</div>
            </div>
            
            ${formData.message ? `
            <div class='field'>
                <div class='field-label'>Message :</div>
                <div class='field-value'>${formData.message}</div>
            </div>
            ` : ''}
        </div>
    </div>
</body>
</html>
    `;

    // Email de confirmation pour le participant
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
            <p>Bonjour ${formData.user_name},</p>
            <p>Nous avons bien reçu votre inscription pour le salon EPHI 2026.</p>
            
            <div class='event-box'>
                <h3 style='margin: 0 0 10px 0;'>📅 ${formData.event_date}</h3>
                <p style='margin: 5px 0; font-size: 18px;'>📍 ${formData.event_location}</p>
            </div>
            
            <p><strong>Vos informations :</strong></p>
            <ul>
                <li><strong>Organisation :</strong> ${formData.organization_type === 'commune' ? 'Commune' : 'Société'}</li>
                <li><strong>Entreprise/Commune :</strong> ${formData.company_name}</li>
                <li><strong>Email :</strong> ${formData.user_email}</li>
                <li><strong>Téléphone :</strong> ${formData.phone}</li>
                <li><strong>Accompagnants :</strong> ${formData.companions || '0'} personne(s)</li>
                <li><strong>Déjeuner :</strong> ${formData.lunch === 'oui' ? 'Oui' : 'Non'}</li>
            </ul>
            
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

    // Configuration de l'envoi d'email
    // Note: Vous devrez configurer vos variables d'environnement dans Netlify
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Envoyer les emails (non bloquant : une erreur SMTP ne fait pas échouer l'inscription)
    try {
      // Email de notification à l'équipe
      await transporter.sendMail({
        from: '"EPHI 2026" <noreply@ephi.pro>',
        to: process.env.NOTIFICATION_EMAIL || 'info@maxiavenue.com',
        subject: `Nouvelle inscription EPHI 2026 - ${formData.event_date} - ${formData.company_name}`,
        html: emailHTML
      });

      // Email de confirmation au participant
      if (formData.user_email) {
        await transporter.sendMail({
          from: '"EPHI 2026" <noreply@ephi.pro>',
          to: formData.user_email,
          subject: `Confirmation d'inscription - EPHI 2026 - ${formData.event_date}`,
          html: confirmationHTML
        });
      }
    } catch (mailError) {
      console.error('Erreur envoi email:', mailError);
      // On continue même si l'email échoue
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Votre inscription a été enregistrée avec succès ! Un email de confirmation vous a été envoyé.'
      })
    };

  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false,
        message: 'Erreur lors du traitement de l\'inscription'
      })
    };
  }
};
