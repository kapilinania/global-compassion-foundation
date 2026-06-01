document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            
            // Update accessibility attribute
            const isExpanded = mainNav.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Toggle icon (Cross vs Hamburger)
            if (isExpanded) {
                navToggle.innerHTML = '&#10005;'; // Unicode Cross icon
            } else {
                navToggle.innerHTML = '&#9776;'; // Unicode Hamburger icon
            }
        });
        
        // Close menu if user clicks outside of navigation container
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && e.target !== navToggle) {
                mainNav.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '&#9776;';
            }
        });
    }
});
