document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && mainNav) {
        // Create backdrop overlay dynamically if it doesn't exist
        let overlay = document.querySelector('.nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
        }

        const openMenu = () => {
            mainNav.classList.add('active');
            navToggle.classList.add('active');
            overlay.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        };

        const closeMenu = () => {
            mainNav.classList.remove('active');
            navToggle.classList.remove('active');
            overlay.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Restore background scrolling
        };

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mainNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu if user clicks on overlay
        overlay.addEventListener('click', closeMenu);
        
        // Close menu if user clicks outside of navigation container
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && e.target !== navToggle) {
                closeMenu();
            }
        });

        // Close menu when clicking nav links (important for page transitions)
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});
