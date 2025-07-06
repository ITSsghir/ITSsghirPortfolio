// ===== GESTIONNAIRE DE THÈMES ===== //
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themeToggle = document.getElementById('theme-toggle');
        this.mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        
        // Éléments à exclure du thème clair
        this.purpleElements = [];
        this.originalStyles = new Map();
    }

    init() {
        this.loadSavedTheme();
        this.bindEvents();
        this.applyTheme();
        this.updateToggleIcons();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    }

    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggle());
        }
        
        if (this.mobileThemeToggle) {
            this.mobileThemeToggle.addEventListener('click', () => this.toggle());
        }

        // Écouter les changements de préférence système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme();
                this.updateToggleIcons();
            }
        });
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.updateToggleIcons();
        this.saveTheme();
        
        // Animation de l'icône
        this.animateToggleIcon();
        
        // Son de basculement si disponible
        if (window.soundManager) {
            window.soundManager.playToggleSound(this.currentTheme === 'light');
        }
    }

    applyTheme() {
        document.body.className = this.currentTheme === 'dark' ? 'dark-theme' : 'light-theme';
        
        if (this.currentTheme === 'light') {
            this.eliminatePurpleElements();
        } else {
            this.restorePurpleElements();
        }
        
        // Mettre à jour les meta tags pour le thème
        this.updateMetaThemeColor();
    }

    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = this.currentTheme === 'dark' ? '#0a0a0a' : '#f5f5f5';
    }

    eliminatePurpleElements() {
        // Sauvegarder et modifier les éléments violets pour le thème clair
        const purpleSelectors = [
            '.accent-primary',
            '.text-purple',
            '.border-purple',
            '.bg-purple',
            '[style*="purple"]',
            '[style*="#8b5cf6"]',
            '[style*="#a855f7"]',
            '[style*="#9333ea"]'
        ];

        purpleSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!this.originalStyles.has(element)) {
                    this.originalStyles.set(element, {
                        color: element.style.color,
                        backgroundColor: element.style.backgroundColor,
                        borderColor: element.style.borderColor,
                        boxShadow: element.style.boxShadow
                    });
                }
                
                // Remplacer les couleurs violettes par des couleurs adaptées au thème clair
                if (element.style.color && element.style.color.includes('purple')) {
                    element.style.color = '#252422';
                }
                if (element.style.backgroundColor && element.style.backgroundColor.includes('purple')) {
                    element.style.backgroundColor = '#CCC5B9';
                }
                if (element.style.borderColor && element.style.borderColor.includes('purple')) {
                    element.style.borderColor = '#252422';
                }
                
                this.purpleElements.push(element);
            });
        });

        // Gérer les éléments avec des classes spécifiques
        const accentElements = document.querySelectorAll('.accent-color, .primary-color');
        accentElements.forEach(element => {
            if (!this.originalStyles.has(element)) {
                this.originalStyles.set(element, {
                    color: element.style.color || getComputedStyle(element).color
                });
            }
            element.style.color = '#252422';
            this.purpleElements.push(element);
        });
    }

    restorePurpleElements() {
        // Restaurer les styles originaux
        this.purpleElements.forEach(element => {
            const originalStyle = this.originalStyles.get(element);
            if (originalStyle) {
                Object.assign(element.style, originalStyle);
            }
        });
        
        this.purpleElements = [];
        this.originalStyles.clear();
    }

    updateToggleIcons() {
        const updateIcon = (toggle) => {
            if (!toggle) return;
            
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // Mettre à jour l'état actif
            toggle.classList.toggle('active', this.currentTheme === 'light');
        };

        updateIcon(this.themeToggle);
        updateIcon(this.mobileThemeToggle);
    }

    animateToggleIcon() {
        const animateIcon = (toggle) => {
            if (!toggle) return;
            
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.add('rotating');
                setTimeout(() => {
                    icon.classList.remove('rotating');
                }, 500);
            }
        };

        animateIcon(this.themeToggle);
        animateIcon(this.mobileThemeToggle);
    }

    saveTheme() {
        localStorage.setItem('theme', this.currentTheme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    isLightTheme() {
        return this.currentTheme === 'light';
    }
}

// Export pour utilisation
window.ThemeManager = ThemeManager; 