// Lineage Page Specific JavaScript for Sarpy Aikido
// Timeline animations and scroll effects

class LineagePage {
    constructor() {
        this.init();
    }

    init() {
        // If GSAP is handling animations, only setup non-animation features
        if (typeof gsap !== 'undefined') {
            console.log('GSAP detected - animations handled by animations.js');
            this.setupAccessibility();
            return;
        }

        this.setupTimelineAnimations();
        this.setupProgressLine();
        this.setupScrollEffects();
        this.setupInteractiveElements();
        this.setupAccessibility();
        this.initializePageLoad();
    }

    // Timeline scroll-triggered animations
    setupTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.flow-item');
        
        // Intersection Observer for timeline items
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for multiple items becoming visible
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        this.animateTimelineContent(entry.target);
                    }, index * 200);
                }
            });
        }, observerOptions);

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Animate individual timeline content
    animateTimelineContent(timelineItem) {
        const content = timelineItem.querySelector('.flow-card');
        const avatar = timelineItem.querySelector('.flow-avatar');
        const textElements = timelineItem.querySelectorAll('.flow-content > *');
        
        if (content) {
            // Main content animation
            content.style.transform = 'scale(0.95)';
            content.style.opacity = '0.8';
            
            setTimeout(() => {
                content.style.transition = 'all 0.6s ease';
                content.style.transform = 'scale(1)';
                content.style.opacity = '1';
            }, 100);
        }

        // Avatar animation
        if (avatar) {
            avatar.style.transform = 'scale(1.1)';
            avatar.style.opacity = '0';

            setTimeout(() => {
                avatar.style.transition = 'all 0.8s ease';
                avatar.style.transform = 'scale(1)';
                avatar.style.opacity = '1';
            }, 200);
        }

        // Stagger text elements
        textElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    }

    // Animated progress line that follows scroll
    setupProgressLine() {
        const timeline = document.querySelector('.lineage-flow');
        const timelineLine = document.querySelector('.flow-line');

        if (!timeline || !timelineLine) return;

        // Create animated progress overlay
        const progressLine = document.createElement('div');
        progressLine.className = 'timeline-progress';
        progressLine.style.cssText = `
            position: absolute;
            left: 50%;
            top: 0;
            width: 4px;
            background: linear-gradient(180deg, var(--accent-red) 0%, rgba(204, 51, 51, 0.8) 100%);
            transform: translateX(-50%);
            z-index: 2;
            height: 0%;
            transition: height 0.3s ease;
            box-shadow: 0 0 10px rgba(204, 51, 51, 0.5);
        `;
        
        timeline.appendChild(progressLine);

        // Update progress on scroll
        const updateProgress = AikidoEdge.throttle(() => {
            const timelineRect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const timelineHeight = timeline.offsetHeight;
            
            // Calculate how much of timeline is in view
            const timelineTop = timelineRect.top;
            const timelineBottom = timelineRect.bottom;
            
            let progress = 0;
            
            if (timelineTop < windowHeight && timelineBottom > 0) {
                const visibleTop = Math.max(0, windowHeight - timelineTop);
                const visibleHeight = Math.min(visibleTop, timelineHeight, windowHeight);
                progress = (visibleHeight / timelineHeight) * 100;
            }
            
            progress = Math.min(Math.max(progress, 0), 100);
            progressLine.style.height = `${progress}%`;
            
            // Add pulsing effect when fully visible
            if (progress > 95) {
                progressLine.style.animation = 'pulse-line 2s ease-in-out infinite';
            } else {
                progressLine.style.animation = 'none';
            }
        }, 16);

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
    }

    // Enhanced scroll effects
    setupScrollEffects() {
        // Parallax effect for hero section
        const hero = document.querySelector('.lineage-hero');
        if (hero) {
            window.addEventListener('scroll', AikidoEdge.throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                hero.style.transform = `translateY(${rate}px)`;
            }, 16));
        }

        // Philosophy cards reveal animation
        const philosophyCards = document.querySelectorAll('.philosophy-card');
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.3 });

        philosophyCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            cardObserver.observe(card);
        });

        // Affiliation badges animation
        const affiliationBadges = document.querySelectorAll('.org-badge');
        const badgeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.5 });

        affiliationBadges.forEach(badge => {
            badge.style.opacity = '0';
            badge.style.transform = 'scale(0.8)';
            badge.style.transition = 'all 0.5s ease';
            badgeObserver.observe(badge);
        });
    }

    // Interactive elements and hover effects
    setupInteractiveElements() {
        // Timeline item click interactions
        const timelineItems = document.querySelectorAll('.flow-item');
        timelineItems.forEach(item => {
            const content = item.querySelector('.flow-card');
            const marker = item.querySelector('.flow-marker');
            
            if (content && marker) {
                // Add click handler for mobile
                content.addEventListener('click', () => {
                    this.highlightTimelineItem(item);
                });

                // Enhanced hover effects
                content.addEventListener('mouseenter', () => {
                    marker.style.transform = 'translateX(-50%) scale(1.3)';
                    marker.style.boxShadow = '0 0 25px rgba(204, 51, 51, 0.6)';
                });

                content.addEventListener('mouseleave', () => {
                    if (!item.classList.contains('current')) {
                        marker.style.transform = 'translateX(-50%) scale(1)';
                        marker.style.boxShadow = '0 0 20px rgba(204, 51, 51, 0.4)';
                    }
                });
            }
        });

        // Philosophy card interactions
        const philosophyCards = document.querySelectorAll('.philosophy-card');
        philosophyCards.forEach(card => {
            const icon = card.querySelector('.philosophy-icon');
            
            card.addEventListener('mouseenter', () => {
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Affiliation badge interactions
        const orgBadges = document.querySelectorAll('.org-badge');
        orgBadges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.borderColor = 'var(--primary-black)';
                badge.style.borderWidth = '3px';
            });

            badge.addEventListener('mouseleave', () => {
                badge.style.borderColor = 'var(--accent-red)';
                badge.style.borderWidth = '2px';
            });
        });
    }

    // Highlight specific timeline item
    highlightTimelineItem(item) {
        // Remove highlight from all items
        document.querySelectorAll('.flow-item').forEach(ti => {
            ti.classList.remove('highlighted');
        });

        // Add highlight to selected item
        item.classList.add('highlighted');
        
        // Scroll to item if not in view
        const rect = item.getBoundingClientRect();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        
        if (rect.top < navHeight || rect.bottom > window.innerHeight) {
            item.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }

        // Remove highlight after delay
        setTimeout(() => {
            item.classList.remove('highlighted');
        }, 3000);
    }

    // Accessibility enhancements
    setupAccessibility() {
        // Keyboard navigation for timeline
        const timelineItems = document.querySelectorAll('.flow-item');
        timelineItems.forEach((item, index) => {
            const content = item.querySelector('.flow-card');
            if (content) {
                content.setAttribute('tabindex', '0');
                content.setAttribute('aria-label', `Timeline item ${index + 1}`);
                
                content.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.highlightTimelineItem(item);
                    }
                });
            }
        });

        // Enhanced focus indicators
        const focusableElements = document.querySelectorAll('.flow-card, .philosophy-card, .org-badge');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--accent-red)';
                element.style.outlineOffset = '4px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });

        // Announce timeline progress to screen readers
        const progressAnnouncer = document.createElement('div');
        progressAnnouncer.setAttribute('aria-live', 'polite');
        progressAnnouncer.setAttribute('aria-atomic', 'true');
        progressAnnouncer.className = 'sr-only';
        progressAnnouncer.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(progressAnnouncer);

        // Update announcer when timeline items become visible
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const itemNumber = Array.from(timelineItems).indexOf(entry.target) + 1;
                    progressAnnouncer.textContent = `Timeline item ${itemNumber} of ${timelineItems.length} is now visible`;
                }
            });
        }, { threshold: 0.5 });

        timelineItems.forEach(item => {
            visibilityObserver.observe(item);
        });
    }

    // Page load initialization
    initializePageLoad() {
        // Add loading class
        document.body.classList.add('timeline-loading');
        
        // Smooth page entrance
        window.addEventListener('load', () => {
            document.body.classList.remove('timeline-loading');
            document.body.classList.add('timeline-loaded');
            
            // Trigger initial animations
            this.animatePageEntrance();
        });
    }

    // Page entrance animations
    animatePageEntrance() {
        const hero = document.querySelector('.lineage-hero .hero-content');
        const introSection = document.querySelector('.timeline-intro');
        
        if (hero) {
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                hero.style.transition = 'all 1s ease';
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }, 200);
        }

        if (introSection) {
            introSection.style.opacity = '0';
            introSection.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                introSection.style.transition = 'all 0.8s ease';
                introSection.style.opacity = '1';
                introSection.style.transform = 'translateY(0)';
            }, 600);
        }
    }

    // Method to programmatically jump to specific lineage member
    jumpToLineageMember(memberName) {
        const timelineItems = document.querySelectorAll('.flow-item');
        
        timelineItems.forEach(item => {
            const nameElement = item.querySelector('h3');
            if (nameElement && nameElement.textContent.toLowerCase().includes(memberName.toLowerCase())) {
                this.highlightTimelineItem(item);
                return;
            }
        });
    }
}

// Add CSS for highlighted timeline items
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    .flow-item.highlighted .flow-card {
        border-left-color: var(--primary-black);
        border-left-width: 6px;
        transform: translateX(8px) translateY(-5px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    }

    .flow-item.highlighted .flow-marker {
        transform: scale(1.5);
        box-shadow: 0 0 30px rgba(204, 51, 51, 0.8);
    }

    @keyframes pulse-line {
        0%, 100% {
            box-shadow: 0 0 10px rgba(204, 51, 51, 0.5);
        }
        50% {
            box-shadow: 0 0 20px rgba(204, 51, 51, 0.8);
        }
    }
`;
document.head.appendChild(highlightStyle);

// Timeline navigation utility
class TimelineNavigation {
    constructor(lineagePage) {
        this.lineagePage = lineagePage;
        this.currentIndex = 0;
        this.timelineItems = document.querySelectorAll('.flow-item');
        this.setupKeyboardNavigation();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only activate when timeline is in focus
            const timelineSection = document.querySelector('.timeline-section');
            if (!timelineSection || !timelineSection.contains(document.activeElement)) {
                return;
            }

            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextItem();
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousItem();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToFirst();
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToLast();
                    break;
            }
        });
    }

    nextItem() {
        if (this.currentIndex < this.timelineItems.length - 1) {
            this.currentIndex++;
            this.focusCurrentItem();
        }
    }

    previousItem() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.focusCurrentItem();
        }
    }

    goToFirst() {
        this.currentIndex = 0;
        this.focusCurrentItem();
    }

    goToLast() {
        this.currentIndex = this.timelineItems.length - 1;
        this.focusCurrentItem();
    }

    focusCurrentItem() {
        const currentItem = this.timelineItems[this.currentIndex];
        if (currentItem) {
            this.lineagePage.highlightTimelineItem(currentItem);
            const content = currentItem.querySelector('.flow-card');
            if (content) {
                content.focus();
            }
        }
    }
}

// Initialize lineage page functionality
document.addEventListener('DOMContentLoaded', () => {
    const lineagePage = new LineagePage();
    new TimelineNavigation(lineagePage);
    
    // Export for potential external use
    window.lineagePage = lineagePage;
});

// Export classes for potential use in other scripts
window.LineagePage = LineagePage;
window.TimelineNavigation = TimelineNavigation;