const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const navToggle = document.querySelector('.nav-toggle');
const navUl = document.querySelector('nav ul');
const themeToggle = document.getElementById('theme-toggle');

// Navigation, smooth scroll, and section reveal
navLinks.forEach(link => link.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute('href').slice(1);
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    sections.forEach(s => s.classList.remove('visible'));
    document.getElementById(id).classList.add('visible');
    navUl.classList.remove('open');
}));

navToggle.addEventListener('click', () => navUl.classList.toggle('open'));

// Glassmorphism dark/light toggle
themeToggle.addEventListener('change', () => {
    if(themeToggle.checked){
        document.body.style.background = 'linear-gradient(120deg,#11131a 0%,#222945 100%)';
        document.body.style.color = '#ebebeb';
        document.documentElement.style.setProperty('--nav-bg','rgba(30,36,50,0.99)');
        document.documentElement.style.setProperty('--glass-bg','rgba(50,54,66,0.16)');
        document.documentElement.style.setProperty('--text','#ebebeb');
        document.documentElement.style.setProperty('--primary','#b4d2fe');
    } else {
        document.body.style.background = '';
        document.body.style.color = '';
        document.documentElement.style.setProperty('--nav-bg','rgba(255,255,255,0.98)');
        document.documentElement.style.setProperty('--glass-bg','rgba(255,255,255,0.06)');
        document.documentElement.style.setProperty('--text','#283149');
        document.documentElement.style.setProperty('--primary','#374785');
    }
});

// Typing animation for hero
const typedText = ["interactive sites.", "dynamic dashboards.", "beautiful UI.", "real web solutions."];
let typingIdx=0, charIdx=0, inDelete=false; 
function typeAnim(){ 
    const el = document.querySelector('.typed');
    if(!el) return;
    if(!inDelete && charIdx <= typedText[typingIdx].length){
        el.textContent = typedText[typingIdx].slice(0,charIdx);
        charIdx++;
        setTimeout(typeAnim, 60);
    } else if(charIdx > typedText[typingIdx].length) {
        inDelete = true;
        setTimeout(typeAnim, 800);
    } else if(inDelete && charIdx>0){
        el.textContent = typedText[typingIdx].slice(0,charIdx-1);
        charIdx--;
        setTimeout(typeAnim, 38);
    }else {
        inDelete=false; 
        typingIdx=(typingIdx+1)%typedText.length;
        setTimeout(typeAnim,400);
    }
}
typeAnim();

// Contact form
const form = document.getElementById('contactForm');
if(form){
    form.addEventListener('submit', function(e){
        e.preventDefault();
        document.getElementById('formStatus').textContent = "Message sent! I'll get back to you soon.";
        this.reset();
    });
}

// Section reveal on scroll (optional, adds fade-in on scroll to visible area)
const animEls = document.querySelectorAll('.animate');
window.addEventListener('scroll',()=>{
    animEls.forEach((el)=>{
        if(el.getBoundingClientRect().top < window.innerHeight *0.85){
            el.classList.add('float-in');
        }
    })
});
