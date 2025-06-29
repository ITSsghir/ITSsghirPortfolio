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
    log "INFO" "💾 Création d'une sauvegarde complète"
    
    local backup_dir="./backups/manual_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Sauvegarde des données
    if docker ps | grep -q "portfolio-frontend"; then
        log "INFO" "Sauvegarde Frontend..."
        docker run --rm \
            --volumes-from portfolio-frontend \
            -v "$PWD/$backup_dir":/backup \
            alpine tar czf /backup/frontend-data.tar.gz /usr/share/nginx/html 2>/dev/null || true
    fi
    
    if docker ps | grep -q "portfolio-backend"; then
        log "INFO" "Sauvegarde Backend..."
        docker run --rm \
            --volumes-from portfolio-backend \
            -v "$PWD/$backup_dir":/backup \
            alpine tar czf /backup/backend-data.tar.gz /app 2>/dev/null || true
    fi
    
    # Sauvegarde de la configuration
    cp docker-compose.yml "$backup_dir/"
    cp -r frontend/nginx.conf "$backup_dir/" 2>/dev/null || true
    
    # Créer un fichier d'info sur la sauvegarde
    cat > "$backup_dir/backup_info.txt" << EOF
Sauvegarde créée le: $(date)
Services sauvegardés:
$(docker compose ps --format "table {{.Service}}\t{{.State}}")

Images:
$(docker compose images)
EOF
    
    log "SUCCESS" "Sauvegarde créée dans: $backup_dir"
}

cmd_restore() {
    local backup_path=${1:-}
    
    if [[ -z $backup_path ]]; then
        log "ERROR" "Veuillez spécifier le chemin de la sauvegarde"
        echo "Usage: $0 restore /path/to/backup"
        return 1
    fi
    
    if [[ ! -d $backup_path ]]; then
        log "ERROR" "Le répertoire de sauvegarde n'existe pas: $backup_path"
        return 1
    fi
    
    log "INFO" "🔄 Restauration depuis: $backup_path"
    
    # Arrêter les services
    docker compose down
    
    # Restaurer les données
    if [[ -f "$backup_path/frontend-data.tar.gz" ]]; then
        log "INFO" "Restauration Frontend..."
        docker run --rm \
            -v "$backup_path":/backup \
            -v portfolio_frontend_data:/data \
            alpine sh -c "cd /data && tar xzf /backup/frontend-data.tar.gz --strip-components=4"
    fi
    
    if [[ -f "$backup_path/backend-data.tar.gz" ]]; then
        log "INFO" "Restauration Backend..."
        docker run --rm \
            -v "$backup_path":/backup \
            -v portfolio_backend_data:/data \
            alpine sh -c "cd /data && tar xzf /backup/backend-data.tar.gz --strip-components=1"
    fi
    
    # Redémarrer les services
    docker compose up -d
    
    log "SUCCESS" "Restauration terminée"
}

cmd_clean() {
    log "INFO" "🧹 Nettoyage Docker"
    
    echo "Cette opération va supprimer:"
    echo "- Images Docker orphelines"
    echo "- Conteneurs arrêtés"
    echo "- Volumes non utilisés"
    echo "- Réseaux non utilisés"
    echo
    
    read -p "Continuer? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Nettoyer le système Docker
        docker system prune -af --volumes
        
        log "SUCCESS" "Nettoyage terminé"
        
        # Afficher l'espace libéré
        log "INFO" "Espace disque après nettoyage:"
        docker system df
    else
        log "INFO" "Nettoyage annulé"
    fi
}

cmd_monitor() {
    log "INFO" "📊 Monitoring en temps réel (Ctrl+C pour arrêter)"
    
    # Créer un script de monitoring temporaire
    cat > /tmp/portfolio_monitor.sh << 'EOF'
#!/bin/bash
while true; do
    clear
    echo "=== PORTFOLIO MONITORING - $(date) ==="
    echo
    
    echo "📊 STATUT DES SERVICES:"
    docker compose ps
    echo
    
    echo "💻 RESSOURCES:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
    echo
    
    echo "🌐 CONNECTIVITÉ:"
    if curl -s --max-time 5 https://anas.itssghir.com > /dev/null; then
        echo "✅ Site accessible"
    else
        echo "❌ Site non accessible"
    fi
    
    if docker exec portfolio-backend wget --quiet --tries=1 --connect-timeout=5 -O- http://localhost:3000/health 2>/dev/null | grep -q "OK"; then
        echo "✅ API Backend répondante"
    else
        echo "❌ API Backend non répondante"
    fi
    
    echo
    echo "Actualisation dans 10 secondes... (Ctrl+C pour arrêter)"
    sleep 10
done
EOF
    
    chmod +x /tmp/portfolio_monitor.sh
    bash /tmp/portfolio_monitor.sh
    rm /tmp/portfolio_monitor.sh
}

cmd_health() {
    log "INFO" "🏥 Vérification de santé complète"
    
    local issues=0
    
    # Vérifier Docker
    if ! docker info &> /dev/null; then
        log "ERROR" "Docker n'est pas opérationnel"
        ((issues++))
    else
        log "SUCCESS" "Docker: OK"
    fi
    
    # Vérifier les services
    if ! check_services; then
        log "ERROR" "Services non opérationnels"
        ((issues++))
    else
        log "SUCCESS" "Services: OK"
    fi
    
    # Vérifier la connectivité API
    if docker exec portfolio-backend wget --quiet --tries=1 --connect-timeout=10 -O- http://localhost:3000/health 2>/dev/null | grep -q "OK"; then
        log "SUCCESS" "API Backend: OK"
    else
        log "WARN" "API Backend: Problème de réponse"
        ((issues++))
    fi
    
    # Vérifier l'accès web
    if curl -s --max-time 10 https://anas.itssghir.com > /dev/null; then
        log "SUCCESS" "Site web: Accessible"
    else
        log "WARN" "Site web: Non accessible depuis l'extérieur"
        ((issues++))
    fi
    
    # Vérifier l'espace disque
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [[ $disk_usage -gt 90 ]]; then
        log "WARN" "Espace disque: ${disk_usage}% utilisé (critique)"
        ((issues++))
    elif [[ $disk_usage -gt 80 ]]; then
        log "WARN" "Espace disque: ${disk_usage}% utilisé (attention)"
    else
        log "SUCCESS" "Espace disque: ${disk_usage}% utilisé"
    fi
    
    echo
    if [[ $issues -eq 0 ]]; then
        log "SUCCESS" "✅ Tous les systèmes sont opérationnels"
    else
        log "WARN" "⚠️ $issues problème(s) détecté(s)"
    fi
}

# =============================================================================
# SCRIPT PRINCIPAL
# =============================================================================

main() {
    if [[ $# -eq 0 ]]; then
        print_banner
        print_usage
        exit 0
    fi
    
    local command=$1
    shift
    
    case $command in
        status)
            cmd_status "$@"
            ;;
        logs)
            cmd_logs "$@"
            ;;
        restart)
            cmd_restart "$@"
            ;;
        stop)
            cmd_stop "$@"
            ;;
        start)
            cmd_start "$@"
            ;;
        update)
            cmd_update "$@"
            ;;
        backup)
            cmd_backup "$@"
            ;;
        restore)
            cmd_restore "$@"
            ;;
        clean)
            cmd_clean "$@"
            ;;
        monitor)
            cmd_monitor "$@"
            ;;
        health)
            cmd_health "$@"
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

main "$@" 