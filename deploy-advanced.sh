#!/bin/bash

# =============================================================================
# 🚀 SCRIPT DE DÉPLOIEMENT AVANCÉ - PORTFOLIO ITSSGHIR
# =============================================================================
# Description: Script de déploiement complet avec options avancées
# Auteur: ITSsghir Portfolio Deployment Script
# Version: 2.0.0
# =============================================================================

set -e  # Arrêter le script en cas d'erreur

# Configuration des couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration par défaut
ENVIRONMENT=${1:-production}
DOMAIN=${DOMAIN:-anas.itssghir.com}
BUILD_CACHE=${BUILD_CACHE:-true}
BACKUP_ENABLED=${BACKUP_ENABLED:-true}
HEALTH_CHECK_TIMEOUT=${HEALTH_CHECK_TIMEOUT:-60}
LOG_LEVEL=${LOG_LEVEL:-info}

# =============================================================================
# FONCTIONS UTILITAIRES
# =============================================================================

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
        "DEBUG")   [[ $LOG_LEVEL == "debug" ]] && echo -e "${PURPLE}[DEBUG]${NC} [$timestamp] $message" ;;
        *)         echo -e "${CYAN}[LOG]${NC} [$timestamp] $message" ;;
    esac
}

print_banner() {
    echo -e "${CYAN}"
    cat << "EOF"
    ╔══════════════════════════════════════════════════════════════╗
    ║                  🚀 ITSSGHIR PORTFOLIO                      ║
    ║                  DEPLOYMENT SCRIPT v2.0                     ║
    ╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

print_usage() {
    cat << EOF
Usage: $0 [ENVIRONMENT] [OPTIONS]

ENVIRONMENTS:
    production    Déploiement production (default)
    staging       Déploiement staging
    development   Déploiement développement

OPTIONS:
    --no-cache    Désactiver le cache de build Docker
    --no-backup   Désactiver la sauvegarde
    --domain      Spécifier le domaine (default: anas.itssghir.com)
    --logs        Afficher les logs après déploiement
    --help        Afficher cette aide

VARIABLES D'ENVIRONNEMENT:
    DOMAIN                 Domaine du site (default: anas.itssghir.com)
    BUILD_CACHE           Activer/désactiver le cache (true/false)
    BACKUP_ENABLED        Activer/désactiver la sauvegarde (true/false)
    HEALTH_CHECK_TIMEOUT  Timeout en secondes pour les health checks (default: 60)
    LOG_LEVEL            Niveau de log (info/debug)

EXEMPLES:
    $0 production
    $0 staging --no-cache
    $0 production --domain mysite.com --logs
    DOMAIN=test.com $0 production --no-backup

EOF
}

get_docker_compose_cmd() {
    # Détecter la commande Docker Compose disponible
    if docker compose version &> /dev/null; then
        echo "docker compose"
    elif command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    else
        return 1
    fi
}

check_dependencies() {
    log "INFO" "🔍 Vérification des dépendances..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        log "ERROR" "Docker n'est pas installé"
        echo "Installez Docker avant de continuer."
        exit 1
    fi
    
    # Vérifier Docker Compose et définir la commande à utiliser
    DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)
    if [ $? -ne 0 ]; then
        log "ERROR" "Docker Compose n'est pas disponible"
        echo "Installez Docker Compose avant de continuer."
        exit 1
    fi
    
    log "DEBUG" "Utilisation de: $DOCKER_COMPOSE_CMD"
    log "SUCCESS" "Toutes les dépendances sont installées"
}

check_docker_status() {
    log "INFO" "🐳 Vérification du statut Docker..."
    
    if ! docker info &> /dev/null; then
        log "ERROR" "Docker n'est pas en cours d'exécution"
        log "INFO" "Démarrez Docker avec: sudo systemctl start docker"
        exit 1
    fi
    
    log "SUCCESS" "Docker est opérationnel"
}

check_network() {
    log "INFO" "🌐 Vérification du réseau proxy..."
    
    if ! docker network ls | grep -q "proxy"; then
        log "WARN" "Le réseau 'proxy' n'existe pas. Création..."
        docker network create proxy
        log "SUCCESS" "Réseau 'proxy' créé"
    else
        log "SUCCESS" "Réseau 'proxy' existant"
    fi
}

check_traefik() {
    log "INFO" "🔀 Vérification de Traefik..."
    
    if ! docker ps | grep -q traefik; then
        log "WARN" "Traefik ne semble pas fonctionner"
        log "INFO" "Assurez-vous que Traefik soit démarré avant de continuer"
        read -p "Continuer sans Traefik? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "INFO" "Déploiement annulé"
            exit 1
        fi
    else
        log "SUCCESS" "Traefik est actif"
    fi
}

backup_data() {
    if [[ $BACKUP_ENABLED == "true" ]]; then
        log "INFO" "💾 Création d'une sauvegarde..."
        
        local backup_dir="./backups/$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$backup_dir"
        
        # Sauvegarder les données des conteneurs s'ils existent
        if docker ps -a | grep -q "portfolio-frontend"; then
            log "DEBUG" "Sauvegarde des données frontend..."
            docker run --rm \
                --volumes-from portfolio-frontend \
                -v "$PWD/$backup_dir":/backup \
                alpine tar czf /backup/frontend-data.tar.gz /usr/share/nginx/html 2>/dev/null || true
        fi
        
        if docker ps -a | grep -q "portfolio-backend"; then
            log "DEBUG" "Sauvegarde des données backend..."
            docker run --rm \
                --volumes-from portfolio-backend \
                -v "$PWD/$backup_dir":/backup \
                alpine tar czf /backup/backend-data.tar.gz /app 2>/dev/null || true
        fi
        
        log "SUCCESS" "Sauvegarde créée dans: $backup_dir"
    else
        log "INFO" "Sauvegarde désactivée"
    fi
}

build_and_deploy() {
    log "INFO" "🏗️ Construction et déploiement..."
    
    # Arrêter les anciens conteneurs
    log "INFO" "Arrêt des conteneurs existants..."
    $DOCKER_COMPOSE_CMD down --remove-orphans
    
    # Nettoyer les images orphelines si nécessaire
    if [[ $BUILD_CACHE == "false" ]]; then
        log "INFO" "Nettoyage du cache Docker..."
        docker system prune -f
        $DOCKER_COMPOSE_CMD build --no-cache
    else
        $DOCKER_COMPOSE_CMD build
    fi
    
    # Démarrer les services
    log "INFO" "Démarrage des services..."
    $DOCKER_COMPOSE_CMD up -d
    
    log "SUCCESS" "Services démarrés"
}

health_check() {
    log "INFO" "🏥 Vérification de santé des services..."
    
    local timeout=$HEALTH_CHECK_TIMEOUT
    local interval=5
    local elapsed=0
    
    # Vérifier le frontend
    while [ $elapsed -lt $timeout ]; do
        if docker ps | grep -q "portfolio-frontend.*Up"; then
            log "SUCCESS" "Frontend: Opérationnel"
            break
        fi
        
        if [ $elapsed -eq 0 ]; then
            log "INFO" "Attente du démarrage du frontend..."
        fi
        
        sleep $interval
        elapsed=$((elapsed + interval))
        
        if [ $elapsed -ge $timeout ]; then
            log "ERROR" "Timeout: Frontend non opérationnel après ${timeout}s"
            return 1
        fi
    done
    
    # Vérifier le backend
    elapsed=0
    while [ $elapsed -lt $timeout ]; do
        if docker ps | grep -q "portfolio-backend.*Up"; then
            log "SUCCESS" "Backend: Opérationnel"
            break
        fi
        
        if [ $elapsed -eq 0 ]; then
            log "INFO" "Attente du démarrage du backend..."
        fi
        
        sleep $interval
        elapsed=$((elapsed + interval))
        
        if [ $elapsed -ge $timeout ]; then
            log "ERROR" "Timeout: Backend non opérationnel après ${timeout}s"
            return 1
        fi
    done
    
    # Test de connectivité API
    log "INFO" "Test de l'API backend..."
    sleep 5  # Attendre que l'API soit prête
    
    if docker exec portfolio-backend wget --quiet --tries=1 --connect-timeout=10 --read-timeout=10 -O- http://localhost:3000/health 2>/dev/null | grep -q "OK"; then
        log "SUCCESS" "API Backend: Répondant"
    else
        log "WARN" "API Backend: Non répondant (peut être normal si l'API met du temps à démarrer)"
    fi
}

print_status() {
    log "INFO" "📊 Statut des services:"
    echo
    $DOCKER_COMPOSE_CMD ps
    echo
    
    log "INFO" "🌐 Accès aux services:"
    echo -e "   ${GREEN}Frontend:${NC} https://$DOMAIN"
    echo -e "   ${YELLOW}Backend API:${NC} 🔒 Interne seulement (sécurisé)"
    echo
    
    log "INFO" "📝 Commandes utiles:"
    echo -e "   ${CYAN}Logs frontend:${NC} $DOCKER_COMPOSE_CMD logs -f portfolio-frontend"
    echo -e "   ${CYAN}Logs backend:${NC}  $DOCKER_COMPOSE_CMD logs -f portfolio-backend"
    echo -e "   ${CYAN}Logs combinés:${NC} $DOCKER_COMPOSE_CMD logs -f"
    echo -e "   ${CYAN}Redémarrer:${NC}    $DOCKER_COMPOSE_CMD restart"
    echo -e "   ${CYAN}Arrêter:${NC}       $DOCKER_COMPOSE_CMD down"
    echo
    
    # Informations sur les ressources
    log "INFO" "💻 Utilisation des ressources:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

cleanup_old_images() {
    log "INFO" "🧹 Nettoyage des anciennes images..."
    
    # Supprimer les images dangereuses (non étiquetées)
    local dangling_images=$(docker images -f "dangling=true" -q)
    if [ -n "$dangling_images" ]; then
        docker rmi $dangling_images 2>/dev/null || true
        log "SUCCESS" "Images dangereuses supprimées"
    else
        log "INFO" "Aucune image dangereuse trouvée"
    fi
}

post_deploy_actions() {
    log "INFO" "⚙️ Actions post-déploiement..."
    
    # Attendre un peu pour que les services se stabilisent
    sleep 10
    
    # Vérifications finales
    if health_check; then
        log "SUCCESS" "Tous les services sont opérationnels"
    else
        log "WARN" "Certains services peuvent ne pas être complètement opérationnels"
    fi
    
    # Nettoyage
    cleanup_old_images
}

# =============================================================================
# TRAITEMENT DES ARGUMENTS
# =============================================================================

SHOW_LOGS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-cache)
            BUILD_CACHE=false
            shift
            ;;
        --no-backup)
            BACKUP_ENABLED=false
            shift
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --logs)
            SHOW_LOGS=true
            shift
            ;;
        --help)
            print_usage
            exit 0
            ;;
        -*)
            log "ERROR" "Option inconnue: $1"
            print_usage
            exit 1
            ;;
        *)
            ENVIRONMENT="$1"
            shift
            ;;
    esac
done

# =============================================================================
# SCRIPT PRINCIPAL
# =============================================================================

main() {
    print_banner
    
    log "INFO" "Démarrage du déploiement..."
    log "INFO" "Environnement: $ENVIRONMENT"
    log "INFO" "Domaine: $DOMAIN"
    log "INFO" "Cache de build: $BUILD_CACHE"
    log "INFO" "Sauvegarde: $BACKUP_ENABLED"
    echo
    
    # Vérifications préliminaires
    check_dependencies
    check_docker_status
    check_network
    check_traefik
    
    # Sauvegarde
    backup_data
    
    # Construction et déploiement
    build_and_deploy
    
    # Actions post-déploiement
    post_deploy_actions
    
    # Affichage du statut
    print_status
    
    # Afficher les logs si demandé
    if [[ $SHOW_LOGS == "true" ]]; then
        log "INFO" "📋 Affichage des logs..."
        $DOCKER_COMPOSE_CMD logs --tail=50
    fi
    
    log "SUCCESS" "✅ Déploiement terminé avec succès!"
    log "INFO" "🎉 Portfolio accessible sur: https://$DOMAIN"
}

# Gestion des signaux pour un arrêt propre
trap 'log "ERROR" "Déploiement interrompu"; exit 1' INT TERM

# Lancer le script principal
main "$@" 