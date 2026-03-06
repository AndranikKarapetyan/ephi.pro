# 🔐 Configuration des Variables d'Environnement

## Fichier `.env.example`

Le fichier `.env.example` contient toutes les variables d'environnement nécessaires pour le bon fonctionnement du site EPHI sur Netlify.

## 📋 Comment configurer sur Netlify

### 1. Accéder aux variables d'environnement
1. Connectez-vous à votre dashboard Netlify
2. Sélectionnez votre site
3. Allez dans **Site Settings** (Paramètres du site)
4. Cliquez sur **Environment Variables** (Variables d'environnement) dans le menu de gauche

### 2. Ajouter les variables
Pour chaque variable dans `.env.example` :

1. Cliquez sur **Add a variable** (Ajouter une variable)
2. **Key** (Clé) : Copiez le nom de la variable (ex: `SMTP_HOST`)
3. **Value** (Valeur) : Entrez votre valeur personnelle
4. Sélectionnez **Same value for all deploy contexts** (Même valeur pour tous les contextes)
5. Cliquez sur **Create variable** (Créer la variable)

### 3. Variables obligatoires

#### Pour l'envoi d'emails :
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
NOTIFICATION_EMAIL=info@maxiavenue.com
```

#### Pour l'accès admin :
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=votremotdepassesecurise2026
```

### 4. Configuration Gmail (recommandé)

Pour utiliser Gmail comme serveur SMTP :

1. **Activez la validation en 2 étapes** :
   - Allez sur https://myaccount.google.com/security
   - Activez "Validation en deux étapes"

2. **Créez un mot de passe d'application** :
   - Allez sur https://myaccount.google.com/apppasswords
   - Sélectionnez "Autre (nom personnalisé)"
   - Entrez "Netlify EPHI"
   - Cliquez sur "Générer"
   - Copiez le mot de passe généré (16 caractères)

3. **Utilisez ce mot de passe** dans `SMTP_PASS` (PAS votre mot de passe Gmail normal)

### 5. Redéployer le site

Après avoir ajouté/modifié les variables :
1. Allez dans **Deploys** (Déploiements)
2. Cliquez sur **Trigger deploy** → **Clear cache and deploy site**

Ou faites un nouveau commit :
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## 🔒 Sécurité

**⚠️ IMPORTANT** :
- Ne commitez JAMAIS le fichier `.env` dans Git
- Utilisez des mots de passe forts pour `ADMIN_PASSWORD`
- Changez les valeurs par défaut
- Ne partagez jamais vos credentials SMTP

Le fichier `.env` est déjà dans `.gitignore` pour éviter tout commit accidentel.

## 🧪 Test en local (optionnel)

Si vous voulez tester en local avec Netlify CLI :

1. Copiez `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Remplissez vos vraies valeurs dans `.env`

3. Installez Netlify CLI :
   ```bash
   npm install -g netlify-cli
   ```

4. Lancez en local :
   ```bash
   netlify dev
   ```

**Note** : Le fichier `.env` ne sera jamais commité car il est dans `.gitignore`.

## 📚 Ressources

- [Documentation Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid SMTP (alternative)](https://sendgrid.com/)

---

Pour plus d'informations, consultez `ADMIN_GUIDE.md` et `DEPLOIEMENT.md`.
