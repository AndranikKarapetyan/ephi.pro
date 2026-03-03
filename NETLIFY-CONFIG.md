# Configuration Netlify - EPHI 2026

## 🚀 Le site est maintenant compatible avec Netlify !

Les formulaires utilisent **Netlify Forms** avec soumission native pour une compatibilité maximale.

## ✅ Ce qui a été fait

1. ✅ Conversion du formulaire d'inscription pour Netlify Forms
2. ✅ Conversion du formulaire de contact pour Netlify Forms
3. ✅ Création du fichier `netlify.toml` de configuration
4. ✅ Protection anti-spam (honeypot) ajoutée
5. ✅ Pages de remerciement créées
   - `merci-inscription.html` (après inscription)
   - `merci-contact.html` (après contact)
6. ✅ Méthode POST native (pas de fetch JavaScript)

## 📋 Configuration dans Netlify

### 1. Déployer sur Netlify

Le site est déjà déployé via GitHub. Après chaque push, Netlify redéploiera automatiquement.

**IMPORTANT** : Après le premier déploiement, Netlify détectera automatiquement les formulaires :
- `inscription-salon`
- `contact`

### 2. Configurer les notifications par email

1. Allez dans votre dashboard Netlify
2. Cliquez sur votre site
3. Allez dans **Site settings** → **Forms** → **Form notifications**
4. Cliquez sur **Add notification**
5. Choisissez **Email notification**
6. Sélectionnez les formulaires :
   - `inscription-salon` (inscriptions aux salons)
   - `contact` (formulaire de contact)
7. Entrez l'email de destination : **info@maxiavenue.com**

### 3. Voir les soumissions

Toutes les soumissions de formulaires sont disponibles dans :
**Dashboard Netlify** → **Forms** → Sélectionnez le formulaire

Vous pouvez :
- Voir toutes les inscriptions
- Exporter en CSV
- Configurer des webhooks
- Intégrer avec Zapier, Slack, etc.

## 📄 Pages de remerciement

Après soumission, les utilisateurs sont redirigés vers :
- `/merci-inscription.html` après inscription au salon
- `/merci-contact.html` après envoi d'un message

Ces pages offrent une meilleure expérience utilisateur.

## 📧 Emails personnalisés (optionnel)

Par défaut, Netlify envoie des emails de notification simples. Pour des emails HTML personnalisés, vous pouvez :

1. Utiliser les **Netlify Functions** (serverless)
2. Intégrer avec **SendGrid**, **Mailgun**, ou **AWS SES**
3. Utiliser **Zapier** pour créer des workflows personnalisés

## 🆓 Limite gratuite Netlify

- 100 soumissions de formulaire par mois (gratuit)
- Au-delà : 19$/mois pour 1000 soumissions

## ⚠️ Important pour le test

Netlify Forms nécessite que le site soit déployé sur Netlify pour fonctionner. En local, les formulaires ne marcheront pas correctement.

Pour tester les formulaires :
1. Commitez et pushez sur GitHub
2. Attendez le déploiement Netlify
3. Testez sur l'URL Netlify (pas en local)

## 🗑️ Fichiers PHP (obsolètes)

Les fichiers suivants ne sont plus nécessaires et peuvent être supprimés :
- `registration.php`
- `contact.php`
- `test-registration.php`
- `start-server.sh`

Ils sont conservés pour référence mais ne sont pas utilisés sur Netlify.

## 🌐 URL du site

Votre site est accessible à l'adresse Netlify attribuée lors du déploiement.

## ✨ Prochaines étapes

1. ✅ Pusher les changements sur GitHub : `git push origin main`
2. ✅ Netlify redéploie automatiquement
3. ⏳ Configurer les notifications email dans le dashboard Netlify
4. ⏳ Tester une inscription sur le site déployé

---

## 🔧 Troubleshooting

**Formulaires retournent 404**
- Assurez-vous que le site est déployé sur Netlify (pas en local)
- Vérifiez que les attributs `data-netlify="true"` et `name="..."` sont présents

**Les formulaires n'apparaissent pas dans le dashboard**
- Netlify détecte les formulaires au moment du build
- Redéployez le site si nécessaire
- Les formulaires doivent être dans le HTML statique (pas générés dynamiquement)

## Support

Pour toute question : info@ephi.pro
