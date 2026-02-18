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

// EmailJS initialization
(function() {
    emailjs.init('YOUR_PUBLIC_KEY'); // À remplacer par votre clé publique EmailJS
})();

// Form submission handler
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    // Envoyer l'email via EmailJS à info@maxiavenue.com
    emailjs.sendForm(
        'YOUR_SERVICE_ID',  // À remplacer par votre Service ID
        'YOUR_TEMPLATE_ID', // À remplacer par votre Template ID
        contactForm
    ).then(
        function(response) {
            console.log('Email envoyé avec succès!', response.status, response.text);
            
            // Create success message
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
            
            // Replace form with success message
            contactForm.style.display = 'none';
            contactForm.parentElement.appendChild(successMessage);
            
            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                successMessage.remove();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        },
        function(error) {
            console.error('Erreur lors de l\'envoi:', error);
            
            // Create error message
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
            errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer.';
            
            contactForm.parentElement.appendChild(errorMessage);
            
            setTimeout(() => {
                errorMessage.remove();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    );
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
