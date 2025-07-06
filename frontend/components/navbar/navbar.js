// ===== NAVBAR RESPONSIVE ===== //
class ResponsiveNavbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburgerBtn = document.querySelector('.hamburger-btn');
        this.mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.mobileMenuClose = document.querySelector('.mobile-menu-close');
        this.mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
        
        this.isMenuOpen = false;
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.lastScrollY = window.scrollY;
        
        this.focusableElements = [];
        this.firstFocusableElement = null;
        this.lastFocusableElement = null;
    }

    init() {
        this.bindEvents();
        this.updateNavbarLayout();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.syncMobileControls();
    }

    bindEvents() {
        // Hamburger menu toggle
        if (this.hamburgerBtn) {
            this.hamburgerBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Mobile menu close
        if (this.mobileMenuClose) {
            this.mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
        }

        // Overlay click to close
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === this.mobileMenuOverlay) {
                    this.closeMobileMenu();
                }
            });
        }

        // Mobile menu items
        this.mobileMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Resize handler
        window.addEventListener('resize', () => this.handleResize());

        // Scroll handler
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Navigation links smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }

    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.updateNavbarLayout();
            
            // Fermer le menu mobile si on passe en desktop
            if (newBreakpoint === 'desktop' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        }
    }

    updateNavbarLayout() {
        // Logique spécifique selon le breakpoint
        if (this.currentBreakpoint === 'tablet') {
            this.applyTabletLayout();
        }
    }

    applyTabletLayout() {
        // Masquer le texte des éléments de navigation sur tablette
        const navItems = document.querySelectorAll('.navbar-item span');
        navItems.forEach(span => {
            span.style.display = 'none';
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        
        if (this.hamburgerBtn) {
            this.hamburgerBtn.classList.add('active');
        }
        
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.add('active');
        }
        
        // Empêcher le scroll du body
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        this.trapFocus();
        
        // Son d'ouverture si disponible
        if (window.soundManager) {
            window.soundManager.playHoverSound();
        }
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        
        if (this.hamburgerBtn) {
            this.hamburgerBtn.classList.remove('active');
        }
        
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.remove('active');
        }
        
        // Restaurer le scroll du body
        document.body.style.overflow = '';
        
        // Restaurer le focus
        if (this.hamburgerBtn) {
            this.hamburgerBtn.focus();
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Auto-hide navbar on scroll down (mobile)
        if (this.currentBreakpoint === 'mobile') {
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                // Scrolling down
                if (this.navbar) {
                    this.navbar.style.transform = 'translateY(-100%)';
                }
            } else {
                // Scrolling up
                if (this.navbar) {
                    this.navbar.style.transform = 'translateY(0)';
                }
            }
        }
        
        // Add background blur on scroll
        if (currentScrollY > 50) {
            if (this.navbar) {
                this.navbar.classList.add('scrolled');
            }
        } else {
            if (this.navbar) {
                this.navbar.classList.remove('scrolled');
            }
        }
        
        this.lastScrollY = currentScrollY;
    }

    setupKeyboardNavigation() {
        // Tab navigation dans le menu mobile
        if (this.mobileMenu) {
            this.focusableElements = this.mobileMenu.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (this.focusableElements.length > 0) {
                this.firstFocusableElement = this.focusableElements[0];
                this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
            }
        }

        // Gestion du Tab dans le menu mobile
        document.addEventListener('keydown', (e) => this.handleTabNavigation(e));
    }

    handleTabNavigation(e) {
        if (!this.isMenuOpen || e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === this.firstFocusableElement) {
                e.preventDefault();
                this.lastFocusableElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === this.lastFocusableElement) {
                e.preventDefault();
                this.firstFocusableElement.focus();
            }
        }
    }

    trapFocus() {
        if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
        }
    }

    syncMobileControls() {
        // Synchroniser les contrôles de thème entre desktop et mobile
        const desktopThemeToggle = document.getElementById('theme-toggle');
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        const desktopSoundToggle = document.getElementById('sound-toggle');
        const mobileSoundToggle = document.getElementById('mobile-sound-toggle');

        if (desktopThemeToggle && mobileThemeToggle) {
            const syncTheme = () => {
                const isDark = document.body.classList.contains('dark-theme');
                const icon = isDark ? 'fas fa-sun' : 'fas fa-moon';
                
                mobileThemeToggle.querySelector('i').className = icon;
                desktopThemeToggle.querySelector('i').className = icon;
            };

            // Synchroniser au changement de thème
            const observer = new MutationObserver(syncTheme);
            observer.observe(document.body, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });
        }

        if (desktopSoundToggle && mobileSoundToggle) {
            const syncSound = () => {
                const isMuted = window.soundManager && window.soundManager.isMuted;
                const icon = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                
                mobileSoundToggle.querySelector('i').className = icon;
                desktopSoundToggle.querySelector('i').className = icon;
            };

            // Synchroniser périodiquement
            setInterval(syncSound, 1000);
        }
    }

    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;

        // Swipe pour fermer le menu mobile
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });

            this.mobileMenu.addEventListener('touchmove', (e) => {
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
            }, { passive: true });

            this.mobileMenu.addEventListener('touchend', () => {
                const diffX = startX - currentX;
                const diffY = Math.abs(startY - currentY);

                // Swipe vers la droite pour fermer
                if (diffX < -100 && diffY < 50) {
                    this.closeMobileMenu();
                }
            }, { passive: true });
        }

        // Swipe depuis le bord gauche pour ouvrir (mobile uniquement)
        if (this.currentBreakpoint === 'mobile') {
            document.addEventListener('touchstart', (e) => {
                if (e.touches[0].clientX < 20 && !this.isMenuOpen) {
                    startX = e.touches[0].clientX;
                }
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                if (startX < 20 && !this.isMenuOpen) {
                    const endX = e.changedTouches[0].clientX;
                    if (endX - startX > 100) {
                        this.openMobileMenu();
                    }
                }
                startX = 0;
            }, { passive: true });
        }
    }

    // Méthodes utilitaires
    isDesktop() {
        return this.currentBreakpoint === 'desktop';
    }

    isTablet() {
        return this.currentBreakpoint === 'tablet';
    }

    isMobile() {
        return this.currentBreakpoint === 'mobile';
    }

    destroy() {
        // Nettoyer les event listeners si nécessaire
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        document.body.style.overflow = '';
    }
}

// Export pour utilisation
window.ResponsiveNavbar = ResponsiveNavbar; 