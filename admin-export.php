<?php
session_start();

// Vérifier l'authentification
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    header('Location: admin.php');
    exit;
}

// Lire les inscriptions
$registrations = [];
$file = 'data/registrations.json';
if (file_exists($file)) {
    $content = file_get_contents($file);
    $registrations = json_decode($content, true) ?: [];
}

// Filtrage par salon si demandé
$filter_salon = $_GET['salon'] ?? '';
if ($filter_salon) {
    $registrations = array_filter($registrations, function($reg) use ($filter_salon) {
        $event = $reg['event_date'] . ' - ' . $reg['event_location'];
        return $event === $filter_salon;
    });
}

// Trier par date
usort($registrations, function($a, $b) {
    return strtotime($a['registered_at'] ?? '0') - strtotime($b['registered_at'] ?? '0');
});

// Nom du fichier
$filename = 'inscriptions_ephi_' . date('Y-m-d_His') . '.csv';
if ($filter_salon) {
    $filename = 'inscriptions_' . preg_replace('/[^a-z0-9]/i', '_', $filter_salon) . '_' . date('Y-m-d_His') . '.csv';
}

// Headers pour téléchargement
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

// Créer le fichier CSV
$output = fopen('php://output', 'w');

// BOM UTF-8 pour Excel
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// En-têtes
$headers = [
    'ID',
    'Date Inscription',
    'Date Salon',
    'Lieu Salon',
    'Type Organisation',
    'Entreprise/Commune',
    'Nom Complet',
    'Email',
    'Téléphone',
    'Nombre Accompagnants',
    'Total Participants',
    'Déjeuner sur place',
    'Message',
    'Adresse IP'
];

fputcsv($output, $headers, ';');

// Données
foreach ($registrations as $reg) {
    $row = [
        $reg['id'] ?? '',
        $reg['registered_at'] ?? '',
        $reg['event_date'] ?? '',
        $reg['event_location'] ?? '',
        ucfirst($reg['organization_type'] ?? ''),
        $reg['company_name'] ?? '',
        $reg['user_name'] ?? '',
        $reg['user_email'] ?? '',
        $reg['phone'] ?? '',
        $reg['companions'] ?? '0',
        (1 + intval($reg['companions'] ?? 0)),
        ucfirst($reg['lunch'] ?? ''),
        $reg['message'] ?? '',
        $reg['ip_address'] ?? ''
    ];
    
    fputcsv($output, $row, ';');
}

fclose($output);
exit;
