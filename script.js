// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
        this.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';

                // Calculate scroll position
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });

    // Contract address copy function
    function copyContract() {
        const contractText = document.getElementById('contract').textContent;
        const copyBtn = document.getElementById('copy-btn');
        
        navigator.clipboard.writeText(contractText).then(() => {
            // Show success feedback
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = 'var(--success)';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
            }, 2000);
            
            // Show notification
            showNotification('Contract address copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy address. Please try again.', 'error');
        });
    }

    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'error' ? '#FF6B6B' : '#4CAF50'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Attach copy functionality to copy button
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyContract);
    }

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate(0)';
            }
        });
    }, observerOptions);

    // Observe elements to animate
    const animatedElements = document.querySelectorAll(
        '.tokenomics-card, .step, .timeline-item, .legend-item, .pie-chart'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Price ticker simulation
    function updatePriceTicker() {
        const priceChange = document.getElementById('price-change');
        const priceElement = document.getElementById('current-price');
        const icon = document.getElementById('price-icon');
        
        if (!priceChange || !priceElement || !icon) return;
        
        // Simulate realistic price changes (±5%)
        const change = (Math.random() - 0.5) * 10;
        const currentPrice = parseFloat(priceElement.textContent.replace('$', '').replace(',', ''));
        const newPrice = currentPrice * (1 + change / 100);
        const formattedPrice = newPrice.toFixed(10);
        
        // Update display
        priceElement.textContent = '$' + formattedPrice;
        priceChange.textContent = (change > 0 ? '+' : '') + change.toFixed(2) + '%';
        
        // Update color and icon based on change
        if (change > 0) {
            priceChange.style.color = 'var(--success)';
            icon.className = 'fas fa-arrow-up';
            icon.style.color = 'var(--success)';
        } else {
            priceChange.style.color = 'var(--primary)';
            icon.className = 'fas fa-arrow-down';
            icon.style.color = 'var(--primary)';
        }
    }

    // Initialize price ticker with random starting price
    function initializePriceTicker() {
        const priceElement = document.getElementById('current-price');
        if (priceElement) {
            const basePrice = 0.0000001;
            const variation = (Math.random() - 0.5) * 0.00000005;
            const initialPrice = basePrice + variation;
            priceElement.textContent = '$' + initialPrice.toFixed(10);
        }
        updatePriceTicker();
    }

    // Update price every 15 seconds (simulation)
    setInterval(updatePriceTicker, 15000);
    initializePriceTicker();

    // Auto-scroll meme carousel
    function autoScrollCarousel() {
        const carousel = document.querySelector('.meme-carousel');
        if (!carousel) return;
        
        let scrollAmount = 0;
        const scrollStep = 280; // Match meme item width + gap
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        let direction = 1;
        
        // Add scroll indicators
        const leftBtn = document.createElement('button');
        const rightBtn = document.createElement('button');
        
        leftBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        rightBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        leftBtn.className = 'carousel-btn left';
        rightBtn.className = 'carousel-btn right';
        
        leftBtn.setAttribute('aria-label', 'Scroll left');
        rightBtn.setAttribute('aria-label', 'Scroll right');
        
        leftBtn.style.cssText = rightBtn.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--primary);
            z-index: 10;
            transition: all 0.3s ease;
        `;
        
        leftBtn.style.left = '10px';
        rightBtn.style.right = '10px';
        
        leftBtn.addEventListener('click', () => {
            scrollAmount = Math.max(0, scrollAmount - scrollStep);
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        });
        
        rightBtn.addEventListener('click', () => {
            scrollAmount = Math.min(maxScroll, scrollAmount + scrollStep);
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        });
        
        carousel.parentElement.style.position = 'relative';
        carousel.parentElement.appendChild(leftBtn);
        carousel.parentElement.appendChild(rightBtn);
        
        // Auto-scroll every 5 seconds
        setInterval(() => {
            if (scrollAmount >= maxScroll) {
                direction = -1;
            } else if (scrollAmount <= 0) {
                direction = 1;
            }
            
            scrollAmount += scrollStep * direction;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }, 5000);
    }

    // Initialize carousel auto-scroll
    autoScrollCarousel();

    // Add hover effect to buttons
    document.querySelectorAll('.btn, .copy-btn, .social-icon').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape
        if (e.key === 'Escape') {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
        
        // Navigate with arrow keys in carousel
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const carousel = document.querySelector('.meme-carousel');
            if (carousel && document.activeElement.closest('#community')) {
                const scrollAmount = 280;
                const currentScroll = carousel.scrollLeft;
                const newScroll = e.key === 'ArrowLeft' 
                    ? Math.max(0, currentScroll - scrollAmount)
                    : Math.min(carousel.scrollWidth - carousel.clientWidth, currentScroll + scrollAmount);
                
                carousel.scrollTo({ left: newScroll, behavior: 'smooth' });
            }
        }
    });

    // Add loading state for buttons
    document.querySelectorAll('a[href*="uniswap"], a[href*="buy"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.includes('uniswap') || this.href.includes('#buy')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.style.pointerEvents = 'none';
                
                // Reset after 2 seconds (simulating loading)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.pointerEvents = 'auto';
                }, 2000);
            }
        });
    });

    // Initialize with a slight delay to ensure all elements are loaded
    setTimeout(() => {
        // Trigger initial animations for elements in viewport
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.style.opacity = '1';
                el.style.transform = 'translate(0)';
            }
        });
    }, 100);

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.backgroundPosition = `center ${rate}px`;
        }
    });

    // Add touch support for carousel
    let touchStartX = 0;
    let touchEndX = 0;
    const carousel = document.querySelector('.meme-carousel');
    
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > threshold) {
                const scrollAmount = 280;
                const currentScroll = carousel.scrollLeft;
                const newScroll = diff > 0 
                    ? Math.min(carousel.scrollWidth - carousel.clientWidth, currentScroll + scrollAmount)
                    : Math.max(0, currentScroll - scrollAmount);
                
                carousel.scrollTo({ left: newScroll, behavior: 'smooth' });
            }
        }
    }

    // Add theme preference detection
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // You can add dark mode support here if needed
    // if (prefersDarkScheme.matches) {
    //     // Initialize dark mode
    // }
});

// Load actual logo when you're ready
function loadActualLogo(logoUrl) {
    if (logoUrl) {
        document.querySelectorAll('.logo-img, .hero-logo, .footer-logo-img').forEach(img => {
            img.src = logoUrl;
            img.onerror = function() {
                // Fallback to a placeholder if logo fails to load
                this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FF6B6B"/><path d="M30,65 Q50,30 70,65" stroke="white" stroke-width="8" fill="none"/><circle cx="40" cy="45" r="5" fill="white"/><circle cx="60" cy="45" r="5" fill="white"/></svg>';
            };
        });
    }
}

// Example usage when you have your logo URL:
// loadActualLogo('YOUR_LOGO_URL_HERE');

// Make functions available globally if needed
window.copyContract = copyContract;
window.loadActualLogo = loadActualLogo;

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// Add error handling for images
document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
        console.warn('Failed to load image:', this.src);
        this.style.opacity = '0.5';
        this.style.filter = 'grayscale(1)';
    };
});

// Performance optimization: Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
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
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});