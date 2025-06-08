# Portfolio avec Assistant IA

Ce projet est un portfolio personnel avec un assistant IA intégré. Il est composé d'un frontend statique (HTML, CSS, JavaScript) et d'un backend Node.js pour gérer l'API du chatbot.

## Structure du Projet

```
ITSsghirPortfolio/
├── frontend/          # Site statique du portfolio
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── chat.css
│   ├── chat.js
│   └── assets/
├── backend/          # API du chatbot
│   ├── src/
│   │   ├── index.js
│   │   └── routes/
│   └── package.json
└── README.md
```

## Prérequis

- Node.js (v14 ou supérieur)
- Clé API OpenAI
- Navigateur web moderne

## Installation

1. **Backend (API du Chatbot)**

```bash
cd backend
npm install
```

Créez un fichier `.env` dans le dossier backend avec :
```
PORT=3000
OPENAI_API_KEY=votre_clé_api_openai
FRONTEND_URL=http://localhost:5173
```

2. **Frontend**
   - Aucune installation requise
   - Utilisez un serveur web statique de votre choix (Live Server, serve, etc.)

## Démarrage

1. **Démarrer le Backend**
```bash
cd backend
npm start
```

2. **Démarrer le Frontend**
   - Ouvrez le dossier frontend dans VS Code et utilisez Live Server
   - Ou utilisez la commande : `npx serve frontend`

Le site sera accessible à :
- Frontend : http://localhost:5173
- Backend API : http://localhost:3000

## Fonctionnalités

- Portfolio personnel interactif
- Assistant IA intégré via chatbot
- Interface responsive
- Animations modernes
- Section projets interactive
- CV téléchargeable

## Technologies Utilisées

- Frontend : HTML5, CSS3, JavaScript (Vanilla)
- Backend : Node.js, Express
- API : OpenAI GPT
- Autres : Font Awesome, Google Fonts

# Portfolio Interactif - Data Science & IA

Un portfolio moderne et interactif mettant en avant mes compétences en Data Science, Machine Learning et développement web, avec une base de données SQL interactive et des démonstrations d'algorithmes d'IA en temps réel.

## 📊 Architecture du Projet

### Structure des Dossiers
```
ITSsghirPortfolio/
├── frontend/                 # Interface utilisateur
│   ├── index.html           # Page principale
│   ├── style.css            # Styles globaux et animations
│   ├── script.js            # Logique principale et interactions
│   ├── chat.css            # Styles du chatbot
│   ├── chat.js             # Logique du chatbot
│   └── cv.txt              # Données du CV pour la base SQL
├── backend/                 # Serveur Node.js
│   ├── src/
│   │   ├── controllers/    # Contrôleurs des routes
│   │   │   ├── chatController.js
│   │   │   └── imageController.js
│   │   ├── routes/        # Définition des routes API
│   │   │   ├── chatRoutes.js
│   │   │   └── imageRoutes.js
│   │   ├── services/      # Services métier
│   │   │   ├── openaiService.js
│   │   │   └── databaseService.js
│   │   ├── config/       # Configuration
│   │   │   └── config.js
│   │   └── app.js        # Point d'entrée du serveur
│   ├── package.json
│   └── .env              # Variables d'environnement
└── README.md

```

## 🔄 Architecture et Communication

### Frontend (Client)

#### Composants Principaux
1. **Interface Utilisateur**
   - Design responsive avec CSS Grid et Flexbox
   - Animations fluides avec Web Animation API
   - Mode sombre/clair adaptatif
   - Particules et effets visuels

2. **Base de Données Client (SQL.js)**
   ```javascript
   // Initialisation de SQL.js
   const SQL = await initSqlJs({
     locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
   });
   window.db = new SQL.Database();
   ```

3. **Intégration GitHub**
   ```javascript
   // Récupération des repositories
   const response = await fetch(`https://api.github.com/users/${config.githubUsername}/repos`);
   const repos = await response.json();
   ```

4. **Démonstrations IA**
   - Q-Learning Visualizer avec Canvas API
   - Classification Iris avec données simulées
   - Génération d'images avec l'API DALL-E

### Backend (Serveur)

#### Services Principaux
1. **API Chat**
   ```javascript
   // Route de chat
   router.post('/chat', chatController.handleChatMessage);
   ```

2. **Génération d'Images**
   ```javascript
   // Route de génération d'images
   router.post('/generate-image', imageController.generateImage);
   ```

3. **Configuration OpenAI**
   ```javascript
   const configuration = new Configuration({
     apiKey: process.env.OPENAI_API_KEY
   });
   ```

#### Middleware et Sécurité
- CORS configuré pour le frontend
- Validation des requêtes
- Rate limiting
- Gestion des erreurs centralisée

### Communication Front-Back

#### Endpoints API
1. **Chat**
   ```javascript
   // Frontend
   async function sendChatMessage(message) {
     const response = await fetch('${config.apiBaseUrl}/api/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message })
     });
     return await response.json();
   }
   ```

2. **Génération d'Images**
   ```javascript
   // Frontend
   async function generateImage(prompt) {
     const response = await fetch('${config.apiBaseUrl}/api/generate-image', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ prompt })
     });
     return await response.json();
   }
   ```

## 💾 Base de Données

### Structure Complète
```sql
-- Table Utilisateur (profil principal)
CREATE TABLE Utilisateur (
    id INTEGER PRIMARY KEY,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT,
    linkedin TEXT,
    titre_poste TEXT,
    disponibilite TEXT,
    description TEXT
);

-- Table Formation
CREATE TABLE Formation (
    id INTEGER PRIMARY KEY,
    utilisateur_id INTEGER,
    diplome TEXT NOT NULL,
    etablissement TEXT NOT NULL,
    ville TEXT,
    periode TEXT,
    description TEXT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);

-- Table Compétences
CREATE TABLE Competences (
    id INTEGER PRIMARY KEY,
    utilisateur_id INTEGER,
    categorie TEXT NOT NULL,
    nom TEXT NOT NULL,
    niveau INTEGER CHECK (niveau BETWEEN 1 AND 5),
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);

-- Table Technologies
CREATE TABLE Technologies (
    id INTEGER PRIMARY KEY,
    utilisateur_id INTEGER,
    nom TEXT NOT NULL,
    categorie TEXT,
    niveau TEXT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);

-- Table Langues
CREATE TABLE Langues (
    id INTEGER PRIMARY KEY,
    utilisateur_id INTEGER,
    langue TEXT NOT NULL,
    niveau TEXT NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);

-- Table Expériences
CREATE TABLE Experiences (
    id INTEGER PRIMARY KEY,
    utilisateur_id INTEGER,
    poste TEXT NOT NULL,
    entreprise TEXT NOT NULL,
    lieu TEXT,
    periode TEXT,
    description TEXT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);

-- Table Certifications
CREATE TABLE Certifications (
    id INTEGER PRIMARY KEY,
    utilisateur_id INTEGER,
    nom TEXT NOT NULL,
    organisme TEXT,
    date_obtention TEXT,
    lien_verification TEXT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);
```

### Requêtes Principales
```sql
-- Récupérer toutes les compétences par catégorie
SELECT categorie, GROUP_CONCAT(nom) as competences
FROM Competences
GROUP BY categorie;

-- Obtenir l'expérience professionnelle triée par date
SELECT poste, entreprise, periode, description
FROM Experiences
ORDER BY periode DESC;

-- Récupérer le profil complet avec relations
SELECT u.*, 
       GROUP_CONCAT(DISTINCT f.diplome) as formations,
       GROUP_CONCAT(DISTINCT c.nom) as competences,
       GROUP_CONCAT(DISTINCT l.langue) as langues
FROM Utilisateur u
LEFT JOIN Formation f ON u.id = f.utilisateur_id
LEFT JOIN Competences c ON u.id = c.utilisateur_id
LEFT JOIN Langues l ON u.id = l.utilisateur_id
GROUP BY u.id;
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js (v14+)
- NPM ou Yarn
- Clé API OpenAI (pour les fonctionnalités IA)

### Installation du Backend
```bash
cd backend
npm install
cp .env.example .env  # Copier le fichier d'exemple
# Éditer .env avec vos clés API
npm run dev  # Démarrer en mode développement
```

### Configuration du Frontend
```bash
# Ouvrir config.js et ajuster les paramètres
const config = {
    apiBaseUrl: 'http://localhost:3000',
    githubUsername: 'ITSsghir',
    theme: 'dark'
};
```

### Variables d'Environnement (.env)
```env
PORT=3000
OPENAI_API_KEY=votre_clé_api
GITHUB_TOKEN=votre_token_github
CORS_ORIGIN=http://localhost:5173
```

## 🎨 Design

### Thème Principal
- Palette Néon/Cyberpunk
- Couleurs principales :
  - `#4b0082` (Indigo) - Fond principal
  - `#00ffcc` (Cyan néon) - Accents et surbrillances
  - `#9b59b6` (Violet) - Éléments secondaires
  - `#ffd700` (Or) - Points d'emphase

### Animations et Transitions
- Effets de particules sur les interactions
- Transitions fluides entre les sections
- Animations de compteur pour les statistiques
- Effets de survol sur les cartes de projets

## 🚀 Installation et Démarrage

1. Cloner le repository
```bash
git clone https://github.com/ITSsghir/ITSsghirPortfolio.git
cd ITSsghirPortfolio
```

2. Ouvrir le projet
- Utiliser un serveur web local (Live Server, http-server, etc.)
- Ou ouvrir directement index.html dans le navigateur

3. Configuration (optionnelle)
- Ajouter votre token GitHub dans config.githubToken
- Personnaliser les données du CV dans cv.txt

## 📱 Responsive Design
- Adaptation fluide sur tous les écrans
- Menu mobile optimisé
- Grilles adaptatives
- Images et médias responsifs

## 🔄 Mises à jour futures
- [ ] Intégration de nouveaux algorithmes IA
- [ ] Amélioration des visualisations de données
- [ ] Extension de la base de données
- [ ] Nouvelles fonctionnalités interactives

## 📫 Contact

- LinkedIn: [Anas Sghir](https://www.linkedin.com/in/anas-sghir/)
- Email: anas.sghir.2912@gmail.com
- GitHub: [@ITSsghir](https://github.com/ITSsghir)

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
