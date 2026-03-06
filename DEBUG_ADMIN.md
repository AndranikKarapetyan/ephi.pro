# 🔍 Dépannage - Problème de Connexion Admin

## ✅ RÉSOLU : Authentification fonctionne

D'après vos logs, l'authentification fonctionne maintenant ! 🎉

Le nouveau problème est : **Netlify Blobs n'est pas configuré**

## 🔧 Activer Netlify Blobs

### Erreur actuelle :
```
MissingBlobsEnvironmentError: The environment has not been configured to use Netlify Blobs
```

### Solution : Activer Netlify Blobs dans votre site

#### Méthode 1 : Via le Dashboard Netlify (Recommandé)

1. Allez sur votre **Netlify Dashboard**
2. Sélectionnez votre site `ephi.pro`
3. Allez dans **Site Configuration** (ou **Site Settings**)
4. Dans le menu de gauche, cherchez **Blobs** ou **Add-ons**
5. Cliquez sur **Enable Blobs** (Activer Blobs)
6. Plan gratuit : 100 MB inclus ✅

#### Méthode 2 : Via netlify.toml (Alternative)

Si l'option n'apparaît pas dans le dashboard, ajoutez dans votre `netlify.toml` :

```toml
[build]
  publish = "."

[build.environment]
  NODE_VERSION = "18"

# Activer Netlify Blobs
[[plugins]]
  package = "@netlify/plugin-blobs"
```

Mais normalement, Blobs devrait être disponible automatiquement si vous utilisez `@netlify/blobs` dans vos functions.

#### Méthode 3 : Forcer l'activation

Parfois, il faut juste **redéployer complètement** :

1. Dans Netlify Dashboard : **Site Settings > Build & deploy**
2. Cliquez sur **Clear build cache**
3. Puis : **Deploys > Trigger deploy > Clear cache and deploy site**

### Vérification

Après activation, attendez le redéploiement (1-2 min) et :

1. Allez sur `/admin`
2. Connectez-vous avec vos identifiants
3. Si ça fonctionne : vous verrez le dashboard (même vide au début)
4. Si erreur : consultez à nouveau les logs Functions

### En attendant : Les inscriptions fonctionnent quand même

**Important** : Même si Blobs n'est pas activé, les inscriptions continuent de fonctionner !
- ✅ Les emails sont envoyés
- ✅ Les participants reçoivent leur confirmation
- ❌ Les données ne sont juste pas sauvegardées dans le dashboard admin

Une fois Blobs activé, les nouvelles inscriptions apparaîtront automatiquement.

---

## Problème : "Identifiants incorrects" (résolu)

### Étape 1 : Vérifier les variables d'environnement

Accédez à cette URL pour tester vos variables :
```
https://votre-site.com/.netlify/functions/test-env
```

Cette page vous montrera :
- ✅ Si les variables sont bien chargées
- 📏 La longueur de votre mot de passe
- 👤 Le nom d'utilisateur configuré

### Étape 2 : Vérifier dans Netlify

1. Allez dans **Site Settings > Environment Variables**
2. Vérifiez que vous avez bien :
   - `ADMIN_USERNAME` (ex: `admin`)
   - `ADMIN_PASSWORD` (votre mot de passe)

#### ⚠️ Erreurs courantes :

**Espaces invisibles :**
- ❌ `ADMIN_PASSWORD = " monmotdepasse "` (avec espaces)
- ✅ `ADMIN_PASSWORD = monmotdepasse` (sans espaces)

**Scope incorrect :**
- Assurez-vous que les variables sont définies pour **"All scopes"** ou **"Same value for all deploy contexts"**

**Variables en double :**
- Vérifiez qu'il n'y a pas deux variables avec le même nom

### Étape 3 : Valeurs par défaut

Si vous n'avez PAS configuré les variables dans Netlify, utilisez :
- **Username :** `admin`
- **Password :** `ephi2026`

### Étape 4 : Redéploiement complet

Parfois, les variables ne sont pas prises en compte. Forcez un redéploiement :

1. **Dans Netlify Dashboard :**
   - Allez dans **Deploys**
   - Cliquez sur **Trigger deploy** 
   - Sélectionnez **Clear cache and deploy site**

2. **Ou via Git :**
   ```bash
   git commit --allow-empty -m "Force redeploy"
   git push origin main
   ```

### Étape 5 : Consulter les logs

1. Allez dans **Netlify Dashboard > Functions**
2. Cliquez sur `admin-data`
3. Regardez les **Recent logs**

Vous verrez des messages comme :
```
Admin config loaded - Username: admin | Password length: 8
Login attempt - Username: admin
Invalid credentials - Expected: admin | Received: admin
```

Cela vous indiquera exactement quel est le problème.

### Étape 6 : Test avec identifiants par défaut

Essayez de vous connecter avec :
- Username: `admin`
- Password: `ephi2026`

**Si ça fonctionne** → Les variables d'environnement ne sont pas prises en compte
**Si ça ne fonctionne pas** → Il y a un autre problème

### Étape 7 : Vérifier la casse

JavaScript est sensible à la casse :
- ❌ `ADMIN_username` (incorrect)
- ✅ `ADMIN_USERNAME` (correct)

### Étape 8 : Caractères spéciaux

Si votre mot de passe contient des caractères spéciaux, essayez temporairement un mot de passe simple :
- Utilisez uniquement lettres et chiffres
- Pas d'espaces, pas de guillemets
- Exemple : `monMotDePasse2026`

## Solutions rapides

### Solution 1 : Réinitialiser avec les valeurs par défaut

1. **Supprimez** les variables `ADMIN_USERNAME` et `ADMIN_PASSWORD` dans Netlify
2. **Redéployez** le site
3. **Connectez-vous** avec `admin` / `ephi2026`
4. Une fois que ça fonctionne, remettez vos propres valeurs

### Solution 2 : Vérifier le format

Dans Netlify, quand vous ajoutez une variable :
- **Key (Clé)** : `ADMIN_PASSWORD` (exactement comme ça, pas de guillemets)
- **Value (Valeur)** : `votremotdepasse` (sans guillemets, sans espaces avant/après)
- **Scopes** : Cochez "All scopes" ou "Same value for all deploy contexts"

### Solution 3 : Utiliser la console du navigateur

1. Ouvrez la console (F12) avant de vous connecter
2. Essayez de vous connecter
3. Regardez les erreurs dans la console
4. Si vous voyez une erreur 401, cliquez dessus pour voir le détail

## Commandes utiles

### Voir les logs Functions en temps réel

```bash
# Installer Netlify CLI si pas déjà fait
npm install -g netlify-cli

# Se connecter
netlify login

# Voir les logs
netlify functions:log admin-data
```

### Tester en local

```bash
# Installer les dépendances
npm install

# Créer un fichier .env avec vos variables
echo "ADMIN_USERNAME=admin" > .env
echo "ADMIN_PASSWORD=test123" >> .env

# Lancer Netlify Dev
netlify dev

# Tester sur http://localhost:8888/admin
```

## Contact

Si le problème persiste après toutes ces étapes :
1. Notez le message d'erreur exact
2. Consultez les logs des Functions
3. Vérifiez l'URL de test-env
4. Contactez le support ou envoyez les détails

---

**Fichiers modifiés pour le débogage :**
- `netlify/functions/admin-data.js` - Ajout de logs détaillés
- `netlify/functions/test-env.js` - Nouvelle fonction de test

**N'oubliez pas de redéployer après avoir fait les modifications !**
