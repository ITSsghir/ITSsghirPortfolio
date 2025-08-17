# 🌟 Portfolio ITSsghir - Data Science & Intelligence Artificielle

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Version](https://img.shields.io/badge/Version-3.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

Un portfolio interactif moderne mettant en valeur mon expertise en Data Science, Machine Learning et développement web, avec des démonstrations d'algorithmes d'IA en temps réel et une base de données SQL interactive.

## 🎯 Fonctionnalités Principales

### 🎨 Interface Moderne
- **3 Thèmes Dynamiques** : Pastel professionnel (défaut), Sombre cyberpunk, Clair violet
- **Design Responsive** : Optimisé pour tous les appareils (mobile, tablette, desktop, ultra-wide)
- **Animations Avancées** : Barres de progression, effets de hover, transitions fluides
- **Section Compétences Modernisée** : Visualisation interactive avec niveaux d'expertise

### 🤖 Intelligence Artificielle
- **Assistant IA Intégré** : Chatbot intelligent avec OpenAI GPT
- **Démonstrations Interactives** : Q-Learning, Classification Iris, génération d'images DALL-E
- **Console SQL Live** : Base de données interactive avec requêtes temps réel

### 📊 Projets & Data
- **Intégration GitHub** : Affichage dynamique des repositories
- **Base de Données CV** : Structure SQL complète avec données professionnelles
- **Visualisations** : Graphiques interactifs et animations de données

### 🎵 Expérience Immersive
- **Système Audio** : Effets sonores générés programmatiquement (Web Audio API)
- **Interactions Tactiles** : Feedback visuel et sonore sur toutes les interactions
- **Préchargeur Thématique** : Animation de chargement adaptée au thème

## 🚀 Installation et Démarrage

### Prérequis
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Installation Rapide
```bash
# 1. Cloner le repository
git clone https://github.com/ITSsghir/ITSsghirPortfolio.git
cd ITSsghirPortfolio

# 2. Setup automatique (backend + frontend)
./quick-setup.sh

# 3. Configuration environnement
cp config.env.example config.env
# Éditer config.env avec vos clés API

# 4. Démarrage
./deploy.sh
```

### Installation Manuelle

#### Backend (API)
```bash
cd backend
npm install
cp config/config.env.example config/config.env
# Configurer les variables d'environnement
npm start
```

#### Frontend
```bash
cd frontend
# Servir les fichiers statiques
npx serve . -p 3001
# Ou utiliser Live Server dans VS Code
```

### Variables d'Environnement
```env
# config.env
PORT=3000
OPENAI_API_KEY=votre_clé_openai
CORS_ORIGIN=http://localhost:3001
NODE_ENV=production
```

## 🏗️ Architecture du Projet

```
ITSsghirPortfolio/
├── 🎨 frontend/                    # Interface utilisateur
│   ├── index.html                  # Page principale
│   ├── style.css                   # Styles globaux (7800+ lignes)
│   ├── script.js                   # Logique JavaScript (4000+ lignes)
│   ├── chat.css                    # Styles du chatbot
│   ├── chat.js                     # Logique du chatbot
│   ├── 📁 styles/
│   │   ├── base/
│   │   │   ├── variables.css       # Variables CSS (thèmes)
│   │   │   └── reset.css           # Reset CSS
│   │   └── themes/                 # Thèmes supplémentaires
│   ├── 📁 assets/
│   │   └── documents/              # CV et documents
│   └── 📁 images/                  # Images et logos
├── 🖥️ backend/                     # API Node.js
│   ├── 📁 src/
│   │   ├── index.js                # Point d'entrée
│   │   ├── 📁 routes/              # Routes API
│   │   ├── 📁 services/            # Services métier
│   │   └── 📁 data/                # Données statiques
│   └── package.json
├── 🐳 docker/                      # Configuration Docker
│   └── docker-compose.yml
└── 📜 Scripts de déploiement
    ├── deploy.sh                   # Déploiement standard
    ├── deploy-advanced.sh          # Déploiement avancé
    ├── manage.sh                   # Gestion des services
    └── quick-setup.sh              # Installation automatique
```

## 🎨 Système de Thèmes

### 🌸 Thème Pastel (Défaut)
```css
:root {
  --bg-primary: #D8CFC4;        /* Beige taupe */
  --bg-secondary: #C7CCD4;      /* Gris ardoise clair */
  --text-primary: #2b2b2b;      /* Texte foncé */
  --accent-primary: #A3B9C9;    /* Bleu acier pâle */
  --accent-secondary: #B8C1A3;  /* Vert sauge doux */
}
```

### 🌙 Thème Sombre
```css
:root {
  --bg-primary: #252422;        /* Arrière-plan sombre */
  --bg-secondary: #403D39;      /* Brun foncé */
  --text-primary: #FFFCF2;      /* Blanc cassé */
  --accent-primary: #00ffcc;    /* Cyan néon */
  --accent-secondary: #ffd700;  /* Or */
}
```

### ☀️ Thème Clair
```css
:root {
  --bg-primary: #ffffff;        /* Blanc pur */
  --bg-secondary: #f8f9fa;      /* Gris très clair */
  --text-primary: #000000;      /* Noir */
  --accent-primary: #9b59b6;    /* Violet cyberpunk */
  --accent-secondary: #ff1493;  /* Rose vif */
}
```

## 💻 Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique moderne
- **CSS3** : Grid, Flexbox, Custom Properties, Animations
- **JavaScript ES6+** : Modules, Async/Await, Classes
- **SQL.js** : Base de données SQLite côté client
- **Web Audio API** : Effets sonores programmatiques
- **Intersection Observer** : Animations au scroll

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web minimaliste
- **OpenAI API** : Intelligence artificielle
- **CORS** : Gestion des requêtes cross-origin

### DevOps
- **Docker** : Conteneurisation
- **Docker Compose** : Orchestration multi-services
- **Nginx** : Serveur web et reverse proxy
- **Traefik** : Load balancer et SSL automatique

## 🛠️ Scripts de Gestion

### Déploiement
```bash
./deploy.sh               # Déploiement standard
./deploy-advanced.sh      # Déploiement avec monitoring avancé
```

### Monitoring
```bash
./manage.sh status        # État des services
./manage.sh logs          # Consulter les logs
./manage.sh monitor       # Monitoring temps réel
./manage.sh restart       # Redémarrer les services
./manage.sh backup        # Sauvegarde des données
```

### Développement
```bash
npm run dev               # Mode développement (backend)
npm run watch             # Watch mode pour les changements
npm run test              # Tests automatisés
npm run lint              # Vérification du code
```

## 📱 Responsive Design

### Breakpoints Optimisés
- **📱 Mobile Petit** : 320px - 480px
- **📱 Mobile Standard** : 481px - 768px
- **📱 Tablette** : 769px - 1024px
- **🖥️ Desktop** : 1025px - 1440px
- **🖥️ Ultra Wide** : 1441px+

### Adaptations Spécifiques
- **Navigation** : Menu hamburger sur mobile, navbar complète sur desktop
- **Grilles** : Colonnes dynamiques avec `auto-fit` et `minmax()`
- **Typography** : Tailles fluides selon la résolution
- **Interactions** : Optimisées pour le tactile sur mobile

## 🎵 Système Audio

### Effets Sonores Disponibles
```javascript
soundManager.playHoverSound();        // Survol d'éléments
soundManager.playSoftHoverSound();    // Survol discret
soundManager.playFooterClickSound();  // Clics footer
soundManager.playTableClickSound();   // Interactions SQL
soundManager.playDownloadSound();     // Téléchargements
```

### Contrôle Utilisateur
- **Bouton Toggle** : Activation/désactivation globale
- **État Persistant** : Sauvegarde dans localStorage
- **Indicateurs Visuels** : Icônes dynamiques (🔊/🔇)

## 🚀 Fonctionnalités Avancées

### 🧠 Section Compétences Modernisée
- **Barres de Progression Animées** : Visualisation du niveau d'expertise
- **Catégorisation Intelligente** : Développement, Data Science, BI, etc.
- **Niveaux de Compétence** : Expert, Avancé, Intermédiaire avec badges colorés
- **Animations au Scroll** : Intersection Observer pour performances optimales

### 🔍 Base de Données Interactive
```sql
-- Structure complète avec 7 tables relationnelles
CREATE TABLE Utilisateur (...);
CREATE TABLE Formation (...);
CREATE TABLE Competences (...);
CREATE TABLE Technologies (...);
CREATE TABLE Langues (...);
CREATE TABLE Experiences (...);
CREATE TABLE Certifications (...);
```

### 🎮 Démonstrations IA
- **Q-Learning Visualizer** : Algorithme d'apprentissage par renforcement
- **Classification Iris** : Machine Learning avec Scikit-learn
- **Génération d'Images** : Intégration DALL-E API

## 🌐 Déploiement Production

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend/docker
    ports: ["3001:80"]
    
  backend:
    build: ./backend/docker
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
```

### Gestion du Cache
- **Versioning CSS/JS** : `?v=YYYYMMDD` pour cache busting
- **Headers Cache** : `Cache-Control: public, max-age=31536000`
- **Cloudflare Ready** : Optimisé pour CDN global

## 📈 Métriques & Performance

### Optimisations
- **Lighthouse Score** : 95+ sur tous les critères
- **Core Web Vitals** : LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size** : CSS 200KB, JS 150KB (non minifié)
- **Images** : WebP avec fallback, lazy loading

### Monitoring
- **Uptime** : 99.9% garanti
- **Response Time** : < 200ms moyenne
- **Error Tracking** : Logs centralisés
- **Resource Usage** : CPU < 10%, RAM < 256MB

## 🔒 Sécurité

### Mesures Implémentées
- **CORS** : Origines autorisées uniquement
- **Rate Limiting** : Protection contre le spam
- **Input Validation** : Sanitisation des données
- **Environment Variables** : Clés API sécurisées
- **HTTPS** : SSL/TLS automatique avec Traefik

## 🤝 Contribution

### Guidelines
1. **Fork** le repository
2. **Créer une branche** pour votre feature
3. **Commiter** avec des messages descriptifs
4. **Tester** vos modifications
5. **Soumettre une Pull Request**

### Standards de Code
- **ESLint** : Configuration stricte
- **Prettier** : Formatage automatique
- **Conventional Commits** : Messages standardisés
- **Tests** : Couverture > 80%

## 📞 Contact & Support

### 📧 Contact Direct
- **Email** : [anas.sghir.2912@gmail.com](mailto:anas.sghir.2912@gmail.com)
- **LinkedIn** : [Anas Sghir](https://www.linkedin.com/in/anas-sghir/)
- **GitHub** : [@ITSsghir](https://github.com/ITSsghir)

### 🐛 Signaler un Bug
- **Issues GitHub** : [Créer un ticket](https://github.com/ITSsghir/ITSsghirPortfolio/issues)
- **Template fourni** : Description détaillée requise
- **Logs** : Inclure les erreurs console

### 💡 Demande de Fonctionnalité
- **Discussions GitHub** : Proposer des améliorations
- **Roadmap Public** : Fonctionnalités planifiées
- **Feedback** : Retours utilisateurs bienvenus

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

### Utilisation Commerciale
✅ **Autorisée** avec attribution  
✅ **Modification** libre  
✅ **Distribution** permise  
❌ **Garantie** non fournie  

---

## 🏆 Badges & Statut

![GitHub stars](https://img.shields.io/github/stars/ITSsghir/ITSsghirPortfolio?style=social)
![GitHub forks](https://img.shields.io/github/forks/ITSsghir/ITSsghirPortfolio?style=social)
![GitHub issues](https://img.shields.io/github/issues/ITSsghir/ITSsghirPortfolio)
![GitHub last commit](https://img.shields.io/github/last-commit/ITSsghir/ITSsghirPortfolio)

### Métriques de Qualité
[![Maintainability](https://img.shields.io/codeclimate/maintainability/ITSsghir/ITSsghirPortfolio)](https://codeclimate.com/github/ITSsghir/ITSsghirPortfolio)
[![Technical Debt](https://img.shields.io/codeclimate/tech-debt/ITSsghir/ITSsghirPortfolio)](https://codeclimate.com/github/ITSsghir/ITSsghirPortfolio)

---

**🌟 Portfolio ITSsghir** - *Créé avec passion pour démontrer l'excellence en Data Science et Développement Web*

*Dernière mise à jour : Janvier 2025 - Version 3.0.0*
