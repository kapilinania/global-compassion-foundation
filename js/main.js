document.addEventListener('DOMContentLoaded', () => {
    // Dynamic footer copyright year update
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
    
    // Header shadow transition on scroll
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header.style.boxShadow = 'var(--shadow-md)';
                header.style.padding = '0.25rem 0';
            } else {
                header.style.boxShadow = 'var(--shadow-sm)';
                header.style.padding = '0';
            }
        });
    }

    // Smooth scroll for nav links and button targets
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                
                // Close mobile menu if active
                const mainNav = document.querySelector('.main-nav');
                const menuToggle = document.getElementById('menu-toggle');
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggle.innerHTML = '&#9776;';
                    }
                }

                // Scroll with offset for sticky header
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Spy active navigation highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const headerHeight = document.querySelector('.site-header').offsetHeight + 40;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Counter Animation function
    const animateCounters = (container) => {
        const counters = container.querySelectorAll('.stat-count');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const frameRate = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const countInterval = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                
                // Ease out quad formula for smooth decelerating animation
                const easeValue = progress * (2 - progress);
                const currentCount = Math.round(target * easeValue);
                
                counter.textContent = currentCount.toLocaleString() + suffix;

                if (frame === totalFrames) {
                    counter.textContent = target.toLocaleString() + suffix;
                    clearInterval(countInterval);
                }
            }, frameRate);
        });
    };

    // Trigger statistics counters when they become visible
    const statsContainer = document.querySelector('.stats-strip');
    if (statsContainer) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters(entry.target);
                    observer.unobserve(entry.target); // Run only once
                }
            });
        }, {
            threshold: 0.2
        });
        statsObserver.observe(statsContainer);
    }
});
