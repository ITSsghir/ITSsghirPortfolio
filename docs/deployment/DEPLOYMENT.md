# 🚀 Guide de Déploiement - Portfolio ITSsghir

## 📋 Vue d'ensemble

Ce portfolio est une application web composée de :
- **Frontend** : Site statique avec HTML/CSS/JS servi par Nginx
- **Backend** : API Node.js/Express avec intégration OpenAI
- **Infrastructure** : Docker + Traefik pour la gestion des certificats SSL

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     Traefik     │───▶│    Frontend      │───▶│    Backend      │
│   (Proxy/SSL)   │    │    (Nginx)       │    │   (Node.js)     │
│                 │    │                  │    │                 │
│ *.itssghir.com  │    │ Portfolio Site   │    │ API + OpenAI    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Prérequis

### Système
- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Bash** >= 4.0
- **curl** et **wget** (pour les health checks)

### Domaine et DNS
- Domaine configuré (ex: `anas.itssghir.com`)
- DNS pointant vers votre serveur
- Traefik configuré avec certificats SSL

### API Keys
- Clé API OpenAI pour le chatbot

## 🚀 Installation et Déploiement

### 1. Clone et Configuration

```bash
# Cloner le projet
git clone <repository-url>
cd itssghirportfolio

# Copier et configurer l'environnement
cp config.env.example .env
nano .env  # Ajuster les valeurs
```

### 2. Configuration de l'environnement

```bash
# Variables essentielles dans .env
OPENAI_API_KEY=sk-...
DOMAIN=votre-domaine.com
ENVIRONMENT=production
```

### 3. Déploiement Simple

```bash
# Donner les permissions d'exécution
chmod +x deploy-advanced.sh manage.sh

# Déploiement production
./deploy-advanced.sh production

# Ou avec options
./deploy-advanced.sh production --domain mysite.com --logs
```

### 4. Déploiement Staging

```bash
# Pour tester avant la production
./deploy-advanced.sh staging --no-cache
```

## 🎛️ Scripts de Gestion

### deploy-advanced.sh - Script de Déploiement Principal

```bash
# Usage basique
./deploy-advanced.sh [environment] [options]

# Environnements disponibles
./deploy-advanced.sh production    # Déploiement production
./deploy-advanced.sh staging       # Déploiement staging  
./deploy-advanced.sh development   # Déploiement dev

# Options utiles
./deploy-advanced.sh production --no-cache     # Sans cache Docker
./deploy-advanced.sh production --no-backup    # Sans sauvegarde
./deploy-advanced.sh production --logs         # Avec logs
./deploy-advanced.sh production --domain site.com
```

### manage.sh - Script de Gestion

```bash
# Statut des services
./manage.sh status

# Gestion des logs
./manage.sh logs                    # Tous les logs
./manage.sh logs --follow           # Suivi en temps réel
./manage.sh logs --backend -n 50    # 50 lignes backend
./manage.sh logs --frontend         # Frontend uniquement

# Gestion des services
./manage.sh restart                 # Redémarrer tous
./manage.sh restart frontend        # Redémarrer frontend uniquement
./manage.sh stop                    # Arrêter
./manage.sh start                   # Démarrer

# Maintenance
./manage.sh backup                  # Sauvegarde manuelle
./manage.sh clean                   # Nettoyage Docker
./manage.sh health                  # Vérification santé
./manage.sh monitor                 # Monitoring temps réel
```

## 🔧 Configuration Avancée

### Variables d'Environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DOMAIN` | Domaine principal | `anas.itssghir.com` |
| `BUILD_CACHE` | Cache Docker | `true` |
| `BACKUP_ENABLED` | Sauvegardes auto | `true` |
| `HEALTH_CHECK_TIMEOUT` | Timeout health check | `60` |
| `LOG_LEVEL` | Niveau de log | `info` |
| `OPENAI_API_KEY` | Clé API OpenAI | *requis* |

### Personnalisation Docker Compose

Pour modifier la configuration, éditez `docker-compose.yml` :

```yaml
# Exemple : changer le domaine
labels:
  - traefik.http.routers.portfolio-frontend.rule=Host(`nouveaudomaine.com`)
```

### Configuration Nginx

Le fichier `frontend/nginx.conf` peut être personnalisé pour :
- Cache des assets
- Headers de sécurité
- Redirections
- Configuration proxy API

## 📊 Monitoring et Logs

### Monitoring en Temps Réel

```bash
# Dashboard complet
./manage.sh monitor

# Statut rapide
./manage.sh status

# Vérification santé
./manage.sh health
```

### Gestion des Logs

```bash
# Logs en temps réel
docker compose logs -f

# Logs spécifiques
docker compose logs -f portfolio-frontend
docker compose logs -f portfolio-backend

# Logs avec horodatage
docker compose logs -t --tail=100
```

### Métriques Docker

```bash
# Utilisation ressources
docker stats

# Espace disque
docker system df

# Images et conteneurs
docker images
docker ps -a
```

## 💾 Sauvegarde et Restauration

### Sauvegarde Automatique

Les sauvegardes sont créées automatiquement à chaque déploiement dans `./backups/`

### Sauvegarde Manuelle

```bash
# Sauvegarde complète
./manage.sh backup

# Sauvegarde avec timestamp
./deploy-advanced.sh production  # Inclut sauvegarde auto
```

### Restauration

```bash
# Restaurer depuis une sauvegarde
./manage.sh restore ./backups/20231201_143022/

# Lister les sauvegardes
ls -la ./backups/
```

## 🔒 Sécurité

### HTTPS et Certificats

- Traefik gère automatiquement les certificats SSL
- Renouvellement automatique Let's Encrypt
- Redirection HTTP → HTTPS

### Headers de Sécurité

Nginx configure automatiquement :
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`

### API Backend

- CORS configuré pour le domaine
- Rate limiting (selon configuration)
- Logs d'accès et d'erreur

## 🚨 Dépannage

### Problèmes Courants

#### Services ne démarrent pas
```bash
# Vérifier les logs
./manage.sh logs

# Vérifier Docker
docker info
systemctl status docker

# Redémarrer proprement
docker compose down
docker compose up -d
```

#### Site non accessible
```bash
# Vérifier Traefik
docker ps | grep traefik

# Vérifier les certificats
docker logs traefik

# Tester connectivité
curl -I https://votredomaine.com
```

#### API Backend non répondante
```bash
# Vérifier l'API
./manage.sh health

# Logs backend
./manage.sh logs --backend

# Test direct
docker exec portfolio-backend curl localhost:3000/health
```

### Commandes de Debug

```bash
# État des conteneurs
docker compose ps

# Logs détaillés
docker compose logs --details

# Inspection conteneur
docker inspect portfolio-frontend

# Connexion dans le conteneur
docker exec -it portfolio-backend sh
```

## 🔄 Mises à Jour

### Mise à Jour Automatique

```bash
# Mise à jour complète
./manage.sh update
```

### Mise à Jour Manuelle

```bash
# 1. Arrêter les services
./manage.sh stop

# 2. Pull du code
git pull origin main

# 3. Rebuild et redémarrage
./deploy-advanced.sh production --no-cache
```

### Rollback

```bash
# Restaurer version précédente
./manage.sh restore ./backups/[timestamp]/

# Ou retour git + redéploiement
git reset --hard HEAD~1
./deploy-advanced.sh production
```

## 📞 Support

### Logs Système

Les logs sont disponibles dans :
- `./logs/` (si configuré)
- `docker-compose logs`
- Syslog système (`journalctl -u docker`)

### Vérifications de Santé

```bash
# Check complet
./manage.sh health

# Status rapide
./manage.sh status

# Monitoring continu
./manage.sh monitor
```

### Commandes Utiles

```bash
# Redémarrage propre
docker compose restart

# Nettoyage complet
./manage.sh clean

# Reconstruction complète
./deploy-advanced.sh production --no-cache

# Sauvegardes d'urgence
./manage.sh backup
```

---

## 📖 Exemples d'Utilisation

### Déploiement Initial
```bash
# 1. Configuration
cp config.env.example .env
nano .env

# 2. Permissions
chmod +x *.sh

# 3. Déploiement
./deploy-advanced.sh production --logs
```

### Maintenance Quotidienne
```bash
# Vérification santé
./manage.sh health

# Logs récents
./manage.sh logs -n 50

# Nettoyage hebdomadaire
./manage.sh clean
```

### Déploiement de Mise à Jour
```bash
# Sauvegarde préventive
./manage.sh backup

# Pull des changements
git pull

# Déploiement
./deploy-advanced.sh production
```

---

Pour plus d'informations, consultez les logs ou contactez l'équipe de développement. 