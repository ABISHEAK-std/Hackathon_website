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

// Horizontal scroll for problems section with vertical scroll lock
const problemsSection = document.querySelector('.problems');
const problemsContainer = document.getElementById('problemsContainer');
const problemsWrapper = document.querySelector('.problems-scroll-wrapper');
let isInProblemsSection = false;
let isScrollLocked = false;

// Check if user is in problems section
function checkProblemsSection() {
    const rect = problemsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible && !isInProblemsSection) {
        isInProblemsSection = true;
        isScrollLocked = true;
    } else if (!isVisible && isInProblemsSection) {
        isInProblemsSection = false;
        isScrollLocked = false;
    }
}

// Check if horizontal scroll is at the end
function isAtEndOfHorizontalScroll() {
    const container = problemsWrapper;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;
    // Allow small threshold for rounding errors
    return currentScroll >= maxScroll - 10;
}

// Handle wheel events - convert vertical scroll to horizontal when in problems section
problemsWrapper.addEventListener('wheel', (e) => {
    if (isInProblemsSection && !isAtEndOfHorizontalScroll()) {
        e.preventDefault();
        // Convert vertical scroll to horizontal
        problemsWrapper.scrollLeft += e.deltaY;
    } else if (isInProblemsSection && isAtEndOfHorizontalScroll()) {
        // Allow vertical scroll only when at the end
        isScrollLocked = false;
    }
}, { passive: false });

// Prevent vertical scroll when scroll is locked
window.addEventListener('wheel', (e) => {
    if (isScrollLocked && isInProblemsSection && !isAtEndOfHorizontalScroll()) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent touch scroll when scroll is locked (for mobile)
let touchStartX = 0;
let touchStartY = 0;

problemsWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

problemsWrapper.addEventListener('touchmove', (e) => {
    if (!isInProblemsSection) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchStartX - touchX;
    const deltaY = touchStartY - touchY;
    
    // If horizontal movement is greater, allow it and prevent vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && !isAtEndOfHorizontalScroll()) {
        e.preventDefault();
    } else if (isAtEndOfHorizontalScroll()) {
        // Allow vertical scroll when at end
        isScrollLocked = false;
    }
}, { passive: false });

// Monitor scroll position
problemsWrapper.addEventListener('scroll', () => {
    if (isAtEndOfHorizontalScroll()) {
        isScrollLocked = false;
    } else if (isInProblemsSection) {
        isScrollLocked = true;
    }
});

// Monitor window scroll to detect when entering/exiting problems section
window.addEventListener('scroll', checkProblemsSection);
window.addEventListener('resize', checkProblemsSection);

// Initial check
checkProblemsSection();

// Set initial scroll position to the right (start from right side)
function initializeProblemsScroll() {
    if (problemsWrapper) {
        // Scroll to the rightmost position
        problemsWrapper.scrollLeft = problemsWrapper.scrollWidth;
    }
}

// Initialize on load and when section becomes visible
window.addEventListener('load', () => {
    setTimeout(initializeProblemsScroll, 100);
});

// Also initialize when section enters viewport
const problemsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(initializeProblemsScroll, 100);
        }
    });
}, { threshold: 0.1 });

if (problemsSection) {
    problemsObserver.observe(problemsSection);
}