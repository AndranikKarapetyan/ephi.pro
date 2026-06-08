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

// Champs d'accompagnement et validation du formulaire d'inscription
const companionsSelect = document.getElementById('companions');
const companionsDetailsContainer = document.getElementById('companionsDetails');
const registrationFormError = document.getElementById('registrationFormError');
const functionPath = '/.netlify/functions/inscription';
let nativeSubmitInProgress = false;

function renderCompanionFields(count) {
    companionsDetailsContainer.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const companionGroup = document.createElement('div');
        companionGroup.className = 'form-group';
        companionGroup.innerHTML = `
            <label class="form-label">Accompagnant ${i}</label>
            <div class="companion-row">
                <input type="text" name="companion_first_name_${i}" placeholder="Prénom accompagnant ${i} *" required>
                <input type="text" name="companion_last_name_${i}" placeholder="Nom accompagnant ${i} *" required>
            </div>
        `;
        companionsDetailsContainer.appendChild(companionGroup);
    }
}

function getCompanionDetails(count) {
    const details = [];

    for (let i = 1; i <= count; i++) {
        const firstName = registrationForm.querySelector(`[name="companion_first_name_${i}"]`).value.trim();
        const lastName = registrationForm.querySelector(`[name="companion_last_name_${i}"]`).value.trim();

        if (!firstName || !lastName) {
            return { error: `Veuillez renseigner le prénom et le nom de l'accompagnant ${i}.` };
        }

        details.push({ first_name: firstName, last_name: lastName });
    }

    return { details };
}

if (companionsSelect) {
    companionsSelect.addEventListener('change', (e) => {
        renderCompanionFields(Number(e.target.value));
    });
}

// Mapping des identifiants de salon vers leurs informations
const salonMap = {
    'saintjeandeluz-16avril': { date: '16 avril 2026', time: '9h - 15h', location: 'Saint Jean De Luz (64)', invitation: 'images/Invitation%20Ephi%202026%20St%20Jean%20De%20Luz%20(1)_page-0001.jpg' },
    'lagrandemotte-27mai': { date: '27 mai 2026', time: '9h - 15h', location: 'La Grande Motte (34)' },
    'idfsud-3juin': { date: '3 juin 2026', time: '9h - 15h', location: 'Lieusaint (77)', invitation: 'images/Invitation%20Ephi%202026%20IDF%20Sud%20Lieusaint%20(91).jpg' },
    'idfnord-4juin': { date: '4 juin 2026', time: '9h - 15h', location: 'IDF nord (95)', invitation: 'images/Invitation%20Ephi%202026%20IDF%20Nord%20Enghien%20(95)%20(6).jpg' },
    'lens-25juin': { date: '25 juin 2026', time: '9h - 15h', location: 'Lens - Stade Bollaert-Delelis (62)', invitation: 'images/Invitation%20Ephi%202026%20LENS%20(62).jpg' },
    'lyon-8septembre': { date: '8 septembre 2026', time: '9h - 15h', location: 'Lyon (69)', invitation: 'images/Invitation%20Salon%20EPHI%20-%202026%20-%20Lyon.jpg', externalUrl: 'https://forms.cloud.microsoft/e/peftu5YB27' },
    'aixenprovence-10septembre': { date: '10 septembre 2026', time: '9h - 15h', location: 'Aix-en-Provence (13)', invitation: 'images/Invitation Ephi 2026 AIX .jpg' },
    'metz-15octobre': { date: '15 octobre 2026', time: '9h - 15h', location: 'Metz (57)' },
    'toulouse-19novembre': { date: '19 novembre 2026', time: '9h - 15h', location: 'Toulouse (31)' },
    'saintmaximin-3decembre': { date: '3 décembre 2026', time: '9h - 15h', location: 'Saint-Maximin (60)' }
};

// Fonction pour ouvrir le modal avec les informations du salon
function openRegistrationModal(date, location, time = '9h - 15h', invitationImage = null) {
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
        if (salon.externalUrl) {
            window.location.href = salon.externalUrl;
            return;
        }
        // Ouvrir automatiquement le modal avec le salon sélectionné
        setTimeout(() => {
            openRegistrationModal(salon.date, salon.location, salon.time, salon.invitation);
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
        openRegistrationModal(date, location, '9h - 15h', invitationImage);
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
    if (nativeSubmitInProgress) {
        return;
    }

    e.preventDefault();
    registrationFormError.textContent = '';
    const submitBtn = registrationForm.querySelector('button[type="submit"]');

    try {
        const formData = new FormData(registrationForm);
        const userName = formData.get('user_name')?.toString().trim();
        const userEmail = formData.get('user_email')?.toString().trim();
        const phone = formData.get('phone')?.toString().trim();
        const companions = Number(formData.get('companions') || '0');

        if (!userName || !userEmail || !phone) {
            registrationFormError.textContent = 'Veuillez remplir tous les champs obligatoires du formulaire.';
            submitBtn.disabled = false;
            return;
        }

        if (companions > 0) {
            const companionResult = getCompanionDetails(companions);
            if (companionResult.error) {
                registrationFormError.textContent = companionResult.error;
                submitBtn.disabled = false;
                return;
            }
            formData.set('companions_details', JSON.stringify(companionResult.details));
        } else {
            formData.set('companions_details', JSON.stringify([]));
        }

        submitBtn.textContent = 'Vérification...';
        submitBtn.disabled = true;

        const checkParams = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            checkParams.append(key, value);
        }
        checkParams.set('action', 'check');

        let checkResponse;
        try {
            checkResponse = await fetch(functionPath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: checkParams.toString()
            });
        } catch (error) {
            console.error('Échec de la vérification du service:', error);
            registrationFormError.textContent = 'Service temporairement indisponible. Réessayez dans quelques instants.';
            submitBtn.textContent = 'Confirmer l\'inscription';
            submitBtn.disabled = false;
            return;
        }

        if (!checkResponse.ok && checkResponse.status !== 409) {
            console.error('Vérification du service non disponible:', checkResponse.status);
            registrationFormError.textContent = 'Service temporairement indisponible. Réessayez dans quelques instants.';
            submitBtn.textContent = 'Confirmer l\'inscription';
            submitBtn.disabled = false;
            return;
        }

        let checkData;
        try {
            checkData = await checkResponse.json();
        } catch (error) {
            console.error('Réponse JSON invalide pour la vérification:', error);
            registrationFormError.textContent = 'Service temporairement indisponible. Réessayez dans quelques instants.';
            submitBtn.textContent = 'Confirmer l\'inscription';
            submitBtn.disabled = false;
            return;
        }

        if (checkData.duplicate) {
            if (checkData.sameSalon) {
                registrationFormError.textContent = checkData.message || 'Vous êtes déjà inscrit à ce salon.';
                submitBtn.textContent = 'Confirmer l\'inscription';
                submitBtn.disabled = false;
                return;
            }

            const confirmMessage = checkData.message || `Vous êtes déjà inscrit au salon ${checkData.otherSalon?.event_date} à ${checkData.otherSalon?.event_location}. Voulez-vous transférer votre inscription vers ce nouveau salon ?`;
            const userConfirmed = window.confirm(confirmMessage);
            if (!userConfirmed) {
                submitBtn.textContent = 'Confirmer l\'inscription';
                submitBtn.disabled = false;
                return;
            }
            formData.set('force_transfer', 'true');
        }

        formData.set('action', 'register');
        submitBtn.textContent = 'Envoi de l\'inscription...';

        let registerResponse;
        try {
            registerResponse = await fetch(functionPath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: new URLSearchParams(formData).toString()
            });
        } catch (error) {
            console.error('Échec de l\'envoi du service:', error);
            registrationFormError.textContent = 'Service temporairement indisponible. Réessayez dans quelques instants.';
            submitBtn.textContent = 'Confirmer l\'inscription';
            submitBtn.disabled = false;
            return;
        }

        if (registerResponse.status === 303) {
            window.location.href = '/merci-inscription.html';
            return;
        }

        if (registerResponse.redirected) {
            window.location.href = registerResponse.url || '/merci-inscription.html';
            return;
        }

        if (!registerResponse.ok) {
            if (registerResponse.status === 400 || registerResponse.status === 409) {
                const registerData = await registerResponse.json();
                registrationFormError.textContent = registerData.message || 'Une erreur est survenue lors de l\'inscription.';
                return;
            }
            console.error('Réponse inattendue du service:', registerResponse.status);
            registrationFormError.textContent = 'Service temporairement indisponible. Réessayez dans quelques instants.';
            submitBtn.textContent = 'Confirmer l\'inscription';
            submitBtn.disabled = false;
            return;
        }

        const responseContentType = registerResponse.headers.get('content-type') || '';
        if (!responseContentType.includes('application/json')) {
            window.location.href = '/merci-inscription.html';
            return;
        }

        const registerData = await registerResponse.json();
        if (registerData.success) {
            window.location.href = registerData.redirect || '/merci-inscription.html';
            return;
        }

        registrationFormError.textContent = registerData.message || 'Une erreur est survenue lors de l\'inscription.';
    } catch (error) {
        console.error(error);
        registrationFormError.textContent = 'Service temporairement indisponible. Réessayez dans quelques instants.';
        submitBtn.textContent = 'Confirmer l\'inscription';
        submitBtn.disabled = false;
        return;
    } finally {
        if (!nativeSubmitInProgress) {
            submitBtn.textContent = 'Confirmer l\'inscription';
            submitBtn.disabled = false;
        }
    }
});