<?php
// Désactiver l'affichage des erreurs pour éviter de polluer la réponse JSON
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer et valider les données du formulaire
$event_date = isset($_POST['event_date']) ? trim($_POST['event_date']) : '';
$event_location = isset($_POST['event_location']) ? trim($_POST['event_location']) : '';
$organization_type = isset($_POST['organization_type']) ? trim($_POST['organization_type']) : '';
$company_name = isset($_POST['company_name']) ? trim($_POST['company_name']) : '';
$user_name = isset($_POST['user_name']) ? trim($_POST['user_name']) : '';
$user_email = isset($_POST['user_email']) ? trim($_POST['user_email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$companions = isset($_POST['companions']) ? trim($_POST['companions']) : '0';
$lunch = isset($_POST['lunch']) ? trim($_POST['lunch']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation des champs obligatoires
$errors = [];

if (empty($event_date)) {
    $errors[] = 'La date de l\'événement est requise';
}

if (empty($event_location)) {
    $errors[] = 'Le lieu de l\'événement est requis';
}

if (empty($organization_type)) {
    $errors[] = 'Le type d\'organisation est requis';
}

if (empty($company_name)) {
    $errors[] = 'Le nom de l\'entreprise/commune est requis';
}

if (empty($user_name)) {
    $errors[] = 'Le nom et prénom sont requis';
}

if (empty($user_email) || !filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Une adresse email valide est requise';
}

if (empty($phone)) {
    $errors[] = 'Le numéro de téléphone est requis';
}

if (empty($lunch)) {
    $errors[] = 'Veuillez indiquer si vous déjeunez sur place';
}

// Si des erreurs existent, les retourner
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Adresse email de destination
$to = 'info@maxiavenue.com';

// Sujet de l'email
$subject = 'Nouvelle inscription EPHI 2026 - ' . $event_date . ' - ' . $company_name;

// Corps de l'email en HTML
$email_body = "
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
        .event-info h3 {
            margin: 0 0 10px 0;
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
                <h3>Événement</h3>
                <p style='margin: 5px 0; font-size: 18px;'><strong>$event_date</strong></p>
                <p style='margin: 5px 0; font-size: 16px;'>$event_location</p>
            </div>
            
            <div class='field'>
                <div class='field-label'>Type d'organisation:</div>
                <div class='field-value'>" . ucfirst($organization_type) . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Entreprise/Commune:</div>
                <div class='field-value'>$company_name</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Nom et Prénom:</div>
                <div class='field-value'>$user_name</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Email:</div>
                <div class='field-value'>$user_email</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Téléphone:</div>
                <div class='field-value'>$phone</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Nombre d'accompagnants:</div>
                <div class='field-value'>$companions personne(s)</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Déjeuner sur place:</div>
                <div class='field-value'>" . ucfirst($lunch) . "</div>
            </div>";

if (!empty($message)) {
    $email_body .= "
            <div class='field'>
                <div class='field-label'>Message:</div>
                <div class='field-value'>$message</div>
            </div>";
}

$email_body .= "
        </div>
    </div>
</body>
</html>
";

// En-têtes de l'email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: EPHI 2026 <noreply@ephi.pro>" . "\r\n";
$headers .= "Reply-To: $user_email" . "\r\n";

// Sauvegarder l'inscription dans un fichier JSON
function saveRegistration($data) {
    $file = 'data/registrations.json';
    $dir = dirname($file);
    
    // Créer le dossier data s'il n'existe pas
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    // Lire les inscriptions existantes
    $registrations = [];
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $registrations = json_decode($content, true) ?: [];
    }
    
    // Ajouter la nouvelle inscription avec un ID unique et un timestamp
    $data['id'] = uniqid('reg_', true);
    $data['registered_at'] = date('Y-m-d H:i:s');
    $data['ip_address'] = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    $registrations[] = $data;
    
    // Sauvegarder
    file_put_contents($file, json_encode($registrations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    return true;
}

// Préparer les données d'inscription
$registration_data = [
    'event_date' => $event_date,
    'event_location' => $event_location,
    'organization_type' => $organization_type,
    'company_name' => $company_name,
    'user_name' => $user_name,
    'user_email' => $user_email,
    'phone' => $phone,
    'companions' => $companions,
    'lunch' => $lunch,
    'message' => $message
];

// Sauvegarder l'inscription
saveRegistration($registration_data);

// Envoyer l'email
$mail_sent = mail($to, $subject, $email_body, $headers);

if ($mail_sent) {
    // Email de confirmation au participant
    $confirmation_subject = "Confirmation d'inscription - EPHI 2026 - $event_date";
    $confirmation_body = "
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
            <p>Bonjour $user_name,</p>
            <p>Nous avons bien reçu votre inscription pour le salon EPHI 2026.</p>
            
            <div class='event-box'>
                <h3 style='margin: 0 0 10px 0;'>📅 $event_date</h3>
                <p style='margin: 5px 0; font-size: 18px;'>📍 $event_location</p>
            </div>
            
            <p><strong>Vos informations :</strong></p>
            <ul>
                <li><strong>Organisation :</strong> " . ucfirst($organization_type) . "</li>
                <li><strong>Entreprise/Commune :</strong> $company_name</li>
                <li><strong>Email :</strong> $user_email</li>
                <li><strong>Téléphone :</strong> $phone</li>
                <li><strong>Accompagnants :</strong> $companions personne(s)</li>
                <li><strong>Déjeuner :</strong> " . ucfirst($lunch) . "</li>
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
    ";
    
    $confirmation_headers = "MIME-Version: 1.0" . "\r\n";
    $confirmation_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $confirmation_headers .= "From: EPHI 2026 <noreply@ephi.pro>" . "\r\n";
    
    mail($user_email, $confirmation_subject, $confirmation_body, $confirmation_headers);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Votre inscription a été enregistrée avec succès ! Un email de confirmation vous a été envoyé.'
    ]);
    exit;
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Une erreur est survenue lors de l\'envoi de votre inscription. Veuillez réessayer.'
    ]);
    exit;
}
