// Landing Page Specific JavaScript for Sarpy Aikido

class LandingPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupHeroAnimations();
        this.setupScrollIndicator();
        this.setupFeatureCards();
        this.setupClassCards();
        this.setupTypingEffect();
        this.setupParallaxEffects();
    }

    // Hero section animations
    setupHeroAnimations() {
        // Skip if GSAP is handling animations
        if (typeof gsap !== 'undefined') {
            console.log('GSAP detected - hero animations handled by animations.js');
            return;
        }

        const heroContent = document.querySelector('.hero-content');
        const heroLogo = document.querySelector('.hero-logo');

        if (heroContent) {
            // Stagger hero content animations (fallback when GSAP not available)
            const elements = [
                '.hero-logo-container',
                '.hero-title',
                '.hero-tagline',
                '.hero-description',
                '.hero-actions'
            ];

            elements.forEach((selector, index) => {
                const element = heroContent.querySelector(selector);
                if (element) {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';

                    setTimeout(() => {
                        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 200 + (index * 150));
                }
            });
        }

        // Logo hover effect - skip if GSAP handles it
        if (heroLogo && typeof gsap === 'undefined') {
            heroLogo.addEventListener('mouseenter', () => {
                heroLogo.style.transform = 'scale(1.1) rotate(5deg)';
                heroLogo.style.transition = 'transform 0.3s ease';
            });

            heroLogo.addEventListener('mouseleave', () => {
                heroLogo.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    }

    // Scroll indicator functionality
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const welcomeSection = document.getElementById('welcome');
        
        if (scrollIndicator && welcomeSection) {
            scrollIndicator.addEventListener('click', () => {
                welcomeSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });

            // Hide scroll indicator when user scrolls
            let isScrollIndicatorVisible = true;
            window.addEventListener('scroll', AikidoEdge.throttle(() => {
                if (window.scrollY > 100 && isScrollIndicatorVisible) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
                    isScrollIndicatorVisible = false;
                } else if (window.scrollY <= 100 && !isScrollIndicatorVisible) {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
                    isScrollIndicatorVisible = true;
                }
            }, 100));
        }
    }

    // Feature cards interactions
    setupFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach((card, index) => {
            // Add entrance animation delay
            card.style.animationDelay = `${index * 0.2}s`;
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                this.animateIcon(card.querySelector('.feature-icon'));
                
                // Lift adjacent cards slightly
                featureCards.forEach((otherCard, otherIndex) => {
                    if (otherIndex !== index) {
                        otherCard.style.transform = 'translateY(-2px)';
                        otherCard.style.transition = 'transform 0.3s ease';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                // Reset all cards
                featureCards.forEach(otherCard => {
                    otherCard.style.transform = 'translateY(0)';
                });
            });
        });
    }

    // Animate feature icons
    animateIcon(icon) {
        if (!icon) return;
        
        const originalTransform = icon.style.transform;
        icon.style.transform = 'scale(1.2) rotate(10deg)';
        icon.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            icon.style.transform = originalTransform;
        }, 300);
    }

    // Class cards interactions
    setupClassCards() {
        const classCards = document.querySelectorAll('.class-card');
        
        classCards.forEach(card => {
            // Add ripple effect on click
            card.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                const rect = card.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(204, 51, 51, 0.1);
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    transform: scale(0);
                    pointer-events: none;
                    animation: ripple 0.6s ease-out;
                `;
                
                card.style.position = 'relative';
                card.style.overflow = 'hidden';
                card.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });

            // Progressive loading animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Typing effect for hero tagline
    setupTypingEffect() {
        const tagline = document.querySelector('.hero-tagline');
        if (!tagline) return;

        // Disable typing effect on mobile to prevent layout shift
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            return; // Keep static text on mobile
        }

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const fullText = tagline.textContent.trim();
        let charIndex = 0;

        // Set minimum height to prevent layout shift
        const computedStyle = window.getComputedStyle(tagline);
        tagline.style.minHeight = computedStyle.height;

        // Clear and add cursor
        tagline.textContent = '';
        tagline.style.borderRight = '2px solid var(--accent-red)';

        const typeSpeed = 80;

        function typeWriter() {
            if (charIndex < fullText.length) {
                tagline.textContent = fullText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Finished typing, remove cursor after a delay
                setTimeout(() => {
                    tagline.style.borderRight = 'none';
                }, 1000);
            }
        }

        // Start typing effect after hero animations
        setTimeout(typeWriter, 1500);
    }

    // Parallax effects for enhanced visual appeal
    setupParallaxEffects() {
        const parallaxElements = [
            { selector: '.hero-background', speed: 0.5 },
            { selector: '.feature-card', speed: 0.1 },
            { selector: '.class-card', speed: 0.05 }
        ];

        function updateParallax() {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(({ selector, speed }) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + scrollTop;
                    const elementHeight = rect.height;
                    const windowHeight = window.innerHeight;
                    
                    // Only apply parallax if element is in viewport
                    if (elementTop < scrollTop + windowHeight && elementTop + elementHeight > scrollTop) {
                        const yPos = -(scrollTop - elementTop) * speed;
                        element.style.transform = `translateY(${yPos}px)`;
                    }
                });
            });
        }

        // Use requestAnimationFrame for smooth animations
        function parallaxLoop() {
            updateParallax();
            requestAnimationFrame(parallaxLoop);
        }

        // Only enable parallax on devices that can handle it
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 
            window.innerWidth > 768) {
            requestAnimationFrame(parallaxLoop);
        }
    }
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Counter animation for statistics (if added later)
class CounterAnimation {
    static animateValue(element, start, end, duration) {
        const startTimestamp = performance.now();
        
        function step(timestamp) {
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }
}

// Initialize landing page functionality
document.addEventListener('DOMContentLoaded', () => {
    new LandingPage();
});

// Export for potential use in other scripts
window.LandingPage = LandingPage;
window.CounterAnimation = CounterAnimation;