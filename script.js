// script.js

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navbar = document.getElementById('navbar');

mobileMenuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navbar.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navbar.classList.remove('active');
        }
    });
});

// Check if user is logged in and update UI accordingly
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const signUpBtn = document.getElementById('signUpBtn');
    const signInBtn = document.getElementById('signInBtn');

    if (isLoggedIn) {
        // If logged in, replace sign in/up buttons with dashboard link
        if (signUpBtn) signUpBtn.style.display = 'none';
        if (signInBtn) {
            signInBtn.textContent = 'Go to Dashboard';
            signInBtn.onclick = () => window.location.href = 'dashboard.html';
        }
    }
}

// Initialize UI
updateAuthUI();

// Add animation to feature cards
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});
