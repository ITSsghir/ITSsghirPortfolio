// ===== MAIN JS - POINT D'ENTRÉE PRINCIPAL ===== //

// Configuration globale
const config = {
    githubUsername: 'ITSsghir',
    githubToken: '', // Laissez vide pour les repos publics
    apiBaseUrl: 'http://localhost:3000'
};

// Fonction d'initialisation principale
function initializeApp() {
    // Initialiser le preloader en premier
    if (window.PreloaderManager) {
        const preloaderManager = new window.PreloaderManager();
        preloaderManager.init();
    }
    
    // Les autres modules seront initialisés par le preloader
    // une fois le chargement terminé
}

// Fonction utilitaire pour le scroll vers le haut
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Attendre que le DOM soit prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export des fonctions globales
window.scrollToTop = scrollToTop;
window.config = config; 