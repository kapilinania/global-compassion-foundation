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
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
            link.classList.remove('active');
            if ((currentPath.endsWith(href) && href !== 'index.html') || (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === ''))) {
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

    // ==========================================================================
    // Interactive Visitor Counter Hub (Google Sheets Integration)
    // ==========================================================================
    // INSTRUCTIONS: Once you deploy your Google Apps Script, paste the Web App URL below
    // Example: const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
    const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycby1XmGgUPLvPHJsi6djJmaVROt3Xaw9h5F80k9QYA8tmklHjtEDRKwigq4QKvLceL7a/exec';

    const initVisitorCounter = () => {
        const panel = document.getElementById('visitor-counter-panel');
        if (!panel) return;

        const totalVisitsEl = document.getElementById('total-visits-digits');
        const sessionViewsEl = document.getElementById('session-views-digits');
        const pulseBtn = document.getElementById('btn-support-pulse');

        // 1. Initialize Local Storage Fallback Total Count
        let fallbackVisits = parseInt(localStorage.getItem('gcf_total_visits'), 10);
        if (isNaN(fallbackVisits)) {
            fallbackVisits = 24785; // Default baseline starting count
            localStorage.setItem('gcf_total_visits', fallbackVisits);
        }

        // 2. Initialize Session Pageviews (using sessionStorage)
        let sessionViews = parseInt(sessionStorage.getItem('gcf_session_views'), 10);
        if (isNaN(sessionViews)) {
            sessionViews = 0;
        }
        sessionViews++;
        sessionStorage.setItem('gcf_session_views', sessionViews);

        // Render helper for odometer style display digits
        const renderOdometer = (element, value, padLength, isAccent = false) => {
            if (!element) return;
            const strVal = String(value).padStart(padLength, '0');
            element.innerHTML = '';

            for (let i = 0; i < strVal.length; i++) {
                const digitBox = document.createElement('span');
                digitBox.className = 'digit-box' + (isAccent ? ' accent-digit' : '');
                digitBox.textContent = strVal[i];
                element.appendChild(digitBox);
            }
        };

        // Render session views immediately (local only)
        renderOdometer(sessionViewsEl, sessionViews, 2, true);

        // Fetch / write total visits to Google Sheets
        const fetchAndUpdateVisits = async (isPulse = false) => {
            if (!GOOGLE_SHEET_API_URL) {
                // If API URL is not set yet, use the local storage fallback logic
                if (!isPulse) {
                    fallbackVisits++; // Increment on page load
                } else {
                    fallbackVisits++; // Increment on support pulse click
                }
                localStorage.setItem('gcf_total_visits', fallbackVisits);
                renderOdometer(totalVisitsEl, fallbackVisits, 5);
                return;
            }

            try {
                // Add unique timestamp to prevent browser cache
                const url = `${GOOGLE_SHEET_API_URL}?nocache=${new Date().getTime()}`;

                const response = await fetch(url);
                if (!response.ok) throw new Error('API server returned status error');

                const data = await response.json();
                if (data && data.total_visits) {
                    const count = parseInt(data.total_visits, 10);
                    // Sync fallback value with database
                    localStorage.setItem('gcf_total_visits', count);
                    fallbackVisits = count;
                    renderOdometer(totalVisitsEl, count, 5);
                } else {
                    throw new Error('Data payload missing total_visits field');
                }
            } catch (error) {
                console.warn('Visitor counter API call failed. Using local storage fallback:', error);

                // Fallback increment logic on failure
                if (!isPulse) {
                    fallbackVisits++;
                } else {
                    fallbackVisits++;
                }
                localStorage.setItem('gcf_total_visits', fallbackVisits);
                renderOdometer(totalVisitsEl, fallbackVisits, 5);
            }
        };

        // Initial hit registration on load
        fetchAndUpdateVisits(false);

        // 3. Support Pulse Button Interaction
        if (pulseBtn) {
            let isCooldown = false;

            pulseBtn.addEventListener('click', (e) => {
                if (isCooldown) return;
                isCooldown = true;

                // Increment count
                fetchAndUpdateVisits(true);

                // Visual feedback: glow digits
                if (totalVisitsEl) {
                    totalVisitsEl.style.filter = 'brightness(1.8) drop-shadow(0 0 8px #10b981)';
                    totalVisitsEl.style.transition = 'filter 0.2s ease';
                    setTimeout(() => {
                        totalVisitsEl.style.filter = 'none';
                    }, 400);
                }

                // Create floating particle animation
                createPulseParticle(e);

                // Button success animation
                const originalHTML = pulseBtn.innerHTML;
                pulseBtn.innerHTML = '<span>Pulse Transmitted!</span> <i class="fas fa-check"></i>';
                pulseBtn.style.background = 'linear-gradient(135deg, #065f46 0%, #047857 100%)';
                pulseBtn.style.pointerEvents = 'none';
                pulseBtn.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    pulseBtn.innerHTML = originalHTML;
                    pulseBtn.style.background = '';
                    pulseBtn.style.pointerEvents = 'auto';
                    pulseBtn.style.transform = '';
                    isCooldown = false;
                }, 2000);
            });
        }

        const createPulseParticle = (e) => {
            const particle = document.createElement('span');
            particle.className = 'pulse-particle';

            const icons = ['fa-heart', 'fa-hand-holding-heart', 'fa-star', 'fa-plus'];
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            particle.innerHTML = `<i class="fas ${randomIcon}"></i>`;

            let x, y;
            if (e && e.clientX && e.clientY) {
                x = e.clientX;
                y = e.clientY + window.scrollY;
            } else {
                const rect = pulseBtn.getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2 + window.scrollY;
            }

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1200);
        };
    };

    // Run visitor counter initialization
    initVisitorCounter();

    // ==========================================================================
    // Interactive Field Updates Gallery & Lightbox
    // ==========================================================================
    const initUpdatesGallery = () => {
        const stageWrapper = document.getElementById('update-main-stage');
        const stageImage = document.getElementById('update-stage-image');
        const stageCaption = document.getElementById('update-stage-caption-text');
        const photoNumEl = document.getElementById('current-photo-num');
        const prevBtn = document.getElementById('update-prev-btn');
        const nextBtn = document.getElementById('update-next-btn');
        const thumbBtns = document.querySelectorAll('.update-thumb-btn');

        const lightboxModal = document.getElementById('gcf-lightbox-modal');
        const modalImg = document.getElementById('modal-img');
        const modalCaption = document.getElementById('modal-caption');
        const modalCounter = document.getElementById('modal-counter');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalPrevBtn = document.getElementById('modal-prev-btn');
        const modalNextBtn = document.getElementById('modal-next-btn');

        if (!stageWrapper || !stageImage || thumbBtns.length === 0) return;

        const photos = Array.from(thumbBtns).map(btn => {
            const img = btn.querySelector('img');
            return {
                src: btn.getAttribute('data-src') || (img ? img.src : ''),
                caption: btn.getAttribute('data-caption') || (img ? img.alt : ''),
                alt: img ? img.alt : 'Tuichawng Raincoat Distribution'
            };
        });

        let currentIndex = 0;

        const updateStage = (index) => {
            currentIndex = (index + photos.length) % photos.length;
            const currentPhoto = photos[currentIndex];

            // Animate transition
            stageImage.style.opacity = '0.3';
            setTimeout(() => {
                stageImage.src = currentPhoto.src;
                stageImage.alt = currentPhoto.alt;
                stageImage.style.opacity = '1';
            }, 150);

            if (stageCaption) {
                stageCaption.textContent = currentPhoto.caption;
            }
            if (photoNumEl) {
                photoNumEl.textContent = currentIndex + 1;
            }

            thumbBtns.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === currentIndex);
            });
        };

        // Thumbnail Clicks
        thumbBtns.forEach((btn, idx) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateStage(idx);
            });
        });

        // Prev / Next on Stage
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateStage(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateStage(currentIndex + 1);
            });
        }

        // Lightbox Functions
        const openLightbox = (index) => {
            if (!lightboxModal) return;
            currentIndex = (index + photos.length) % photos.length;
            const currentPhoto = photos[currentIndex];

            if (modalImg) {
                modalImg.src = currentPhoto.src;
                modalImg.alt = currentPhoto.alt;
            }
            if (modalCaption) {
                modalCaption.textContent = currentPhoto.caption;
            }
            if (modalCounter) {
                modalCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
            }

            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            if (!lightboxModal) return;
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        const updateLightbox = (index) => {
            currentIndex = (index + photos.length) % photos.length;
            const currentPhoto = photos[currentIndex];

            if (modalImg) {
                modalImg.style.opacity = '0.3';
                setTimeout(() => {
                    modalImg.src = currentPhoto.src;
                    modalImg.alt = currentPhoto.alt;
                    modalImg.style.opacity = '1';
                }, 120);
            }
            if (modalCaption) {
                modalCaption.textContent = currentPhoto.caption;
            }
            if (modalCounter) {
                modalCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
            }

            // Sync with main stage
            updateStage(currentIndex);
        };

        // Open lightbox on stage click (unless clicking nav button)
        stageWrapper.addEventListener('click', (e) => {
            if (e.target.closest('.update-stage-btn')) return;
            openLightbox(currentIndex);
        });

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeLightbox);
        }

        if (modalPrevBtn) {
            modalPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateLightbox(currentIndex - 1);
            });
        }

        if (modalNextBtn) {
            modalNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateLightbox(currentIndex + 1);
            });
        }

        // Close on background backdrop click
        if (lightboxModal) {
            lightboxModal.addEventListener('click', (e) => {
                if (e.target === lightboxModal || e.target.classList.contains('gcf-lightbox-body') || e.target.classList.contains('gcf-lightbox-img-wrapper')) {
                    closeLightbox();
                }
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                updateLightbox(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateLightbox(currentIndex + 1);
            }
        });
    };

    initUpdatesGallery();
});
