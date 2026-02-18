# Configuration du Service d'Email - EPHI 2026

Le formulaire de contact est maintenant configuré pour envoyer les emails à **info@maxiavenue.com** via PHP.

## ✅ Configuration PHP (Méthode actuelle - Recommandée)

Le site utilise maintenant un script PHP (`contact.php`) pour envoyer les emails directement.

### Fonctionnalités

- ✉️ Envoi automatique à **info@maxiavenue.com**
- ✅ Email de confirmation automatique à l'utilisateur
- 🎨 Emails en HTML avec mise en forme professionnelle
- 🔒 Validation des données côté serveur
- 📱 Responsive et compatible tous navigateurs

### Déploiement

1. **Hébergement requis**: Un serveur web avec PHP (Apache, Nginx, etc.)
   - Hébergement mutualisé (OVH, o2switch, Ionos, etc.)
   - Serveur VPS
   - Hébergement cloud (AWS, DigitalOcean, etc.)

2. **Uploadez tous les fichiers** sur votre serveur via FTP/SFTP :
   ```
   index.html
   style.css
   script.js
   contact.php
   images/ (dossier complet)
   ```

3. **Vérifiez la configuration PHP** :
   - PHP 7.0 ou supérieur
   - La fonction `mail()` doit être activée
   - Vérifiez avec votre hébergeur si besoin

### Test en local avec XAMPP / MAMP / WAMP

Pour tester localement :

1. **Installez XAMPP** (Windows/Linux) ou **MAMP** (Mac)
2. **Copiez les fichiers** dans le dossier `htdocs` (XAMPP) ou `www` (MAMP)
3. **Démarrez Apache**
4. **Accédez** à `http://localhost/ephi/index.html`

**Note**: En local, les emails ne seront pas réellement envoyés sans configuration SMTP.

### Configuration SMTP (Optionnel - Pour production)

Pour un envoi d'emails plus fiable, utilisez PHPMailer avec SMTP :

1. Téléchargez PHPMailer : `composer require phpmailer/phpmailer`

2. Modifiez `contact.php` pour utiliser PHPMailer avec vos identifiants SMTP

### Personnalisation

Dans `contact.php`, vous pouvez modifier :
- **Ligne 47** : L'adresse email de destination (`$to`)
- **Ligne 50** : Le sujet de l'email
- **Ligne 54-120** : Le template HTML de l'email
- **Ligne 150-200** : L'email de confirmation automatique

---

## 📋 Ancienne méthode - EmailJS (Non utilisée)

### Étapes de Configuration avec EmailJS

### 1. Créer un compte EmailJS (Gratuit)

1. Allez sur [https://www.emailjs.com](https://www.emailjs.com)
2. Cliquez sur "Sign Up" et créez un compte gratuit
3. Confirmez votre email

### 2. Connecter votre service d'email

1. Dans le dashboard EmailJS, allez dans **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez votre fournisseur d'email (Gmail, Outlook, etc.)
4. Configurez le service pour utiliser **info@maxiavenue.com** comme adresse d'envoi
5. Notez le **Service ID** qui sera généré (par exemple: `service_abc123`)

### 3. Créer un template d'email

1. Allez dans **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. Configurez le template avec les champs suivants :
   - **To Email**: `info@maxiavenue.com`
   - **From Name**: `{{user_name}}`
   - **Subject**: `Nouveau message de contact EPHI 2026 - {{company_name}}`
   - **Content (corps de l'email)** :
   ```
   Nouvelle demande de contact depuis le site EPHI 2026

   Entreprise: {{company_name}}
   Nom: {{user_name}}
   Email: {{user_email}}
   Téléphone: {{phone}}

   Message:
   {{message}}
   ```
4. Notez le **Template ID** (par exemple: `template_xyz789`)

### 4. Récupérer votre clé publique

1. Allez dans **"Account"** > **"General"**
2. Copiez votre **Public Key** (par exemple: `abcdefg1234567`)

### 5. Mettre à jour le code

Dans le fichier `script.js`, remplacez les valeurs suivantes :

```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Ligne 60
```
Remplacez `YOUR_PUBLIC_KEY` par votre clé publique.

```javascript
emailjs.sendForm(
    'YOUR_SERVICE_ID',  // Ligne 71
    'YOUR_TEMPLATE_ID', // Ligne 72
    contactForm
)
```
Remplacez :
- `YOUR_SERVICE_ID` par votre Service ID
- `YOUR_TEMPLATE_ID` par votre Template ID

### Exemple de configuration finale :

```javascript
// EmailJS initialization
(function() {
    emailjs.init('abcdefg1234567'); // Votre clé publique
})();

// Dans la fonction sendForm :
emailjs.sendForm(
    'service_abc123',  // Votre Service ID
    'template_xyz789', // Votre Template ID
    contactForm
)
```

## Alternative : Formspree (Plus simple)

Si vous préférez une solution encore plus simple :

1. Allez sur [https://formspree.io](https://formspree.io)
2. Créez un compte gratuit
3. Créez un nouveau formulaire
4. Notez l'URL du formulaire (par exemple: `https://formspree.io/f/abc123`)

Puis dans `script.js`, remplacez le code EmailJS par :

```javascript
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Afficher message de succès
            const successMessage = document.createElement('div');
            successMessage.style.cssText = `
                background: #10b981;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                text-align: center;
                margin-top: 1rem;
                animation: fadeInUp 0.5s ease;
            `;
            successMessage.textContent = 'Merci pour votre message ! Nous vous contacterons bientôt.';
            
            contactForm.style.display = 'none';
            contactForm.parentElement.appendChild(successMessage);
            
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                successMessage.remove();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    } catch (error) {
        console.error('Erreur:', error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});
```

Dans les paramètres de Formspree, configurez l'email de réception sur **info@maxiavenue.com**.

## Test

Après configuration, testez le formulaire en :
1. Ouvrant `index.html` dans votre navigateur
2. Remplissant tous les champs du formulaire
3. Cliquant sur "Envoyer"
4. Vérifiant la réception de l'email à info@maxiavenue.com

## Notes

- Le plan gratuit d'EmailJS permet 200 emails/mois
- Le plan gratuit de Formspree permet 50 soumissions/mois
- Pour un usage professionnel intensif, envisagez un plan payant ou un backend personnalisé
