const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const navToggle = document.querySelector('.nav-toggle');
const navUl = document.querySelector('nav ul');

// Navigation scroll and active state
navLinks.forEach(link => link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    // For visibility toggling: only show the right section
    sections.forEach(s => s.classList.remove('visible'));
    document.getElementById(targetId).classList.add('visible');
    // Close menu on mobile
    navUl.classList.remove('open');
}));

// Hamburger mobile menu
navToggle.addEventListener('click', () => navUl.classList.toggle('open'));

// Form feedback
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('formStatus').textContent = "Message sent! I'll get back to you soon.";
        this.reset();
    });
}
