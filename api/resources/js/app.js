require('./bootstrap');
import ScrollReveal from 'scrollreveal';

document.addEventListener('DOMContentLoaded', () => {
    ScrollReveal().reveal('.scroll-fide', {
        delay: 200,
        distance: '50px',
        origin: 'bottom',
        duration: 800,
        reset: false
    });
});