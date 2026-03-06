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

// Trier par date (plus récent en premier)
usort($registrations, function($a, $b) {
    return strtotime($b['registered_at'] ?? '0') - strtotime($a['registered_at'] ?? '0');
});

// Statistiques
$total_inscriptions = count($registrations);
$total_participants = $total_inscriptions;
foreach ($registrations as $reg) {
    $total_participants += intval($reg['companions'] ?? 0);
}

// Grouper par salon
$by_salon = [];
foreach ($registrations as $reg) {
    $event = $reg['event_date'] . ' - ' . $reg['event_location'];
    if (!isset($by_salon[$event])) {
        $by_salon[$event] = [
            'count' => 0,
            'participants' => 0,
            'communes' => 0,
            'societes' => 0
        ];
    }
    $by_salon[$event]['count']++;
    $by_salon[$event]['participants'] += 1 + intval($reg['companions'] ?? 0);
    
    if (($reg['organization_type'] ?? '') === 'commune') {
        $by_salon[$event]['communes']++;
    } else {
        $by_salon[$event]['societes']++;
    }
}

// Filtrage
$filter_salon = $_GET['salon'] ?? '';
$filtered_registrations = $registrations;
if ($filter_salon) {
    $filtered_registrations = array_filter($registrations, function($reg) use ($filter_salon) {
        $event = $reg['event_date'] . ' - ' . $reg['event_location'];
        return $event === $filter_salon;
    });
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Inscriptions EPHI 2026</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f7fa;
            color: #333;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .header h1 {
            font-size: 1.8rem;
            font-weight: 700;
        }
        
        .header-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .btn {
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.3s;
            font-size: 0.9rem;
        }
        
        .btn-export {
            background: white;
            color: #667eea;
        }
        
        .btn-export:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
        }
        
        .btn-logout {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid white;
        }
        
        .btn-logout:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            border-left: 4px solid #667eea;
        }
        
        .stat-card h3 {
            color: #666;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
        }
        
        .section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            margin-bottom: 2rem;
            overflow: hidden;
        }
        
        .section-header {
            padding: 1.5rem;
            border-bottom: 2px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .section-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #333;
        }
        
        .filter-group {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .filter-group select {
            padding: 0.6rem 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 0.9rem;
            cursor: pointer;
        }
        
        .table-container {
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th {
            background: #f8f9fa;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #555;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 1rem;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.9rem;
        }
        
        tr:hover {
            background: #f8f9ff;
        }
        
        .badge {
            display: inline-block;
            padding: 0.3rem 0.7rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .badge-commune {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .badge-societe {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .badge-lunch-oui {
            background: #e8f5e9;
            color: #2e7d32;
        }
        
        .badge-lunch-non {
            background: #ffebee;
            color: #c62828;
        }
        
        .empty-state {
            padding: 3rem;
            text-align: center;
            color: #999;
        }
        
        .empty-state-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .salon-stats {
            padding: 1.5rem;
        }
        
        .salon-item {
            padding: 1rem;
            margin-bottom: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .salon-item h4 {
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 1rem;
        }
        
        .salon-item-stats {
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
            font-size: 0.85rem;
            color: #666;
        }
        
        .salon-item-stats span {
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header-content {
                flex-direction: column;
                align-items: flex-start;
            }
            
            table {
                font-size: 0.8rem;
            }
            
            th, td {
                padding: 0.5rem;
            }
        }
    </style>
    <script>
        function filterBySalon() {
            const select = document.getElementById('salon-filter');
            const value = select.value;
            if (value) {
                window.location.href = '?salon=' + encodeURIComponent(value);
            } else {
                window.location.href = 'admin-dashboard.php';
            }
        }
        
        function exportCSV() {
            window.location.href = 'admin-export.php<?php echo $filter_salon ? '?salon=' . urlencode($filter_salon) : ''; ?>';
        }
    </script>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>📊 Dashboard - Inscriptions EPHI 2026</h1>
            <div class="header-actions">
                <button onclick="exportCSV()" class="btn btn-export">📥 Exporter CSV</button>
                <a href="admin-logout.php" class="btn btn-logout">🚪 Déconnexion</a>
            </div>
        </div>
    </div>
    
    <div class="container">
        <!-- Statistiques -->
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total des inscriptions</h3>
                <div class="stat-value"><?php echo $total_inscriptions; ?></div>
            </div>
            <div class="stat-card">
                <h3>Total des participants</h3>
                <div class="stat-value"><?php echo $total_participants; ?></div>
            </div>
            <div class="stat-card">
                <h3>Nombre de salons</h3>
                <div class="stat-value"><?php echo count($by_salon); ?></div>
            </div>
        </div>
        
        <!-- Stats par salon -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">📍 Statistiques par Salon</h2>
            </div>
            <div class="salon-stats">
                <?php if (empty($by_salon)): ?>
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>Aucune inscription pour le moment</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($by_salon as $event => $stats): ?>
                        <div class="salon-item">
                            <h4><?php echo htmlspecialchars($event); ?></h4>
                            <div class="salon-item-stats">
                                <span>👥 <strong><?php echo $stats['count']; ?></strong> inscriptions</span>
                                <span>🎫 <strong><?php echo $stats['participants']; ?></strong> participants</span>
                                <span>🏛️ <strong><?php echo $stats['communes']; ?></strong> communes</span>
                                <span>🏢 <strong><?php echo $stats['societes']; ?></strong> sociétés</span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Liste des inscriptions -->
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">📋 Liste des Inscriptions</h2>
                <div class="filter-group">
                    <label for="salon-filter">Filtrer par salon :</label>
                    <select id="salon-filter" onchange="filterBySalon()">
                        <option value="">Tous les salons</option>
                        <?php foreach (array_keys($by_salon) as $event): ?>
                            <option value="<?php echo htmlspecialchars($event); ?>" <?php echo $filter_salon === $event ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($event); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            
            <div class="table-container">
                <?php if (empty($filtered_registrations)): ?>
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>Aucune inscription trouvée</p>
                    </div>
                <?php else: ?>
                    <table>
                        <thead>
                            <tr>
                                <th>Date/Lieu</th>
                                <th>Type</th>
                                <th>Entreprise/Commune</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                                <th>Accomp.</th>
                                <th>Déjeuner</th>
                                <th>Inscrit le</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($filtered_registrations as $reg): ?>
                                <tr>
                                    <td>
                                        <strong><?php echo htmlspecialchars($reg['event_date'] ?? ''); ?></strong><br>
                                        <small style="color: #666;"><?php echo htmlspecialchars($reg['event_location'] ?? ''); ?></small>
                                    </td>
                                    <td>
                                        <span class="badge badge-<?php echo htmlspecialchars($reg['organization_type'] ?? 'societe'); ?>">
                                            <?php echo ucfirst(htmlspecialchars($reg['organization_type'] ?? 'N/A')); ?>
                                        </span>
                                    </td>
                                    <td><?php echo htmlspecialchars($reg['company_name'] ?? 'N/A'); ?></td>
                                    <td><?php echo htmlspecialchars($reg['user_name'] ?? 'N/A'); ?></td>
                                    <td><?php echo htmlspecialchars($reg['user_email'] ?? 'N/A'); ?></td>
                                    <td><?php echo htmlspecialchars($reg['phone'] ?? 'N/A'); ?></td>
                                    <td><?php echo intval($reg['companions'] ?? 0); ?></td>
                                    <td>
                                        <span class="badge badge-lunch-<?php echo htmlspecialchars($reg['lunch'] ?? 'non'); ?>">
                                            <?php echo ucfirst(htmlspecialchars($reg['lunch'] ?? 'N/A')); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <small><?php echo date('d/m/Y H:i', strtotime($reg['registered_at'] ?? 'now')); ?></small>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>
