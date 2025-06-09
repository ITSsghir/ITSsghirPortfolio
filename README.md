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

## Effets Sonores

Le portfolio utilise l'API Web Audio pour créer des effets sonores interactifs. Ces sons sont générés de manière programmatique, sans nécessiter de fichiers audio externes.

### Implémentation des Sons

Les sons sont créés en utilisant l'API Web Audio, qui génère des oscillations sonores en temps réel :

```javascript
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}
```

### Interactions Sonores

- **Sections CV** : Un son de fréquence 800Hz est joué lors du clic sur les en-têtes de section (durée : 0.1s)
- **Tags de Compétences** : Un son aigu de 1000Hz est joué au survol des tags (durée : 0.05s)

Ces sons sont délibérément subtils et non-intrusifs, ajoutant une dimension interactive au portfolio sans perturber l'expérience utilisateur.

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

## Documentation des Sons

### Système de Gestion du Son

Le portfolio intègre un système de sons interactifs sophistiqué pour améliorer l'expérience utilisateur. Tous les sons sont gérés par le `soundManager`, un gestionnaire centralisé qui contrôle la création, la lecture et le volume des effets sonores.

#### Contrôle Global du Son
- Un bouton de contrôle du son est disponible dans la barre de navigation
- État du son persistant grâce au localStorage
- Icônes dynamiques : 
  - 🔊 Son activé : `fa-volume-up`
  - 🔇 Son désactivé : `fa-volume-mute`

### Guide d'Utilisation des Sons

#### 1. Initialisation du Système
```javascript
// Dans votre fichier principal (ex: script.js)
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le gestionnaire de son
    soundManager.initialize();
    
    // Configurer le bouton de contrôle du son
    const soundToggle = document.querySelector('.sound-toggle');
    soundToggle.addEventListener('click', () => soundManager.toggleMute());
});
```

#### 2. Ajout des Sons aux Éléments

##### Sons de Survol
```javascript
// Pour les cartes GitHub
const githubCards = document.querySelectorAll('.repo-card');
githubCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        soundManager.playHoverSound();
    });
});

// Pour les boutons de contact
const contactButtons = document.querySelectorAll('footer a[href*="mailto"], footer a[href*="tel"], footer a[href*="linkedin"]');
contactButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        soundManager.playSoftHoverSound();
    });
});

// Pour les tables de la base de données
const dbTables = document.querySelectorAll('.table-item');
dbTables.forEach(table => {
    table.addEventListener('mouseenter', () => {
        soundManager.playHoverSound();
    });
});
```

##### Sons de Clic
```javascript
// Pour les boutons du footer
const footerButtons = document.querySelectorAll('footer a');
footerButtons.forEach(button => {
    button.addEventListener('click', () => {
        soundManager.playFooterClickSound();
    });
});

// Pour les tables de la base de données
dbTables.forEach(table => {
    table.addEventListener('click', () => {
        soundManager.playTableClickSound();
    });
});
```

##### Son de Téléchargement
```javascript
// Pour le bouton de téléchargement du CV
const cvButton = document.querySelector('.cv-download-btn');
cvButton.addEventListener('click', () => {
    soundManager.playDownloadSound();
});
```

### Détails des Sons et Cas d'Utilisation

#### 1. Sons de Survol (Hover)

##### Cartes GitHub (`playHoverSound`)
- **Quand l'utiliser** : Sur les éléments interactifs principaux
- **Cas d'usage** : 
  ```javascript
  element.addEventListener('mouseenter', () => soundManager.playHoverSound());
  ```
- **Caractéristiques** :
  - Son doux et professionnel
  - Durée courte (0.3s)
  - Idéal pour les éléments fréquemment survolés

##### Boutons de Contact (`playSoftHoverSound`)
- **Quand l'utiliser** : Sur les éléments de navigation secondaires
- **Cas d'usage** :
  ```javascript
  element.addEventListener('mouseenter', () => soundManager.playSoftHoverSound());
  ```
- **Caractéristiques** :
  - Son très léger
  - Durée très courte (0.15s)
  - Parfait pour les menus et liens

#### 2. Sons de Clic

##### Footer Buttons (`playFooterClickSound`)
- **Quand l'utiliser** : Pour les actions de contact/réseaux sociaux
- **Cas d'usage** :
  ```javascript
  element.addEventListener('click', () => soundManager.playFooterClickSound());
  ```
- **Caractéristiques** :
  - Son court et satisfaisant
  - Feedback immédiat
  - Volume modéré

##### Tables de Base de Données (`playTableClickSound`)
- **Quand l'utiliser** : Pour les interactions avec les données
- **Cas d'usage** :
  ```javascript
  element.addEventListener('click', () => soundManager.playTableClickSound());
  ```
- **Caractéristiques** :
  - Son riche et informatif
  - Accord harmonieux
  - Durée moyenne (0.4s)

#### 3. Son de Téléchargement (`playDownloadSound`)
- **Quand l'utiliser** : Pour les actions de téléchargement/succès
- **Cas d'usage** :
  ```javascript
  element.addEventListener('click', () => soundManager.playDownloadSound());
  ```
- **Caractéristiques** :
  - Mélodie ascendante joyeuse
  - Durée satisfaisante (0.5s)
  - Volume équilibré

### Personnalisation des Sons

#### Modification des Paramètres
```javascript
// Exemple de personnalisation d'un son
playCustomSound() {
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Connecter les nœuds
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Personnaliser les paramètres
    osc.type = 'sine';                // Type d'onde : 'sine', 'triangle', 'square', 'sawtooth'
    osc.frequency.value = 440;        // Fréquence en Hz
    gain.gain.value = 0.05;           // Volume (0-1)

    // Durée et timing
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);  // Durée en secondes
}
```

### Bonnes Pratiques d'Implémentation

1. **Vérification de l'État**
```javascript
if (soundManager.canPlaySound()) {
    soundManager.playHoverSound();
}
```

2. **Gestion des Erreurs**
```javascript
try {
    soundManager.playDownloadSound();
} catch (error) {
    console.warn('Erreur de lecture du son:', error);
}
```

3. **Performance**
```javascript
// Mauvaise pratique : Créer un nouveau contexte à chaque fois
const context = new AudioContext(); // ❌

// Bonne pratique : Réutiliser le contexte existant
if (!this.audioContext) {
    this.audioContext = new AudioContext(); // ✅
}
```

4. **Nettoyage des Ressources**
```javascript
// Arrêter proprement les oscillateurs
osc.stop(ctx.currentTime + duration);
setTimeout(() => {
    osc.disconnect();
    gain.disconnect();
}, duration * 1000);
```

### Dépannage Courant

1. **Son Non Fonctionnel**
   - Vérifier que le son n'est pas en sourdine (`soundManager.isMuted`)
   - Confirmer que l'AudioContext est initialisé
   - Vérifier les permissions du navigateur

2. **Sons Trop Forts/Faibles**
   - Ajuster les valeurs de gain (entre 0 et 1)
   - Utiliser des rampes de gain pour des transitions douces

3. **Latence**
   - Minimiser la durée des sons
   - Précharger l'AudioContext au chargement de la page
   - Éviter les opérations lourdes pendant la lecture

### Compatibilité

- Chrome/Edge : Totalement supporté
- Firefox : Totalement supporté
- Safari : Nécessite le préfixe webkit
- IE : Non supporté

```javascript
// Gestion de la compatibilité
const AudioContext = window.AudioContext || window.webkitAudioContext;
```
