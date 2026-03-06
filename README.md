# Site EPHI - Inscriptions aux Salons

Site web pour les inscriptions aux différents salons EPHI 2026 avec dashboard administrateur.

## 🚀 Démarrage rapide

### 1. Configuration de la base de données

**IMPORTANT** : Suivez d'abord le guide complet : **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

Résumé :
1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un projet
3. Exécutez le SQL pour créer la table `registrations`
4. Récupérez votre `SUPABASE_URL` et `SUPABASE_KEY`

### 2. Configuration des variables d'environnement

Consultez : **[VARIABLES_ENV.md](VARIABLES_ENV.md)**

Dans Netlify, ajoutez ces variables obligatoires :
```
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=eyJhbGci...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=votre_mot_de_passe
```

Variables optionnelles (pour les emails) :
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=mot-de-passe-application
NOTIFICATION_EMAIL=info@maxiavenue.com
```

### 3. Déploiement

```bash
npm install
git add .
git commit -m "Configuration Supabase"
git push
```

Netlify déploiera automatiquement.

## 📂 Structure du projet

```
├── index.html              # Page d'accueil avec liens salons
├── admin.html              # Dashboard administrateur
├── script.js               # Logique frontend
├── style.css               # Styles
├── netlify/
│   └── functions/
│       ├── inscription.js  # API inscription (Supabase)
│       └── admin-data.js   # API admin (Supabase)
└── package.json            # Dépendances
```

## 🔗 Fonctionnalités

### Liens directs par salon

Chaque salon a son propre lien d'inscription :
- `?salon=vienne-38` → 13 Mars 2026 - Vienne (38)
- `?salon=bourg-01` → 21 Mars 2026 - Bourg-en-Bresse (01)
- etc.

Le formulaire s'ouvre automatiquement avec le salon pré-sélectionné.

### Dashboard administrateur

Accès : `https://votre-site.netlify.app/admin.html`

Fonctionnalités :
- 🔐 Authentification sécurisée
- 📊 Statistiques en temps réel
- 📋 Liste complète des inscriptions
- 🔍 Filtrage par salon
- 📥 Export CSV

## 📚 Documentation complète

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Configuration base de données (OBLIGATOIRE)
- **[VARIABLES_ENV.md](VARIABLES_ENV.md)** - Variables d'environnement
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Guide d'utilisation admin
- **[DEPLOIEMENT.md](DEPLOIEMENT.md)** - Instructions de déploiement

## 🛠️ Technologies

- **Frontend** : HTML, CSS, JavaScript (vanilla)
- **Backend** : Netlify Functions (Node.js serverless)
- **Base de données** : Supabase (PostgreSQL)
- **Email** : Nodemailer (optionnel)
- **Hébergement** : Netlify

## ⚙️ Commandes

```bash
# Installer les dépendances
npm install

# Tester localement (nécessite Netlify CLI)
npm install -g netlify-cli
netlify dev

# Construire pour production
npm run build
```

## 🐛 Dépannage

### "Supabase not configured"
➡️ Vérifiez que `SUPABASE_URL` et `SUPABASE_KEY` sont bien configurés dans Netlify

### "Database error"
➡️ Vérifiez que la table `registrations` existe dans Supabase (voir [SUPABASE_SETUP.md](SUPABASE_SETUP.md))

### Identifiants admin incorrects
➡️ Vérifiez `ADMIN_USERNAME` et `ADMIN_PASSWORD` dans les variables Netlify

### Emails non envoyés
➡️ Les emails sont optionnels. Les inscriptions sont quand même sauvegardées.
➡️ Si vous voulez les emails, configurez les variables SMTP (voir [VARIABLES_ENV.md](VARIABLES_ENV.md))

## 📞 Support

Pour toute question :
1. Consultez d'abord la documentation dans ce dossier
2. Vérifiez les logs Netlify : Deploys > Function logs
3. Vérifiez les données dans Supabase : Table Editor > registrations

## 🔐 Sécurité

- ✅ Authentification Basic Auth pour l'admin
- ✅ Variables d'environnement pour les credentials
- ✅ Validation anti-spam (bot-field)
- ✅ HTTPS automatique via Netlify
- ✅ Clés API Supabase sécurisées (anon key)

## 📊 Limites gratuites

**Netlify** (gratuit) :
- 100 Go de bande passante/mois
- 300 minutes de build/mois
- 125,000 invocations de fonctions/mois

**Supabase** (gratuit) :
- 500 Mo de base de données
- 2 Go de bande passante/mois
- 50,000 utilisateurs actifs/mois

Pour un site d'inscriptions, ces limites suffisent largement.

## 📄 Licence

Propriété de MaxiAvenue / EPHI
