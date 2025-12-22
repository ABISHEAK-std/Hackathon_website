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
        navbar.style.background = 'rgba(15, 20, 25, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 20, 25, 0.85)';
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
