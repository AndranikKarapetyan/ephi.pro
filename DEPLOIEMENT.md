# 🚀 Déploiement du Système d'Administration EPHI sur Netlify

## Étapes de déploiement

### 1. Prérequis
- Avoir un compte Netlify
- Site déjà connecté à votre repository Git (GitHub, GitLab, etc.)

### 2. Configuration des variables d'environnement

Dans le dashboard Netlify :

1. Allez dans **Site Settings > Environment Variables**
2. Cliquez sur **Add a variable**
3. Ajoutez les variables suivantes :

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application-gmail
NOTIFICATION_EMAIL=info@maxiavenue.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=votremotdepasse2026
```

### 3. Déployer le code

```bash
# 1. Installer les dépendances localement (optionnel, pour tester)
npm install

# 2. Commit et push
git add .
git commit -m "Add Netlify admin system with Functions and Blobs"
git push origin main
```

Netlify déploiera automatiquement :
- Les functions dans `netlify/functions/`
- Les fichiers statiques (HTML, CSS, JS)
- Installera automatiquement les dépendances de `package.json`

### 4. Vérification post-déploiement

Après le déploiement :

1. **Vérifiez les Functions** :
   - Allez dans **Functions** dans le menu Netlify
   - Vous devriez voir : `inscription` et `admin-data`

2. **Testez une inscription** :
   - Allez sur votre site
   - Faites une inscription test
   - Vérifiez que l'email est reçu

3. **Testez l'admin** :
   - Allez sur `https://votre-site.com/admin`
   - Connectez-vous avec vos identifiants
   - Vérifiez que l'inscription test apparaît

### 5. Activer Netlify Blobs (automatique)

Netlify Blobs est automatiquement activé. Rien à faire ! Le stockage commence dès la première inscription.

## 🔍 Vérifier les logs

Si quelque chose ne fonctionne pas :

1. **Logs de déploiement** :
   - Dashboard Netlify > Deploys > Dernier déploiement
   - Vérifiez qu'il n'y a pas d'erreurs

2. **Logs des Functions** :
   - Dashboard Netlify > Functions > Fonction concernée
   - Cliquez sur "Recent log" pour voir les erreurs

3. **Console du navigateur** :
   - F12 sur votre site
   - Onglet Console et Network pour débugger

## ⚠️ Points d'attention

### Gmail / SMTP
- Utilisez un **mot de passe d'application** Gmail (pas votre mot de passe normal)
- Activez la validation en deux étapes sur votre compte Gmail
- Créez le mot de passe ici : https://myaccount.google.com/apppasswords

### Anciens fichiers PHP
Les fichiers PHP ne sont plus utilisés et peuvent être supprimés :
- `admin.php`
- `admin-dashboard.php`
- `admin-export.php`
- `admin-logout.php`
- `registration.php`
- Dossier `data/`

**Important** : Gardez ces fichiers si vous avez des inscriptions dans `data/registrations.json`. Exportez-les d'abord en CSV depuis l'ancien système PHP.

## 📝 Fichiers importants

Fichiers Netlify Functions :
- `netlify/functions/inscription.js` - Traite les inscriptions + sauvegarde
- `netlify/functions/admin-data.js` - API admin avec authentification

Fichiers statiques :
- `admin.html` - Page d'administration
- `index.html` - Page principale du site

Configuration :
- `netlify.toml` - Configuration Netlify et redirects
- `package.json` - Dépendances Node.js

## 🎉 C'est prêt !

Après ces étapes, votre système d'administration est opérationnel sur Netlify !

Accédez-y via : `https://votre-site.com/admin`
