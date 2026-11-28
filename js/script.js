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

    // --- Language switch (English by default, Arabic on demand; remembers the visitor's choice) ---
    const AR = {
        title: 'محمود أحمد | محرر فيديو محترف',
        logo: 'محمود <span>أحمد</span>',
        nav_about: 'نبذة عني',
        nav_skills: 'المهارات',
        nav_projects: 'أعمالي',
        nav_feedback: 'آراء العملاء',
        nav_services: 'الخدمات',
        nav_contact: 'تواصل معي',
        badge: 'سنوات من الخبرة',
        hello: 'مرحباً، أنا',
        name: '<span>محمود</span> <span class="alt">أحمد.</span>',
        role: '<span class="hl">محرر فيديو</span> محترف',
        hero_text: 'أحوّل اللقطات الخام إلى فيديوهات مؤثرة تجعل المشاهد يتابع حتى النهاية — من فيديوهات يوتيوب إلى مقاطع الشورتس والريلز التي تستوقف المتابعين، لصنّاع المحتوى والعلامات التجارية.',
        cta_work: 'شاهد أعمالي',
        cta_talk: '<i class="fab fa-whatsapp"></i> لنتحدث',
        about_eyebrow: 'من أنا',
        about_title: 'نبذة <span class="accent">عني</span>',
        about_lead: 'أنا محمود، محرر فيديو محترف بخبرة <mark>تزيد على 4 سنوات</mark>. أعمل على فيديوهات يوتيوب الطويلة والمحتوى القصير — <mark>الشورتس والريلز وتيك توك</mark> — إلى جانب الأعمال السينمائية والإعلانات التجارية.',
        about_p2: 'المحتوى القصير هو مجال تميّزي الحقيقي: بداية جذابة من الثانية الأولى، وإيقاع سريع، ونصوص واضحة على الشاشة. أما في الفيديوهات الطويلة، فأركّز على السرد والإيقاع اللذين يُبقيان المشاهد حتى النهاية. ومع تصحيح ألوان احترافي وهندسة صوتية متقنة، يأتي كل فيديو منسجماً مع هوية علامتك — سواء كنت صانع محتوى تسعى لتنمية قناتك أو علامة تجارية تطلق حملة جديدة.',
        why_title: 'لماذا تعمل <span class="accent">معي؟</span>',
        why1_t: 'تسليم سريع',
        why1_d: 'مواعيد واضحة وتسليم في الوقت المحدد — دون الحاجة إلى متابعة.',
        why2_t: 'تعديلات مشمولة',
        why2_d: 'نعمل معاً على تحسين المونتاج حتى يصبح كما تريده تماماً.',
        why3_t: 'تواصل سهل',
        why3_d: 'ردود سريعة وتحديثات مستمرة طوال فترة المشروع.',
        why4_t: 'مصمَّم ليحقق النتائج',
        why4_d: 'مونتاج مُعدّ خصيصاً لكل منصة ليجذب الانتباه ويحافظ على المشاهدين.',
        skills_eyebrow: 'ما أتقنه',
        skills_title: 'أبرز <span class="accent">مهاراتي</span>',
        sk1: 'مونتاج الفيديو',
        sk2: 'الصورة والصوت',
        sk3: 'الأدوات والتقنيات',
        sk4: 'فيديوهات الذكاء الاصطناعي',
        ski1: 'شورتس / ريلز / تيك توك',
        ski2: 'فيديوهات يوتيوب الطويلة',
        ski3: 'فيديوهات سينمائية',
        ski4: 'مونتاج إعلاني',
        ski5: 'تصحيح الألوان',
        ski6: 'الهندسة الصوتية',
        ski7: 'نصوص متحركة',
        ski8: 'مؤثرات بصرية وانتقالات',
        ski9: 'العمل بالذكاء الاصطناعي',
        ski10: 'فيديوهات مولَّدة بالذكاء الاصطناعي',
        ski11: 'مشاهد ومرئيات بالذكاء الاصطناعي',
        ski12: 'تعليق صوتي بالذكاء الاصطناعي',
        ski13: 'مونتاج معزَّز بالذكاء الاصطناعي',
        proj_eyebrow: 'أعمال مختارة',
        proj_title: 'معرض <span class="accent">أعمالي</span>',
        works_t: 'أعمالي',
        works_d: 'مجموعة مختارة من أفضل أعمالي في مختلف الأنماط التي أعمل عليها:',
        chip1: '<i class="fas fa-mobile-screen-button"></i> شورتس وريلز',
        chip2: '<i class="fab fa-tiktok"></i> تيك توك',
        chip3: '<i class="fas fa-bullhorn"></i> إعلانات',
        works_btn: '<i class="fab fa-google-drive"></i> شاهد أعمالي',
        fb_eyebrow: 'آراء العملاء',
        fb_t: 'ماذا يقول عملائي',
        fb_d: 'رسائل وتقييمات حقيقية من صنّاع محتوى وعلامات تجارية عملت معهم.',
        fb_btn: '<i class="fas fa-comment-dots"></i> اقرأ آراء العملاء',
        svc_eyebrow: 'الخدمات',
        svc_title: 'ماذا <span class="accent">أقدّم</span>',
        svc1_t: 'شورتس وريلز وتيك توك',
        svc1_d: 'مونتاج عمودي سريع ومؤثر، ببداية جذابة من الثانية الأولى، ونصوص متحركة، وأساليب رائجة تُبقي المشاهدين متابعين.',
        svc2_t: 'فيديوهات يوتيوب الطويلة',
        svc2_d: 'مونتاج يركّز على الاحتفاظ بالمشاهدين: إيقاع مدروس، ولقطات داعمة، ونصوص على الشاشة، وسرد قصصي يُبقي المشاهد حتى النهاية.',
        svc3_t: 'سينمائي وإعلاني',
        svc3_d: 'تصحيح ألوان وهندسة صوتية وإيقاع سردي للإعلانات والعروض الترويجية والمقاطع التشويقية والأفلام التعريفية للعلامات التجارية.',
        svc4_t: 'موشن جرافيك',
        svc4_d: 'عناوين ونصوص متحركة وأشرطة تعريفية ومؤثرات بصرية ترتقي بعلامتك وبجودة إنتاجك.',
        ct_eyebrow: 'لنتعاون معاً',
        ct_title: 'لنصنع فيديوك <span class="accent">القادم.</span>',
        ct_lead: 'هل تريد أن تحظى فيديوهاتك بالمشاهدة فعلاً؟ أرسل لي رسالة، ولنصنع معاً محتوى يستوقف المتابعين.',
        ct_btn: '<i class="fab fa-whatsapp"></i> تواصل عبر واتساب',
        ct_phone: 'الهاتف / واتساب',
        ct_email: 'البريد الإلكتروني',
        ct_loc: 'الموقع',
        ct_loc_v: 'الجيزة، مصر · العمل عن بُعد حول العالم',
        pill: '<i class="fas fa-location-dot"></i> الجيزة · العمل عن بُعد حول العالم',
        copy: '&copy; 2026 محمود أحمد. جميع الحقوق محفوظة.',
        top: 'العودة إلى الأعلى <i class="fas fa-arrow-up"></i>',
        wa: '<i class="fab fa-whatsapp"></i> راسلني على واتساب'
    };

    const i18nEls = [...document.querySelectorAll('[data-i18n]')];
    const EN = { title: document.title };
    i18nEls.forEach(el => { EN[el.dataset.i18n] = el.innerHTML; });

    const langBtn = document.getElementById('lang-toggle');

    function applyLang(lang, live) {
        const dict = lang === 'ar' ? AR : EN;
        root.setAttribute('lang', lang);
        root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.title = dict.title;
        i18nEls.forEach(el => {
            const html = dict[el.dataset.i18n];
            if (html === undefined) return;
            el.innerHTML = html;
            if (live && el.classList.contains('float-text')) {
                splitWords(el);
                el.classList.add('in');
            }
        });
        if (langBtn) {
            const toAr = lang !== 'ar';
            langBtn.setAttribute('lang', toAr ? 'ar' : 'en');
            langBtn.setAttribute('aria-label', toAr ? 'عرض الموقع باللغة العربية' : 'View the site in English');
            langBtn.querySelector('span').textContent = toAr ? 'عربي' : 'English';
        }
    }

    if (root.getAttribute('lang') === 'ar') applyLang('ar', false);

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const next = root.getAttribute('lang') === 'ar' ? 'en' : 'ar';
            applyLang(next, true);
            try { localStorage.setItem('lang', next); } catch (e) { }
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
    function splitWords(el) {
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
    }
    document.querySelectorAll('.float-text').forEach(splitWords);

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
