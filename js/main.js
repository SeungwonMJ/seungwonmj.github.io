document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // --- Project Carousel ---
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-track .project-item');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function getVisibleCount() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        return 2;
    }

    function getMaxIndex() {
        return Math.max(0, items.length - getVisibleCount());
    }

    function updateCarousel() {
        const visibleCount = getVisibleCount();
        const gap = 20;
        const itemWidth = (track.parentElement.offsetWidth - gap * (visibleCount - 1)) / visibleCount;

        items.forEach(item => {
            item.style.flex = `0 0 ${itemWidth}px`;
        });

        const offset = currentIndex * (itemWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= getMaxIndex();

        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const maxIndex = getMaxIndex();
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < getMaxIndex()) {
                currentIndex++;
            } else if (diff < 0 && currentIndex > 0) {
                currentIndex--;
            }
            updateCarousel();
        }
    }, { passive: true });

    // Recalculate on resize
    window.addEventListener('resize', () => {
        if (currentIndex > getMaxIndex()) {
            currentIndex = getMaxIndex();
        }
        buildDots();
        updateCarousel();
    });

    buildDots();
    updateCarousel();

    // Add active class to navigation items on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach((item) => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });
});