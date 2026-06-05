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

    // Set active class on navigation links based on current page URL
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href) {
            // Check if href is the current page
            if (currentPath === href || (href === '/' && (currentPath === '/' || currentPath === '' || currentPath.endsWith('/index.html'))) || (href !== '/' && currentPath.endsWith(href))) {
                link.classList.add('active');
            }
        }
    });

    // Core Pillars Tabs Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length > 0 && tabPanes.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Set active button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Set active pane
                tabPanes.forEach(pane => {
                    if (pane.getAttribute('id') === targetTab) {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });
            });
        });
    }

    // Testimonials Slider
    const wrapper = document.querySelector('.testimonial-wrapper');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (wrapper && slides.length > 0 && dots.length > 0) {
        let activeIndex = 0;
        
        const updateSlider = (index) => {
            activeIndex = index;
            wrapper.style.transform = `translateX(-${activeIndex * 100}%)`;
            
            dots.forEach((dot, idx) => {
                if (idx === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };
        
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                updateSlider(idx);
            });
        });
        
        // Auto slide every 5 seconds
        let slideInterval = setInterval(() => {
            let nextIndex = (activeIndex + 1) % slides.length;
            updateSlider(nextIndex);
        }, 5000);

        // Reset timer on click
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(() => {
                    let nextIndex = (activeIndex + 1) % slides.length;
                    updateSlider(nextIndex);
                }, 5000);
            });
        });
    }

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

    // Animate progress bars in Financial Transparency
    const financeContainer = document.querySelector('.finance-grid');
    if (financeContainer) {
        const progressBars = financeContainer.querySelectorAll('.progress-bar');
        const financeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width') || '0%';
                        bar.style.width = targetWidth;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        financeObserver.observe(financeContainer);
    }

    // Team Slider Carousel logic
    const teamWrapper = document.querySelector('.team-slider-wrapper');
    const teamSlides = document.querySelectorAll('.team-slide');
    const teamDots = document.querySelectorAll('.team-dot');
    const teamPrev = document.querySelector('.team-slider-btn.prev');
    const teamNext = document.querySelector('.team-slider-btn.next');

    if (teamWrapper && teamSlides.length > 0) {
        let activeTeamIdx = 0;
        
        const getItemsPerView = () => {
            if (window.innerWidth >= 1024) return 3; // Show 3 items on desktop!
            if (window.innerWidth >= 640) return 2;  // Show 2 items on tablet!
            return 1;                                // Show 1 item on mobile!
        };
        
        const updateTeamSlider = () => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, teamSlides.length - itemsPerView);
            
            // Boundary enforcement
            if (activeTeamIdx > maxIndex) activeTeamIdx = maxIndex;
            if (activeTeamIdx < 0) activeTeamIdx = 0;
            
            const translateX = activeTeamIdx * (100 / itemsPerView);
            teamWrapper.style.transform = `translateX(-${translateX}%)`;
            
            // Update dots active classes and visibility
            teamDots.forEach((dot, idx) => {
                if (idx > maxIndex) {
                    dot.style.display = 'none';
                } else {
                    dot.style.display = 'inline-block';
                    if (idx === activeTeamIdx) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                }
            });
        };
        
        // Autoplay Infinite Loop logic
        let teamInterval = setInterval(() => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, teamSlides.length - itemsPerView);
            activeTeamIdx++;
            if (activeTeamIdx > maxIndex) {
                activeTeamIdx = 0;
            }
            updateTeamSlider();
        }, 4000);

        const resetTeamInterval = () => {
            clearInterval(teamInterval);
            teamInterval = setInterval(() => {
                const itemsPerView = getItemsPerView();
                const maxIndex = Math.max(0, teamSlides.length - itemsPerView);
                activeTeamIdx++;
                if (activeTeamIdx > maxIndex) {
                    activeTeamIdx = 0;
                }
                updateTeamSlider();
            }, 4000);
        };
        
        if (teamPrev && teamNext) {
            teamPrev.addEventListener('click', () => {
                const itemsPerView = getItemsPerView();
                activeTeamIdx--;
                if (activeTeamIdx < 0) {
                    activeTeamIdx = Math.max(0, teamSlides.length - itemsPerView);
                }
                updateTeamSlider();
                resetTeamInterval();
            });
            
            teamNext.addEventListener('click', () => {
                const itemsPerView = getItemsPerView();
                const maxIndex = Math.max(0, teamSlides.length - itemsPerView);
                activeTeamIdx++;
                if (activeTeamIdx > maxIndex) {
                    activeTeamIdx = 0;
                }
                updateTeamSlider();
                resetTeamInterval();
            });
        }
        
        teamDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                activeTeamIdx = idx;
                updateTeamSlider();
                resetTeamInterval();
            });
        });
        
        // Listen to window resizes to recalculate layout
        window.addEventListener('resize', updateTeamSlider);
        updateTeamSlider();
    }
});
