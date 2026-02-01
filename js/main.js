// Main JavaScript for Sarpy Aikido Website
// Shared functionality across all pages

// Progressive Enhancement: Mark that JS is enabled
// This allows CSS to apply animations only when JS is available
// Content remains visible for no-JS users (accessibility first)
document.documentElement.classList.add('js-enabled');
document.body?.classList.add('js-enabled');

class AikidoEdge {
    constructor() {
        this.init();
    }

    init() {
        // Ensure js-enabled is on body (in case script runs before body exists)
        document.body.classList.add('js-enabled');

        this.setupNavigation();
        this.setupScrollEffects();
        this.setupScrollReveal();
        this.setupAccessibility();
        this.setupPageTransitions();
    }

    // Navigation functionality
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close mobile menu when clicking on nav links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Navbar scroll effects
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (navbar) {
                // Add scrolled class for styling
                if (currentScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Hide/show navbar on scroll (optional)
                // if (currentScrollY > lastScrollY && currentScrollY > 100) {
                //     navbar.style.transform = 'translateY(-100%)';
                // } else {
                //     navbar.style.transform = 'translateY(0)';
                // }
            }
            
            lastScrollY = currentScrollY;
        });

        // Set active nav link based on current page
        this.setActiveNavLink();
    }

    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === '/' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Scroll effects and smooth scrolling
    setupScrollEffects() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Parallax effect for hero section (if exists)
        // NOTE: GSAP now handles hero parallax via animations.js
        // This is disabled when GSAP is available
        const hero = document.querySelector('.hero');
        if (hero && typeof gsap === 'undefined') {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }

        // Mobile sticky CTA bar - hide when near top of page
        const mobileCta = document.getElementById('mobile-cta');
        if (mobileCta) {
            const showThreshold = 400; // Show after scrolling 400px

            const updateMobileCtaVisibility = () => {
                const currentScrollY = window.scrollY;

                if (currentScrollY < showThreshold) {
                    mobileCta.classList.add('hidden');
                } else {
                    mobileCta.classList.remove('hidden');
                }
            };

            // Initial check
            updateMobileCtaVisibility();

            // Update on scroll (throttled)
            window.addEventListener('scroll', AikidoEdge.throttle(updateMobileCtaVisibility, 100));
        }
    }

    // Scroll reveal animations
    // NOTE: GSAP ScrollTrigger now handles scroll reveals via animations.js
    // This method is kept as a fallback for when GSAP fails to load
    setupScrollReveal() {
        // Check if GSAP is handling animations (wait a bit for it to load)
        setTimeout(() => {
            if (window.gsapReady || (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined')) {
                console.log('GSAP detected - scroll reveal handled by animations.js');
                return; // Let GSAP handle it
            }

            // Fallback to IntersectionObserver if GSAP not available
            console.log('GSAP not detected - using IntersectionObserver fallback');
            this.initFallbackScrollReveal();
        }, 200);
    }

    initFallbackScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stagger animation for multiple elements
                    if (entry.target.classList.contains('stagger')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('fade-in-up');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe elements with reveal class
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        // Add reveal class to common elements
        const revealElements = [
            '.welcome-content',
            '.feature-card',
            '.class-card',
            '.location-content',
            'section h2',
            'section p'
        ];

        revealElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.classList.contains('reveal')) {
                    el.classList.add('reveal');
                    observer.observe(el);
                }
            });
        });
    }

    // Accessibility enhancements
    setupAccessibility() {
        // Enhanced focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }

        // ARIA enhancements for mobile menu
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'nav-menu');
            
            navToggle.addEventListener('click', () => {
                const isExpanded = navMenu.classList.contains('active');
                navToggle.setAttribute('aria-expanded', isExpanded.toString());
            });
        }
    }

    // Page transition effects
    setupPageTransitions() {
        // Add loading state
        document.body.classList.add('page-loading');
        
        window.addEventListener('load', () => {
            document.body.classList.remove('page-loading');
            document.body.classList.add('page-loaded');
        });

        // Handle page transitions for internal links
        document.querySelectorAll('a[href^="./"], a[href^="/"], a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                // Skip if it's an external link or has target="_blank"
                if (link.hostname !== window.location.hostname || link.target === '_blank') {
                    return;
                }

                // Add transition effect
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    e.preventDefault();
                    document.body.classList.add('page-loading');
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 150);
                }
            });
        });
    }

    // Utility methods
    static throttle(func, wait) {
        let lastTime = 0;
        return function executedFunction(...args) {
            const now = Date.now();
            if (now - lastTime >= wait) {
                lastTime = now;
                func(...args);
            }
        };
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Form handling utilities
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'error' ? '#cc3333' : '#2d2d2d',
            color: 'white',
            borderRadius: '4px',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Performance optimization
const performanceOptimizations = {
    // Lazy load images
    lazyLoadImages() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    },

    // Optimize scroll events
    optimizeScrollEvents() {
        window.addEventListener('scroll', AikidoEdge.throttle(() => {
            // Throttled scroll events
        }, 16)); // ~60fps
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AikidoEdge();
        performanceOptimizations.lazyLoadImages();
        performanceOptimizations.optimizeScrollEvents();
    });
} else {
    new AikidoEdge();
    performanceOptimizations.lazyLoadImages();
    performanceOptimizations.optimizeScrollEvents();
}

// Handle reduced motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-smooth', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}

// Export for use in other files
window.AikidoEdge = AikidoEdge;