// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 82, 204, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 82, 204, 0.1)';
    }
});

// Intersection Observer for reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('visible'); // Added for the new phase card animations
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-box h3');
    counters.forEach(counter => {
        const target = counter.innerText;
        counter.innerText = '0';
        const increment = setInterval(() => {
            if (parseInt(counter.innerText) < parseInt(target.match(/\d+/)[0])) {
                counter.innerText = parseInt(counter.innerText) + 1;
            } else {
                counter.innerText = target;
                clearInterval(increment);
            }
        }, 30);
    });
}

// Trigger counter animation when hero is in view
window.addEventListener('load', () => {
    setTimeout(animateCounters, 800);
});



// Component 2: Stacked Card Elevation - Scroll-driven stacking
const outcomesSection = document.getElementById('outcomes-section');
const stackCards = document.querySelectorAll('.stack-card');
const stackContainer = document.querySelector('.stacked-cards-container');
const progressBar = document.getElementById('stack-progress-bar');
const outcomesBg = document.querySelector('.outcomes-bg');

if (outcomesSection && stackCards.length && stackContainer) {
    // Set initial card indices and z-indexes
    stackCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
        card.style.zIndex = index + 1;
    });

    const updateStack = () => {
        // Calculate progress based on scroll position relative to the Scroll Track (outcomes-section)
        // NOT the container itself, because the container is sticky.

        const sectionRect = outcomesSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        const viewportHeight = window.innerHeight;

        // We want the animation to start when the section hits the top (0)
        // And end when we have scrolled through the available height

        // Progress 0 when section top is at 0
        // Progress 1 when section bottom is at bottom of viewport (end of scroll)

        const scrollableDistance = sectionHeight - viewportHeight;

        // Use negative top because as we scroll down, top becomes negative
        let rawProgress = -sectionTop / scrollableDistance;

        // Clamp between 0 and 1
        let progress = Math.max(0, Math.min(1, rawProgress));

        // Slight buffer to ensure first card is fully visible at start (optional)
        // progress = progress * 1.05; 

        // Update progress bar
        if (progressBar) {
            progressBar.style.height = `${progress * 100}%`;
        }

        // Calculate visual states
        const activeIndex = Math.floor(progress * stackCards.length);

        // Handle Parallax Background
        if (outcomesBg) {
            const parallaxY = (progress - 0.5) * 50;
            outcomesBg.style.transform = `translateY(${parallaxY}px)`;
        }

        stackCards.forEach((card, index) => {
            // Remove all state classes first
            card.classList.remove('active', 'behind', 'next');

            if (index === activeIndex) {
                // Current active card
                card.classList.add('active');
            } else if (index < activeIndex) {
                // Cards already passed (stacked behind)
                card.classList.add('behind');
            } else {
                // Cards yet to come
                card.classList.add('next');
            }
        });
    };

    // Use Ticking for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateStack();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial call
    updateStack();
}

// About Section - Staggered Delays for Content
document.querySelectorAll('.info-card').forEach((el, index) => {
    el.style.transitionDelay = `${index * 150}ms`;
});
document.querySelectorAll('.highlight-widget').forEach((el, index) => {
    el.style.transitionDelay = `${index * 100}ms`;
});

// Component: Challenge Themes - Sticky Stack
(() => {
    const problemsSection = document.getElementById('challenges');
    const problemCards = document.querySelectorAll('.problem-card');

    if (problemsSection && problemCards.length) {
        // Initial setup not strictly needed as CSS handles opacity transition on load

        const updateProblemsCarousel = () => {
            const sectionRect = problemsSection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const viewportHeight = window.innerHeight;

            const scrollableDistance = sectionHeight - viewportHeight;
            let rawProgress = -sectionTop / scrollableDistance;
            let progress = Math.max(0, Math.min(1, rawProgress));

            // Map progress (0 to 1) to a continuous card index (0 to N-1)
            const totalCards = problemCards.length;
            const currentPosition = progress * (totalCards - 1);

            // Check if mobile
            const isMobile = window.innerWidth <= 768;

            problemCards.forEach((card, index) => {
                const dist = index - currentPosition;

                // --- Mobile Logic (Vertical Slide) ---
                if (isMobile) {
                    // Similar to sticky stack but smoother
                    if (Math.abs(dist) > 1.5) {
                        card.style.opacity = 0;
                        card.style.pointerEvents = 'none';
                        card.style.transform = `translate(-50%, -50%) translateY(100px) scale(0.9)`;
                    } else {
                        // In view
                        const yOffset = dist * 80; // Distance between cards
                        const scale = 1 - Math.abs(dist) * 0.1;
                        const opacity = 1 - Math.abs(dist) * 0.6;

                        card.style.opacity = Math.max(0, opacity);
                        card.style.pointerEvents = Math.abs(dist) < 0.5 ? 'auto' : 'none';
                        card.style.zIndex = Math.round(100 - Math.abs(dist) * 10);
                        card.style.transform = `translate(-50%, -50%) translateY(${yOffset}px) scale(${scale})`;
                    }
                    return;
                }

                // --- Desktop Logic (Horizontal Rotation) ---

                // If far away, hide to save rendering
                if (Math.abs(dist) > 2.5) {
                    card.style.opacity = 0;
                    card.style.pointerEvents = 'none';
                    card.style.transform = `translate(-50%, -50%) translateX(${dist * 200}%) scale(0.5)`;
                    return;
                }

                // Calculate styles
                const opacity = 1 - Math.abs(dist) * 0.4;
                const scale = 1 - Math.abs(dist) * 0.15;
                const translateX = dist * 70; // 70% offset per unit
                const rotateY = -dist * 25; // 25deg rotation
                const zIndex = Math.round(100 - Math.abs(dist) * 10);

                card.style.opacity = Math.max(0, opacity);
                card.style.zIndex = zIndex;
                card.style.pointerEvents = Math.abs(dist) < 0.5 ? 'auto' : 'none'; // Only center clickable

                // Composite transform
                // translate(-50%, -50%) is baseline for centering
                card.style.transform = `translate(-50%, -50%) translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`;
            });
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateProblemsCarousel();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', updateProblemsCarousel);

        // Initial call
        updateProblemsCarousel();
    }
})();