# Système d'Administration EPHI - Guide d'Utilisation

## 🔐 Accès à l'Administration

### URL d'accès
`https://votre-domaine.com/admin.php`

### Identifiants par défaut
- **Nom d'utilisateur:** `admin`
- **Mot de passe:** `ephi2026`

⚠️ **IMPORTANT:** Modifiez ces identifiants dans le fichier `admin.php` (lignes 5-6) pour sécuriser votre système !

```php
define('ADMIN_USERNAME', 'votre-nouveau-username');
define('ADMIN_PASSWORD', 'votre-nouveau-mot-de-passe-securise');
```

## 📊 Fonctionnalités

### 1. Dashboard Principal
- **Statistiques globales:** Total des inscriptions, participants, salons
- **Statistiques par salon:** Nombre d'inscriptions, participants, communes et sociétés par salon
- **Liste détaillée:** Toutes les inscriptions avec informations complètes
- **Filtrage:** Possibilité de filtrer par salon spécifique

### 2. Export CSV
- Export de toutes les inscriptions ou d'un salon spécifique
- Format compatible Excel (avec BOM UTF-8)
- Séparateur point-virgule (;) pour compatibilité française
- Contient toutes les données : dates, contacts, préférences, etc.

### 3. Données Sauvegardées
Pour chaque inscription, les informations suivantes sont stockées :
- ID unique
- Date et heure d'inscription
- Date et lieu du salon
- Type d'organisation (commune/société)
- Nom de l'entreprise/commune
- Nom complet du participant
- Email et téléphone
- Nombre d'accompagnants
- Choix déjeuner
- Message éventuel
- Adresse IP

## 📁 Structure des Fichiers

```
ephi/
├── admin.php                 # Page de connexion
├── admin-dashboard.php       # Dashboard principal
├── admin-export.php         # Export CSV
├── admin-logout.php         # Déconnexion
├── registration.php         # Script de traitement des inscriptions (modifié)
└── data/
    ├── .htaccess           # Protection du dossier
    └── registrations.json  # Base de données des inscriptions
```

## 🔒 Sécurité

### Protection du dossier data
Le dossier `data/` est protégé par un fichier `.htaccess` qui empêche l'accès direct via le web.

### Authentification
- Système de sessions PHP
- Protection de toutes les pages admin
- Redirection automatique vers la page de login si non connecté

### Recommandations
1. **Changez les identifiants par défaut** immédiatement
2. **Utilisez HTTPS** sur votre site en production
3. **Sauvegardez régulièrement** le fichier `data/registrations.json`
4. **Ne commitez jamais** le dossier data dans Git (déjà dans .gitignore)

## 🚀 Utilisation

### Se connecter
1. Accédez à `admin.php`
2. Entrez vos identifiants
3. Vous serez redirigé vers le dashboard

### Consulter les inscriptions
- Le dashboard affiche automatiquement toutes les données
- Utilisez le menu déroulant pour filtrer par salon
- Les statistiques se mettent à jour automatiquement

### Exporter les données
1. Cliquez sur "📥 Exporter CSV" dans le header
2. Le fichier se télécharge automatiquement
3. Ouvrez-le avec Excel, LibreOffice ou Google Sheets

### Se déconnecter
Cliquez sur "🚪 Déconnexion" dans le header

## 📧 Notifications Email

Les emails continuent d'être envoyés comme avant :
- Email à `info@maxiavenue.com` pour chaque nouvelle inscription
- Email de confirmation au participant

## 🔄 Sauvegarde des Données

### Sauvegarde manuelle
Téléchargez régulièrement le fichier `data/registrations.json` via FTP/SFTP

### Sauvegarde automatique (recommandé)
Configurez une tâche cron pour copier le fichier périodiquement :
```bash
# Sauvegarde quotidienne à 2h du matin
0 2 * * * cp /chemin/vers/ephi/data/registrations.json /chemin/vers/backup/registrations_$(date +\%Y\%m\%d).json
```

## 🆘 Dépannage

### Problème : "Aucune inscription ne s'affiche"
- Vérifiez que le dossier `data/` existe et est accessible en écriture
- Vérifiez les permissions : `chmod 755 data/`
- Vérifiez que `registrations.json` existe et n'est pas corrompu

### Problème : "Impossible de se connecter"
- Vérifiez que vous utilisez les bons identifiants
- Vérifiez que les sessions PHP sont activées sur votre serveur

### Problème : "Les inscriptions ne se sauvegardent pas"
- Vérifiez les permissions du dossier data : `chmod 755 data/`
- Vérifiez les logs PHP pour voir les erreurs

## 📞 Support

Pour toute question ou problème :
- Email : info@ephi.pro

---

**Dernière mise à jour :** 6 mars 2026
