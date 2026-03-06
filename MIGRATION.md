# 🔄 Migration : Netlify Blobs → Supabase

## Pourquoi cette migration ?

Netlify Blobs refusait de s'activer malgré plusieurs tentatives :
```
MissingBlobsEnvironmentError: The environment has not been configured to use Netlify Blobs
```

**Solution** : Migration vers Supabase (PostgreSQL), plus fiable et tout aussi simple.

---

## ✅ Ce qui a été modifié

### 1. Dépendances (`package.json`)

**Avant** :
```json
"@netlify/blobs": "^7.0.0"
```

**Après** :
```json
"@supabase/supabase-js": "^2.39.0"
```

### 2. Fonction d'inscription (`netlify/functions/inscription.js`)

**Avant** (Netlify Blobs) :
```javascript
const { getStore } = require('@netlify/blobs');
const store = getStore('registrations');
await store.setJSON('all', registrations);
```

**Après** (Supabase) :
```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
await supabase.from('registrations').insert([registration]);
```

### 3. Fonction admin (`netlify/functions/admin-data.js`)

**Avant** (Netlify Blobs) :
```javascript
const store = getStore('registrations');
const data = await store.get('all', { type: 'json' });
```

**Après** (Supabase) :
```javascript
const { data } = await supabase
  .from('registrations')
  .select('*')
  .order('registered_at', { ascending: false });
```

### 4. Variables d'environnement

**Nouvelles variables obligatoires** :
- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_KEY` : Clé API publique (anon key)

**Variables existantes conservées** :
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SMTP_*` (optionnelles)

---

## 🎯 Prochaines étapes

### Étape 1 : Configuration Supabase (10 minutes)

**Action** : Suivez le guide complet **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

Résumé rapide :
1. Créez un compte sur https://supabase.com
2. Créez un nouveau projet (région : West EU - Ireland)
3. Créez la table `registrations` avec le SQL fourni
4. Récupérez votre URL et clé API

### Étape 2 : Ajouter les variables dans Netlify

1. Allez sur https://app.netlify.com
2. Ouvrez votre site
3. Allez dans **Site configuration** > **Environment variables**
4. Ajoutez :
   - `SUPABASE_URL` = votre URL Supabase
   - `SUPABASE_KEY` = votre clé anon/public

### Étape 3 : Installer et déployer

```bash
# Installer les nouvelles dépendances
npm install

# Commiter et pousser
git add .
git commit -m "Migration vers Supabase"
git push
```

Netlify redéploiera automatiquement en ~2 minutes.

### Étape 4 : Tester

1. **Test d'inscription** :
   - Allez sur votre site
   - Cliquez sur un lien de salon
   - Remplissez et soumettez le formulaire

2. **Vérification Supabase** :
   - Allez sur https://app.supabase.com
   - Ouvrez votre projet
   - Cliquez sur "Table Editor" > "registrations"
   - Votre inscription devrait apparaître ! 🎉

3. **Test du dashboard admin** :
   - Allez sur `https://votre-site.netlify.app/admin.html`
   - Connectez-vous avec vos identifiants
   - Vous devriez voir l'inscription

---

## 📊 Comparaison

| Caractéristique | Netlify Blobs | Supabase |
|-----------------|---------------|----------|
| **Activation** | ❌ Échoue mystérieusement | ✅ Immédiate |
| **Type de données** | Blob storage (JSON) | PostgreSQL |
| **Interface admin** | Aucune | ✅ Dashboard complet |
| **Requêtes** | Pas de requêtes complexes | ✅ SQL complet |
| **Prix gratuit** | 1 Go | 500 Mo (suffisant) |
| **Export CSV** | Non natif | ✅ Intégré |
| **Filtering** | Manuel en JS | ✅ SQL natif |
| **Backups** | ? | ✅ Automatiques |

**Verdict** : Supabase est clairement supérieur pour ce cas d'usage.

---

## 🔧 Code modifié

### Fichiers modifiés :
- ✏️ `package.json` - Dépendance remplacée
- ✏️ `netlify/functions/inscription.js` - Sauvegarde via Supabase
- ✏️ `netlify/functions/admin-data.js` - Récupération via Supabase
- ✏️ `.env.example` - Ajout variables Supabase

### Fichiers créés :
- ✨ `SUPABASE_SETUP.md` - Guide de configuration
- ✨ `README.md` - Documentation générale
- ✨ `MIGRATION.md` - Ce fichier

### Fichiers inchangés :
- ✅ `index.html` - Aucune modification nécessaire
- ✅ `admin.html` - Aucune modification nécessaire
- ✅ `script.js` - Aucune modification nécessaire
- ✅ `style.css` - Aucune modification nécessaire

---

## ⚠️ Points d'attention

### Données existantes

Si vous aviez des inscriptions dans Netlify Blobs (peu probable vu qu'il ne s'activait pas) :
- ❌ Elles ne seront PAS migrées automatiquement
- ➡️ Elles n'étaient probablement pas sauvegardées vu l'erreur

### Compatibilité

- ✅ Toutes les fonctionnalités sont conservées
- ✅ L'interface admin reste identique
- ✅ Les liens de salons fonctionnent pareil
- ✅ L'authentification reste la même

### Performance

- ⚡ Supabase est probablement **plus rapide** que Blobs
- ⚡ Requêtes SQL optimisées avec index
- ⚡ CDN mondial pour l'API

---

## 🎓 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide complet : SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- [Variables d'environnement : VARIABLES_ENV.md](VARIABLES_ENV.md)
- [Dashboard Supabase](https://app.supabase.com)

---

## ✅ Checklist de migration

- [ ] Compte Supabase créé
- [ ] Projet Supabase créé
- [ ] Table `registrations` créée (SQL exécuté)
- [ ] `SUPABASE_URL` récupérée
- [ ] `SUPABASE_KEY` récupérée (anon/public)
- [ ] Variables ajoutées dans Netlify
- [ ] `npm install` exécuté
- [ ] Code commité et pushé
- [ ] Site redéployé sur Netlify
- [ ] Test d'inscription effectué
- [ ] Inscription visible dans Supabase Table Editor
- [ ] Test du dashboard admin effectué
- [ ] Export CSV testé

Une fois tous les points cochés, la migration est complète ! 🚀
