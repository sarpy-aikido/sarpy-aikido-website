// Classes Page Specific JavaScript for Sarpy Aikido
// Interactive class cards, schedule animations, and progression flow

class ClassesPage {
    constructor() {
        this.init();
    }

    init() {
        // If GSAP is handling animations, only setup non-animation features
        if (typeof gsap !== 'undefined') {
            console.log('GSAP detected - animations handled by animations.js');
            this.setupAccessibility();
            this.setupFilteringSystem();
            this.setupQuickNavigation();
            return;
        }

        // Fallback: Run all animations when no GSAP
        this.setupClassCardAnimations();
        this.setupProgressionFlow();
        this.setupScheduleInteractions();
        this.setupFilteringSystem();
        this.setupInfoCardAnimations();
        this.setupAccessibility();
        this.setupHeroStats();
        this.setupQuickNavigation();
        this.initializePageLoad();
    }

    // Class card reveal and interaction animations
    setupClassCardAnimations() {
        const classCards = document.querySelectorAll('.class-card');
        
        // Intersection Observer for class cards
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const classCardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        this.animateClassCardContent(entry.target);
                    }, index * 300);
                }
            });
        }, observerOptions);

        classCards.forEach(card => {
            classCardObserver.observe(card);
            this.setupClassCardInteractions(card);
        });
    }

    // Animate individual class card content
    animateClassCardContent(classCard) {
        const elements = [
            '.class-header',
            '.class-schedule',
            '.class-description',
            '.class-features'
        ];

        elements.forEach((selector, index) => {
            const element = classCard.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });

        // Animate feature tags individually
        const featureTags = classCard.querySelectorAll('.feature-tag');
        featureTags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                tag.style.transition = 'all 0.4s ease';
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, 800 + (index * 100));
        });
    }

    // Setup interactive behaviors for class cards
    setupClassCardInteractions(card) {
        const image = card.querySelector('.class-photo');
        const features = card.querySelectorAll('.feature-tag');
        const scheduleItems = card.querySelectorAll('.schedule-item');

        // Enhanced hover effects for image
        card.addEventListener('mouseenter', () => {
            if (image) {
                image.style.filter = 'brightness(1.1) contrast(1.1)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.filter = 'brightness(1) contrast(1)';
            }
        });

        // Interactive feature tags
        features.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.05)';
                tag.style.boxShadow = '0 4px 15px rgba(204, 51, 51, 0.3)';
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'scale(1)';
                tag.style.boxShadow = 'none';
            });
        });

        // Schedule item highlighting
        scheduleItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = 'rgba(204, 51, 51, 0.1)';
                item.style.borderRadius = '4px';
                item.style.transform = 'translateX(5px)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
                item.style.transform = 'translateX(0)';
            });
        });

        // Click to expand/focus functionality
        card.addEventListener('click', () => {
            this.focusClassCard(card);
        });
    }

    // Focus and highlight specific class card
    focusClassCard(card) {
        // Remove focus from all cards
        document.querySelectorAll('.class-card').forEach(c => {
            c.classList.remove('focused');
        });

        // Add focus to selected card
        card.classList.add('focused');
        
        // Scroll to card if not fully in view
        const rect = card.getBoundingClientRect();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        
        if (rect.top < navHeight || rect.bottom > window.innerHeight) {
            card.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }

        // Add ripple effect
        this.createRippleEffect(card);

        // Remove focus after delay
        setTimeout(() => {
            card.classList.remove('focused');
        }, 3000);
    }

    // Create ripple effect for card interactions
    createRippleEffect(card) {
        const ripple = document.createElement('div');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        
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
            animation: classRipple 0.8s ease-out;
            z-index: 1;
        `;
        
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }

    // Progression flow animations and interactions
    setupProgressionFlow() {
        const progressionSteps = document.querySelectorAll('.progression-step');
        const arrows = document.querySelectorAll('.progression-arrow');
        
        // Intersection Observer for progression section
        const progressionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressionFlow();
                }
            });
        }, { threshold: 0.3 });

        const progressionSection = document.querySelector('.progression-section');
        if (progressionSection) {
            progressionObserver.observe(progressionSection);
        }

        // Setup step interactions
        progressionSteps.forEach((step, index) => {
            step.addEventListener('mouseenter', () => {
                this.highlightProgressionPath(index);
            });

            step.addEventListener('mouseleave', () => {
                this.resetProgressionHighlight();
            });

            // Click to focus on specific step
            step.addEventListener('click', () => {
                this.focusProgressionStep(index);
            });
        });
    }

    // Animate the progression flow
    animateProgressionFlow() {
        const steps = document.querySelectorAll('.progression-step');
        const arrows = document.querySelectorAll('.progression-arrow');
        
        steps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                step.style.transition = 'all 0.6s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, index * 200);
        });

        arrows.forEach((arrow, index) => {
            arrow.style.opacity = '0';
            arrow.style.transform = 'scale(0)';
            
            setTimeout(() => {
                arrow.style.transition = 'all 0.4s ease';
                arrow.style.opacity = '1';
                arrow.style.transform = 'scale(1)';
            }, (index + 1) * 400);
        });
    }

    // Highlight progression path up to specific step
    highlightProgressionPath(stepIndex) {
        const steps = document.querySelectorAll('.progression-step');
        const arrows = document.querySelectorAll('.progression-arrow');
        
        steps.forEach((step, index) => {
            const stepNumber = step.querySelector('.step-number');
            if (index <= stepIndex) {
                step.style.transform = 'scale(1.05)';
                if (stepNumber) {
                    stepNumber.style.backgroundColor = 'var(--accent-red)';
                    stepNumber.style.boxShadow = '0 8px 25px rgba(204, 51, 51, 0.5)';
                }
            }
        });

        arrows.forEach((arrow, index) => {
            if (index < stepIndex) {
                arrow.style.color = 'var(--accent-red)';
                arrow.style.transform = 'scale(1.2)';
            }
        });
    }

    // Reset progression highlight
    resetProgressionHighlight() {
        const steps = document.querySelectorAll('.progression-step');
        const arrows = document.querySelectorAll('.progression-arrow');
        
        steps.forEach(step => {
            const stepNumber = step.querySelector('.step-number');
            step.style.transform = 'scale(1)';
            if (stepNumber) {
                stepNumber.style.backgroundColor = 'var(--accent-red)';
                stepNumber.style.boxShadow = '0 4px 15px rgba(204, 51, 51, 0.3)';
            }
        });

        arrows.forEach(arrow => {
            arrow.style.color = 'var(--accent-red)';
            arrow.style.transform = 'scale(1)';
        });
    }

    // Focus on specific progression step
    focusProgressionStep(stepIndex) {
        this.highlightProgressionPath(stepIndex);
        
        // Add special highlighting
        const step = document.querySelectorAll('.progression-step')[stepIndex];
        if (step) {
            step.style.backgroundColor = 'rgba(204, 51, 51, 0.05)';
            step.style.borderRadius = '12px';
            step.style.padding = 'var(--spacing-md)';
            step.style.border = '2px solid var(--accent-red)';
            
            setTimeout(() => {
                step.style.backgroundColor = 'transparent';
                step.style.border = 'none';
                step.style.padding = '0';
                this.resetProgressionHighlight();
            }, 2000);
        }
    }

    // Schedule card interactions and filtering
    setupScheduleInteractions() {
        const scheduleCards = document.querySelectorAll('.schedule-card');
        
        scheduleCards.forEach(card => {
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                card.style.borderTopWidth = '6px';
                this.animateScheduleContent(card);
            });

            card.addEventListener('mouseleave', () => {
                card.style.borderTopWidth = '4px';
            });

            // Click to highlight related class
            card.addEventListener('click', () => {
                this.highlightRelatedClass(card);
            });
        });

        // Animate schedule cards on scroll
        const scheduleObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.3 });

        scheduleCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            scheduleObserver.observe(card);
        });
    }

    // Animate schedule card content
    animateScheduleContent(card) {
        const elements = card.children;
        Array.from(elements).forEach((element, index) => {
            element.style.transform = 'scale(1.02)';
            element.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 100 + (index * 50));
        });
    }

    // Highlight related class when schedule card is clicked
    highlightRelatedClass(scheduleCard) {
        const className = scheduleCard.querySelector('.schedule-class').textContent.toLowerCase();
        const classCards = document.querySelectorAll('.class-card');
        
        classCards.forEach(card => {
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            if (cardTitle.includes(className.split(' ')[0])) {
                this.focusClassCard(card);
            }
        });
    }

    // Simple filtering system for class information
    setupFilteringSystem() {
        // This could be expanded to filter classes by level, time, etc.
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterType = button.dataset.filter;
                this.filterClasses(filterType);
            });
        });
    }

    // Filter classes based on criteria
    filterClasses(filterType) {
        const classCards = document.querySelectorAll('.class-card');
        
        classCards.forEach(card => {
            let shouldShow = true;
            
            switch(filterType) {
                case 'beginners':
                    shouldShow = card.querySelector('.class-level').textContent.toLowerCase().includes('beginners');
                    break;
                case 'all-levels':
                    shouldShow = card.querySelector('.class-level').textContent.toLowerCase().includes('all');
                    break;
                case 'all':
                default:
                    shouldShow = true;
                    break;
            }
            
            if (shouldShow) {
                card.style.display = 'grid';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.3';
            }
        });
    }

    // Info card animations
    setupInfoCardAnimations() {
        const infoCards = document.querySelectorAll('.info-card');
        
        const infoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        this.animateInfoIcon(entry.target);
                    }, index * 100);
                }
            });
        }, { threshold: 0.3 });

        infoCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            infoObserver.observe(card);
            
            // Setup hover interactions
            card.addEventListener('mouseenter', () => {
                this.animateInfoIcon(card);
            });
        });
    }

    // Animate info card icons
    animateInfoIcon(card) {
        const icon = card.querySelector('.info-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }
    }

    // Accessibility enhancements
    setupAccessibility() {
        // Keyboard navigation for class cards
        const classCards = document.querySelectorAll('.class-card');
        classCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Class information ${index + 1}`);
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.focusClassCard(card);
                }
            });
        });

        // Progression step keyboard navigation
        const progressionSteps = document.querySelectorAll('.progression-step');
        progressionSteps.forEach((step, index) => {
            step.setAttribute('tabindex', '0');
            step.setAttribute('aria-label', `Training progression step ${index + 1}`);
            
            step.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.focusProgressionStep(index);
                }
            });
        });

        // Enhanced focus indicators
        const focusableElements = document.querySelectorAll('.class-card, .info-card, .schedule-card, .progression-step');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--accent-red)';
                element.style.outlineOffset = '4px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
    }

    // Quick navigation for jumping to class sections
    setupQuickNavigation() {
        const quickNavLinks = document.querySelectorAll('.quick-nav-btn');
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;

        quickNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Animated hero statistics
    setupHeroStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatNumbers();
                }
            });
        }, { threshold: 0.5 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            statsObserver.observe(heroStats);
        }
    }

    // Animate statistic numbers
    animateStatNumbers() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach((item, index) => {
            const number = item.querySelector('.stat-number');
            const label = item.querySelector('.stat-label');
            
            // Animate the stat item entrance
            item.style.transform = 'scale(0.8)';
            item.style.opacity = '0';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.transform = 'scale(1)';
                item.style.opacity = '1';
                
                // Add a subtle pulse effect
                setTimeout(() => {
                    number.style.animation = 'pulse-stat 1s ease-in-out';
                }, 300);
            }, index * 200);
        });
    }

    // Page load initialization
    initializePageLoad() {
        // Add loading class
        document.body.classList.add('classes-loading');
        
        // Smooth page entrance
        window.addEventListener('load', () => {
            document.body.classList.remove('classes-loading');
            document.body.classList.add('classes-loaded');
            
            // Trigger initial animations
            this.animatePageEntrance();
        });
    }

    // Page entrance animations
    animatePageEntrance() {
        const hero = document.querySelector('.classes-hero .hero-content');
        const overview = document.querySelector('.class-overview .overview-content');
        
        if (hero) {
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                hero.style.transition = 'all 1s ease';
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }, 200);
        }

        if (overview) {
            overview.style.opacity = '0';
            overview.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                overview.style.transition = 'all 0.8s ease';
                overview.style.opacity = '1';
                overview.style.transform = 'translateY(0)';
            }, 600);
        }
    }

    // Method to scroll to specific class
    scrollToClass(className) {
        const classCards = document.querySelectorAll('.class-card');
        
        classCards.forEach(card => {
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            if (cardTitle.includes(className.toLowerCase())) {
                card.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                this.focusClassCard(card);
                return;
            }
        });
    }

    // Method to highlight schedule for specific day
    highlightScheduleDay(day) {
        const scheduleCards = document.querySelectorAll('.schedule-card');
        
        scheduleCards.forEach(card => {
            const cardDay = card.querySelector('.schedule-day').textContent.toLowerCase();
            if (cardDay === day.toLowerCase()) {
                card.style.transform = 'scale(1.05)';
                card.style.boxShadow = '0 20px 50px rgba(204, 51, 51, 0.2)';
                card.style.borderTopWidth = '8px';
                
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                    card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                    card.style.borderTopWidth = '4px';
                }, 2000);
            }
        });
    }
}

// Add CSS for additional animations
const classesAnimationStyle = document.createElement('style');
classesAnimationStyle.textContent = `
    @keyframes classRipple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse-stat {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
    
    .class-card.focused {
        border-left: 6px solid var(--accent-red);
        transform: translateY(-15px);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
        z-index: 10;
    }
    
    .class-card.focused .class-badge {
        animation: pulse-stat 1s ease-in-out infinite;
    }
    
    @media (max-width: 768px) {
        .class-card.focused {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(classesAnimationStyle);

// Initialize classes page functionality
document.addEventListener('DOMContentLoaded', () => {
    const classesPage = new ClassesPage();

    // Export for potential external use
    window.classesPage = classesPage;
});

// Export classes for potential use in other scripts
window.ClassesPage = ClassesPage;