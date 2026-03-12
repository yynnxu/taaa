// TAAA - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
        });
        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            }
        });
    }

    // --- Scroll-triggered animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.pillar-card, .event-card, .event-card-full, .section-intro, .section-body, .cta-card, .contact-info-card, .benefit-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    // --- Expand/collapse event cards ---
    document.querySelectorAll('.btn-more').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.event-card-compact');
            const isExpanded = card.classList.toggle('expanded');
            btn.setAttribute('aria-expanded', String(isExpanded));
            btn.innerHTML = isExpanded ? 'Less' : 'More&hellip;';
        });
    });

    // --- Lightbox for gallery images ---
    const galleryImages = document.querySelectorAll('.gallery-grid img, .event-hero-img');
    if (galleryImages.length > 0) {
        // Create lightbox element
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>
            <button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>
            <img src="" alt="Gallery image">
        `;
        document.body.appendChild(lightbox);

        const lbImg = lightbox.querySelector('img');
        const lbClose = lightbox.querySelector('.lightbox-close');
        const lbPrev = lightbox.querySelector('.lightbox-prev');
        const lbNext = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;
        const allImages = Array.from(galleryImages);

        function openLightbox(index) {
            currentIndex = index;
            lbImg.src = allImages[currentIndex].src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function navigate(dir) {
            currentIndex = (currentIndex + dir + allImages.length) % allImages.length;
            lbImg.src = allImages[currentIndex].src;
        }

        allImages.forEach((img, i) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openLightbox(i));
        });

        lbClose.addEventListener('click', closeLightbox);
        lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
        lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }
});
