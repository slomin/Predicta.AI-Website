// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functions
    initSmoothScrolling();
    initMobileNavigation();
    initWaitlistForm();
    initAnimations();
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's an anchor link
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Adding offset for the sticky header
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.nav-links');
                    if (mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                    }
                }
            }
        });
    });
}

/**
 * Initialize mobile navigation toggle
 */
function initMobileNavigation() {
    // Create mobile menu toggle button
    const nav = document.querySelector('nav');
    const mobileToggle = document.createElement('div');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(mobileToggle);
    
    // Add event listener to toggle button
    mobileToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
    
    // Add mobile-specific styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-links {
                display: none;
                width: 100%;
            }
            .nav-links.active {
                display: flex;
            }
            .mobile-toggle {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 30px;
                height: 21px;
                cursor: pointer;
            }
            .mobile-toggle span {
                display: block;
                height: 3px;
                width: 100%;
                background-color: var(--text);
                transition: all 0.3s ease;
            }
            .mobile-toggle.active span:nth-child(1) {
                transform: translateY(9px) rotate(45deg);
            }
            .mobile-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            .mobile-toggle.active span:nth-child(3) {
                transform: translateY(-9px) rotate(-45deg);
            }
        }
        @media (min-width: 769px) {
            .mobile-toggle {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize waitlist form submission
 */
function initWaitlistForm() {
    const waitlistForm = document.getElementById('waitlist-form');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = waitlistForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // In a real implementation, this would call an API to save the email
                // For this demo, we'll just show a success message
                
                // Create success message
                const formContainer = waitlistForm.parentElement;
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for joining our waitlist! We\'ll be in touch soon.';
                successMessage.style.cssText = 'background-color: var(--secondary); color: white; padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem;';
                
                // Hide the form and show success message
                waitlistForm.style.display = 'none';
                formContainer.appendChild(successMessage);
                
                // Log to console (for demo purposes)
                console.log('Waitlist submission:', email);
            } else {
                // Show error for invalid email
                emailInput.style.border = '2px solid red';
                
                // Remove error styling after 3 seconds
                setTimeout(() => {
                    emailInput.style.border = '';
                }, 3000);
            }
        });
    }
}

/**
 * Initialize animations for page elements
 */
function initAnimations() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    
    // Create intersection observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing after animation is triggered
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add fade-in animation style
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .hero {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Observe all sections except the hero (which should be visible immediately)
    sections.forEach(section => {
        if (!section.classList.contains('hero')) {
            sectionObserver.observe(section);
        }
    });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @return {boolean} - Whether email is valid
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}