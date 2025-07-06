// ===== GESTIONNAIRE DE PRELOADER MINIMALISTE ===== //
class PreloaderManager {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingText = document.querySelector('.loading-text');
        
        this.totalResources = 0;
        this.loadedResources = 0;
        this.startTime = Date.now();
        
        this.resourceTypes = [
            { selector: 'link[rel="stylesheet"]', type: 'CSS' },
            { selector: 'script[src]', type: 'JS' },
            { selector: 'img', type: 'Images' },
            { selector: 'link[href*="fonts"]', type: 'Fonts' }
        ];
    }

    init() {
        this.detectAndApplyTheme();
        this.trackResourceLoading();
        this.setupLoadListeners();
    }

    detectAndApplyTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    }

    trackResourceLoading() {
        const allResources = [];

        // Collecter toutes les ressources
        this.resourceTypes.forEach(({ selector, type }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.href || element.src) {
                    allResources.push({ element, type });
                }
            });
        });

        // Ajouter les Google Fonts spécifiquement
        const googleFontsLink = document.querySelector('link[href*="fonts.googleapis.com"]');
        if (googleFontsLink) {
            allResources.push({ element: googleFontsLink, type: 'Google Fonts' });
        }

        this.totalResources = allResources.length;
        this.updateProgress();

        // Surveiller le chargement de chaque ressource
        allResources.forEach(({ element, type }) => {
            this.monitorResource(element, type);
        });

        // Timeout de sécurité
        setTimeout(() => {
            if (!this.isComplete()) {
                this.completeLoading();
            }
        }, 8000);
    }

    monitorResource(element, type) {
        const onLoad = () => {
            this.loadedResources++;
            this.updateLoadingText(type);
            this.updateProgress();
            
            if (this.isComplete()) {
                setTimeout(() => this.completeLoading(), 300);
            }
        };

        const onError = () => {
            this.loadedResources++;
            this.updateProgress();
            
            if (this.isComplete()) {
                setTimeout(() => this.completeLoading(), 300);
            }
        };

        if (element.tagName === 'IMG') {
            if (element.complete) {
                onLoad();
            } else {
                element.addEventListener('load', onLoad);
                element.addEventListener('error', onError);
            }
        } else if (element.tagName === 'LINK' || element.tagName === 'SCRIPT') {
            element.addEventListener('load', onLoad);
            element.addEventListener('error', onError);
            
            // Pour les CSS, vérifier si déjà chargé
            if (element.tagName === 'LINK' && element.sheet) {
                try {
                    if (element.sheet.cssRules) {
                        onLoad();
                    }
                } catch (e) {
                    // Probablement encore en cours de chargement
                }
            }
        }
    }

    setupLoadListeners() {
        // DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadedResources++;
                this.updateLoadingText('DOM');
                this.updateProgress();
            });
        } else {
            this.loadedResources++;
            this.totalResources++;
        }

        // Window load complet
        window.addEventListener('load', () => {
            // S'assurer que tout est chargé après un petit délai
            setTimeout(() => {
                if (!this.isComplete()) {
                    this.loadedResources = this.totalResources;
                    this.updateProgress();
                    this.completeLoading();
                }
            }, 100);
        });
    }

    updateLoadingText(resourceType) {
        if (resourceType && this.loadingText) {
            const messages = {
                'CSS': 'Styles chargés...',
                'JS': 'Scripts chargés...',
                'Images': 'Images chargées...',
                'Fonts': 'Polices chargées...',
                'Google Fonts': 'Google Fonts chargées...',
                'DOM': 'Structure prête...'
            };
            
            this.loadingText.textContent = messages[resourceType] || 'Chargement...';
        }
    }

    updateProgress() {
        if (this.progressFill && this.totalResources > 0) {
            const percentage = Math.min((this.loadedResources / this.totalResources) * 100, 100);
            this.progressFill.style.width = percentage + '%';
        }
    }

    isComplete() {
        return this.loadedResources >= this.totalResources && document.readyState === 'complete';
    }

    completeLoading() {
        if (this.loadingText) {
            this.loadingText.textContent = 'Prêt !';
        }
        
        if (this.progressFill) {
            this.progressFill.style.width = '100%';
        }

        // Calculer le temps de chargement
        const loadTime = Date.now() - this.startTime;
        
        setTimeout(() => {
            this.hidePreloader();
        }, Math.max(500, Math.min(loadTime * 0.1, 1000)));
    }

    hidePreloader() {
        if (this.preloader) {
            this.preloader.classList.add('fade-out');
            
            setTimeout(() => {
                if (this.preloader && this.preloader.parentNode) {
                    this.preloader.remove();
                }
                
                // Déclencher les animations du contenu
                document.body.classList.add('loaded');
                window.dispatchEvent(new CustomEvent('preloaderComplete'));
                
                // Initialiser les autres modules après le preloader
                this.initializeOtherModules();
            }, 600);
        }
    }

    initializeOtherModules() {
        // Initialiser les autres modules une fois le preloader terminé
        if (window.ThemeManager) {
            window.themeManager = new window.ThemeManager();
            window.themeManager.init();
        }
        
        if (window.ResponsiveNavbar) {
            window.responsiveNavbar = new window.ResponsiveNavbar();
            window.responsiveNavbar.init();
        }
        
        if (window.SoundManager) {
            window.soundManager = new window.SoundManager();
            window.soundManager.initialize();
        }
    }
}

// Export pour utilisation
window.PreloaderManager = PreloaderManager; 