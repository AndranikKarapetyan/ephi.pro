# EPHI 2026 - Site Web

Site web pour le salon EPHI 2026, événement de référence pour les équipements et solutions des collectivités.

## 📁 Structure du Projet

```
ephi/
├── index.html              # Page principale
├── style.css              # Styles CSS
├── script.js              # JavaScript (interactions)
├── contact.php            # Script d'envoi d'email
├── .htaccess             # Configuration Apache
├── images/               # Images et logos
└── CONFIGURATION_EMAIL.md # Documentation email
```

## 🚀 Déploiement

### Prérequis
- Serveur web avec PHP 7.0+
- Fonction `mail()` activée
- Apache (recommandé) ou Nginx

### Installation

1. **Uploadez les fichiers** sur votre serveur via FTP/SFTP :
   - Tous les fichiers HTML, CSS, JS, PHP
   - Le dossier `images/` complet
   - Le fichier `.htaccess`

2. **Vérifiez les permissions** :
   ```bash
   chmod 644 index.html style.css script.js
   chmod 755 contact.php
   chmod 755 images/
   ```

3. **Testez le formulaire** :
   - Ouvrez le site dans votre navigateur
   - Remplissez le formulaire de contact
   - Vérifiez la réception à info@maxiavenue.com

## 🧪 Test en Local

### Avec XAMPP (Windows/Linux)

1. Installez [XAMPP](https://www.apachefriends.org/)
2. Copiez les fichiers dans `C:\xampp\htdocs\ephi\`
3. Démarrez Apache depuis le panneau de contrôle XAMPP
4. Accédez à `http://localhost/ephi/`

### Avec MAMP (Mac)

1. Installez [MAMP](https://www.mamp.info/)
2. Copiez les fichiers dans `/Applications/MAMP/htdocs/ephi/`
3. Démarrez les serveurs
4. Accédez à `http://localhost:8888/ephi/`

**Note** : En local, configurez SMTP pour tester l'envoi d'emails réels.

## ✉️ Configuration Email

Le formulaire envoie automatiquement les messages à **info@maxiavenue.com**.

### Fonctionnalités :
- ✅ Email formaté en HTML professionnel
- ✅ Confirmation automatique à l'expéditeur
- ✅ Validation des données
- ✅ Messages d'erreur et de succès

Pour plus de détails, consultez [CONFIGURATION_EMAIL.md](CONFIGURATION_EMAIL.md)

## 🎨 Personnalisation

### Modifier les couleurs
Éditez les variables CSS dans [style.css](style.css) :
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... */
}
```

### Modifier le contenu
Éditez directement [index.html](index.html)

### Modifier l'email de destination
Dans [contact.php](contact.php), ligne 47 :
```php
$to = 'info@maxiavenue.com';
```

## 🔧 Hébergeurs Recommandés

- **o2switch** : Hébergement français illimité (~5€/mois)
- **OVH** : Solutions variées à partir de 3€/mois
- **Ionos** : Hébergement économique
- **DigitalOcean** : VPS pour plus de contrôle

## 📱 Compatibilité

- ✅ Responsive (mobile, tablette, desktop)
- ✅ Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- ✅ Optimisé SEO
- ✅ Performance optimale

## 🐛 Dépannage

### Les emails ne sont pas reçus

1. Vérifiez que `mail()` est activé sur votre serveur
2. Consultez les logs PHP : `/var/log/php_errors.log`
3. Vérifiez le dossier spam de info@maxiavenue.com
4. Contactez votre hébergeur pour activer l'envoi d'emails

### Erreur 500 sur contact.php

1. Vérifiez les permissions du fichier (`chmod 755`)
2. Vérifiez la syntaxe PHP
3. Consultez les logs d'erreur Apache

### Le formulaire ne s'affiche pas correctement

1. Vérifiez que tous les fichiers CSS/JS sont bien uploadés
2. Videz le cache du navigateur (Ctrl+F5)
3. Vérifiez la console du navigateur (F12)

## 📞 Support

Pour toute question, contactez : info@maxiavenue.com

## 📄 Licence

© 2026 EPHI - Tous droits réservés
