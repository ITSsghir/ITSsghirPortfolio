// Configuration globale
const config = {
    githubUsername: 'ITSsghir',
    githubToken: '', // Laissez vide pour les repos publics
    apiBaseUrl: 'http://localhost:3000'
};

// Cache DOM pour les performances
const domCache = {
    githubRepos: document.getElementById('github-projects'),
    cvSections: document.querySelectorAll('.cv-section'),
    skillBars: document.querySelectorAll('.skill-bar'),
    experienceItems: document.querySelectorAll('.experience-item'),
    tableList: document.getElementById('table-list')
};

/* ======================
      PARTIE CLASSIFICATION
      ====================== */
   
   // Données Iris générées aléatoirement
   const irisData = {
     features: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
     targetNames: ['setosa', 'versicolor', 'virginica'],
     samples: Array.from({length: 30}, (_, i) => ({
       id: i+1,
       sepal_length: (4 + Math.random() * 3.5).toFixed(1),
       sepal_width: (2 + Math.random() * 1.5).toFixed(1),
       petal_length: (1 + Math.random() * 5).toFixed(1),
       petal_width: (0.1 + Math.random() * 2.5).toFixed(1),
       target: Math.floor(Math.random() * 3) // Valeur cible simulée
     }))
   };

   // Simulateur de modèle IA
   class IrisClassifier {
 constructor(data) {
   this.modelTrained = false;
   this.samples = data.samples; // Stocker les données simulées
   this.targetNames = data.targetNames;
   this.features = data.features;
 }

 trainMock() {
   return new Promise(resolve => {
     setTimeout(() => {
       this.modelTrained = true;
       resolve();
     }, 2000);
   });
 }

 predictMock() {
   return this.samples.map(sample => ({
     ...sample,
     prediction: sample.target // Simulation d'une prédiction parfaite
   }));
 }
}

// Crée le classifieur avec les données
let classifier = new IrisClassifier(irisData);

   function generateDataTable(data, withPrediction = false) {
     let html = `<table>
       <tr>
         ${data.features.map(f => `<th class="feature-column">${f}</th>`).join('')}
         ${withPrediction ? '<th class="prediction-column">Prédiction</th>' : ''}
       </tr>`;
     
     data.samples.forEach(sample => {
       html += `<tr>
         <td>${sample.sepal_length}</td>
         <td>${sample.sepal_width}</td>
         <td>${sample.petal_length}</td>
         <td>${sample.petal_width}</td>
         ${withPrediction ? 
           `<td class="prediction-column">${irisData.targetNames[sample.prediction]}</td>` : ''}
       </tr>`;
     });
     
     return html + '</table>';
   }
 
   async function startClassification() {
 const status = document.getElementById('classification-status');
 const btn = document.getElementById('classify-btn');
 const resetBtn = document.getElementById('reset-btn');

 btn.disabled = true;
 status.innerHTML = '<div class="loading-message">⚙️ Entraînement du modèle en cours...</div>';

 await classifier.trainMock();

 status.innerHTML = '<div class="loading-message">🔮 Prédiction des résultats...</div>';
 const results = classifier.predictMock();

 setTimeout(() => {
   document.getElementById('prediction-section').style.display = 'block';
   document.getElementById('prediction-results').innerHTML =
     generateDataTable({ features: irisData.features, samples: results }, true);

   status.innerHTML = '<div style="color:#00ffcc">✅ Prédictions terminées avec succès!</div>';
   btn.disabled = false;
   resetBtn.style.display = 'inline-block'; // 👈 Affiche le bouton reset
 }, 1500);
}
function resetClassification() {
 // Masquer les résultats
 document.getElementById('prediction-section').style.display = 'none';
 document.getElementById('prediction-results').innerHTML = '';
 document.getElementById('classification-status').innerHTML = '';
 document.getElementById('reset-btn').style.display = 'none';

 // Générer de nouvelles données
 irisData.samples = Array.from({length: 30}, (_, i) => ({
   id: i + 1,
   sepal_length: (4 + Math.random() * 3.5).toFixed(1),
   sepal_width: (2 + Math.random() * 1.5).toFixed(1),
   petal_length: (1 + Math.random() * 5).toFixed(1),
   petal_width: (0.1 + Math.random() * 2.5).toFixed(1),
   target: Math.floor(Math.random() * 3)
 }));

 // Réinitialiser le classifieur
 classifier = new IrisClassifier(irisData);

 // Réafficher les nouvelles données
 document.getElementById('test-data').innerHTML =
   generateDataTable({ features: irisData.features, samples: irisData.samples });
}



   function toggleClassification() {
 const classification = document.getElementById('classification-container');
 const qlearning = document.getElementById('qlearning-container');

 const isVisible = classification.style.display === 'block';

 // Masquer les deux
 classification.style.display = 'none';
 qlearning.style.display = 'none';

 // Afficher classification seulement si elle était cachée
 if (!isVisible) {
   classification.style.display = 'block';
   document.getElementById('test-data').innerHTML = 
     generateDataTable({ features: irisData.features, samples: irisData.samples });
 }
}



       // Initialisation de SQL.js de manière asynchrone
   async function initDatabase() {
       try {
           const SQL = await initSqlJs({
               locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
           });
           window.db = new SQL.Database();
       
       // Création et remplissage des tables
       db.run(`
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
                   icone TEXT,
                   categorie TEXT,
                   FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
               );

               -- Table Langues
               CREATE TABLE Langues (
                   id INTEGER PRIMARY KEY,
                   utilisateur_id INTEGER,
                   langue TEXT NOT NULL,
                   niveau TEXT NOT NULL,
                   certification TEXT,
                   FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
               );

               -- Table Expériences
               CREATE TABLE Experiences (
                   id INTEGER PRIMARY KEY,
                   utilisateur_id INTEGER,
                   titre TEXT NOT NULL,
                   entreprise TEXT NOT NULL,
                   lieu TEXT,
                   date_debut TEXT,
                   date_fin TEXT,
                   description TEXT,
                   type TEXT CHECK (type IN ('stage', 'emploi', 'projet', 'freelance')),
                   FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
               );

               -- Table Certifications
               CREATE TABLE Certifications (
                   id INTEGER PRIMARY KEY,
                   utilisateur_id INTEGER,
                   nom TEXT NOT NULL,
                   organisme TEXT,
                   date_obtention TEXT,
                   FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
               );

               -- Insertion des données de base
               INSERT INTO Utilisateur VALUES (
                   1, 
                   'Itssghir',
                   'anas.sghir.2912@gmail.com',
                   '+33758934175',
                   'https://www.linkedin.com/in/anas-sghir/',
                   'Data Scientist & ML Engineer',
                   'À partir de septembre 2025',
                   'Actuellement étudiant en Master 2 MIAGE, où j''ai acquis une solide expérience en informatique, en gestion et en organisation. Ma spécialisation en conception, développement et gestion de projets informatiques m''a permis de maîtriser plusieurs langages informatiques et de travailler efficacement sur différentes plateformes et logiciels. Mon intérêt pour les nouvelles technologies et les défis complexes m''a rendu curieux, créatif et passionné par la recherche de solutions innovantes.'
               );

               -- Formation
               INSERT INTO Formation VALUES
                   (1, 1, 'Master 2 MIAGE - IDP', 'Université Toulouse III - Paul Sabatier', 'Toulouse', '2023-2025', 'Ingénierie des Données et Protection'),
                   (2, 1, 'Licence Informatique - MIAGE', 'Université Aix-Marseille', 'Aix-en-Provence', '2021-2023', 'Parcours MIAGE');

               -- Compétences
               INSERT INTO Competences (utilisateur_id, categorie, nom, niveau) VALUES
                   -- Programmation
                   (1, 'Programmation', 'Python', 5),
                   (1, 'Programmation', 'Java', 4),
                   (1, 'Programmation', 'C', 4),
                   (1, 'Programmation', 'R', 4),
                   -- Web
                   (1, 'Web', 'HTML', 4),
                   (1, 'Web', 'CSS', 4),
                   (1, 'Web', 'JavaScript', 4),
                   (1, 'Web', 'Django', 4),
                   -- Data Science
                   (1, 'Data Science', 'SQL', 5),
                   (1, 'Data Science', 'Python', 5),
                   (1, 'Data Science', 'NoSQL', 4),
                   -- Data Analysis
                   (1, 'Data Analysis', 'Tableau', 4),
                   (1, 'Data Analysis', 'Power BI', 4),
                   -- Gestion de Projet
                   (1, 'Gestion de Projet', 'SCRUM', 4),
                   (1, 'Gestion de Projet', 'GANTT', 4),
                   (1, 'Gestion de Projet', 'TOGAF', 3),
                   (1, 'Gestion de Projet', 'ARCHIMATE', 3),
                   -- Conception
                   (1, 'Conception', 'MERISE', 4),
                   (1, 'Conception', 'UML', 4),
                   (1, 'Conception', 'SysML', 4),
                   -- Bases de Données
                   (1, 'Bases de Données', 'MySQL', 5),
                   (1, 'Bases de Données', 'Dataiku', 4),
                   (1, 'Bases de Données', 'PostgreSQL', 4),
                   -- Cloud
                   (1, 'Cloud', 'IBM', 3),
                   (1, 'Cloud', 'AWS', 3),
                   -- Cybersécurité
                   (1, 'Cybersécurité', 'OpenSSL', 4),
                   (1, 'Cybersécurité', 'RSA', 4),
                   (1, 'Cybersécurité', 'AES', 4);

               -- Technologies
               INSERT INTO Technologies (utilisateur_id, nom, icone, categorie) VALUES
                   (1, 'IntelliJ IDEA', 'fab fa-java', 'IDE'),
                   (1, 'Visual Studio', 'fas fa-code', 'IDE'),
                   (1, 'Docker', 'fab fa-docker', 'DevOps'),
                   (1, 'MongoDB', 'fas fa-database', 'Database'),
                   (1, 'R Studio', 'fab fa-r-project', 'Data Science'),
                   (1, 'DataGrip', 'fas fa-database', 'Database'),
                   (1, 'VirtualBox', 'fas fa-box', 'Virtualisation'),
                   (1, 'PostMan', 'fas fa-paper-plane', 'API Testing');

               -- Langues
               INSERT INTO Langues (utilisateur_id, langue, niveau, certification) VALUES
                   (1, 'Français', 'Natif', NULL),
                   (1, 'Anglais', 'B2', 'TOEIC'),
                   (1, 'Arabe', 'Natif', NULL);

               -- Expériences
               INSERT INTO Experiences (utilisateur_id, titre, entreprise, lieu, date_debut, date_fin, description, type) VALUES
                   (1, 'Product Owner / Data Engineer', 'La Banque Postale', 'Toulouse', '2025', 'En cours', 
                   'Documentation technique et métier des données\nModélisation logique des données et lineage complet\nTableaux de bord avec Tableau & Power BI\nRecettes SQL et Python sur Dataiku\nOptimisation des requêtes sur gros volumes\nTransformation des besoins métiers en dashboards pertinents', 'stage'),
                   
                   (1, 'Développeur Application Empreinte Carbone', 'Université Toulouse III', 'Toulouse', '2023', '2024',
                   'Développement d''une application de calcul d''empreinte carbone (Python, React Native)\nReconnaissance caméra et vocale (APIs Google)\nGestion complète du projet (coordination, planification, supervision)', 'projet'),
                   
                   (1, 'Chef de Projet IT', 'SHL', 'Marseille', '2022', '2023',
                   'Développement full-stack d''une interface d''administration\nLeadership dans la finalisation du site\nGestion d''équipe multidisciplinaire et alignement stratégique', 'emploi'),
                   
                   (1, 'Développeur Web Freelance', 'Indépendant', 'Aix-en-Provence', '2021', '2022',
                   'Conception et développement de sites web multisecteurs\nTravail en équipe interdisciplinaire\nCompétences en gestion, communication, autonomie', 'freelance');

               -- Certifications
               INSERT INTO Certifications (utilisateur_id, nom, organisme, date_obtention) VALUES
                   (1, 'Core Designer', 'Dataiku', '2024');
           `);

           updateTableList();
           console.log('Base de données initialisée avec succès');
       } catch (err) {
           console.error('Erreur lors de l\'initialisation de la base de données:', err);
       }
   }

   function updateTableList() {
       if (!domCache.tableList) return;

       try {
       const res = db.exec(`
               SELECT name, 
                   (SELECT COUNT(*) FROM pragma_table_info(name)) as columns,
           CASE name
             WHEN 'Utilisateur' THEN (SELECT COUNT(*) FROM Utilisateur)
             WHEN 'Formation' THEN (SELECT COUNT(*) FROM Formation)
             WHEN 'Competences' THEN (SELECT COUNT(*) FROM Competences)
             WHEN 'Technologies' THEN (SELECT COUNT(*) FROM Technologies)
             WHEN 'Langues' THEN (SELECT COUNT(*) FROM Langues)
             WHEN 'Experiences' THEN (SELECT COUNT(*) FROM Experiences)
             WHEN 'Certifications' THEN (SELECT COUNT(*) FROM Certifications)
                   END as rows
         FROM sqlite_master 
         WHERE type='table'
         ORDER BY name;
       `);

       if (res[0]) {
               const tables = res[0].values.map(([name, cols, rows]) => `
                   <li class="table-item">
             <div class="table-name">${name}</div>
             <div class="table-stats">
               <span class="table-cols">${cols} colonnes</span>
               <span class="table-rows">${rows} enregistrements</span>
             </div>
                   </li>
               `).join('');
         
               domCache.tableList.innerHTML = `
           <div class="table-header">📊 Base de données du CV</div>
           <div class="table-description">
             Explorez les différentes tables de mon CV interactif avec des requêtes SQL
           </div>
           <ul class="table-list">
                       ${tables}
           </ul>
         `;
       }
       } catch (error) {
           console.error('Erreur lors de la mise à jour de la liste des tables:', error);
       }
   }

   // SQL History Management
   const sqlHistory = {
       queries: [],
       currentIndex: -1,
       maxSize: 50
   };

   // Gestionnaire d'événements pour les touches de l'historique SQL
   document.addEventListener('DOMContentLoaded', function() {
       const sqlInput = document.getElementById('sql-input');
       sqlInput.addEventListener('keydown', handleSqlInputKeydown);
   });

   function handleSqlInputKeydown(event) {
       if (event.key === 'ArrowUp') {
           event.preventDefault();
           if (sqlHistory.currentIndex > 0) {
               sqlHistory.currentIndex--;
               updateSqlInput(sqlHistory.queries[sqlHistory.currentIndex]);
           }
       } else if (event.key === 'ArrowDown') {
           event.preventDefault();
           if (sqlHistory.currentIndex < sqlHistory.queries.length - 1) {
               sqlHistory.currentIndex++;
               updateSqlInput(sqlHistory.queries[sqlHistory.currentIndex]);
           } else {
               sqlHistory.currentIndex = sqlHistory.queries.length;
               updateSqlInput('');
           }
       } else if (event.key === 'Enter' && event.ctrlKey) {
           event.preventDefault();
           runSQL();
       }
   }

   function updateSqlInput(query) {
       const sqlInput = document.getElementById('sql-input');
       if (sqlInput) sqlInput.value = query;
   }

   function addToHistory(query) {
       if (query.trim() === '') return;
       
       if (sqlHistory.queries[sqlHistory.queries.length - 1] !== query) {
           sqlHistory.queries.push(query);
           if (sqlHistory.queries.length > sqlHistory.maxSize) {
               sqlHistory.queries.shift();
           }
       }
       sqlHistory.currentIndex = sqlHistory.queries.length;
   }

   // Enhanced SQL execution
   function runSQL() {
       const input = document.getElementById('sql-input').value;
       const output = document.getElementById('sql-output');
       
       if (!input.trim()) {
           output.innerHTML = '<div class="error-message">❌ Veuillez entrer une requête SQL</div>';
           return;
       }
       
       try {
           addToHistory(input);
       const results = db.exec(input);
           
           if (results.length > 0) {
               let html = '<div class="sql-results">';
               results.forEach(result => {
                   html += '<table class="sql-table">';
                   html += '<tr>' + result.columns.map(col => 
                       `<th>${col}</th>`).join('') + '</tr>';
                   result.values.forEach(row => {
                       html += '<tr>' + row.map(cell => 
                           `<td>${cell}</td>`).join('') + '</tr>';
                   });
                   html += '</table>';
               });
               html += '</div>';
               output.innerHTML = html;
           } else {
               output.innerHTML = '<div class="success-message">✔️ Requête exécutée avec succès.</div>';
           }
     } catch (e) {
           output.innerHTML = `<div class="error-message">❌ Erreur: ${e.message}</div>`;
       }
   }

   // SQL Export functionality
   function exportSqlResults(format = 'csv') {
       const output = document.getElementById('sql-output');
       const tables = output.querySelectorAll('.sql-table');
       
       if (tables.length === 0) {
           alert('Aucun résultat à exporter');
           return;
       }
       
       let exportContent = '';
       
       if (format === 'csv') {
           tables.forEach(table => {
               const rows = Array.from(table.querySelectorAll('tr'));
               rows.forEach(row => {
                   const cells = Array.from(row.querySelectorAll('th, td'));
                   exportContent += cells.map(cell => 
                       `"${cell.textContent.replace(/"/g, '""')}"`
                   ).join(',') + '\n';
               });
               exportContent += '\n';
           });
       } else if (format === 'json') {
           const data = Array.from(tables).map(table => {
               const rows = Array.from(table.querySelectorAll('tr'));
               const headers = Array.from(rows[0].querySelectorAll('th')).map(th => th.textContent);
               const dataRows = rows.slice(1);
               
               return dataRows.map(row => {
                   const cells = Array.from(row.querySelectorAll('td'));
                   return Object.fromEntries(
                       headers.map((header, i) => [header, cells[i].textContent])
                   );
               });
           });
           exportContent = JSON.stringify(data, null, 2);
       }
       
       const blob = new Blob([exportContent], { 
           type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json' 
       });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `sql_results.${format}`;
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
   }

   // Chatbot Implementation
   const chatbot = {
       messages: [],
       systemPrompt: `Tu es un assistant virtuel pour le portfolio d'Anas Sghir. 
       Tu as accès à toutes les informations sur son profil, ses compétences et son expérience.
       Réponds de manière professionnelle et concise aux questions sur son parcours.
       Informations principales:
       - Data Scientist & ML Engineer
       - Expert en Python, TensorFlow, PyTorch
       - Certifié Dataiku Core Designer
       - Formation: Master MIAGE
       - Expérience en IA et automatisation`
   };

   async function sendMessage() {
       const input = document.getElementById('chat-input');
       const message = input.value.trim();
       
       if (!message) return;
       
       input.value = '';
       appendMessage('user', message);
       
       try {
           const response = await fetch(`${config.apiBaseUrl}/api/chat/message`, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                   message: message
               })
           });

           const data = await response.json();
           if (data.error) {
               throw new Error(data.error.message);
           }
           
           const botResponse = data.message;
           appendMessage('bot', botResponse);
           
           chatbot.messages.push(
               { role: 'user', content: message },
               { role: 'assistant', content: botResponse }
           );
           
       } catch (error) {
           appendMessage('error', 'Désolé, une erreur est survenue. Veuillez réessayer.');
           console.error('Chatbot error:', error);
       }
   }

   function appendMessage(type, content) {
       const messages = document.getElementById('chat-messages');
       if (!messages) return;
       
       const messageDiv = document.createElement('div');
       messageDiv.className = `chat-message ${type}-message`;
       
       messageDiv.innerHTML = `
           <div class="message-content">
               ${type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>'}
               <p>${content}</p>
           </div>
       `;
       
       messages.appendChild(messageDiv);
       messages.scrollTop = messages.scrollHeight;
   }

   // Theme Manager
   const themeManager = {
       isDark: true,
       
       lightTheme: {
           '--bg-primary': '#ffffff',
           '--bg-secondary': '#f0f0f0',
           '--text-primary': '#333333',
           '--text-secondary': '#666666',
           '--accent-primary': '#9b59b6',
           '--accent-secondary': '#8e44ad',
           '--neon-glow': 'rgba(155, 89, 182, 0.5)'
       },
       
       darkTheme: {
           '--bg-primary': '#4b0082',
           '--bg-secondary': '#2c003e',
           '--text-primary': '#ffffff',
           '--text-secondary': '#cccccc',
           '--accent-primary': '#00ffcc',
           '--accent-secondary': '#00ccaa',
           '--neon-glow': 'rgba(0, 255, 204, 0.5)'
       },
       
       toggle() {
           this.isDark = !this.isDark;
           this.applyTheme();
       },
       
       applyTheme() {
           const theme = this.isDark ? this.darkTheme : this.lightTheme;
           document.documentElement.style.transition = 'all 0.5s ease';
           
           Object.entries(theme).forEach(([property, value]) => {
               document.documentElement.style.setProperty(property, value);
           });
           
           localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
           
           const themeIcon = document.getElementById('theme-toggle-icon');
           if (themeIcon) {
               themeIcon.className = this.isDark ? 'fas fa-sun' : 'fas fa-moon';
           }
       },
       
       init() {
           const savedTheme = localStorage.getItem('theme');
           if (savedTheme) {
               this.isDark = savedTheme === 'dark';
           } else {
               this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
           }
           this.applyTheme();
       }
   };

   // Initialize everything when DOM is loaded
   document.addEventListener('DOMContentLoaded', function() {
       // Initialize SQL input handling
       const sqlInput = document.getElementById('sql-input');
       if (sqlInput) {
           sqlInput.addEventListener('keydown', handleSqlInputKeydown);
       }
       
       // Initialize chat input handling
       const chatInput = document.getElementById('chat-input');
       if (chatInput) {
           chatInput.addEventListener('keypress', function(e) {
               if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   sendMessage();
               }
           });
       }
       
       // Initialize theme
       themeManager.init();
       const themeToggle = document.getElementById('theme-toggle');
       if (themeToggle) {
           themeToggle.addEventListener('click', () => themeManager.toggle());
       }
   });

   // SYSTÈME Q-LEARNING COMPLET
   const gridElement = document.getElementById("grid");
   let agentPos = 0;
   const goalPos = 24;
   let training = false;
   let episodes = 0;
   let steps = 0;
   let trainingInterval;
   let optimalPath = [];
   const qTable = Array.from({ length: 25 }, () => new Array(4).fill(0));
   const alpha = 0.3;
   const gamma = 0.9;
   let epsilon = 0.8;
   const epsilonDecay = 0.98;

   function drawGrid() {
     gridElement.innerHTML = "";
     for (let i = 0; i < 25; i++) {
       const cell = document.createElement("div");
       cell.className = "cell" + (optimalPath.includes(i) ? " optimal-path" : "");
       const maxQ = Math.max(...qTable[i]) || 0;
       cell.style.background = `linear-gradient(to top, 
         rgba(106,13,173,1) ${100 - maxQ * 2}%, 
         rgba(0,255,204,1) ${maxQ * 2}%)`;
       
       if (i === agentPos) cell.innerHTML = '<div class="agent"></div>';
       if (i === goalPos) cell.innerHTML = '<div class="goal"></div>';
       gridElement.appendChild(cell);
     }
   }

   function getValidActions(pos) {
     const actions = [];
     if (pos >= 5) actions.push(0); // Haut
     if (pos < 20) actions.push(1); // Bas
     if (pos % 5 !== 0) actions.push(2); // Gauche
     if (pos % 5 !== 4) actions.push(3); // Droite
     return actions;
   }

   function takeAction(pos, action) {
     const newPos = [
       pos - 5, // Haut
       pos + 5, // Bas
       pos - 1, // Gauche
       pos + 1  // Droite
     ][action];
     return (newPos >= 0 && newPos < 25) ? newPos : pos;
   }

   function calculateOptimalPath() {
     optimalPath = [];
     let currentPos = 0;
     const visited = new Set();
     
     while (currentPos !== goalPos && !visited.has(currentPos)) {
       optimalPath.push(currentPos);
       visited.add(currentPos);
       const actions = getValidActions(currentPos);
       if (actions.length === 0) break;
       const bestAction = actions.reduce((a, b) => 
         qTable[currentPos][a] > qTable[currentPos][b] ? a : b);
       currentPos = takeAction(currentPos, bestAction);
     }
     if (currentPos === goalPos) optimalPath.push(goalPos);
   }

   function startQLearning() {
     const status = document.getElementById("status");
     const startBtn = document.getElementById("start-btn");

     if (!training) {
       // Réinitialisation complète
       optimalPath = [];
       qTable.forEach((_, i) => qTable[i].fill(0));
       episodes = 0;
       steps = 0;
       agentPos = 0;
       epsilon = 0.8;
       training = true;
       startBtn.textContent = "Arrêter l'apprentissage";
       status.innerHTML = "";

       trainingInterval = setInterval(() => {
         let currentPos = agentPos;
         let episodeSteps = 0;
         let reachedGoal = false;
         
         while (episodeSteps < 20 && !reachedGoal) {
           const actions = getValidActions(currentPos);
           const action = Math.random() < epsilon 
             ? actions[Math.floor(Math.random() * actions.length)]
             : actions.reduce((a, b) => qTable[currentPos][a] > qTable[currentPos][b] ? a : b);
           
           const newPos = takeAction(currentPos, action);
           const reward = newPos === goalPos ? 100 : -0.1;
           const maxFutureQ = newPos === goalPos ? 0 : Math.max(...qTable[newPos]);
           
           qTable[currentPos][action] += alpha * (reward + gamma * maxFutureQ - qTable[currentPos][action]);
           
           currentPos = newPos;
           steps++;
           episodeSteps++;
           
           if (currentPos === goalPos) {
             episodes++;
             reachedGoal = true;
             epsilon *= epsilonDecay;
             currentPos = 0;
           }
         }

         agentPos = currentPos;
         drawGrid();
         
         status.innerHTML = `
           🏆 Épisodes réussis: <span style="color: #00ffcc">${episodes}</span><br>
           🚶 Pas total: <span style="color: #ffd700">${steps}</span><br>
           🔍 Exploration: <span style="color: #9b59b6">${(epsilon * 100).toFixed(1)}%</span>
         `;

         if (episodes >= 20) {
           clearInterval(trainingInterval);
           training = false;
           calculateOptimalPath();
           drawGrid();
           
           const pathDisplay = document.createElement("div");
           pathDisplay.id = "path-display";
           const pathSteps = optimalPath.map(pos => {
             const x = (pos % 5) + 1;
             const y = Math.floor(pos / 5) + 1;
             return `(${x},${y})`;
           }).join(" → ");
           
           pathDisplay.innerHTML = `
             <strong>🌟 Chemin Optimal 🌟</strong><br>
             ${pathSteps}<br>
             Longueur: ${optimalPath.length - 1} pas
           `;
           
           status.appendChild(pathDisplay);
           startBtn.textContent = "Recommencer";
         }
       }, 300);
     } else {
       clearInterval(trainingInterval);
       training = false;
       startBtn.textContent = "Démarrer l'apprentissage";
       status.textContent = "🛑 Apprentissage arrêté";
     }
   }

   drawGrid();

   // TEXTE ROTATIF
   const phrases = [
     "Data Science & Machine Learning",
     "Python | TensorFlow | PyTorch",
     "Apprentissage Automate Innovant",
     "Solutions IA sur Mesure"
   ];
   let index = 0;
   const rotatingText = document.getElementById("rotating-text");
   setInterval(() => {
     rotatingText.style.opacity = 0;
     setTimeout(() => {
       rotatingText.textContent = phrases[index];
       rotatingText.style.opacity = 1;
       index = (index + 1) % phrases.length;
     }, 500);
   }, 4000);

   function toggleQlearning() {
 const qlearning = document.getElementById("qlearning-container");
 const classification = document.getElementById("classification-container");

 const isVisible = qlearning.style.display === 'block';

 // Masquer les deux
 qlearning.style.display = 'none';
 classification.style.display = 'none';

 // Afficher q-learning seulement si il était caché
 if (!isVisible) {
   qlearning.style.display = 'block';
   drawGrid();
 }
}

// Ajouter l'animation de "pulse" lors de la frappe dans la zone de texte
document.addEventListener('DOMContentLoaded', function() {
   const textarea = document.querySelector('textarea');
   
   textarea.addEventListener('keydown', function() {
     // Supprimer la classe pour réinitialiser l'animation
     this.classList.remove('text-pulse');
     
     // Force un reflow pour que l'animation puisse se déclencher à nouveau
     void this.offsetWidth;
     
     // Ajouter la classe pour déclencher l'animation
     this.classList.add('text-pulse');
   });
 });




 function toggleGBT() {
 const gbt = document.getElementById('gbt-container');
 const classification = document.getElementById('classification-container');
 const qlearning = document.getElementById('qlearning-container');

 // Masquer les autres
 classification.style.display = 'none';
 qlearning.style.display = 'none';
 gbt.style.display = gbt.style.display === 'block' ? 'none' : 'block';
}

// Fonction pour toggle les sections CV
function toggleCvSection(header) {
    const section = header.parentElement;
    const content = section.querySelector('.cv-section-content');
    const isActive = section.classList.contains('active');
    
    // Si la section est active, on la désactive
    if (isActive) {
        section.classList.remove('active');
        content.style.maxHeight = '0px';
    } else {
        // Si la section est inactive, on l'active
        section.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
    }
}

// Animation d'entrée pour les sections CV au scroll
function animateCvOnScroll() {
    const cvSections = document.querySelectorAll('.cv-section');
    cvSections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionVisible = 150;
        
        if (sectionTop < window.innerHeight - sectionVisible) {
            section.style.animation = 'slideInUp 0.6s ease forwards';
        }
    });
}

// Ajouter l'event listener pour le scroll (uniquement si pas déjà présent)
if (!window.cvScrollListenerAdded) {
    window.addEventListener('scroll', animateCvOnScroll);
    window.cvScrollListenerAdded = true;
    animateCvOnScroll(); // Animation initiale
}

// Fonction pour animer les skill tags au hover (optionnel)
document.addEventListener('DOMContentLoaded', function() {
    const skillTags = document.querySelectorAll('.cv-skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            });
    });
});

// Fonction pour créer un effet de particules sur les icônes
function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #00ffcc;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 6px #00ffcc;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
        `;
        
        document.body.appendChild(particle);
        
        // Animation des particules
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 50 + Math.random() * 50;
        const life = 1000 + Math.random() * 500;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: life,
            easing: 'cubic-bezier(0, 0, 0.2, 1)'
        }).addEventListener('finish', () => {
            document.body.removeChild(particle);
        });
    }
}

// Ajouter des effets de particules aux icônes importantes
document.addEventListener('DOMContentLoaded', function() {
    const importantIcons = document.querySelectorAll('.cv-section-icon, .cv-experience-icon');
    importantIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            createParticleEffect(this);
        });
    });
});

// Fonction pour créer un compteur animé pour les compétences
function animateSkillCounters() {
    const skillCategories = document.querySelectorAll('.cv-skill-category');
    skillCategories.forEach((category, index) => {
        const tags = category.querySelectorAll('.cv-skill-tag');
        const counter = document.createElement('div');
        counter.className = 'skill-counter';
        counter.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            background: linear-gradient(135deg, #ff6b35, #ffd700);
            color: #000;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(255, 107, 53, 0.4);
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
        `;
        
        category.style.position = 'relative';
        counter.textContent = tags.length;
        category.appendChild(counter);
        
        // Animer l'apparition du compteur
        setTimeout(() => {
            counter.style.opacity = '1';
            counter.style.transform = 'scale(1)';
        }, index * 200);
    });
}

// Fonction pour créer un système de progression pour l'expérience
function createExperienceTimeline() {
    const experienceSection = document.querySelector('.cv-section:has(.cv-experience-item)');
    if (!experienceSection) return;
    
    const timeline = document.createElement('div');
    timeline.className = 'cv-timeline';
    timeline.style.cssText = `
        position: absolute;
        left: 20px;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(to bottom, #00ffcc, #ffd700, #ff6b35);
        border-radius: 2px;
        box-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
    `;
    
    const experienceContent = experienceSection.querySelector('.cv-section-content');
    experienceContent.style.position = 'relative';
    experienceContent.appendChild(timeline);
    
    // Ajouter des points sur la timeline
    const experienceItems = experienceSection.querySelectorAll('.cv-experience-item');
    experienceItems.forEach((item, index) => {
        const timelinePoint = document.createElement('div');
        timelinePoint.className = 'timeline-point';
        timelinePoint.style.cssText = `
            position: absolute;
            left: 18px;
            top: ${(index + 1) * 120}px;
            width: 12px;
            height: 12px;
            background: #00ffcc;
            border-radius: 50%;
            border: 3px solid rgba(0, 255, 204, 0.3);
            box-shadow: 0 0 15px #00ffcc;
            animation: pulse 2s infinite;
            z-index: 1;
        `;
        
        experienceContent.appendChild(timelinePoint);
        
        // Ajouter une ligne de connexion
        const connectionLine = document.createElement('div');
        connectionLine.style.cssText = `
            position: absolute;
            left: 24px;
            top: ${(index + 1) * 120 + 6}px;
            width: 50px;
            height: 2px;
            background: linear-gradient(to right, #00ffcc, transparent);
            box-shadow: 0 0 5px rgba(0, 255, 204, 0.5);
        `;
        
        experienceContent.appendChild(connectionLine);
    });
}

// Fonction pour ajouter des tooltips informatifs
function addTooltips() {
    const skillTags = document.querySelectorAll('.cv-skill-tag');
    
    // Données des tooltips pour chaque compétence
    const tooltipData = {
        'Java': 'Programmation orientée objet, Spring Framework',
        'Python': 'Data Science, Django, Automatisation',
        'JavaScript': 'Développement frontend et backend moderne',
        'SQL': 'Gestion de bases de données relationnelles',
        'Docker': 'Conteneurisation et déploiement d\'applications',
        'SCRUM': 'Méthodologie agile de gestion de projet',
        'MongoDB': 'Base de données NoSQL orientée documents',
        'R': 'Analyse statistique et data science'
    };
    
    skillTags.forEach(tag => {
        const skillName = tag.textContent.trim();
        if (tooltipData[skillName]) {
            tag.title = tooltipData[skillName];
            tag.style.cursor = 'help';
        }
    });
}

// Fonction pour créer un mode sombre/clair
function createThemeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    toggleButton.className = 'theme-toggle';
    toggleButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #9b59b6, #be75e6);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(155, 89, 182, 0.4);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toggleButton);
    
    let isDarkMode = true;
    
    toggleButton.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.body.style.filter = 'none';
            this.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.style.filter = 'invert(1) hue-rotate(180deg)';
            this.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Animation du bouton
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

// Fonction pour créer un effet de typing sur le texte de profil
function createTypingEffect() {
    const profileText = document.querySelector('.cv-profile-text');
    if (!profileText) return;
    
    const originalText = profileText.textContent;
    profileText.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            profileText.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Observer pour déclencher l'animation quand la section est visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target === profileText.parentElement) {
                typeWriter();
                observer.disconnect();
            }
        });
    });
    
    observer.observe(profileText.parentElement);
}

// Fonction pour ajouter des sons aux interactions (optionnel)
function addSoundEffects() {
    // Créer des sons avec l'API Web Audio (plus moderne que des fichiers audio)
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
    
    // Ajouter des sons aux interactions
    document.querySelectorAll('.cv-section-header').forEach(header => {
        header.addEventListener('click', () => playTone(800, 0.1));
    });
    
    document.querySelectorAll('.cv-skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => playTone(1000, 0.05));
    });
}

// Optimisation des performances
const ANIMATION_FRAME = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { setTimeout(callback, 1000 / 60); };

// Fonction d'initialisation optimisée
function initCvInteractions() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCvInteractions);
        return;
    }
    
    // Initialisation du cache DOM
    domCache.cvSections = document.querySelectorAll('.cv-section');
    domCache.githubRepos = document.getElementById('github-repos');
    domCache.profileText = document.querySelector('.cv-profile-text');

    // Initialisation des fonctionnalités avec délai optimisé
    const initSequence = [
        { fn: initExperienceAnimations, delay: 0 },
        { fn: loadGitHubRepos, delay: 100 },
        { fn: initScrollAnimations, delay: 300 }
    ];

    initSequence.forEach(({ fn, delay }) => {
        setTimeout(() => requestAnimationFrame(fn), delay);
    });

    // Appel unique à createAnimatedStats
    setTimeout(() => {
        const existingStats = document.querySelector('.cv-stats');
        if (!existingStats) {
            createAnimatedStats();
        }
    }, 200);
}

// Optimisation des animations d'expérience
function initExperienceAnimations() {
    const experienceItems = document.querySelectorAll('.cv-experience-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    experienceItems.forEach(item => observer.observe(item));
}

// Optimisation du toggle des sections
function toggleCvSection(header) {
    const section = header.parentElement;
    const content = section.querySelector('.cv-section-content');
    const isActive = section.classList.contains('active');

    requestAnimationFrame(() => {
        if (isActive) {
            section.classList.remove('active');
            content.style.maxHeight = '0px';
        } else {
            section.classList.add('active');
            content.style.maxHeight = `${content.scrollHeight}px`;
        }
    });
}

// Optimisation du chargement GitHub
async function loadGitHubRepos() {
    const projectsContainer = document.getElementById('github-projects');
    if (!projectsContainer) return;

    try {
        projectsContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-code-branch fa-spin"></i>
                Chargement des projets...
            </div>`;
        
        const response = await fetch(`https://api.github.com/users/itssghir/repos?sort=updated&per_page=100`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();

        if (repos.length === 0) {
            projectsContainer.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-folder-open"></i>
                    Aucun projet public disponible
                </div>`;
            return;
        }

        const filteredRepos = repos
            .filter(repo => !repo.fork && !repo.archived)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        const projectsHTML = filteredRepos
            .map(repo => createRepoCard(repo))
            .join('');

        projectsContainer.innerHTML = `
            <div class="repos-grid">
                ${projectsHTML}
            </div>`;

        // Add hover effects after rendering
        document.querySelectorAll('.repo-card').forEach(card => {
            card.addEventListener('mouseenter', () => createParticleEffect(card));
        });

    } catch (error) {
        console.error('Erreur GitHub:', error);
        projectsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                Impossible de charger les projets GitHub. 
                <a href="https://github.com/itssghir" target="_blank" rel="noopener">
                    Voir mon profil GitHub <i class="fas fa-external-link-alt"></i>
                </a>
            </div>`;
    }
}

function createRepoCard(repo) {
    const topics = repo.topics && repo.topics.length > 0 
        ? `<div class="repo-topics">${repo.topics.map(topic => `<span class="topic">${topic}</span>`).join('')}</div>`
        : '';
    
    const homepage = repo.homepage 
        ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="repo-link homepage-link">
            <i class="fas fa-globe"></i> Demo
           </a>`
        : '';

    return `
        <div class="repo-card" data-repo-id="${repo.id}">
            <div class="repo-header">
                <h3 class="repo-title">
                    <a href="${repo.html_url}" target="_blank" rel="noopener">
                        <i class="fab fa-github"></i> ${repo.name}
                    </a>
                </h3>
                <div class="repo-links">
                    ${homepage}
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-link">
                        <i class="fas fa-code"></i> Code
                    </a>
            </div>
            </div>
            
            <p class="repo-description">${repo.description || 'Aucune description disponible'}</p>
            
            ${topics}
            
            <div class="repo-stats">
                <span class="repo-stat">
                    <i class="fas fa-star"></i> ${repo.stargazers_count}
                </span>
                <span class="repo-stat">
                    <i class="fas fa-code-branch"></i> ${repo.forks_count}
                </span>
                <span class="repo-stat ${repo.language ? 'with-language' : ''}">
                    <i class="fas fa-circle" style="color: ${getLanguageColor(repo.language)}"></i>
                    ${repo.language || 'N/A'}
                </span>
                <span class="repo-stat">
                    <i class="fas fa-clock"></i>
                    ${formatDate(repo.updated_at)}
                </span>
        </div>
        </div>
    `;
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'TypeScript': '#2b7489',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Swift': '#ffac45',
        'Go': '#00ADD8',
        'Rust': '#dea584'
    };
    return colors[language] || '#8e8e8e';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays/7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays/30)} mois`;
    return `Il y a ${Math.floor(diffDays/365)} ans`;
}

// Optimisation des animations au scroll
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.cv-section').forEach(section => {
        observer.observe(section);
    });
}

// Démarrage optimisé
document.addEventListener('DOMContentLoaded', () => {
    initCvInteractions();
    loadGitHubRepos(); // Charger les projets GitHub
    initScrollAnimations();
    createExperienceTimeline();
    addTooltips();
    createThemeToggle();
    createTypingEffect();
    addSoundEffects();
});

// Désactivation des animations si la préférence de réduction de mouvement est activée
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
}

// Fonction pour créer des statistiques animées
function createAnimatedStats() {
    // Vérifier si les stats existent déjà
    if (document.querySelector('.cv-stats')) {
        return; // Ne pas créer de nouvelles stats si elles existent déjà
    }
    
    const statsContainer = document.createElement('div');
    statsContainer.className = 'cv-stats';
    statsContainer.style.cssText = `
        background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(255, 20, 147, 0.2));
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
    `;
    
    const stats = [
        { label: 'Années d\'expérience', value: 3, suffix: '+' },
        { label: 'Projets réalisés', value: 15, suffix: '+' },
        { label: 'Technologies maîtrisées', value: 12, suffix: '' },
        { label: 'Certifications', value: 1, suffix: '' }
    ];
    
    stats.forEach((stat, index) => {
        const statItem = document.createElement('div');
        statItem.style.cssText = `
            text-align: center;
            color: white;
        `;
        
        statItem.innerHTML = `
            <div style="font-size: 2rem; font-weight: bold; color: #00ffcc; text-shadow: 0 0 10px #00ffcc;" class="stat-number">0</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">${stat.label}</div>
        `;
        
        statsContainer.appendChild(statItem);
        
        // Animer le compteur
        const numberElement = statItem.querySelector('.stat-number');
        let current = 0;
        const increment = stat.value / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
            }
            numberElement.textContent = Math.floor(current) + stat.suffix;
        }, 50);
    });
    
    // Insérer les stats après la section profil
    const profileSection = document.querySelector('.cv-section.active');
    if (profileSection) {
        profileSection.insertAdjacentElement('afterend', statsContainer);
    }
}

// Navbar Interaction
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarItems = document.querySelectorAll('.navbar-item');

    // Gestion du menu mobile
    navbarToggle?.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarMenu?.classList.toggle('active');
    });

    // Fonction pour ouvrir une section CV
    function openCvSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const cvSection = section.closest('.cv-section');
            if (cvSection) {
                // Fermer toutes les sections d'abord
                document.querySelectorAll('.cv-section').forEach(s => {
                    s.classList.remove('active');
                    const content = s.querySelector('.cv-section-content');
                    if (content) content.style.maxHeight = '0px';
                });
                
                // Ouvrir la section ciblée
                cvSection.classList.add('active');
                const content = cvSection.querySelector('.cv-section-content');
                if (content) content.style.maxHeight = content.scrollHeight + 'px';
            }
        }
    }

    // Smooth scroll amélioré pour les liens de navigation
    navbarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // Enlève le # du début
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Fermer le menu mobile si ouvert
                navbarToggle?.classList.remove('active');
                navbarMenu?.classList.remove('active');

                // Ouvrir la section CV correspondante
                openCvSection(targetId);

                // Calculer la position avec offset pour la navbar fixe
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                // Smooth scroll vers la section
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Effet de transparence au scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.background = 'rgba(75, 0, 130, 0.1)';
        } else if (currentScroll > lastScroll) {
            navbar.style.background = 'rgba(75, 0, 130, 0.95)';
        }
        
        lastScroll = currentScroll;
    });

    // Effet de surlignage de la section active amélioré
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navbarItems.forEach(item => {
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                        item.style.textShadow = '0 0 10px #00ffcc';
                        // Ouvrir automatiquement la section correspondante
                        openCvSection(id);
                    } else {
                        item.classList.remove('active');
                        item.style.textShadow = 'none';
                    }
                });
            }
        });
    }, observerOptions);

    // Observer chaque section
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });
});

// Initialisation du chat
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', function() {
            const chatContainer = document.querySelector('.chat-container');
            const toggleText = this.querySelector('span');
            const chatMessages = document.getElementById('chat-messages');
            
            if (!chatContainer || !toggleText || !chatMessages) {
                console.error('Un ou plusieurs éléments du chat sont manquants');
                return;
            }
            
            chatContainer.classList.toggle('active');
            this.classList.toggle('active');
            
            if (chatContainer.classList.contains('active')) {
                toggleText.textContent = 'Fermer l\'assistant';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(() => {
                    const chatInput = document.getElementById('chat-input');
                    if (chatInput) {
                        chatInput.focus();
                    }
                }, 300);
            } else {
                toggleText.textContent = 'Ouvrir l\'assistant';
            }
        });
    } else {
        console.error('L\'élément chat-toggle n\'a pas été trouvé');
    }
});

// Gestionnaire d'événements pour la touche Entrée dans le chat
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});