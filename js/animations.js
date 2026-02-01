// GSAP Animations Module for Sarpy Aikido
// Centralized animation system using GreenSock Animation Platform
// Inspired by Aikido principles: harmony, flow, balance, effortless control

(function() {
    'use strict';

    // Wait for GSAP to load
    const initGSAP = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            // Retry after a short delay if GSAP hasn't loaded yet
            setTimeout(initGSAP, 50);
            return;
        }

        // Mark that GSAP is ready (prevents main.js fallback from running)
        window.gsapReady = true;

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Global GSAP defaults
        gsap.defaults({
            ease: 'power2.out',
            duration: prefersReducedMotion ? 0 : 0.8
        });

        // Initialize all animations
        const SarpyAnimations = {
            prefersReducedMotion,

            // Initialize all animations
            init() {
                if (this.prefersReducedMotion) {
                    console.log('Reduced motion preference detected - minimal animations enabled');
                    this.initMinimalMode();
                    return;
                }

                this.initScrollProgress();
                this.initScrollReveal();
                this.initHeroAnimations();
                this.initSectionTransitions();
                this.initCardEffects();

                // Page-specific initializations
                if (document.querySelector('.timeline-section')) {
                    this.initTimelineAnimations();
                }

                console.log('GSAP animations initialized');
            },

            // Minimal mode for reduced motion
            initMinimalMode() {
                // Just show content without animations
                gsap.set('.reveal, .feature-card, .class-card, .timeline-item', {
                    opacity: 1,
                    y: 0,
                    scale: 1
                });
            },

            // Scroll Progress Bar - shows page scroll position (ma-ai awareness)
            initScrollProgress() {
                // Create progress bar element
                const progressBar = document.createElement('div');
                progressBar.className = 'scroll-progress-bar';
                progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
                document.body.appendChild(progressBar);

                // Add styles
                const style = document.createElement('style');
                style.textContent = `
                    .scroll-progress-bar {
                        position: fixed;
                        top: 70px;
                        left: 0;
                        width: 100%;
                        height: 3px;
                        background: rgba(0, 0, 0, 0.1);
                        z-index: 999;
                        pointer-events: none;
                    }
                    .scroll-progress-fill {
                        height: 100%;
                        width: 0%;
                        background: linear-gradient(90deg, var(--accent-red), #ff6b6b);
                        transition: width 0.1s ease-out;
                    }
                    @media (max-width: 768px) {
                        .scroll-progress-bar {
                            top: 60px;
                            height: 2px;
                        }
                    }
                `;
                document.head.appendChild(style);

                // Animate progress on scroll
                const progressFill = progressBar.querySelector('.scroll-progress-fill');

                gsap.to(progressFill, {
                    width: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: document.body,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 0.3
                    }
                });
            },

            // Scroll Reveal Animations - fluid section reveals
            initScrollReveal() {
                // Define reveal selectors
                const revealSelectors = [
                    '.welcome-content',
                    '.feature-card',
                    '.class-card',
                    '.location-content',
                    '.philosophy-card',
                    '.value-card',
                    '.instructor-card',
                    '.history-event',
                    '.community-feature',
                    'section > .container > h2',
                    '.classes-intro p',
                    '.about-mission-content',
                    '.mission-values'
                ];

                // Add gsap-reveal class and set initial state via CSS (prevents flash)
                revealSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        el.classList.add('gsap-reveal');
                    });
                });

                // Small delay to let CSS apply initial hidden state
                requestAnimationFrame(() => {
                    // Create scroll-triggered reveals
                    revealSelectors.forEach(selector => {
                        const elements = document.querySelectorAll(selector);
                        if (elements.length === 0) return;

                        elements.forEach((el) => {
                            gsap.to(el, {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: 'power3.out',
                                onComplete: () => el.classList.add('revealed'),
                                scrollTrigger: {
                                    trigger: el,
                                    start: 'top 85%',
                                    toggleActions: 'play none none none'
                                }
                            });
                        });
                    });

                    // Staggered grid reveals (feature cards, class cards)
                    const gridContainers = document.querySelectorAll('.features-grid, .classes-grid, .philosophy-grid, .values-grid');
                    gridContainers.forEach(container => {
                        const cards = container.children;
                        if (cards.length === 0) return;

                        // Mark cards for CSS initial state
                        Array.from(cards).forEach(card => card.classList.add('gsap-reveal'));

                        gsap.to(cards, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.6,
                            stagger: 0.1,
                            ease: 'power2.out',
                            onComplete: () => Array.from(cards).forEach(card => card.classList.add('revealed')),
                            scrollTrigger: {
                                trigger: container,
                                start: 'top 85%',
                                toggleActions: 'play none none none'
                            }
                        });
                    });
                });
            },

            // Hero Animations - breathing logo (ki energy) and entrance
            initHeroAnimations() {
                const heroLogo = document.querySelector('.hero-logo');
                const heroContent = document.querySelector('.hero-content');
                const heroTitle = document.querySelector('.hero-title');
                const heroTagline = document.querySelector('.hero-tagline');
                const heroDescription = document.querySelector('.hero-description');
                const heroActions = document.querySelector('.hero-actions');

                // Check if we're on mobile - use simpler animations
                const isMobile = window.innerWidth < 768;

                // Hero entrance animation (home page)
                if (heroContent) {
                    const entranceTl = gsap.timeline();

                    if (heroLogo) {
                        // Breathing animation for logo (subtle scale pulse like ki energy)
                        // Only on desktop
                        if (!isMobile) {
                            gsap.to(heroLogo, {
                                scale: 1.05,
                                duration: 3,
                                ease: 'sine.inOut',
                                repeat: -1,
                                yoyo: true
                            });
                        }

                        entranceTl.fromTo(heroLogo,
                            { opacity: 0, scale: 0.8 },
                            { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }
                        );
                    }

                    if (heroTitle) {
                        entranceTl.fromTo(heroTitle,
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.8 },
                            '-=0.5'
                        );
                    }

                    if (heroTagline) {
                        entranceTl.fromTo(heroTagline,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.6 },
                            '-=0.4'
                        );
                    }

                    if (heroDescription) {
                        entranceTl.fromTo(heroDescription,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.6 },
                            '-=0.3'
                        );
                    }

                    if (heroActions) {
                        entranceTl.fromTo(heroActions.children,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 },
                            '-=0.2'
                        );
                    }
                }

                // Page-specific hero animations (lineage, classes, about pages)
                const lineageHero = document.querySelector('.lineage-hero');
                const classesHero = document.querySelector('.classes-hero');
                const aboutHero = document.querySelector('.about-hero');

                [lineageHero, classesHero, aboutHero].forEach(hero => {
                    if (!hero) return;

                    // Animate all text content inside the hero using fromTo (no flash)
                    const heroH1 = hero.querySelector('h1');
                    const heroTagline = hero.querySelector('.hero-tagline');
                    const heroDesc = hero.querySelector('.hero-description');

                    // Create smooth slide-up + fade timeline using fromTo
                    const heroTl = gsap.timeline({ delay: 0.1 });

                    if (heroH1) {
                        heroTl.fromTo(heroH1,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
                        );
                    }

                    if (heroTagline) {
                        heroTl.fromTo(heroTagline,
                            { opacity: 0, y: 15 },
                            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                            '-=0.5'
                        );
                    }

                    if (heroDesc) {
                        heroTl.fromTo(heroDesc,
                            { opacity: 0, y: 15 },
                            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                            '-=0.4'
                        );
                    }
                });

                // Stats animation on classes page
                const heroStats = document.querySelector('.hero-stats');
                if (heroStats) {
                    gsap.fromTo(heroStats.children,
                        { opacity: 0, y: 30, scale: 0.9 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            stagger: 0.2,
                            duration: 0.6,
                            delay: 0.5,
                            ease: 'back.out(1.4)'
                        }
                    );
                }
            },

            // Section Transitions - smooth flow between sections
            initSectionTransitions() {
                const sections = document.querySelectorAll('section');

                sections.forEach((section, index) => {
                    // Skip hero sections
                    if (section.classList.contains('hero') ||
                        section.classList.contains('lineage-hero') ||
                        section.classList.contains('classes-hero') ||
                        section.classList.contains('about-hero')) {
                        return;
                    }

                    // Create parallax effect for sections
                    gsap.to(section, {
                        backgroundPositionY: '30%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    });
                });
            },

            // Card Effects - hover and interaction animations
            initCardEffects() {
                const cards = document.querySelectorAll('.feature-card, .class-card, .philosophy-card, .value-card');

                cards.forEach(card => {
                    // Hover effect
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, {
                            y: -8,
                            scale: 1.02,
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    });

                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, {
                            y: 0,
                            scale: 1,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    });
                });

                // Class card specific - expanded info items
                const classCards = document.querySelectorAll('.class-card');
                classCards.forEach(card => {
                    const infoItems = card.querySelectorAll('.class-info-item');

                    card.addEventListener('mouseenter', () => {
                        gsap.to(infoItems, {
                            x: 5,
                            stagger: 0.05,
                            duration: 0.2
                        });
                    });

                    card.addEventListener('mouseleave', () => {
                        gsap.to(infoItems, {
                            x: 0,
                            stagger: 0.05,
                            duration: 0.2
                        });
                    });
                });
            },

            // Timeline Animations for Lineage Page - tenkan (turning) movement
            initTimelineAnimations() {
                const timelineItems = document.querySelectorAll('.flow-item');

                // Animate timeline items on scroll using fromTo (no flash)
                timelineItems.forEach((item, index) => {
                    const marker = item.querySelector('.flow-marker');
                    const content = item.querySelector('.flow-content');

                    // Main reveal animation
                    gsap.fromTo(item,
                        { opacity: 0, x: -30 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 80%',
                                toggleActions: 'play none none none'
                            }
                        }
                    );

                    // Marker rotation animation (tenkan - turning movement in Aikido)
                    if (marker) {
                        gsap.to(marker, {
                            rotation: 360,
                            scale: 1.2,
                            duration: 0.6,
                            ease: 'back.out(1.7)',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 70%',
                                toggleActions: 'play none none none'
                            }
                        });

                        // Reset scale after initial animation
                        gsap.to(marker, {
                            scale: 1,
                            duration: 0.3,
                            delay: 0.6,
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 70%',
                                toggleActions: 'play none none none'
                            }
                        });
                    }

                    // Content stagger animation
                    if (content) {
                        const textElements = content.querySelectorAll('h3, .flow-title, .flow-date, .flow-desc, .flow-badge');
                        gsap.fromTo(textElements,
                            { opacity: 0, y: 20 },
                            {
                                opacity: 1,
                                y: 0,
                                stagger: 0.1,
                                duration: 0.5,
                                delay: 0.3,
                                scrollTrigger: {
                                    trigger: item,
                                    start: 'top 75%',
                                    toggleActions: 'play none none none'
                                }
                            }
                        );
                    }
                });

                // Timeline progress line - animate glow effect on existing .flow-line
                const timelineLine = document.querySelector('.flow-line');
                const timeline = document.querySelector('.lineage-flow');

                if (timelineLine && timeline) {
                    // Add glow animation to existing flow-line as user scrolls
                    gsap.to(timelineLine, {
                        boxShadow: '0 0 20px rgba(204, 51, 51, 0.8)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: timeline,
                            start: 'top 60%',
                            end: 'bottom 40%',
                            scrub: 0.5
                        }
                    });
                }
            },

            // Utility: Refresh ScrollTrigger on dynamic content
            refresh() {
                ScrollTrigger.refresh();
            },

            // Utility: Kill all animations (for cleanup)
            kill() {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            }
        };

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => SarpyAnimations.init());
        } else {
            SarpyAnimations.init();
        }

        // Export for use in other scripts
        window.SarpyAnimations = SarpyAnimations;

        // Listen for reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                SarpyAnimations.kill();
                SarpyAnimations.initMinimalMode();
            } else {
                location.reload(); // Reload to reinitialize animations
            }
        });
    };

    // Start initialization
    initGSAP();
})();
