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
    // Pour Netlify Forms, on laisse la soumission native se faire
    // Le formulaire redirigera automatiquement vers la page de remerciement
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    // Pas de preventDefault() - laisse Netlify gérer la soumission naturellement
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

// Mapping des identifiants de salon vers leurs informations
const salonMap = {
    'saintjeandeluz-16avril': { date: '16 avril 2026', time: '9h - 15h', location: 'Saint Jean De Luz (64)' },
    'lagrandemotte-27mai': { date: '27 mai 2026', time: '9h - 15h', location: 'La Grande Motte (34)' },
    'idfsud-3juin': { date: '3 juin 2026', time: '9h - 15h', location: 'IDF sud (91)' },
    'idfnord-4juin': { date: '4 juin 2026', time: '9h - 15h', location: 'IDF nord (95)' },
    'lens-25juin': { date: '25 juin 2026', time: '9h - 15h', location: 'Lens - Stade Bollaert-Delelis (62)' },
    'lyon-8septembre': { date: '8 septembre 2026', time: '9h - 15h', location: 'Lyon (69)' },
    'aixenprovence-10septembre': { date: '10 septembre 2026', time: '9h - 15h', location: 'Aix-en-Provence (13)' },
    'metz-15octobre': { date: '15 octobre 2026', time: '9h - 15h', location: 'Metz (57)' },
    'toulouse-19novembre': { date: '19 novembre 2026', time: '9h - 15h', location: 'Toulouse (31)' },
    'saintmaximin-3decembre': { date: '3 décembre 2026', time: '9h - 15h', location: 'Saint-Maximin (60)' }
};

// Fonction pour ouvrir le modal avec les informations du salon
function openRegistrationModal(date, location, time = '9h - 15h') {
    // Remplir les champs cachés
    document.getElementById('event_date').value = date;
    document.getElementById('event_location').value = location;
    
    // Afficher l'information de l'événement dans le modal
    document.querySelector('.modal-event-info').textContent = `📅 ${date} • ⏰ ${time} • 📍 ${location}`;
    
    // Afficher le modal
    registrationModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animation d'apparition
    setTimeout(() => {
        registrationModal.querySelector('.modal-content').style.transform = 'scale(1)';
        registrationModal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

// Vérifier si un paramètre de salon est présent dans l'URL
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const salonId = urlParams.get('salon');
    
    if (salonId && salonMap[salonId]) {
        const salon = salonMap[salonId];
        // Ouvrir automatiquement le modal avec le salon sélectionné
        setTimeout(() => {
            openRegistrationModal(salon.date, salon.location, salon.time);
        }, 500); // Petit délai pour permettre le chargement de la page
    }
}

// Vérifier les paramètres URL au chargement de la page
window.addEventListener('DOMContentLoaded', checkUrlParams);

// ===== GESTION DES LIENS DIRECTS =====
// Fonctionnalité de copie des liens directs
const copyButtons = document.querySelectorAll('.btn-copy');

copyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const linkId = button.getAttribute('data-link-id');
        const linkInput = document.getElementById(linkId);
        
        // Sélectionner et copier le texte
        linkInput.select();
        linkInput.setSelectionRange(0, 99999); // Pour mobile
        
        // Copier dans le presse-papiers
        navigator.clipboard.writeText(linkInput.value).then(() => {
            // Feedback visuel
            const originalText = button.textContent;
            button.textContent = '✓ Copié !';
            button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Erreur lors de la copie:', err);
            alert('Impossible de copier automatiquement. Veuillez copier manuellement.');
        });
    });
});

// Ouvrir le modal lors du clic sur un bouton d'inscription
registerButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Ignorer les liens externes (comme celui de La Grande Motte)
        if (button.tagName === 'A' && button.href) {
            return; // Laisser le lien fonctionner normalement
        }
        
        const date = button.getAttribute('data-date');
        const location = button.getAttribute('data-location');
        openRegistrationModal(date, location);
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

    try {
        const response = await fetch('/.netlify/functions/inscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(registrationForm)).toString()
        });

        const result = await response.json();

        if (response.ok && result.success) {
            window.location.href = '/merci-inscription.html';
        } else {
            throw new Error(result.message || 'Erreur lors de l\'inscription');
        }
    } catch (error) {
        alert('Une erreur est survenue lors de votre inscription. Veuillez réessayer ou nous contacter à info@ephi.pro.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});
