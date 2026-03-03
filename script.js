// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Form submission handler with PHP backend
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    // Préparer les données du formulaire
    const formData = new FormData(contactForm);
    
    try {
        // Envoyer les données au script PHP
        const response = await fetch('contact.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Succès - afficher le message de confirmation
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
            successMessage.textContent = result.message || 'Merci pour votre message ! Nous vous contacterons bientôt.';
            
            // Remplacer le formulaire par le message de succès
            contactForm.style.display = 'none';
            contactForm.parentElement.appendChild(successMessage);
            
            // Réinitialiser après 3 secondes
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                successMessage.remove();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        } else {
            // Erreur - afficher le message d'erreur
            throw new Error(result.message || 'Une erreur s\'est produite');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        
        // Créer le message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            background: #ef4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            text-align: center;
            margin-top: 1rem;
            animation: fadeInUp 0.5s ease;
        `;
        errorMessage.textContent = error.message || 'Une erreur s\'est produite. Veuillez réessayer.';
        
        contactForm.parentElement.appendChild(errorMessage);
        
        setTimeout(() => {
            errorMessage.remove();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.card, .partner-card, .calendar-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter animation for stats (if needed in future)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Add active state to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.style.color = '';
            });
            if (navLink) {
                navLink.style.color = 'var(--primary-color)';
            }
        }
    });
});

console.log('EPHI 2026 - Site chargé avec succès! 🚀');

// ===== GESTION DU MODAL D'INSCRIPTION =====
const registrationModal = document.getElementById('registrationModal');
const registrationForm = document.getElementById('registrationForm');
const modalClose = document.querySelector('.modal-close');
const registerButtons = document.querySelectorAll('.btn-register');

// Ouvrir le modal lors du clic sur un bouton d'inscription
registerButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const date = button.getAttribute('data-date');
        const location = button.getAttribute('data-location');
        
        // Remplir les champs cachés
        document.getElementById('event_date').value = date;
        document.getElementById('event_location').value = location;
        
        // Afficher l'information de l'événement dans le modal
        document.querySelector('.modal-event-info').textContent = `📅 ${date} - 📍 ${location}`;
        
        // Afficher le modal
        registrationModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Empêcher le scroll
        
        // Animation d'apparition
        setTimeout(() => {
            registrationModal.querySelector('.modal-content').style.transform = 'scale(1)';
            registrationModal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    });
});

// Fermer le modal
function closeModal() {
    registrationModal.querySelector('.modal-content').style.transform = 'scale(0.7)';
    registrationModal.querySelector('.modal-content').style.opacity = '0';
    setTimeout(() => {
        registrationModal.style.display = 'none';
        document.body.style.overflow = ''; // Réactiver le scroll
        registrationForm.reset();
    }, 300);
}

// Fermer avec le bouton X
modalClose.addEventListener('click', closeModal);

// Fermer en cliquant en dehors du modal
registrationModal.addEventListener('click', (e) => {
    if (e.target === registrationModal) {
        closeModal();
    }
});

// Fermer avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && registrationModal.style.display === 'block') {
        closeModal();
    }
});

// Gérer la soumission du formulaire d'inscription
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = registrationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Inscription en cours...';
    submitBtn.disabled = true;
    
    // Préparer les données du formulaire
    const formData = new FormData(registrationForm);
    
    try {
        // Envoyer les données au script PHP
        const response = await fetch('registration.php', {
            method: 'POST',
            body: formData
        });
        
        // Vérifier si la réponse est OK
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        // Obtenir le texte de la réponse
        const responseText = await response.text();
        
        // Vérifier si c'est du JSON valide
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            console.error('Réponse reçue:', responseText);
            throw new Error('Le serveur n\'a pas renvoyé une réponse valide. Veuillez vérifier que PHP est correctement configuré.');
        }
        
        if (result.success) {
            // Succès - afficher le message de confirmation
            const successMessage = document.createElement('div');
            successMessage.style.cssText = `
                background: #10b981;
                color: white;
                padding: 1.5rem 2rem;
                border-radius: 8px;
                text-align: center;
                margin-top: 1rem;
                animation: fadeInUp 0.5s ease;
            `;
            successMessage.innerHTML = `
                <h3 style="margin: 0 0 10px 0;">✅ Inscription réussie !</h3>
                <p style="margin: 0;">${result.message}</p>
            `;
            
            // Masquer le formulaire et afficher le message
            registrationForm.style.display = 'none';
            registrationForm.parentElement.appendChild(successMessage);
            
            // Fermer le modal après 3 secondes
            setTimeout(() => {
                closeModal();
                registrationForm.style.display = 'block';
                successMessage.remove();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        } else {
            // Erreur - afficher le message d'erreur
            throw new Error(result.message || 'Une erreur s\'est produite');
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        
        // Créer le message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            background: #ef4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            text-align: center;
            margin-top: 1rem;
            animation: fadeInUp 0.5s ease;
        `;
        errorMessage.textContent = error.message || 'Une erreur s\'est produite. Veuillez réessayer.';
        
        registrationForm.parentElement.appendChild(errorMessage);
        
        setTimeout(() => {
            errorMessage.remove();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }
});
