// Menu data - could be fetched from API in production
const menuData = [
    { id: 1, name: 'Grilled Salmon', price: 24.99, description: 'Fresh Atlantic salmon' },
    { id: 2, name: 'Beef Tenderloin', price: 32.99, description: 'Premium cut beef' },
    { id: 3, name: 'Pasta Carbonara', price: 18.99, description: 'Classic Italian pasta' },
    { id: 4, name: 'Caesar Salad', price: 12.99, description: 'Fresh romaine lettuce' },
    { id: 5, name: 'Margherita Pizza', price: 16.99, description: 'Wood-fired pizza' },
    { id: 6, name: 'Chocolate Lava Cake', price: 9.99, description: 'Decadent dessert' }
];

let orderItems = [];
let totalAmount = 0;

// Initialize the page
function init() {
    displayMenu();
    populateMenuSelect();
    setupEventListeners();
}

// Display menu items
function displayMenu() {
    const menuContainer = document.getElementById('menuItems');
    
    menuData.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p class="price">$${item.price}</p>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Populate select dropdown
function populateMenuSelect() {
    const select = document.getElementById('menuItem');
    
    menuData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} - $${item.price}`;
        select.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('orderForm');
    form.addEventListener('submit', handleOrderSubmit);
}

// Handle order submission - missing proper validation
function handleOrderSubmit(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const menuItemId = parseInt(document.getElementById('menuItem').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Find the menu item - could use a Map for better performance
    let selectedItem;
    for (let i = 0; i < menuData.length; i++) {
        if (menuData[i].id === menuItemId) {
            selectedItem = menuData[i];
            break;
        }
    }
    
    if (selectedItem) {
        const orderItem = {
            name: selectedItem.name,
            price: selectedItem.price,
            quantity: quantity,
            subtotal: selectedItem.price * quantity
        };
        
        orderItems.push(orderItem);
        totalAmount += orderItem.subtotal;
        
        updateOrderSummary(customerName);
        
        // Reset form - but not the customer name (minor UX issue)
        document.getElementById('menuItem').value = '';
        document.getElementById('quantity').value = '1';
    }
}

// ===================================
// Newsletter Form Handler
// ===================================

class NewsletterHandler {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = this.form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (this.validateEmail(email)) {
                console.log('Newsletter subscription:', email);
                toast.success('Thank you for subscribing to our newsletter!', 3000);
                this.form.reset();
            } else {
                toast.error('Please enter a valid email address', 3000);
            }
        });
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// ===================================
// Scroll Animations
// ===================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.feature-card, .menu-item, .contact-item');
        this.stats = document.querySelectorAll('.stat-number');
        this.statsAnimated = false;
        
        this.init();
    }

    init() {
        this.observeElements();
        this.observeStats();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    observeStats() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.statsAnimated) {
                    this.animateStats();
                    this.statsAnimated = true;
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.5
        });

        if (this.stats.length > 0) {
            observer.observe(this.stats[0].closest('.about-stats'));
        }
    }

    animateStats() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateNumber(stat, target, 2000);
        });
    }
}

// ===================================
// Back to Top Button
// ===================================

class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.scrollThreshold = 300;
        
        if (this.button) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', throttle(() => {
            if (window.pageYOffset > this.scrollThreshold) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100));

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===================================
// Lazy Loading Images
// ===================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            this.images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
}

// ===================================
// Performance Monitoring
// ===================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('LCP monitoring not supported');
            }

            // Monitor First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('FID monitoring not supported');
            }
        }

        // Log page load time
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page Load Time:', pageLoadTime + 'ms');
        });
    }
}

// ===================================
// Accessibility Enhancements
// ===================================

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Add keyboard navigation for custom elements
        this.setupKeyboardNavigation();
        
        // Announce dynamic content changes to screen readers
        this.setupAriaLiveRegions();
        
        // Trap focus in mobile menu when open
        this.setupFocusTrap();
    }

    setupKeyboardNavigation() {
        // Allow Enter key to trigger button clicks
        document.querySelectorAll('[role="button"]').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    setupAriaLiveRegions() {
        // Toast notifications are already set up with aria-live
        // Add more as needed
    }

    setupFocusTrap() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navToggle.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    // Focus first link when menu opens
                    setTimeout(() => {
                        const firstLink = navMenu.querySelector('a');
                        if (firstLink) firstLink.focus();
                    }, 100);
                }
            });
        }
    }
}

// ===================================
// Initialize Application
// ===================================

class RestaurantApp {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        console.log('🍽️ Restaurant App Initialized');
        console.log('🎨 Loading Advanced Visual Effects...');
        
        // Initialize loading animation
        new LoadingAnimation();
        
        // Initialize core components
        new NavigationManager();
        new MenuFilter();
        new FormValidator('reservationForm');
        new NewsletterHandler();
        new ScrollAnimations();
        new BackToTop();
        new LazyLoader();
        new AccessibilityEnhancer();
        
        // Initialize advanced visual effects
        console.log('✨ Initializing Particle System...');
        new ParticleSystem();
        
        console.log('🎯 Initializing Cursor Effects...');
        new CursorEffects();
        
        console.log('🎴 Initializing 3D Card Tilt...');
        new Card3DTilt();
        
        console.log('🌊 Initializing Parallax Scrolling...');
        new ParallaxScroll();
        
        console.log('💧 Initializing Ripple Effects...');
        new RippleEffect();
        
        console.log('🔮 Initializing Morphing Blobs...');
        new MorphingBlobs();
        
        console.log('🌈 Initializing Iridescent Text...');
        new IridescentText();
        
        console.log('📜 Initializing Smooth Reveal...');
        new SmoothReveal();
        
        console.log('⚡ Initializing Glitch Effects...');
        new GlitchEffect();
        
        // Initialize performance monitoring in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            new PerformanceMonitor();
        }
        
        // Add smooth reveal on page load
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
        
        console.log('✅ All components loaded successfully');
        console.log('🚀 Advanced Restaurant Interface Ready!');
    }
}

// Start the application
new RestaurantApp();

// ===================================
// Service Worker Registration (PWA)
// ===================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
    
    summaryHTML += `<div class="total">Total: $${totalAmount.toFixed(2)}</div>`;
    
    summaryDiv.innerHTML = summaryHTML;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);


// ===================================
// Advanced Particle System
// ===================================

class ParticleSystem {
    constructor() {
        this.container = null;
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        this.createContainer();
        this.generateParticles();
        this.animate();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'particle-container';
        document.body.appendChild(this.container);
    }

    generateParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '-10px';
            
            // Random animation delay and duration
            const duration = 10 + Math.random() * 20;
            const delay = Math.random() * 10;
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';
            
            // Random horizontal movement
            particle.style.setProperty('--particle-x', (Math.random() - 0.5) * 200 + 'px');
            
            // Random size
            const size = 2 + Math.random() * 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    animate() {
        // Particles are animated via CSS
        // This method can be used for additional JS-based animations if needed
    }
}

// ===================================
// Advanced Cursor Effects
// ===================================

class CursorEffects {
    constructor() {
        this.cursor = null;
        this.cursorTrail = [];
        this.trailLength = 10;
        this.init();
    }

    init() {
        this.createCursor();
        this.createTrail();
        this.setupEventListeners();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.2s ease, opacity 0.3s ease;
            mix-blend-mode: difference;
            opacity: 0;
        `;
        document.body.appendChild(this.cursor);
    }

    createTrail() {
        for (let i = 0; i < this.trailLength; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.cssText = `
                position: fixed;
                width: ${15 - i}px;
                height: ${15 - i}px;
                background: var(--accent-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${0.5 - (i * 0.05)};
                transition: transform 0.${i + 1}s ease;
                mix-blend-mode: screen;
            `;
            document.body.appendChild(trail);
            this.cursorTrail.push(trail);
        }
    }

    setupEventListeners() {
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            this.cursor.style.opacity = '1';
            this.cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
            
            // Update trail with delay
            this.cursorTrail.forEach((trail, index) => {
                setTimeout(() => {
                    trail.style.transform = `translate(${mouseX - (7.5 - index * 0.5)}px, ${mouseY - (7.5 - index * 0.5)}px)`;
                }, index * 20);
            });
        });

        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        // Expand cursor on clickable elements
        const clickables = document.querySelectorAll('a, button, .btn, .nav-link, .filter-btn');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px) scale(1.5)`;
                this.cursor.style.borderColor = 'var(--accent-light)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px) scale(1)`;
                this.cursor.style.borderColor = 'var(--accent-color)';
            });
        });
    }
}

// ===================================
// 3D Card Tilt Effect
// ===================================

class Card3DTilt {
    constructor() {
        this.cards = document.querySelectorAll('.feature-card, .menu-item, .contact-item');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.classList.add('card-3d');
            this.setupTilt(card);
        });
    }

    setupTilt(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.setProperty('--rotate-x', rotateX + 'deg');
            card.style.setProperty('--rotate-y', rotateY + 'deg');
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rotate-x', '0deg');
            card.style.setProperty('--rotate-y', '0deg');
        });
    }
}

// ===================================
// Parallax Scrolling Effect
// ===================================

class ParallaxScroll {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.createParallaxElements();
        this.setupScrollListener();
    }

    createParallaxElements() {
        // Add parallax to hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            this.elements.push({ element: heroContent, speed: 0.5 });
        }

        // Add parallax to section headers
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            this.elements.push({ element: header, speed: 0.3 });
        });

        // Create floating orbs
        this.createFloatingOrbs();
    }

    createFloatingOrbs() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        for (let i = 0; i < 5; i++) {
            const orb = document.createElement('div');
            orb.className = 'floating-orb';
            
            const size = 100 + Math.random() * 200;
            orb.style.width = size + 'px';
            orb.style.height = size + 'px';
            orb.style.left = Math.random() * 100 + '%';
            orb.style.top = Math.random() * 100 + '%';
            orb.style.animationDelay = Math.random() * 10 + 's';
            orb.style.animationDuration = (15 + Math.random() * 10) + 's';
            
            hero.appendChild(orb);
        }
    }

    setupScrollListener() {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            
            this.elements.forEach(({ element, speed }) => {
                const offset = scrolled * speed;
                element.style.transform = `translateY(${offset}px)`;
            });
        }, 16));
    }
}

// ===================================
// Ripple Click Effect
// ===================================

class RippleEffect {
    constructor() {
        this.init();
    }

    init() {
        const rippleElements = document.querySelectorAll('.btn, .nav-link, .filter-btn, .menu-item');
        
        rippleElements.forEach(element => {
            element.classList.add('ripple-effect');
            element.addEventListener('click', (e) => this.createRipple(e, element));
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// ===================================
// Morphing Background Blobs
// ===================================

class MorphingBlobs {
    constructor() {
        this.blobs = [];
        this.blobCount = 3;
        this.init();
    }

    init() {
        const sections = document.querySelectorAll('.features, .about-section, .contact-section');
        
        sections.forEach(section => {
            section.style.position = 'relative';
            section.style.overflow = 'hidden';
            
            for (let i = 0; i < this.blobCount; i++) {
                const blob = document.createElement('div');
                blob.className = 'morphing-blob';
                
                const size = 200 + Math.random() * 300;
                blob.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: var(--iridescent-${(i % 3) + 1});
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 0;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation-delay: ${Math.random() * 5}s;
                    animation-duration: ${8 + Math.random() * 4}s;
                `;
                
                section.insertBefore(blob, section.firstChild);
                this.blobs.push(blob);
            }
            
            // Ensure content is above blobs
            Array.from(section.children).forEach(child => {
                if (!child.classList.contains('morphing-blob')) {
                    child.style.position = 'relative';
                    child.style.zIndex = '1';
                }
            });
        });
    }
}

// ===================================
// Iridescent Text Effect
// ===================================

class IridescentText {
    constructor() {
        this.init();
    }

    init() {
        // Apply to main headings
        const headings = document.querySelectorAll('.section-title, .logo');
        
        headings.forEach(heading => {
            heading.classList.add('gradient-text');
        });

        // Apply holographic effect to hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.classList.add('holographic-text');
            heroTitle.setAttribute('data-text', heroTitle.textContent);
        }
    }
}

// ===================================
// Smooth Reveal on Scroll
// ===================================

class SmoothReveal {
    constructor() {
        this.elements = document.querySelectorAll('.menu-item, .feature-card, .contact-item, .about-content');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px) scale(0.95)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(element);
        });
    }
}

// ===================================
// Glitch Effect on Hover
// ===================================

class GlitchEffect {
    constructor() {
        this.init();
    }

    init() {
        const glitchElements = document.querySelectorAll('.menu-badge, .tag');
        
        glitchElements.forEach(element => {
            element.classList.add('glitch-hover');
            element.setAttribute('data-text', element.textContent);
        });
    }
}

// ===================================
// Advanced Loading Animation
// ===================================

class LoadingAnimation {
    constructor() {
        this.init();
    }

    init() {
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease;
        `;

        const loader = document.createElement('div');
        loader.style.cssText = `
            width: 100px;
            height: 100px;
            border: 3px solid transparent;
            border-top-color: var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            box-shadow: 0 0 30px var(--glow-color);
        `;

        overlay.appendChild(loader);
        document.body.appendChild(overlay);

        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Remove overlay after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            }, 1000);
        });
    }
}
