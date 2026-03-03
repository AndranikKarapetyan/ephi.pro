# EPHI 2026 - Guide de dépannage

## Problème d'inscription (Erreur JSON)

Si vous obtenez l'erreur "JSON.parse: unexpected character at line 1 column 1", cela signifie que PHP n'est pas correctement configuré sur votre serveur.

### Solutions possibles:

### 1. Tester si PHP fonctionne

Ouvrez dans votre navigateur: `http://votre-domaine.com/test-registration.php`

Si vous voyez du code PHP au lieu d'un message JSON, PHP n'est PAS configuré.

### 2. Solutions selon votre environnement:

#### Si vous utilisez un serveur local:

**Avec XAMPP/WAMP/MAMP:**
- Assurez-vous que Apache et PHP sont démarrés
- Placez les fichiers dans le dossier `htdocs` (XAMPP) ou `www` (WAMP)
- Accédez via `http://localhost/ephi/`

**Avec PHP intégré:**
```bash
cd /home/andranik/freelance/ephi
php -S localhost:8000
```
Puis accédez à `http://localhost:8000`

#### Si vous êtes sur un serveur en production:

1. Vérifiez que PHP est installé sur le serveur
2. Vérifiez que l'extension `.php` est bien associée à PHP
3. Vérifiez les permissions des fichiers PHP (644 recommandé)
4. Contactez votre hébergeur si PHP n'est pas disponible

### 3. Vérifier la fonction mail()

Si PHP fonctionne mais les emails ne partent pas:
- Sur serveur local, configurez un service SMTP
- Sur serveur production, vérifiez que `mail()` est activé
- Alternative: utilisez PHPMailer ou un service comme SendGrid

### 4. Vérifier les erreurs PHP

Ouvrez la console du navigateur (F12) et vérifiez l'onglet "Network" pour voir la réponse exacte du serveur.

### Support

Pour plus d'aide, contactez: info@ephi.pro
