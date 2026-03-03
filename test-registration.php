<?php
// Fichier de test pour vérifier que PHP fonctionne correctement
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'PHP fonctionne correctement !',
    'php_version' => phpversion(),
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
]);
?>
