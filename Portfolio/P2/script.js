document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('formMessage').textContent = "Thank you for reaching out!";
    this.reset();
});
