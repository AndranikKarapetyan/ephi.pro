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
    'saintjeandeluz-16avril': { date: '16 avril 2026', time: '9h - 15h', location: 'Saint Jean De Luz (64)', invitation: 'images/Invitation%20Ephi%202026%20St%20Jean%20De%20Luz%20(1)_page-0001.jpg' },
    'lagrandemotte-27mai': { date: '27 mai 2026', time: '9h - 15h', location: 'La Grande Motte (34)' },
    'idfsud-3juin': { date: '3 juin 2026', time: '9h - 15h', location: 'Lieusaint (77)', invitation: 'images/Invitation%20Ephi%202026%20IDF%20Sud%20Lieusaint%20(91).jpg' },
    'idfnord-4juin': { date: '4 juin 2026', time: '9h - 15h', location: 'IDF nord (95)', invitation: 'images/Invitation%20Ephi%202026%20IDF%20Nord%20Enghien%20(95)%20(6).jpg' },
    'lens-25juin': { date: '25 juin 2026', time: '9h - 15h', location: 'Lens - Stade Bollaert-Delelis (62)' },
    'lyon-8septembre': { date: '8 septembre 2026', time: '9h - 15h', location: 'Lyon (69)' },
    'aixenprovence-10septembre': { date: '10 septembre 2026', time: '9h - 15h', location: 'Aix-en-Provence (13)', invitation: 'images/Invitation Ephi 2026 AIX .jpg' },
    'metz-15octobre': { date: '15 octobre 2026', time: '9h - 15h', location: 'Metz (57)' },
    'toulouse-19novembre': { date: '19 novembre 2026', time: '9h - 15h', location: 'Toulouse (31)' },
    'saintmaximin-3decembre': { date: '3 décembre 2026', time: '9h - 15h', location: 'Saint-Maximin (60)' }
};

// Fonction pour ouvrir le modal avec les informations du salon
function openRegistrationModal(date, location, time = '9h - 15h', invitationImage = null, shareLink = null) {
    // Remplir les champs cachés
    document.getElementById('event_date').value = date;
    document.getElementById('event_location').value = location;
    
    // Afficher l'information de l'événement dans le modal
    document.querySelector('.modal-event-info').textContent = `📅 ${date} • ⏰ ${time} • 📍 ${location}`;

    // Gérer l'affichage de l'invitation
    const invitationEl = document.getElementById('modal-invitation');
    if (invitationEl && invitationImage) {
        const invitationImg = invitationEl.querySelector('.modal-invitation-img');
        invitationImg.src = invitationImage;
        invitationImg.alt = `Invitation Salon EPHI 2026 - ${location}`;
        invitationEl.style.display = 'block';
    } else if (invitationEl) {
        invitationEl.style.display = 'none';
    }

    // Gérer l'affichage du lien de partage
    const shareEl = document.getElementById('modal-share-link');
    const shareInput = document.getElementById('modal-link-input');
    if (shareEl && shareInput && shareLink) {
        shareInput.value = shareLink;
        shareEl.style.display = 'block';
    } else if (shareEl) {
        shareEl.style.display = 'none';
        if (shareInput) shareInput.value = '';
    }

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
            const shareLink = `https://ephi.pro/?salon=${salonId}`;
            openRegistrationModal(salon.date, salon.location, salon.time, salon.invitation, shareLink);
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
        const invitationImage = button.getAttribute('data-invitation');
        const salonId = button.getAttribute('data-salon');
        const shareLink = salonId ? `https://ephi.pro/?salon=${salonId}` : null;
        openRegistrationModal(date, location, '9h - 15h', invitationImage, shareLink);
    });
});

// Gestionnaire pour copier le lien depuis le modal
const modalCopyBtn = document.getElementById('modal-copy-link');
if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', () => {
        const shareInput = document.getElementById('modal-link-input');
        if (!shareInput) return;
        const val = shareInput.value;
        navigator.clipboard.writeText(val).then(() => {
            const original = modalCopyBtn.textContent;
            modalCopyBtn.textContent = '✓ Copié !';
            modalCopyBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            setTimeout(() => {
                modalCopyBtn.textContent = original;
                modalCopyBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Erreur copie modal:', err);
            alert('Impossible de copier automatiquement. Veuillez copier manuellement.');
        });
    });
}

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
// Gérer la soumission du formulaire d'inscription
registrationForm.addEventListener('submit', async (e) => {
    // Pour Netlify Forms, on laisse la soumission native se faire
    // Le formulaire redirigera automatiquement vers la page de remerciement
    const submitBtn = registrationForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Inscription en cours...';
    submitBtn.disabled = true;
    
    // Pas de preventDefault() - laisse Netlify gérer la soumission naturellement
});