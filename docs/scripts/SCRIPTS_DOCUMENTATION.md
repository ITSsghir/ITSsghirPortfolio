# 🛠️ Documentation des Scripts de Gestion

## 📋 Vue d'ensemble

Ce portfolio dispose de **4 scripts principaux** pour faciliter la gestion, le déploiement et la maintenance :

| Script | Rôle | Complexité | Usage |
|--------|------|------------|-------|
| `quick-setup.sh` | Installation initiale | ⭐ Simple | Première installation |
| `deploy.sh` | Déploiement simple | ⭐⭐ Facile | Déploiement rapide |
| `deploy-advanced.sh` | Déploiement avancé | ⭐⭐⭐ Avancé | Production complète |
| `manage.sh` | Gestion quotidienne | ⭐⭐ Modéré | Maintenance courante |

---

## 🚀 quick-setup.sh - Installation Rapide

### 📝 **À quoi ça sert**
Script d'installation **one-click** pour configurer le portfolio depuis zéro.

### 🎯 **Fonctionnalités**
- ✅ **Installation automatique de Docker** (si absent)
- ✅ **Configuration interactive** (domaine, clé OpenAI, environnement)
- ✅ **Création du fichier .env** depuis l'exemple
- ✅ **Vérification des dépendances** système
- ✅ **Permissions des scripts** automatiques

### 🔧 **Utilisation**
```bash
# Installation complète interactive
./quick-setup.sh

# Le script vous demande :
# - Domaine du site (default: anas.itssghir.com)
# - Clé API OpenAI 
# - Type d'environnement (production/staging/dev)
```

### 📊 **Ce qui se passe**
1. Vérification du système (Linux, dépendances)
2. Installation de Docker si nécessaire
3. Configuration interactive du projet
4. Création des fichiers et dossiers nécessaires
5. Attribution des permissions

### 🎯 **Quand l'utiliser**
- ✅ **Première installation** sur un nouveau serveur
- ✅ **Configuration initiale** d'un environnement
- ✅ **Réinstallation complète** après problème

---

## 🚢 deploy.sh - Déploiement Simple

### 📝 **À quoi ça sert**
Script de déploiement **basique et rapide** pour lancer le portfolio.

### 🎯 **Fonctionnalités**
- ✅ **Vérification du réseau proxy** Traefik
- ✅ **Construction des images** Docker
- ✅ **Démarrage des services** (frontend + backend)
- ✅ **Affichage du statut** final

### 🔧 **Utilisation**
```bash
# Déploiement simple
./deploy.sh

# Résultat :
# - Services construits et démarrés
# - Affichage des URLs d'accès
# - Commandes pour voir les logs
```

### 📊 **Ce qui se passe**
1. Vérification que Traefik fonctionne
2. Création du réseau proxy si nécessaire
3. Arrêt des anciens conteneurs
4. Construction et démarrage des nouveaux
5. Affichage du statut et des URLs

### 🎯 **Quand l'utiliser**
- ✅ **Déploiement rapide** après modifications
- ✅ **Tests locaux** simples
- ✅ **Redémarrage** après maintenance

---

## 🚀 deploy-advanced.sh - Déploiement Avancé

### 📝 **À quoi ça sert**
Script de déploiement **professionnel** avec options avancées et sécurité.

### 🎯 **Fonctionnalités**
- ✅ **Multi-environnements** (production/staging/dev)
- ✅ **Sauvegarde automatique** avant déploiement
- ✅ **Health checks** avec timeout configurable
- ✅ **Vérifications complètes** (Docker, réseau, Traefik)
- ✅ **Gestion d'erreurs** avancée
- ✅ **Logs colorés** et détaillés
- ✅ **Options configurables** via variables

### 🔧 **Utilisation**
```bash
# Déploiement production (default)
./deploy-advanced.sh

# Déploiement staging
./deploy-advanced.sh staging

# Options avancées
./deploy-advanced.sh production --no-cache --logs
./deploy-advanced.sh staging --domain test.itssghir.com

# Variables d'environnement
DOMAIN=custom.com ./deploy-advanced.sh production
BUILD_CACHE=false ./deploy-advanced.sh production --no-backup
```

### 📊 **Options disponibles**
| Option | Description | Exemple |
|--------|-------------|---------|
| `--no-cache` | Désactive le cache Docker | Plus lent mais plus sûr |
| `--no-backup` | Skip la sauvegarde | Pour tests rapides |
| `--domain` | Domaine personnalisé | `--domain test.com` |
| `--logs` | Affiche les logs après | Pour debugging |

### 🔧 **Variables d'environnement**
```bash
DOMAIN=anas.itssghir.com          # Domaine du site
BUILD_CACHE=true                   # Cache Docker
BACKUP_ENABLED=true                # Sauvegarde auto
HEALTH_CHECK_TIMEOUT=60            # Timeout health check
LOG_LEVEL=info                     # Niveau de log (info/debug)
```

### 🎯 **Quand l'utiliser**
- ✅ **Déploiement production** critique
- ✅ **Environnements multiples** (staging/prod)
- ✅ **Sauvegardes importantes** nécessaires
- ✅ **Debugging** avec logs détaillés

---

## 🛠️ manage.sh - Gestion Quotidienne

### 📝 **À quoi ça sert**
Script de **gestion et maintenance** pour les opérations courantes.

### 🎯 **Fonctionnalités**
- ✅ **Monitoring** en temps réel
- ✅ **Gestion des logs** (affichage, suivi)
- ✅ **Contrôle des services** (start/stop/restart)
- ✅ **Sauvegardes** manuelles
- ✅ **Nettoyage Docker** automatique
- ✅ **Health checks** détaillés
- ✅ **Statistiques** d'utilisation

### 🔧 **Utilisation**

#### **Commandes principales**
```bash
# Statut des services
./manage.sh status

# Logs en temps réel
./manage.sh logs --follow

# Redémarrage
./manage.sh restart

# Arrêt/Démarrage
./manage.sh stop
./manage.sh start
```

#### **Gestion des logs**
```bash
# Logs du backend seulement
./manage.sh logs --backend

# Logs du frontend seulement  
./manage.sh logs --frontend

# Dernières 50 lignes
./manage.sh logs -n 50

# Suivi en temps réel du backend
./manage.sh logs --backend --follow
```

#### **Maintenance**
```bash
# Sauvegarde manuelle
./manage.sh backup

# Nettoyage Docker
./manage.sh clean

# Monitoring temps réel
./manage.sh monitor

# Vérification de santé
./manage.sh health
```

### 📊 **Commandes détaillées**
| Commande | Description | Options |
|----------|-------------|---------|
| `status` | Statut + ressources | - |
| `logs` | Affichage des logs | `-f`, `-n`, `--backend`, `--frontend` |
| `restart` | Redémarrage | `[service]` optionnel |
| `stop` | Arrêt des services | - |
| `start` | Démarrage des services | - |
| `update` | Mise à jour complète | - |
| `backup` | Sauvegarde manuelle | - |
| `restore` | Restauration | `[backup_path]` |
| `clean` | Nettoyage Docker | - |
| `monitor` | Monitoring temps réel | - |
| `health` | Health check complet | - |

### 🎯 **Quand l'utiliser**
- ✅ **Maintenance quotidienne** du portfolio
- ✅ **Debugging** et analyse des logs
- ✅ **Monitoring** des performances
- ✅ **Sauvegardes** régulières
- ✅ **Nettoyage** de l'espace disque

---

## 🔄 Workflow de Déploiement Recommandé

### 🆕 **Première Installation**
```bash
1. ./quick-setup.sh              # Configuration initiale
2. ./deploy-advanced.sh          # Premier déploiement
3. ./manage.sh status            # Vérification
```

### 🔄 **Déploiement Régulier**
```bash
1. ./deploy.sh                   # Déploiement rapide
   OU
   ./deploy-advanced.sh          # Déploiement sécurisé
2. ./manage.sh logs --follow     # Vérification des logs
```

### 🛠️ **Maintenance Quotidienne**
```bash
1. ./manage.sh status            # Vérifier l'état
2. ./manage.sh logs -n 100       # Consulter les logs
3. ./manage.sh backup            # Sauvegarde si nécessaire
4. ./manage.sh clean             # Nettoyage périodique
```

---

## 🚨 Dépannage Courant

### ❌ **Problème : Docker non démarré**
```bash
# Solution
sudo systemctl start docker
./manage.sh status
```

### ❌ **Problème : Réseau proxy manquant**
```bash
# Solution automatique dans deploy.sh
docker network create proxy
```

### ❌ **Problème : Services ne démarrent pas**
```bash
# Diagnostic
./manage.sh logs --follow
./manage.sh health

# Solution
./manage.sh restart
```

### ❌ **Problème : Espace disque plein**
```bash
# Nettoyage
./manage.sh clean
docker system prune -a
```

---

## 📁 Structure des Fichiers

```
itssghirportfolio/
├── quick-setup.sh          # 🚀 Installation initiale
├── deploy.sh               # 🚢 Déploiement simple  
├── deploy-advanced.sh      # 🚀 Déploiement avancé
├── manage.sh               # 🛠️ Gestion quotidienne
├── docker-compose.yml      # 🐳 Configuration Docker
├── config.env.example      # ⚙️ Exemple de configuration
├── .env                    # 🔐 Configuration locale (créé par quick-setup)
└── backups/                # 💾 Sauvegardes automatiques
```

---

*Cette documentation vous permet de maîtriser tous les aspects de la gestion de votre portfolio ITSsghir.* 