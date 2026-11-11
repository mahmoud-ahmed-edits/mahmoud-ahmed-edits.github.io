document.addEventListener('DOMContentLoaded', () => {

    // --- Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = themeToggleBtn.querySelector('i');

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const btnIcon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            btnIcon.classList.remove('fa-bars');
            btnIcon.classList.add('fa-times');
        } else {
            btnIcon.classList.remove('fa-times');
            btnIcon.classList.add('fa-bars');
        }
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileBtn.querySelector('i').classList.remove('fa-times');
            mobileBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // --- Scroll Animations ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                const headerOffset = 80;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // --- About Slideshow ---
    const slides = document.querySelectorAll('.about-slideshow .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 3500;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }

    // --- Video Modal ---
    const videoModal = document.getElementById('video-modal');
    const modalVideoPlayer = document.getElementById('modal-video-player');
    const closeModalBtn = document.querySelector('.close-modal');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const modalContent = document.querySelector('.modal-content');

    if (videoModal && modalVideoPlayer) {
        function getYouTubeId(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) return match[2];
            const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
            if (shortsMatch && shortsMatch[1]) return shortsMatch[1];
            return null;
        }

        videoThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const videoSrc = thumbnail.getAttribute('data-video-src');
                if (videoSrc) {
                    const youtubeId = getYouTubeId(videoSrc);
                    const videoWrapper = document.querySelector('.video-wrapper');
                    const existingIframe = videoWrapper.querySelector('iframe');
                    if (existingIframe) existingIframe.remove();

                    if (youtubeId) {
                        modalVideoPlayer.style.display = 'none';
                        modalVideoPlayer.src = "";
                        const iframe = document.createElement('iframe');
                        iframe.setAttribute('src', `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`);
                        iframe.setAttribute('frameborder', '0');
                        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                        iframe.setAttribute('allowfullscreen', '');
                        videoWrapper.appendChild(iframe);
                    } else {
                        modalVideoPlayer.style.display = 'block';
                        modalVideoPlayer.src = videoSrc;
                        modalVideoPlayer.play();
                    }

                    videoModal.style.display = 'flex';
                    void videoModal.offsetWidth;
                    videoModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeVideoModal() {
            videoModal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => {
                videoModal.style.display = 'none';
                modalVideoPlayer.pause();
                modalVideoPlayer.currentTime = 0;
                modalVideoPlayer.src = "";
                modalVideoPlayer.style.display = 'block';
                const videoWrapper = document.querySelector('.video-wrapper');
                const iframe = videoWrapper.querySelector('iframe');
                if (iframe) iframe.remove();
            }, 400);
        }

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeVideoModal);
        videoModal.addEventListener('click', (e) => {
            if (!modalContent.contains(e.target)) closeVideoModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('show')) closeVideoModal();
        });
    }

});

/* ===============================
   ANIMATION PACK
   =============================== */
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // --- Cursor glow that follows the mouse ---
    const glow = document.querySelector('.cursor-glow');
    const dot = document.querySelector('.cursor-dot');
    if (glow && dot && finePointer && !reduceMotion) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let gx = mx, gy = my;
        window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px)`;
            document.body.classList.add('has-cursor');
        });
        document.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));
        (function follow() {
            gx += (mx - gx) * 0.12;
            gy += (my - gy) * 0.12;
            glow.style.transform = `translate(${gx}px, ${gy}px)`;
            requestAnimationFrame(follow);
        })();
        document.querySelectorAll('a, button, .tilt, .tilt-soft').forEach(el => {
            el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
            el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
        });
    }

    // --- Scroll progress bar + navbar shrink ---
    const bar = document.querySelector('.scroll-progress');
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        if (bar) bar.style.transform = `scaleX(${p})`;
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Count-up numbers ---
    document.querySelectorAll('.count').forEach(el => {
        const target = parseInt(el.dataset.target, 10) || 0;
        if (reduceMotion) { el.textContent = target; return; }
        let n = 0;
        const step = () => {
            n++;
            el.textContent = n;
            if (n < target) setTimeout(step, 180);
        };
        setTimeout(step, 600);
    });

    // --- Stagger reveal inside grids ---
    document.querySelectorAll('.services-grid, .why-grid, .projects-split, .contact-cards').forEach(grid => {
        grid.querySelectorAll('.animate-on-scroll').forEach((el, idx) => {
            el.style.setProperty('--delay', `${idx * 0.12}s`);
        });
    });

    // --- 3D tilt + spotlight on cards ---
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.tilt, .tilt-soft').forEach(card => {
            const max = card.classList.contains('tilt-soft') ? 4 : 8;
            card.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'transform' && card.classList.contains('visible')) card.classList.add('tilt-ready');
            });
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                card.style.setProperty('--mx', `${x * 100}%`);
                card.style.setProperty('--my', `${y * 100}%`);
                if (card.classList.contains('tilt-ready')) {
                    card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateY(-4px)`;
                }
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });

        // --- Magnetic buttons ---
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.translate = `${x * 0.25}px ${y * 0.35}px`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.translate = ''; });
        });

        // --- Hero parallax on mouse move ---
        const hero = document.querySelector('.hero-section');
        const blobs = document.querySelector('.hero-blobs');
        const ring = document.querySelector('.hero-image-content');
        if (hero && blobs && ring) {
            hero.addEventListener('mousemove', (e) => {
                const x = e.clientX / window.innerWidth - 0.5;
                const y = e.clientY / window.innerHeight - 0.5;
                blobs.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
                ring.style.translate = `${x * 18}px ${y * 18}px`;
            });
        }
    }
});

// --- Split "My Works" into letters for the animation ---
document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char' + (ch === ' ' ? ' space' : '');
        span.textContent = ch === ' ' ? ' ' : ch;
        span.style.setProperty('--i', i);
        span.setAttribute('aria-hidden', 'true');
        el.appendChild(span);
    });
});
