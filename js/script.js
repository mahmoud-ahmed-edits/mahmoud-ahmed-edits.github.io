/*! © 2026 Mahmoud Ahmed. All Rights Reserved. Copying or reusing this code or design without written permission is not allowed. */
(function () {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Theme toggle (light by default, remembers the visitor's choice) ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const themeColor = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.classList.toggle('fa-sun', theme === 'dark');
            themeIcon.classList.toggle('fa-moon', theme !== 'dark');
        }
        if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#1d1a1a' : '#8f8a87');
    }

    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) { }
        });
    }

    // --- Mobile menu ---
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    function setMenu(open) {
        if (!navLinks || !mobileBtn) return;
        navLinks.classList.toggle('active', open);
        navbar.classList.toggle('menu-open', open);
        mobileBtn.setAttribute('aria-expanded', String(open));
        const i = mobileBtn.querySelector('i');
        i.classList.toggle('fa-bars', !open);
        i.classList.toggle('fa-times', open);
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navbar.contains(e.target)) setMenu(false);
        });
    }

    // --- Smooth scrolling with navbar offset ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });

    // --- Floating drop-shadow text: split headings into words ---
    document.querySelectorAll('.float-text').forEach(el => {
        const units = [];
        [...el.childNodes].forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent.split(/(\s+)/).forEach(part => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { units.push(document.createTextNode(' ')); return; }
                    const w = document.createElement('span');
                    w.className = 'word';
                    w.textContent = part;
                    units.push(w);
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.classList.add('word');
                units.push(node);
            }
        });
        el.textContent = '';
        let n = 0;
        units.forEach(u => {
            if (u.nodeType === Node.ELEMENT_NODE) {
                u.style.setProperty('--d', `${(n * 0.12).toFixed(2)}s`);
                n++;
            }
            el.appendChild(u);
        });
    });

    // --- Reveal on scroll ---
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add(entry.target.classList.contains('float-text') ? 'in' : 'visible');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Stagger siblings inside grids
    document.querySelectorAll('.why-grid, .skills-grid, .projects-split, .svc-list, .contact-cards').forEach(group => {
        group.querySelectorAll('.animate-on-scroll').forEach((el, i) => el.style.setProperty('--delay', `${i * 0.1}s`));
    });

    // Hero plays in sequence on load
    document.querySelectorAll('.hero-section .reveal').forEach((el, i) => {
        el.style.setProperty('--delay', `${0.15 + i * 0.12}s`);
    });

    const heroName = document.querySelector('.hero-name');
    requestAnimationFrame(() => {
        document.querySelectorAll('.hero-section .reveal').forEach(el => el.classList.add('visible'));
        if (heroName) {
            heroName.querySelectorAll('.word').forEach((w, i) => w.style.setProperty('--d', `${0.35 + i * 0.16}s`));
            heroName.classList.add('in');
        }
    });

    document.querySelectorAll('.animate-on-scroll, .float-text:not(.hero-name)').forEach(el => io.observe(el));

    // --- Light that follows the mouse inside cards ---
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.skill-card, .why-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - r.left}px`);
                card.style.setProperty('--my', `${e.clientY - r.top}px`);
            });
        });
    }

    // --- Count-up for years ---
    document.querySelectorAll('.count').forEach(el => {
        const target = parseInt(el.dataset.target, 10) || 0;
        if (reduceMotion) { el.textContent = target; return; }
        let n = 0;
        const step = () => {
            el.textContent = ++n;
            if (n < target) setTimeout(step, 200);
        };
        setTimeout(step, 700);
    });

    // --- Scroll progress, navbar state, floating WhatsApp (mobile) ---
    const bar = document.querySelector('.scroll-progress');
    const wa = document.querySelector('.wa-float');
    const hero = document.querySelector('.hero-section');
    const contact = document.querySelector('#contact');
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        if (navbar) navbar.classList.toggle('scrolled', y > 40);
        if (wa && hero && contact) {
            const pastHero = y > hero.offsetHeight * 0.7;
            const atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.85;
            wa.classList.toggle('show', pastHero && !atContact);
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    // --- Video modal (used when videos are added to the Projects section) ---
    const videoModal = document.getElementById('video-modal');
    const player = document.getElementById('modal-video-player');
    const modalContent = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close-modal');
    const wrapper = document.querySelector('.video-wrapper');

    function getYouTubeId(url) {
        const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
        if (m && m[2].length === 11) return m[2];
        const s = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
        return s ? s[1] : null;
    }

    function closeVideo() {
        videoModal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            videoModal.style.display = 'none';
            player.pause();
            player.removeAttribute('src');
            player.style.display = 'block';
            const iframe = wrapper.querySelector('iframe');
            if (iframe) iframe.remove();
        }, 400);
    }

    if (videoModal && player) {
        document.querySelectorAll('.video-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const src = thumb.getAttribute('data-video-src');
                if (!src) return;
                const id = getYouTubeId(src);
                const old = wrapper.querySelector('iframe');
                if (old) old.remove();
                if (id) {
                    player.style.display = 'none';
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;
                    wrapper.appendChild(iframe);
                } else {
                    player.style.display = 'block';
                    player.src = src;
                    player.play();
                }
                videoModal.style.display = 'flex';
                void videoModal.offsetWidth;
                videoModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });
        if (closeBtn) closeBtn.addEventListener('click', closeVideo);
        videoModal.addEventListener('click', (e) => { if (!modalContent.contains(e.target)) closeVideo(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && videoModal.classList.contains('show')) closeVideo(); });
    }
})();
