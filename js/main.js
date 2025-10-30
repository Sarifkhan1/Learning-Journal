// ===================================
// LEARNING JOURNAL - MAIN JAVASCRIPT
// ===================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE NAVIGATION TOGGLE =====
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const hamburger = this.querySelector('.hamburger');
            if (navMenu.classList.contains('active')) {
                hamburger.style.background = 'transparent';
                hamburger.style.transform = 'rotate(45deg)';
            } else {
                hamburger.style.background = '#e4e4e4';
                hamburger.style.transform = 'rotate(0)';
            }
        });
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const hamburger = mobileToggle.querySelector('.hamburger');
                hamburger.style.background = '#e4e4e4';
                hamburger.style.transform = 'rotate(0)';
            });
        });
    }
    
    // ===== SCROLL TO TOP BUTTON =====
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== SCROLL ANIMATIONS (AOS Alternative) =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Add delay to elements with data-aos-delay
                const delay = entry.target.getAttribute('data-aos-delay');
                if (delay) {
                    entry.target.style.animationDelay = delay + 'ms';
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
    
    // ===== NAVBAR BACKGROUND ON SCROLL =====
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 17, 23, 0.98)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 198, 255, 0.1)';
            } else {
                navbar.style.background = 'rgba(15, 17, 23, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // ===== TYPING EFFECT FOR HERO TITLE =====
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle && window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        heroTitle.style.opacity = '1';
        
        let charIndex = 0;
        const typingSpeed = 50;
        
        function typeText() {
            if (charIndex < originalText.length) {
                // Check if we're at a tag
                if (originalText.charAt(charIndex) === '<') {
                    // Find the closing bracket
                    const closingBracket = originalText.indexOf('>', charIndex);
                    if (closingBracket !== -1) {
                        // Add the entire tag at once
                        heroTitle.innerHTML += originalText.substring(charIndex, closingBracket + 1);
                        charIndex = closingBracket + 1;
                    }
                } else {
                    heroTitle.innerHTML += originalText.charAt(charIndex);
                    charIndex++;
                }
                setTimeout(typeText, typingSpeed);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeText, 500);
    }
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===== ANIMATE SKILL BARS ON SCROLL =====
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (skillBars.length > 0) {
        const skillObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    skillObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => skillObserver.observe(bar));
    }
    
    // ===== ANIMATE STATS NUMBERS =====
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent.replace('+', '');
                    const isPlus = target.textContent.includes('+');
                    const numericValue = parseInt(finalValue);
                    
                    if (!isNaN(numericValue)) {
                        animateValue(target, 0, numericValue, 2000, isPlus);
                        statsObserver.unobserve(target);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(num => statsObserver.observe(num));
        
        function animateValue(element, start, end, duration, addPlus) {
            const range = end - start;
            const increment = range / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= end) {
                    current = end;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + (addPlus ? '+' : '');
            }, 16);
        }
    }
    
    // ===== PROJECT CARD TILT EFFECT =====
    const projectCards = document.querySelectorAll('.project-card, .project-showcase-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // ===== ACTIVE NAVIGATION HIGHLIGHT =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // ===== DYNAMIC YEAR IN FOOTER =====
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.textContent = `© ${currentYear} Learning Journal. All rights reserved.`;
    }
    
    // ===== PARALLAX EFFECT FOR HERO SECTION =====
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                heroSection.style.opacity = 1 - (scrolled / (window.innerHeight * 1.5));
            }
        });
    }
    
    // ===== ADD GRADIENT GLOW TO BUTTONS ON HOVER =====
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'glow 2s ease-in-out infinite';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
    
    // ===== JOURNAL CARD READ MORE BUTTON =====
    const readMoreButtons = document.querySelectorAll('.journal-card .btn');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.journal-card');
            const summary = card.querySelector('.journal-summary');
            
            if (summary.style.maxHeight && summary.style.maxHeight !== 'none') {
                summary.style.maxHeight = 'none';
                this.textContent = 'Read Less';
            } else {
                summary.style.maxHeight = '4.8em'; // Approximately 3 lines
                this.textContent = 'Read More';
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
    
    // ===== LOADING ANIMATION =====
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // ===== CONSOLE MESSAGE =====
    console.log('%c👋 Welcome to My Learning Journal!', 'color: #00c6ff; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #0072ff; font-size: 14px;');
    console.log('%cCheck out my projects at the Projects page!', 'color: #a0a0a0; font-size: 12px;');
});

// ===== DARK MODE TOGGLE (OPTIONAL) =====
function toggleDarkMode() {
    const root = document.documentElement;
    const isDark = root.style.getPropertyValue('--bg-primary') === '#0f1117';
    
    if (isDark) {
        // Switch to light mode
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f5f5f5');
        root.style.setProperty('--bg-card', '#ffffff');
        root.style.setProperty('--text-primary', '#1a1a1a');
        root.style.setProperty('--text-secondary', '#666666');
        root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to dark mode
        root.style.setProperty('--bg-primary', '#0f1117');
        root.style.setProperty('--bg-secondary', '#1a1d29');
        root.style.setProperty('--bg-card', '#1e2230');
        root.style.setProperty('--text-primary', '#e4e4e4');
        root.style.setProperty('--text-secondary', '#a0a0a0');
        root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    toggleDarkMode();
}
