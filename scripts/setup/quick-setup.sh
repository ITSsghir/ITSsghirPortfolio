#!/bin/bash

# =============================================================================
# 🚀 INSTALLATION RAPIDE - PORTFOLIO ITSSGHIR
# =============================================================================
# Script d'installation et de configuration initiale
# =============================================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    
    case $level in
        "ERROR")   echo -e "${RED}[ERROR]${NC} [$timestamp] $message" ;;
        "WARN")    echo -e "${YELLOW}[WARN]${NC} [$timestamp] $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} [$timestamp] $message" ;;
        "INFO")    echo -e "${BLUE}[INFO]${NC} [$timestamp] $message" ;;
        *)         echo -e "${CYAN}[LOG]${NC} [$timestamp] $message" ;;
    esac
}

print_banner() {
    clear
    echo -e "${PURPLE}"
    cat << "EOF"
    ╔══════════════════════════════════════════════════════════════╗
    ║              🚀 PORTFOLIO ITSSGHIR                          ║
    ║                INSTALLATION RAPIDE                           ║
    ║                                                              ║
    ║           Configuration et déploiement automatique           ║
    ╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

check_system() {
    log "INFO" "🔍 Vérification du système..."
    
    # Vérifier l'OS
    if [[ "$OSTYPE" != "linux-gnu"* ]]; then
        log "WARN" "Ce script est optimisé pour Linux"
    fi
    
    # Vérifier les dépendances
    local deps=("git" "curl" "wget")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        log "ERROR" "Dépendances manquantes: ${missing[*]}"
        log "INFO" "Installation avec: sudo apt install ${missing[*]}"
        exit 1
    fi
    
    log "SUCCESS" "Système compatible"
}

install_docker() {
    if command -v docker &> /dev/null; then
        log "SUCCESS" "Docker déjà installé"
        return 0
    fi
    
    log "INFO" "📦 Installation de Docker..."
    
    # Mise à jour des paquets
    sudo apt update
    
    # Installation des dépendances
    sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Ajout de la clé GPG Docker
    curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Ajout du repository Docker
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Installation Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Ajout de l'utilisateur au groupe docker
    sudo usermod -aG docker $USER
    
    # Démarrage et activation Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    log "SUCCESS" "Docker installé avec succès"
    log "WARN" "Redémarrez votre session pour utiliser Docker sans sudo"
}

setup_environment() {
    log "INFO" "⚙️ Configuration de l'environnement..."
    
    # Créer le fichier .env s'il n'existe pas
    if [[ ! -f .env ]]; then
        if [[ -f config.env.example ]]; then
            cp config.env.example .env
            log "SUCCESS" "Fichier .env créé depuis l'exemple"
        else
            log "WARN" "Fichier d'exemple non trouvé, création d'un .env basique"
            cat > .env << EOF
# Configuration Portfolio ITSsghir
ENVIRONMENT=production
DOMAIN=anas.itssghir.com
BUILD_CACHE=true
BACKUP_ENABLED=true
HEALTH_CHECK_TIMEOUT=60
LOG_LEVEL=info

# Backend Configuration
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=production

# Frontend Configuration
VITE_API_URL=https://anas.itssghir.com/api
VITE_ENVIRONMENT=production
EOF
        fi
    else
        log "INFO" "Fichier .env existant conservé"
    fi
    
    # Permissions des scripts
    chmod +x *.sh 2>/dev/null || true
    
    # Créer les répertoires nécessaires
    mkdir -p backups logs
    
    log "SUCCESS" "Environnement configuré"
}

interactive_config() {
    echo
    log "INFO" "📝 Configuration interactive"
    echo
    
    # Demander le domaine
    read -p "🌐 Domaine du site (default: anas.itssghir.com): " domain
    domain=${domain:-anas.itssghir.com}
    
    # Demander la clé OpenAI
    echo
    log "INFO" "🔑 Configuration de l'API OpenAI"
    echo "Vous pouvez obtenir une clé API sur: https://platform.openai.com/api-keys"
    read -p "Clé API OpenAI (ou 'skip' pour configurer plus tard): " openai_key
    
    # Demander l'environnement
    echo
    log "INFO" "🏗️ Type de déploiement"
    echo "1) Production (recommandé)"
    echo "2) Staging (test)"
    echo "3) Development (dev)"
    read -p "Choisissez (1-3, default: 1): " env_choice
    
    case $env_choice in
        2) environment="staging" ;;
        3) environment="development" ;;
        *) environment="production" ;;
    esac
    
    # Mettre à jour le fichier .env
    sed -i "s/DOMAIN=.*/DOMAIN=$domain/" .env
    sed -i "s/ENVIRONMENT=.*/ENVIRONMENT=$environment/" .env
    
    if [[ "$openai_key" != "skip" && -n "$openai_key" ]]; then
        sed -i "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$openai_key/" .env
        sed -i "s|VITE_API_URL=.*|VITE_API_URL=https://$domain/api|" .env
    fi
    
    log "SUCCESS" "Configuration mise à jour"
    
    # Afficher la configuration
    echo
    log "INFO" "📋 Configuration finale:"
    echo "   Domaine: $domain"
    echo "   Environnement: $environment"
    echo "   API OpenAI: ${openai_key:+✅ Configurée}${openai_key:-❌ À configurer}"
}

install_portfolio() {
    log "INFO" "🚀 Installation du portfolio..."
    
    # Vérifier que Docker fonctionne
    if ! docker info &> /dev/null; then
        log "ERROR" "Docker n'est pas accessible"
        log "INFO" "Essayez: sudo systemctl start docker"
        log "INFO" "Ou redémarrez votre session si vous venez d'installer Docker"
        exit 1
    fi
    
    # Lancer le déploiement
    if [[ -x "./deploy-advanced.sh" ]]; then
        log "INFO" "Lancement du déploiement..."
        ./deploy-advanced.sh "$environment" --logs
    else
        log "ERROR" "Script de déploiement non trouvé"
        exit 1
    fi
}

show_final_info() {
    echo
    log "SUCCESS" "🎉 Installation terminée!"
    echo
    echo -e "${GREEN}📱 Accès au portfolio:${NC}"
    echo "   🌐 Site web: https://$domain"
    echo "   📊 API: https://$domain/api/health"
    echo
    echo -e "${BLUE}🛠️ Commandes utiles:${NC}"
    echo "   ./manage.sh status          # Statut des services"
    echo "   ./manage.sh logs --follow   # Logs en temps réel"
    echo "   ./manage.sh health          # Vérification santé"
    echo "   ./manage.sh monitor         # Monitoring dashboard"
    echo "   ./manage.sh backup          # Sauvegarde"
    echo
    echo -e "${YELLOW}📖 Documentation:${NC}"
    echo "   README.md                   # Guide utilisateur"
    echo "   DEPLOYMENT.md               # Guide déploiement"
    echo
    
    if grep -q "your_openai_api_key_here" .env 2>/dev/null; then
        echo -e "${RED}⚠️ N'oubliez pas:${NC}"
        echo "   Configurez votre clé API OpenAI dans le fichier .env"
        echo "   Puis redémarrez: ./manage.sh restart"
        echo
    fi
    
    echo -e "${PURPLE}🎯 Prochaines étapes:${NC}"
    echo "   1. Vérifiez que votre domaine pointe vers ce serveur"
    echo "   2. Assurez-vous que Traefik est configuré"
    echo "   3. Testez l'accès au site"
    echo "   4. Configurez les sauvegardes automatiques"
}

# Script principal
main() {
    print_banner
    
    echo "Ce script va installer et configurer votre portfolio ITSsghir"
    echo "Il installe Docker (si nécessaire) et déploie l'application"
    echo
    read -p "Continuer? (Y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        log "INFO" "Installation annulée"
        exit 0
    fi
    
    # Étapes d'installation
    check_system
    install_docker
    setup_environment
    interactive_config
    
    echo
    log "INFO" "🚀 Prêt pour l'installation"
    read -p "Lancer le déploiement maintenant? (Y/n): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        install_portfolio
        show_final_info
    else
        log "INFO" "Installation préparée. Lancez ./deploy-advanced.sh quand vous êtes prêt"
        echo
        echo "Configuration sauvegardée dans .env"
        echo "Pour déployer plus tard: ./deploy-advanced.sh $environment"
    fi
}

# Lancer le script
main "$@" 