#!/bin/bash

# =============================================================================
# 🛠️ SCRIPT DE GESTION - PORTFOLIO ITSSGHIR
# =============================================================================
# Description: Script pour gérer le portfolio (logs, maintenance, monitoring)
# Version: 1.0.0
# =============================================================================

set -e

# Configuration des couleurs
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
    echo -e "${PURPLE}"
    cat << "EOF"
    ╔══════════════════════════════════════════════════════════════╗
    ║                  🛠️ PORTFOLIO MANAGER                       ║
    ║                     Gestion & Maintenance                    ║
    ╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

print_usage() {
    cat << EOF
Usage: $0 [COMMAND] [OPTIONS]

COMMANDES DISPONIBLES:
    status        Afficher le statut des services
    logs          Afficher les logs
    restart       Redémarrer les services
    stop          Arrêter les services
    start         Démarrer les services
    update        Mettre à jour les services
    backup        Créer une sauvegarde
    restore       Restaurer depuis une sauvegarde
    clean         Nettoyer Docker
    monitor       Monitoring en temps réel
    health        Vérification de santé
    help          Afficher cette aide

OPTIONS POUR LES LOGS:
    -f, --follow    Suivre les logs en temps réel
    -n, --lines     Nombre de lignes à afficher (default: 100)
    --frontend      Logs du frontend uniquement
    --backend       Logs du backend uniquement

EXEMPLES:
    $0 status
    $0 logs --follow
    $0 logs --backend -n 50
    $0 restart
    $0 backup

EOF
}

check_services() {
    if ! docker compose ps | grep -q "Up"; then
        log "WARN" "Aucun service n'est en cours d'exécution"
        return 1
    fi
    return 0
}

cmd_status() {
    log "INFO" "📊 Statut des services Portfolio"
    echo
    
    docker compose ps
    echo
    
    log "INFO" "💻 Utilisation des ressources:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    echo
    
    log "INFO" "🌐 Ports exposés:"
    docker compose ps --format "table {{.Service}}\t{{.Ports}}"
}

cmd_logs() {
    local follow=false
    local lines=100
    local service=""
    
    # Parser les options
    while [[ $# -gt 0 ]]; do
        case $1 in
            -f|--follow)
                follow=true
                shift
                ;;
            -n|--lines)
                lines="$2"
                shift 2
                ;;
            --frontend)
                service="portfolio-frontend"
                shift
                ;;
            --backend)
                service="portfolio-backend"
                shift
                ;;
            *)
                shift
                ;;
        esac
    done
    
    if ! check_services; then
        return 1
    fi
    
    log "INFO" "📋 Affichage des logs ($lines lignes)"
    
    if [[ $follow == "true" ]]; then
        if [[ -n $service ]]; then
            docker compose logs -f --tail="$lines" "$service"
        else
            docker compose logs -f --tail="$lines"
        fi
    else
        if [[ -n $service ]]; then
            docker compose logs --tail="$lines" "$service"
        else
            docker compose logs --tail="$lines"
        fi
    fi
}

cmd_restart() {
    local service=${1:-}
    
    if [[ -n $service ]]; then
        log "INFO" "🔄 Redémarrage du service: $service"
        docker compose restart "$service"
    else
        log "INFO" "🔄 Redémarrage de tous les services"
        docker compose restart
    fi
    
    log "SUCCESS" "Services redémarrés"
    cmd_status
}

cmd_stop() {
    log "INFO" "⏹️ Arrêt des services"
    docker compose stop
    log "SUCCESS" "Services arrêtés"
}

cmd_start() {
    log "INFO" "▶️ Démarrage des services"
    docker compose start
    
    # Attendre un peu pour la stabilisation
    sleep 5
    
    log "SUCCESS" "Services démarrés"
    cmd_status
}

cmd_update() {
    log "INFO" "🔄 Mise à jour des services"
    
    # Pull des nouvelles images
    docker compose pull
    
    # Rebuild et redémarrage
    docker compose up --build -d
    
    log "SUCCESS" "Services mis à jour"
    cmd_status
}

cmd_backup() {
    log "INFO" "💾 Création d'une sauvegarde..."
    
    local backup_dir="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Sauvegarder les données des conteneurs s'ils existent
    if docker ps -a | grep -q "portfolio-frontend"; then
        log "INFO" "Sauvegarde des données frontend..."
        docker run --rm \
            --volumes-from portfolio-frontend \
            -v "$PWD/$backup_dir":/backup \
            alpine tar czf /backup/frontend-data.tar.gz /usr/share/nginx/html 2>/dev/null || true
    fi
    
    if docker ps -a | grep -q "portfolio-backend"; then
        log "INFO" "Sauvegarde des données backend..."
        docker run --rm \
            --volumes-from portfolio-backend \
            -v "$PWD/$backup_dir":/backup \
            alpine tar czf /backup/backend-data.tar.gz /app 2>/dev/null || true
    fi
    
    log "SUCCESS" "Sauvegarde créée dans: $backup_dir"
}

cmd_clean() {
    log "INFO" "🧹 Nettoyage Docker..."
    
    # Supprimer les conteneurs arrêtés
    docker container prune -f
    
    # Supprimer les images non utilisées
    docker image prune -f
    
    # Supprimer les volumes non utilisés
    docker volume prune -f
    
    # Supprimer les réseaux non utilisés
    docker network prune -f
    
    log "SUCCESS" "Nettoyage terminé"
}

cmd_monitor() {
    log "INFO" "📊 Monitoring en temps réel"
    log "INFO" "Appuyez sur Ctrl+C pour arrêter"
    
    watch -n 2 'docker compose ps && echo "" && docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"'
}

cmd_health() {
    log "INFO" "🏥 Vérification de santé des services"
    
    # Vérifier le frontend
    if curl -f -s http://localhost:80 > /dev/null; then
        log "SUCCESS" "Frontend: ✅ OK"
    else
        log "ERROR" "Frontend: ❌ KO"
    fi
    
    # Vérifier le backend
    if docker exec portfolio-backend curl -f -s http://localhost:3000/health > /dev/null 2>&1; then
        log "SUCCESS" "Backend: ✅ OK"
    else
        log "ERROR" "Backend: ❌ KO"
    fi
    
    # Vérifier Traefik
    if docker ps | grep -q traefik; then
        log "SUCCESS" "Traefik: ✅ OK"
    else
        log "ERROR" "Traefik: ❌ KO"
    fi
}

# Script principal
main() {
    local command=${1:-help}
    
    case $command in
        status)
            cmd_status
            ;;
        logs)
            shift
            cmd_logs "$@"
            ;;
        restart)
            shift
            cmd_restart "$@"
            ;;
        stop)
            cmd_stop
            ;;
        start)
            cmd_start
            ;;
        update)
            cmd_update
            ;;
        backup)
            cmd_backup
            ;;
        restore)
            log "WARN" "Fonctionnalité de restauration non implémentée"
            ;;
        clean)
            cmd_clean
            ;;
        monitor)
            cmd_monitor
            ;;
        health)
            cmd_health
            ;;
        help|--help|-h)
            print_banner
            print_usage
            ;;
        *)
            log "ERROR" "Commande inconnue: $command"
            print_usage
            exit 1
            ;;
    esac
}

# Exécuter le script principal
main "$@" 