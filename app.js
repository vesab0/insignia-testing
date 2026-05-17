/**
 * Restaurant Frontend Application
 * Advanced JavaScript with modern patterns and smart features
 */

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit function execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

/**
 * Animate number counting
 * @param {HTMLElement} element - Element containing the number
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in milliseconds
 */
const animateNumber = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
};

// ===================================
// Toast Notification System
// ===================================

class ToastNotification {
    constructor() {
        this.toast = document.getElementById('toast');
    }

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (success, error, info)
     * @param {number} duration - Duration in milliseconds
     */
    show(message, type = 'info', duration = 3000) {
        this.toast.textContent = message;
        this.toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, duration);
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }
}

const toast = new ToastNotification();

// ===================================
// Navigation Management
// ===================================

class NavigationManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScrollTop = 0;
        this.scrollThreshold = 100;
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLink();
        this.setupScrollBehavior();
    }

    setupMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
            this.navToggle.setAttribute('aria-expanded', !isExpanded);
            this.navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle.setAttribute('aria-expanded', 'false');
                this.navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.navToggle.setAttribute('aria-expanded', 'false');
                this.navMenu.classList.remove('active');
            }
        });
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        const updateActiveLink = () => {
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', throttle(updateActiveLink, 100));
    }

    setupScrollBehavior() {
        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide/show header on scroll
            if (scrollTop > this.lastScrollTop && scrollTop > this.scrollThreshold) {
                this.header.classList.add('hidden');
            } else {
                this.header.classList.remove('hidden');
            }
            
            this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, 100));
    }
}

// ===================================
// Menu Filter System
// ===================================

class MenuFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.menuItems = document.querySelectorAll('.menu-item');
        
        this.init();
    }

    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                this.filterItems(category);
                this.updateActiveButton(button);
            });
        });
    }

    filterItems(category) {
        this.menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
                // Animate in
                item.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                item.classList.add('hidden');
            }
        });
    }

    updateActiveButton(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
        });
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
    }
}

// ===================================
// Form Validation System
// ===================================

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        // Define validation rules
        this.fields = {
            name: {
                element: this.form.querySelector('#name'),
                rules: [
                    { type: 'required', message: 'Name is required' },
                    { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
                ]
            },
            email: {
                element: this.form.querySelector('#email'),
                rules: [
                    { type: 'required', message: 'Email is required' },
                    { type: 'email', message: 'Please enter a valid email address' }
                ]
            },
            phone: {
                element: this.form.querySelector('#phone'),
                rules: [
                    { type: 'required', message: 'Phone number is required' },
                    { type: 'phone', message: 'Please enter a valid phone number' }
                ]
            },
            guests: {
                element: this.form.querySelector('#guests'),
                rules: [
                    { type: 'required', message: 'Please select number of guests' }
                ]
            },
            date: {
                element: this.form.querySelector('#date'),
                rules: [
                    { type: 'required', message: 'Please select a date' },
                    { type: 'futureDate', message: 'Please select a future date' }
                ]
            },
            time: {
                element: this.form.querySelector('#time'),
                rules: [
                    { type: 'required', message: 'Please select a time' }
                ]
            }
        };

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        if (this.fields.date.element) {
            this.fields.date.element.setAttribute('min', today);
        }

        // Add real-time validation
        Object.values(this.fields).forEach(field => {
            if (field.element) {
                field.element.addEventListener('blur', () => this.validateField(field));
                field.element.addEventListener('input', () => this.clearError(field));
            }
        });

        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(field) {
        const value = field.element.value.trim();
        
        for (const rule of field.rules) {
            let isValid = true;
            
            switch (rule.type) {
                case 'required':
                    isValid = value !== '';
                    break;
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    break;
                case 'phone':
                    isValid = /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10;
                    break;
                case 'minLength':
                    isValid = value.length >= rule.value;
                    break;
                case 'futureDate':
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    isValid = selectedDate >= today;
                    break;
            }
            
            if (!isValid) {
                this.showError(field, rule.message);
                return false;
            }
        }
        
        this.clearError(field);
        return true;
    }

    showError(field, message) {
        field.element.classList.add('error');
        const errorElement = field.element.parentElement.querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }

    clearError(field) {
        field.element.classList.remove('error');
        const errorElement = field.element.parentElement.querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        }
    }

    validateForm() {
        let isValid = true;
        
        Object.values(this.fields).forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            // Simulate form submission
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            console.log('Form submitted:', data);
            
            // Show success message
            toast.success('Reservation confirmed! We\'ll send you a confirmation email shortly.', 5000);
            
            // Reset form
            this.form.reset();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            toast.error('Please correct the errors in the form', 3000);
        }
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
        
        // Initialize all components
        new NavigationManager();
        new MenuFilter();
        new FormValidator('reservationForm');
        new NewsletterHandler();
        new ScrollAnimations();
        new BackToTop();
        new LazyLoader();
        new AccessibilityEnhancer();
        
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
}

// ===================================
// Export for testing (if needed)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        isInViewport,
        animateNumber,
        ToastNotification,
        NavigationManager,
        MenuFilter,
        FormValidator
    };
}

// Made with Bob
