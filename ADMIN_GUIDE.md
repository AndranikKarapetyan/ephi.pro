# Système d'Administration EPHI - Guide d'Utilisation (Netlify)

## 🌐 Vue d'ensemble

Ce système utilise **Netlify Functions** (serverless) et **Netlify Blobs** pour stocker les inscriptions. Tout fonctionne directement sur Netlify sans nécessiter de serveur PHP.

## 🔐 Accès à l'Administration

### URL d'accès
`https://votre-domaine.com/admin` ou `https://votre-domaine.com/admin.html`

### Identifiants par défaut
- **Nom d'utilisateur:** `admin`
- **Mot de passe:** `ephi2026`

⚠️ **IMPORTANT:** Modifiez ces identifiants dans les **variables d'environnement Netlify** (voir section Configuration ci-dessous)

## ⚙️ Configuration Netlify

### 1. Variables d'environnement à configurer

Connectez-vous à votre dashboard Netlify et allez dans **Site Settings > Environment Variables**, puis ajoutez :

#### Variables Email (obligatoires pour l'envoi d'emails)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
NOTIFICATION_EMAIL=info@maxiavenue.com
```

#### Variables Admin (recommandé de les changer)
```
ADMIN_USERNAME=votre-nouveau-username
ADMIN_PASSWORD=votre-mot-de-passe-securise-ici
```

### 2. Activer Netlify Blobs

Netlify Blobs est inclus gratuitement (jusqu'à 100MB). Il est automatiquement activé quand vous déployez votre site.

### 3. Installer les dépendances

Après avoir poussé les modifications, Netlify installera automatiquement les packages définis dans `package.json` :
- `nodemailer` : Pour l'envoi d'emails
- `@netlify/blobs` : Pour le stockage des données

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
- Téléchargement direct depuis le navigateur

### 3. Données Sauvegardées
Pour chaque inscription, les informations suivantes sont stockées :
- ID unique
- Date et heure d'inscription (ISO)
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
├── admin.html                      # Page d'administration (HTML/JS)
├── netlify.toml                    # Configuration Netlify
├── package.json                    # Dépendances Node.js
└── netlify/
    └── functions/
        ├── inscription.js          # Traitement des inscriptions + sauvegarde
        └── admin-data.js          # API admin (authentification + données)
```

## 🔒 Sécurité

### Protection des données
- Les données sont stockées dans **Netlify Blobs** (stockage privé, non accessible publiquement)
- **Authentification Basic Auth** pour l'accès aux données
- Les credentials sont vérifiés côté serveur (Functions)
- Communication HTTPS obligatoire

### Authentification
- Username/password vérifiés par Netlify Functions
- Les credentials ne transitent jamais en clair (Base64 encoding via HTTPS)
- Session maintenue côté client (credentials en mémoire uniquement)

### Recommandations
1. **Changez les identifiants par défaut** via les variables d'environnement Netlify
2. **Utilisez des mots de passe forts** (générateur de mots de passe recommandé)
3. **HTTPS est obligatoire** (automatique sur Netlify)
4. **Ne commitez jamais** les credentials dans Git
5. **Sauvegardez régulièrement** les données via export CSV

## 🚀 Utilisation

### Se connecter
1. Accédez à `https://votre-site.com/admin`
2. Entrez vos identifiants
3. Le dashboard s'affiche automatiquement

### Consulter les inscriptions
- Le dashboard charge et affiche automatiquement toutes les données
- Utilisez le menu déroulant pour filtrer par salon
- Les statistiques se mettent à jour en temps réel

### Exporter les données
1. Cliquez sur "📥 Exporter CSV" dans le header
2. Le fichier CSV se télécharge automatiquement dans votre navigateur
3. Ouvrez-le avec Excel, LibreOffice ou Google Sheets

### Se déconnecter
Cliquez sur "🚪 Déconnexion" dans le header

## 📧 Notifications Email

Pour chaque inscription :
1. **Email à l'équipe** (NOTIFICATION_EMAIL) avec tous les détails
2. **Email de confirmation** au participant
3. **Sauvegarde dans Netlify Blobs** pour le dashboard admin

## 💾 Sauvegarde des Données

### Sauvegarde automatique
Les données sont stockées dans Netlify Blobs, qui est :
- **Persistant** : Les données ne sont jamais perdues
- **Redondant** : Sauvegardé automatiquement par Netlify
- **Scalable** : Peut gérer des milliers d'inscriptions

### Sauvegarde manuelle (recommandé)
Exportez régulièrement les données en CSV pour avoir une copie locale

### Consultation des données brutes (avancé)
Les données sont stockées dans Netlify Blobs sous le store `registrations` avec la clé `all`. Vous pouvez y accéder via l'API Netlify si nécessaire.

## 🆘 Dépannage

### Problème : "Aucune inscription ne s'affiche"
- Vérifiez que vous êtes bien connecté
- Rafraîchissez la page (F5)
- Vérifiez la console du navigateur (F12) pour les erreurs
- Vérifiez que les Functions Netlify sont déployées

### Problème : "Impossible de se connecter"
- Vérifiez que vous utilisez les bons identifiants
- Vérifiez que les variables `ADMIN_USERNAME` et `ADMIN_PASSWORD` sont bien configurées dans Netlify
- Si vous n'avez pas configuré ces variables, utilisez les identifiants par défaut : `admin` / `ephi2026`

### Problème : "Les inscriptions ne se sauvegardent pas"
- Vérifiez que @netlify/blobs est bien installé (voir dans les logs de déploiement Netlify)
- Vérifiez que la fonction `inscription.js` est déployée correctement
- Consultez les logs des Functions dans le dashboard Netlify

### Problème : "Les emails ne sont pas envoyés"
- Vérifiez que les variables SMTP sont correctement configurées dans Netlify
- Pour Gmail, vous devez utiliser un "Mot de passe d'application" (pas votre mot de passe habituel)
- Consultez les logs des Functions pour voir les erreurs d'envoi

### Comment créer un mot de passe d'application Gmail
1. Allez sur https://myaccount.google.com/security
2. Activez la validation en deux étapes si ce n'est pas déjà fait
3. Allez dans "Mots de passe des applications"
4. Créez un nouveau mot de passe pour "Autre (nom personnalisé)"
5. Utilisez ce mot de passe dans la variable `SMTP_PASS`

## 📊 Limites et Quotas

### Netlify Blobs (Plan gratuit)
- **Stockage**: 100 MB gratuit
- **Requêtes**: Illimitées
- Une inscription = environ 1 KB
- Capacité: ~100,000 inscriptions avec le plan gratuit

### Netlify Functions
- **Appels**: 125,000/mois gratuit
- **Durée d'exécution**: 300 secondes max par fonction
- Largement suffisant pour la gestion des inscriptions

## 🔄 Mise à jour et déploiement

### Déploiement automatique
Netlify redéploie automatiquement votre site à chaque push sur Git :
```bash
git add .
git commit -m "Update admin system"
git push origin main
```

### Installer les nouvelles dépendances localement
```bash
npm install
```

## 📞 Support

Pour toute question ou problème :
- **Documentation Netlify Functions**: https://docs.netlify.com/functions/overview/
- **Documentation Netlify Blobs**: https://docs.netlify.com/blobs/overview/
- Email : info@ephi.pro

## 🎯 Fonctionnalités futures possibles

- Export automatique programmé (webhook)
- Notifications par email lors de nouvelles inscriptions
- Filtres avancés (par date, type d'organisation, etc.)
- Graphiques et statistiques visuelles
- Intégration avec Google Sheets ou Airtable
- API publique pour intégrations tierces

---

**Dernière mise à jour :** 6 mars 2026
**Version :** 2.0 (Netlify Functions + Blobs)
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
