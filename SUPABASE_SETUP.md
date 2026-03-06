# Configuration Supabase pour le Système d'Inscription

## Pourquoi Supabase ?

Supabase remplace Netlify Blobs qui ne s'activait pas. Avantages :
- ✅ Base de données PostgreSQL fiable
- ✅ API REST automatique
- ✅ Tier gratuit généreux (500 Mo, 2 Go de bande passante)
- ✅ Pas de problème d'activation
- ✅ Interface d'administration simple

---

## Étape 1 : Créer un compte Supabase

1. Allez sur : https://supabase.com
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub (ou créez un compte)

---

## Étape 2 : Créer un nouveau projet

1. Cliquez sur "New Project"
2. **Nom du projet** : `ephi-inscriptions` (ou autre)
3. **Database Password** : Créez un mot de passe fort (notez-le !)
4. **Region** : Choisissez `West EU (Ireland)` (le plus proche de la France)
5. Cliquez sur "Create new project"
6. ⏳ Attendre 2-3 minutes que le projet se crée

---

## Étape 3 : Créer la table des inscriptions

### 3.1 Ouvrir l'éditeur SQL

1. Dans le menu de gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur "New query"

### 3.2 Copier-coller ce code SQL

```sql
-- Créer la table des inscriptions
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  event_date TEXT,
  event_location TEXT,
  organization_type TEXT,
  company_name TEXT,
  user_name TEXT,
  user_email TEXT,
  phone TEXT,
  companions INTEGER DEFAULT 0,
  lunch TEXT,
  message TEXT,
  ip_address TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer un index sur la date d'inscription pour des requêtes rapides
CREATE INDEX idx_registrations_date ON registrations(registered_at DESC);

-- Créer un index sur le salon
CREATE INDEX idx_registrations_salon ON registrations(event_date, event_location);
```

### 3.3 Exécuter le code

1. Cliquez sur **"Run"** (ou Ctrl+Enter)
2. Vous devriez voir : ✅ "Success. No rows returned"

---

## Étape 4 : Récupérer les clés API

### 4.1 Ouvrir les paramètres

1. Cliquez sur l'icône **⚙️ Settings** en bas à gauche
2. Cliquez sur **"API"** dans le menu

### 4.2 Copier les informations

Vous verrez deux informations importantes :

**1. Project URL**
```
https://abcdefghijklmnop.supabase.co
```
👆 Copiez cette URL

**2. Project API keys - anon public**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
👆 Copiez cette clé (la clé `anon` / `public`, PAS la clé `service_role` !)

---

## Étape 5 : Configurer les variables dans Netlify

### 5.1 Ouvrir Netlify

1. Allez sur https://app.netlify.com
2. Ouvrez votre site
3. Allez dans **"Site configuration"** > **"Environment variables"**

### 5.2 Ajouter les variables Supabase

Cliquez sur "Add a variable" et ajoutez :

**Variable 1 : SUPABASE_URL**
- Key : `SUPABASE_URL`
- Value : Votre Project URL (https://abcdefghijklmnop.supabase.co)

**Variable 2 : SUPABASE_KEY**
- Key : `SUPABASE_KEY`  
- Value : Votre clé anon/public (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...)

### 5.3 Variables existantes à garder

N'oubliez pas de garder aussi :
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SMTP_HOST` (optionnel pour emails)
- `SMTP_PORT` (optionnel)
- `SMTP_USER` (optionnel)
- `SMTP_PASS` (optionnel)

---

## Étape 6 : Redéployer le site

### Option A : Déploiement automatique (recommandé)
```bash
npm install
git add .
git commit -m "Migration vers Supabase"
git push
```
Netlify déploiera automatiquement.

### Option B : Déploiement manuel
1. Dans Netlify, allez dans "Deploys"
2. Cliquez sur "Trigger deploy" > "Deploy site"

---

## Étape 7 : Tester

### 7.1 Test d'inscription

1. Allez sur votre site
2. Cliquez sur un lien de salon
3. Remplissez le formulaire
4. Soumettez

### 7.2 Vérifier dans Supabase

1. Retournez sur Supabase
2. Cliquez sur **"Table Editor"** (menu gauche)
3. Sélectionnez la table `registrations`
4. Vous devriez voir votre inscription ! 🎉

### 7.3 Vérifier dans l'admin

1. Allez sur `https://votre-site.netlify.app/admin.html`
2. Connectez-vous avec vos identifiants
3. Vous devriez voir l'inscription dans le tableau

---

## Vérification de la configuration

### Variables d'environnement (Netlify)

Vous devez avoir ces 4 variables minimum :

| Variable | Exemple | Obligatoire |
|----------|---------|-------------|
| `SUPABASE_URL` | https://xxx.supabase.co | ✅ |
| `SUPABASE_KEY` | eyJhbGci... | ✅ |
| `ADMIN_USERNAME` | admin | ✅ |
| `ADMIN_PASSWORD` | votre_mdp | ✅ |

---

## Résolution de problèmes

### ❌ "Supabase not configured"

**Cause** : Les variables SUPABASE_URL ou SUPABASE_KEY ne sont pas définies

**Solution** :
1. Vérifiez dans Netlify > Site configuration > Environment variables
2. Assurez-vous que les noms sont exacts (pas d'espaces)
3. Redéployez après avoir ajouté les variables

### ❌ "Database error"

**Cause** : La table `registrations` n'existe pas ou les clés API sont incorrectes

**Solution** :
1. Vérifiez que vous avez bien exécuté le SQL de l'étape 3
2. Dans Supabase, allez dans Table Editor et vérifiez que la table existe
3. Vérifiez que vous avez copié la bonne clé (anon/public, pas service_role)

### ❌ "Invalid API key"

**Cause** : Vous avez peut-être copié la mauvaise clé

**Solution** :
1. Retournez dans Supabase > Settings > API
2. Copiez la clé sous "Project API keys" section "anon public"
3. Mettez à jour SUPABASE_KEY dans Netlify
4. Redéployez

---

## Accès aux données directement

Vous pouvez voir et gérer vos inscriptions directement dans Supabase :

1. Connectez-vous à https://supabase.com
2. Ouvrez votre projet
3. Cliquez sur "Table Editor"
4. Sélectionnez "registrations"

Vous pouvez :
- ✏️ Modifier des entrées
- 🗑️ Supprimer des entrées
- 📥 Exporter en CSV
- 🔍 Filtrer et rechercher

---

## Sécurité

### Clés utilisées

- ✅ **anon/public key** : Sécurisée pour le frontend, accès limité
- ❌ **service_role key** : NE JAMAIS utiliser côté client !

### Row Level Security (RLS)

Pour l'instant, RLS n'est pas activé car :
- L'admin est protégé par authentification Basic Auth
- Les inscriptions utilisent la clé anon (pas de suppression possible)

Si vous voulez activer RLS plus tard :
1. Allez dans Supabase > Authentication > Policies
2. Créez une policy pour la table `registrations`

---

## Coûts

**Tier gratuit Supabase** :
- ✅ 500 Mo de base de données (largement suffisant)
- ✅ 2 Go de bande passante
- ✅ 50 000 utilisateurs actifs par mois
- ✅ Projets illimités

Pour des inscriptions de salons, vous resterez dans le gratuit pendant des années.

---

## Support

- Documentation Supabase : https://supabase.com/docs
- Dashboard Supabase : https://app.supabase.com
- Status Supabase : https://status.supabase.com
