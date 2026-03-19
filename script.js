document.addEventListener('DOMContentLoaded', () => {

    // --- HERO CANVAS SEQUENCE LOGIC ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 240;

        canvas.width = 1920;
        canvas.height = 1080;

        const currentFrame = index => `assets/sequence/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
        const images = [];

        // Preload all 240 images
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);

            img.onload = () => {
                // Render the first frame as early as possible
                if (i === 1) {
                    renderImage(images[0]);
                }
            };
        }

        function renderImage(img) {
            if (!img) return;

            // Make image 'cover' the canvas exactly
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);

            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#cecece';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }

        const scrollContainer = document.querySelector('.hero-scroll-container');

        window.addEventListener('scroll', () => {
            if (!scrollContainer) return;

            // Maximum scroll distance inside the hero container before it un-sticks
            // Since sticky-slide is roughly 80vh, we subtract it from container height (250vh)
            const stickySlide = document.querySelector('.hero-sticky-slide');
            const maxScroll = scrollContainer.offsetHeight - (stickySlide ? stickySlide.offsetHeight : window.innerHeight);

            // Distance scrolled past the top of the container
            const distance = window.scrollY - scrollContainer.offsetTop;

            let scrollFraction = 0;
            if (maxScroll > 0) {
                // Determine percentage of scroll track traversed
                scrollFraction = distance / maxScroll;
            }

            // Clamp between 0 and 1
            scrollFraction = Math.max(0, Math.min(1, scrollFraction));
            let frameIndex = Math.floor(scrollFraction * (frameCount - 1));

            // Fade out text to reveal product early in animation
            const textOverlay = document.querySelector('.hero-overlay-content');
            if (textOverlay) {
                // Starts fading immediately (0), fully transparent by ~33% mark (0.33)
                let opacity = 1 - (scrollFraction * 3);
                textOverlay.style.opacity = Math.max(0, opacity);
            }

            const buttonsContainer = document.querySelector('.hero-buttons-container');
            if (buttonsContainer) {
                // Reveal near the end of the scroll animation
                if (scrollFraction > 0.85) {
                    buttonsContainer.classList.add('visible');
                } else {
                    buttonsContainer.classList.remove('visible');
                }
            }

            // Use requestAnimationFrame for smooth drawing
            requestAnimationFrame(() => {
                if (images[frameIndex]) {
                    renderImage(images[frameIndex]);
                }
            });
        });
    }

    // --- SEC 2: MULTI-TOOL CANVAS SEQUENCE LOGIC ---
    const toolCanvas = document.getElementById('multi-tool-canvas');
    if (toolCanvas) {
        const toolContext = toolCanvas.getContext('2d');
        const toolFrameCount = 240;

        toolCanvas.width = 1920;
        toolCanvas.height = 1080;

        const currentToolFrame = index => `assets/sequence2/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
        const toolImages = [];

        // Preload all 240 images for Sec 2
        for (let i = 1; i <= toolFrameCount; i++) {
            const img = new Image();
            img.src = currentToolFrame(i);
            toolImages.push(img);

            img.onload = () => {
                if (i === 1) renderToolImage(toolImages[0]);
            };
        }

        function renderToolImage(img) {
            if (!img) return;

            const hRatio = toolCanvas.width / img.width;
            const vRatio = toolCanvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);

            const centerShift_x = (toolCanvas.width - img.width * ratio) / 2;
            const centerShift_y = (toolCanvas.height - img.height * ratio) / 2;

            toolContext.clearRect(0, 0, toolCanvas.width, toolCanvas.height);
            // Black background for Sec 2 blending
            toolContext.fillStyle = '#050505';
            toolContext.fillRect(0, 0, toolCanvas.width, toolCanvas.height);

            toolContext.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }

        const toolScrollContainer = document.querySelector('.multi-tool-scroll-container');
        const labels = document.querySelectorAll('.dynamic-label');

        window.addEventListener('scroll', () => {
            if (!toolScrollContainer) return;

            const stickySlide = document.querySelector('.multi-tool-sticky-slide');
            const maxScroll = toolScrollContainer.offsetHeight - (stickySlide ? stickySlide.offsetHeight : window.innerHeight);
            const distance = window.scrollY - toolScrollContainer.offsetTop;

            let scrollFraction = 0;
            if (maxScroll > 0) {
                scrollFraction = distance / maxScroll;
            }

            scrollFraction = Math.max(0, Math.min(1, scrollFraction));
            let frameIndex = Math.floor(scrollFraction * (toolFrameCount - 1));

            // Fade out header and footer text to reveal the product early in animation
            const toolHeader = document.querySelector('.multi-tool-header');
            const toolFooter = document.querySelector('.multi-tool-footer');
            if (toolHeader && toolFooter) {
                // Starts fading immediately (0), fully transparent by ~33% mark (0.33)
                let opacity = 1 - (scrollFraction * 3);
                toolHeader.style.opacity = Math.max(0, opacity);
                toolFooter.style.opacity = Math.max(0, opacity);
            }

            // Use requestAnimationFrame for smooth drawing
            requestAnimationFrame(() => {
                if (toolImages[frameIndex]) {
                    renderToolImage(toolImages[frameIndex]);
                }

                // --- Dynamic Label Triggers ---
                // The frame numbers from index.html (40, 60, 80, 100) are compared against the current array index.
                labels.forEach(label => {
                    const triggerFrame = parseInt(label.getAttribute('data-frame'), 10);
                    // Add .active if we are AT or PAST the trigger frame
                    if (frameIndex >= triggerFrame) {
                        label.classList.add('active');
                    } else {
                        label.classList.remove('active');
                    }
                });
            });
        });
    }

    // Scroll Reveal Animation for brochure slides
    const reveals = document.querySelectorAll('.reveal');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(el => {
        observer.observe(el);
    });

    // Smooth Scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle Navbar transparency on scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '15px 0';
            nav.style.background = 'rgba(206, 206, 206, 0.9)';
        } else {
            nav.style.padding = '20px 0';
            nav.style.background = 'rgba(206, 206, 206, 0.7)';
        }
    });

    // --- REVIEW CAROUSEL LOGIC ---
    const reviewCards = document.querySelectorAll(".review-card");
    const reviewDots = document.querySelectorAll(".dot");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");
    let currentReviewIndex = 0;
    let isReviewAnimating = false;

    if (reviewCards.length > 0) {
        function updateReviewCarousel(newIndex) {
            if (isReviewAnimating) return;
            isReviewAnimating = true;

            currentReviewIndex = (newIndex + reviewCards.length) % reviewCards.length;

            reviewCards.forEach((card, i) => {
                const offset = (i - currentReviewIndex + reviewCards.length) % reviewCards.length;

                card.classList.remove("center", "left-1", "right-1", "hidden");

                if (offset === 0) {
                    card.classList.add("center");
                } else if (offset === reviewCards.length - 1) {
                    card.classList.add("left-1");
                } else if (offset === 1) {
                    card.classList.add("right-1");
                } else {
                    card.classList.add("hidden");
                }
            });

            reviewDots.forEach((dot, i) => {
                dot.classList.toggle("active", i === currentReviewIndex);
            });

            setTimeout(() => {
                isReviewAnimating = false;
            }, 800);
        }

        if (leftArrow) leftArrow.addEventListener("click", () => updateReviewCarousel(currentReviewIndex - 1));
        if (rightArrow) rightArrow.addEventListener("click", () => updateReviewCarousel(currentReviewIndex + 1));

        reviewDots.forEach((dot, i) => dot.addEventListener("click", () => updateReviewCarousel(i)));
        reviewCards.forEach((card, i) => card.addEventListener("click", () => updateReviewCarousel(i)));

        let touchStartX = 0;
        let touchEndX = 0;

        const reviewContainer = document.querySelector('.review-carousel-container');
        if (reviewContainer) {
            reviewContainer.addEventListener("touchstart", (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            reviewContainer.addEventListener("touchend", (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) updateReviewCarousel(currentReviewIndex + 1);
                else updateReviewCarousel(currentReviewIndex - 1);
            }
        }

        updateReviewCarousel(0);
    }
});
