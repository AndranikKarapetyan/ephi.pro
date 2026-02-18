<?php
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
$company_name = isset($_POST['company_name']) ? trim($_POST['company_name']) : '';
$user_name = isset($_POST['user_name']) ? trim($_POST['user_name']) : '';
$user_email = isset($_POST['user_email']) ? trim($_POST['user_email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation des champs obligatoires
$errors = [];

if (empty($company_name)) {
    $errors[] = 'Le nom de l\'entreprise est requis';
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

if (empty($message)) {
    $errors[] = 'Le message est requis';
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
$subject = 'Nouveau message de contact EPHI 2026 - ' . $company_name;

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
        .message-box {
            background-color: #f5f5f5;
            padding: 15px;
            border-left: 3px solid #667eea;
            margin-top: 10px;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nouveau message de contact - EPHI 2026</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='field-label'>Entreprise:</div>
                <div class='field-value'>" . htmlspecialchars($company_name) . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Nom et Prénom:</div>
                <div class='field-value'>" . htmlspecialchars($user_name) . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Email:</div>
                <div class='field-value'><a href='mailto:" . htmlspecialchars($user_email) . "'>" . htmlspecialchars($user_email) . "</a></div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Téléphone:</div>
                <div class='field-value'>" . htmlspecialchars($phone) . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Message:</div>
                <div class='message-box'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
        </div>
    </div>
</body>
</html>
";

// Version texte de l'email (pour les clients email qui ne supportent pas HTML)
$email_body_text = "
Nouveau message de contact - EPHI 2026
=======================================

Entreprise: $company_name
Nom et Prénom: $user_name
Email: $user_email
Téléphone: $phone

Message:
$message

---
Ce message a été envoyé depuis le formulaire de contact du site EPHI 2026
";

// Headers de l'email
$headers = array();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'From: EPHI 2026 <noreply@ephi2026.com>';
$headers[] = 'Reply-To: ' . $user_name . ' <' . $user_email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Envoyer l'email
$mail_sent = mail($to, $subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Email envoyé avec succès
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Votre message a été envoyé avec succès. Nous vous contacterons bientôt.'
    ]);
    
    // Optionnel: Envoyer un email de confirmation à l'utilisateur
    $confirm_subject = 'Confirmation de réception - EPHI 2026';
    $confirm_body = "
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
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
        }
        .content {
            padding: 30px 0;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Merci pour votre message !</h2>
        </div>
        <div class='content'>
            <p>Bonjour " . htmlspecialchars($user_name) . ",</p>
            <p>Nous avons bien reçu votre message concernant EPHI 2026.</p>
            <p>Nous vous répondrons dans les plus brefs délais.</p>
            <p>À très bientôt,<br>L'équipe EPHI 2026</p>
        </div>
    </div>
</body>
</html>
    ";
    
    $confirm_headers = array();
    $confirm_headers[] = 'MIME-Version: 1.0';
    $confirm_headers[] = 'Content-Type: text/html; charset=UTF-8';
    $confirm_headers[] = 'From: EPHI 2026 <info@maxiavenue.com>';
    
    mail($user_email, $confirm_subject, $confirm_body, implode("\r\n", $confirm_headers));
    
} else {
    // Erreur lors de l'envoi
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer.'
    ]);
}
?>
