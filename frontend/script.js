// Configuration globale
const config = {

    githubToken: '', // Laissez vide pour les repos publics
    apiBaseUrl: 'http://localhost:3000'
};

// ===== GESTIONNAIRE DE PRELOADER MINIMALISTE ===== //
class PreloaderManager {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingText = document.querySelector('.loading-text');
        
        this.totalResources = 0;
        this.loadedResources = 0;
        this.startTime = Date.now();
        
        this.resourceTypes = [
            { selector: 'link[rel="stylesheet"]', type: 'CSS' },
            { selector: 'script[src]', type: 'JS' },
            { selector: 'img', type: 'Images' },
            { selector: 'link[href*="fonts"]', type: 'Fonts' }
        ];
    }

    init() {
        this.detectAndApplyTheme();
        this.trackResourceLoading();
        this.setupLoadListeners();
    }

    detectAndApplyTheme() {
        const savedTheme = localStorage.getItem('theme');
        // Valeurs possibles désormais: 'pastel' (défaut), 'light', 'dark'
        const themeKey = savedTheme || 'pastel';
        const themeClass = themeKey === 'dark' ? 'dark-theme' : themeKey === 'light' ? 'light-theme' : 'pastel-theme';
        document.body.className = themeClass;
    }

    trackResourceLoading() {
        const allResources = [];

        // Collecter toutes les ressources
        this.resourceTypes.forEach(({ selector, type }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.href || element.src) {
                    allResources.push({ element, type });
                }
            });
        });

        // Ajouter les Google Fonts spécifiquement
        const googleFontsLink = document.querySelector('link[href*="fonts.googleapis.com"]');
        if (googleFontsLink) {
            allResources.push({ element: googleFontsLink, type: 'Google Fonts' });
        }

        this.totalResources = allResources.length;
        this.updateProgress();

        // Surveiller le chargement de chaque ressource
        allResources.forEach(({ element, type }) => {
            this.monitorResource(element, type);
        });

        // Timeout de sécurité
        setTimeout(() => {
            if (!this.isComplete()) {
                this.completeLoading();
            }
        }, 8000);
    }

    monitorResource(element, type) {
        const onLoad = () => {
            this.loadedResources++;
            this.updateLoadingText(type);
            this.updateProgress();
            
            if (this.isComplete()) {
                setTimeout(() => this.completeLoading(), 300);
            }
        };

        const onError = () => {
            this.loadedResources++;
            this.updateProgress();
            
            if (this.isComplete()) {
                setTimeout(() => this.completeLoading(), 300);
            }
        };

        if (element.tagName === 'IMG') {
            if (element.complete) {
                onLoad();
            } else {
                element.addEventListener('load', onLoad);
                element.addEventListener('error', onError);
            }
        } else if (element.tagName === 'LINK' || element.tagName === 'SCRIPT') {
            element.addEventListener('load', onLoad);
            element.addEventListener('error', onError);
            
            // Pour les CSS, vérifier si déjà chargé
            if (element.tagName === 'LINK' && element.sheet) {
                try {
                    if (element.sheet.cssRules) {
                        onLoad();
                    }
                } catch (e) {
                    // Probablement encore en cours de chargement
                }
            }
        }
    }

    setupLoadListeners() {
        // DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadedResources++;
                this.updateLoadingText('DOM');
                this.updateProgress();
            });
        } else {
            this.loadedResources++;
            this.totalResources++;
        }

        // Window load complet
        window.addEventListener('load', () => {
            // S'assurer que tout est chargé après un petit délai
            setTimeout(() => {
                if (!this.isComplete()) {
                    this.loadedResources = this.totalResources;
                    this.updateProgress();
                    this.completeLoading();
                }
            }, 100);
        });
    }

    updateLoadingText(resourceType) {
        if (resourceType && this.loadingText) {
            const messages = {
                'CSS': 'Styles chargés...',
                'JS': 'Scripts chargés...',
                'Images': 'Images chargées...',
                'Fonts': 'Polices chargées...',
                'Google Fonts': 'Google Fonts chargées...',
                'DOM': 'Structure prête...'
            };
            
            this.loadingText.textContent = messages[resourceType] || 'Chargement...';
        }
    }

    updateProgress() {
        if (this.progressFill && this.totalResources > 0) {
            const percentage = Math.min((this.loadedResources / this.totalResources) * 100, 100);
            this.progressFill.style.width = percentage + '%';
        }
    }

    isComplete() {
        return this.loadedResources >= this.totalResources && document.readyState === 'complete';
    }

    completeLoading() {
        if (this.loadingText) {
            this.loadingText.textContent = 'Prêt !';
        }
        
        if (this.progressFill) {
            this.progressFill.style.width = '100%';
        }

        // Calculer le temps de chargement
        const loadTime = Date.now() - this.startTime;
        
        setTimeout(() => {
            this.hidePreloader();
        }, Math.max(500, Math.min(loadTime * 0.1, 1000)));
    }

    hidePreloader() {
        if (this.preloader) {
            this.preloader.classList.add('fade-out');
            
            setTimeout(() => {
                if (this.preloader && this.preloader.parentNode) {
                    this.preloader.remove();
                }
                
                // Déclencher les animations du contenu
                document.body.classList.add('loaded');
                window.dispatchEvent(new CustomEvent('preloaderComplete'));
                
                // Affichage progressif du contenu
                const hero = document.querySelector('#hero');
                if (hero) {
                    hero.style.opacity = '0';
                    hero.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        hero.style.transition = 'all 0.6s ease';
                        hero.style.opacity = '1';
                        hero.style.transform = 'translateY(0)';
                    });
                }
            }, 600);
        }
    }
}

// Initialisation immédiate du preloader
if (document.getElementById('preloader')) {
    const preloaderManager = new PreloaderManager();
    preloaderManager.init();
}

// Fonction pour retourner en haut de la page (logo cliquable)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

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
     if (!data.samples || data.samples.length === 0) {
       return `<div class="empty-table-message">Aucune donnée d'entraînement disponible</div>`;
     }
     let html = `<table><tr>`;
     html += data.features.map(f => `<th class="feature-column">${f}</th>`).join('');
     if (withPrediction) html += '<th class="prediction-column">Prédiction</th>';
     html += '</tr>';
     data.samples.forEach(sample => {
       html += `<tr>`;
       html += `<td class="feature-column">${sample.sepal_length}</td>`;
       html += `<td class="feature-column">${sample.sepal_width}</td>`;
       html += `<td class="feature-column">${sample.petal_length}</td>`;
       html += `<td class="feature-column">${sample.petal_width}</td>`;
       if (withPrediction) {
         html += `<td class="prediction-column">${irisData.targetNames[sample.prediction]}</td>`;
       }
       html += `</tr>`;
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
 const dataAnalytics = document.getElementById('data-analytics-container');

 const isVisible = classification.style.display === 'block';

 // Masquer tous
 classification.style.display = 'none';
 qlearning.style.display = 'none';
 dataAnalytics.style.display = 'none';

 // Afficher classification seulement si elle était cachée
 if (!isVisible) {
   classification.style.display = 'block';
   drawGrid();
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
                       <li class="table-item" data-table-name="${name}">
             <div class="table-name">${name}</div>
             <div class="table-stats">
               <span class="table-cols">${cols} colonnes</span>
               <span class="table-rows">${rows} enregistrements</span>
             </div>
                   </li>
               `).join('');
         
               domCache.tableList.innerHTML = `
           <div class="table-header">Base de données du CV</div>
           <div class="table-description">
             Explorez les différentes tables de mon CV interactif avec des requêtes SQL
           </div>
           <ul class="table-list">
                       ${tables}
           </ul>
         `;

               // Ajouter les événements aux nouvelles tables
               document.querySelectorAll('.table-item').forEach(table => {
                   if (!table.dataset.soundInitialized) {
                       soundManager.addTableEvents(table);
                   }
               });
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

   // Gestionnaire de thème multi-thèmes
   const themeManager = {
       themes: ['pastel', 'light', 'dark'],
       current: 'pastel',

       // Variables CSS optionnelles par thème (complémentaires aux classes CSS)
       themeVars: {
           pastel: {
               '--neon-glow': 'rgba(166, 177, 225, 0.35)'
           },
           light: {
               '--neon-glow': 'rgba(0, 255, 204, 0.5)'
           },
           dark: {
               '--neon-glow': 'rgba(204, 197, 185, 0.3)'
           }
       },

       toggle() {
           const idx = this.themes.indexOf(this.current);
           const next = (idx + 1) % this.themes.length;
           this.current = this.themes[next];
           this.applyTheme();
           this.updateToggleIcon();
           localStorage.setItem('theme', this.current);
       },

       applyTheme() {
           // Appliquer classes de thème
           document.body.classList.remove('light-theme', 'dark-theme', 'pastel-theme');
           const cls = this.current === 'dark' ? 'dark-theme' : this.current === 'light' ? 'light-theme' : 'pastel-theme';
           document.body.classList.add(cls);

           // Appliquer variables CSS complémentaires
           const vars = this.themeVars[this.current] || {};
           Object.entries(vars).forEach(([property, value]) => {
               document.documentElement.style.setProperty(property, value);
           });

           // Ajustements spécifiques précédemment forcés en dark
           if (this.current === 'dark') {
               this.eliminatePurpleElements();
           } else if (this.current === 'light') {
               this.restorePurpleElements();
           } else {
               // Pastel: neutraliser les forces précédentes
               this.restorePurpleElements();
           }
       },
       
               eliminatePurpleElements() {
            // UNIQUEMENT EN DARK MODE - Forcer le background du body
            if (this.isDark) {
                document.body.style.background = '#252422';
                document.body.style.backgroundColor = '#252422';
                document.body.style.backgroundImage = 'none';
            }
           
           // Identifier et corriger tous les éléments avec du violet
           const purpleColors = [
               '#4b0082', '#8a2be2', '#8A2BE2', '#9b59b6', 
               '#6a1b9a', '#9c27b0', 'purple', 'violet'
           ];
           
                       // UNIQUEMENT EN DARK MODE - Parcourir tous les éléments
            if (this.isDark) {
                const allElements = document.querySelectorAll('*');
                allElements.forEach(element => {
                    const computedStyle = window.getComputedStyle(element);
                    const bgColor = computedStyle.backgroundColor;
                    const bgImage = computedStyle.backgroundImage;
                    
                    // Vérifier si l'élément a du violet EN DARK MODE SEULEMENT
                    purpleColors.forEach(color => {
                        if (bgColor.includes(color) || bgImage.includes(color)) {
                            element.style.background = '#252422';
                            element.style.backgroundColor = '#252422';
                            element.style.backgroundImage = 'none';
                        }
                    });
                    
                    // Traiter les styles inline EN DARK MODE SEULEMENT
                    const inlineStyle = element.getAttribute('style') || '';
                    if (purpleColors.some(color => inlineStyle.includes(color))) {
                        element.style.background = '#252422';
                        element.style.backgroundColor = '#252422';
                        element.style.backgroundImage = 'none';
                    }
                });
            }
           
                       // UNIQUEMENT EN DARK MODE - Forcer les éléments spécifiques problématiques
            if (this.isDark) {
                const chatButton = document.querySelector('.chat-button');
                if (chatButton) {
                    chatButton.style.background = 'linear-gradient(135deg, #403D39, #252422)';
                    chatButton.style.border = '2px solid #CCC5B9';
                }
                
                const chatWindow = document.querySelector('.chat-window');
                if (chatWindow) {
                    chatWindow.style.background = 'linear-gradient(135deg, #403D39, #252422)';
                }
                
                // Forcer les cellules Q-Learning EN DARK MODE SEULEMENT
                const cells = document.querySelectorAll('.cell');
                cells.forEach(cell => {
                    if (!cell.classList.contains('optimal-path')) {
                        cell.style.background = 'linear-gradient(to top, #403D39 50%, #CCC5B9 100%)';
                    }
                });
            }
               },
        
        restorePurpleElements() {
            // RESTAURER LES COULEURS VIOLET ORIGINALES EN LIGHT MODE
            document.body.style.background = 'linear-gradient(135deg, #4b0082, #8a2be2)';
            document.body.style.backgroundColor = '';
            document.body.style.backgroundImage = '';
            
            // Restaurer les boutons violet
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.background = '';
                button.style.backgroundColor = '';
                button.style.border = '';
                button.style.color = '';
            });
            
            // Restaurer chat button violet
            const chatButton = document.querySelector('.chat-button');
            if (chatButton) {
                chatButton.style.background = '';
                chatButton.style.border = '';
            }
            
            // Restaurer chat window violet
            const chatWindow = document.querySelector('.chat-window');
            if (chatWindow) {
                chatWindow.style.background = '';
            }
            
            // Restaurer textarea violet
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                textarea.style.background = '';
                textarea.style.color = '';
            });
            
            // Restaurer SQL output violet
            const sqlOutput = document.getElementById('sql-output');
            if (sqlOutput) {
                sqlOutput.style.background = '';
                sqlOutput.style.color = '';
            }
        },
        
        init() {
           // Charger préférence sauvegardée; défaut = 'pastel'
           const savedTheme = localStorage.getItem('theme');
           this.current = this.themes.includes(savedTheme) ? savedTheme : 'pastel';

           this.applyTheme();
           this.updateToggleIcon();

           // Initialiser le bouton
           const themeButton = document.getElementById('theme-toggle');
           if (themeButton && !themeButton._themeBound) {
               themeButton._themeBound = true;
               themeButton.addEventListener('click', () => this.toggle());
           }
       }
   };

   // Icône selon thème courant
   themeManager.updateToggleIcon = function() {
       const themeButton = document.getElementById('theme-toggle');
       if (!themeButton) return;
       const icon = themeButton.querySelector('i');
       
       // Icône spécifique selon le thème
       let iconClass;
       switch(this.current) {
           case 'pastel':
               iconClass = 'fas fa-sun'; // soleil pour thème jour/doux
               break;
           case 'light':
               iconClass = 'fas fa-palette'; // palette pour thème violet
               break;
           case 'dark':
               iconClass = 'fas fa-moon'; // lune pour thème sombre
               break;
           default:
               iconClass = 'fas fa-sun';
       }
       
       icon.className = iconClass;
       icon.classList.add('rotating');
       setTimeout(() => icon.classList.remove('rotating'), 500);
       themeButton.classList.toggle('active', this.current === 'dark');
   };

   // Initialiser le gestionnaire de thème au chargement
   document.addEventListener('DOMContentLoaded', () => {
       themeManager.init();
       // ... autres initialisations ...
   });

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
       
       // Initialize theme already handled above
   });

   // NAVBAR RESPONSIVE DYNAMIQUE - GESTION COMPLETE
   
   class ResponsiveNavbar {
       constructor() {
           this.navbar = document.querySelector('.navbar');
           this.hamburgerBtn = document.querySelector('.hamburger-btn');
           this.mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
           this.mobileMenu = document.querySelector('.mobile-menu');
           this.mobileMenuClose = document.querySelector('.mobile-menu-close');
           this.mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
           this.mobileThemeToggle = document.getElementById('mobile-theme-toggle');
           this.mobileSoundToggle = document.getElementById('mobile-sound-toggle');
           
           this.isMenuOpen = false;
           this.currentBreakpoint = this.getCurrentBreakpoint();
           this.lastScrollY = window.scrollY;
           
           this.init();
       }
       
       init() {
           this.bindEvents();
           this.handleResize();
           this.setupKeyboardNavigation();
           this.syncMobileControls();
       }
       
       bindEvents() {
           // Hamburger button click
           if (this.hamburgerBtn) {
               this.hamburgerBtn.addEventListener('click', (e) => {
                   e.stopPropagation();
                   this.toggleMobileMenu();
               });
           }
           
           // Mobile menu close button
           if (this.mobileMenuClose) {
               this.mobileMenuClose.addEventListener('click', () => {
                   this.closeMobileMenu();
               });
           }
           
           // Overlay click to close
           if (this.mobileMenuOverlay) {
               this.mobileMenuOverlay.addEventListener('click', (e) => {
                   if (e.target === this.mobileMenuOverlay) {
                       this.closeMobileMenu();
                   }
               });
           }
           
           // Mobile menu items click
           this.mobileMenuItems.forEach(item => {
               item.addEventListener('click', () => {
                   this.closeMobileMenu();
                   // Smooth scroll to section
                   const href = item.getAttribute('href');
                   if (href && href.startsWith('#')) {
                       const target = document.querySelector(href);
                       if (target) {
                           target.scrollIntoView({ 
                               behavior: 'smooth',
                               block: 'start'
                           });
                       }
                   }
               });
           });
           
           // Window resize
           window.addEventListener('resize', () => {
               this.handleResize();
           });
           
           // Orientation change
           window.addEventListener('orientationchange', () => {
               setTimeout(() => {
                   this.handleResize();
               }, 100);
           });
           
           // Scroll behavior
           window.addEventListener('scroll', () => {
               this.handleScroll();
           });
           
           // Mobile theme controls
            if (this.mobileThemeToggle && !this.mobileThemeToggle._themeBound) {
                this.mobileThemeToggle._themeBound = true;
                this.mobileThemeToggle.addEventListener('click', () => {
                    themeManager.toggle();
                    this.syncMobileControls();
                });
            }
           
           if (this.mobileSoundToggle) {
               this.mobileSoundToggle.addEventListener('click', () => {
                   soundManager.toggleMute();
                   this.syncMobileControls();
               });
           }
       }
       
       getCurrentBreakpoint() {
           const width = window.innerWidth;
           if (width <= 768) return 'mobile';
           if (width <= 1024) return 'tablet';
           return 'desktop';
       }
       
       handleResize() {
           const newBreakpoint = this.getCurrentBreakpoint();
           
           // Close mobile menu if switching to larger screen
           if (this.currentBreakpoint === 'mobile' && newBreakpoint !== 'mobile') {
               this.closeMobileMenu();
           }
           
           this.currentBreakpoint = newBreakpoint;
           this.updateNavbarLayout();
       }
       
       updateNavbarLayout() {
           // Priority display for tablet mode
           if (this.currentBreakpoint === 'tablet') {
               this.applyTabletLayout();
           }
       }
       
       applyTabletLayout() {
           // Show only priority items in tablet mode
           const navItems = document.querySelectorAll('.navbar-item');
           const priority = ['#profil', '#competences', '#experience', '#projects', '#contact']; // Priority order
           
           navItems.forEach(item => {
               const href = item.getAttribute('href');
               if (priority.includes(href)) {
                   item.style.display = 'flex';
               } else {
                   item.style.display = 'none';
               }
           });
       }
       
       toggleMobileMenu() {
           if (this.isMenuOpen) {
               this.closeMobileMenu();
           } else {
               this.openMobileMenu();
           }
       }
       
       openMobileMenu() {
           this.isMenuOpen = true;
           this.hamburgerBtn.classList.add('active');
           this.hamburgerBtn.setAttribute('aria-expanded', 'true');
           this.mobileMenuOverlay.classList.add('active');
           
           // Prevent body scroll
           document.body.style.overflow = 'hidden';
           
           // Focus trap
           this.trapFocus();
           
           // Sound effect
           if (typeof soundManager !== 'undefined') {
               soundManager.playToggleSound(false);
           }
       }
       
       closeMobileMenu() {
           this.isMenuOpen = false;
           this.hamburgerBtn.classList.remove('active');
           this.hamburgerBtn.setAttribute('aria-expanded', 'false');
           this.mobileMenuOverlay.classList.remove('active');
           
           // Restore body scroll
           document.body.style.overflow = '';
           
           // Sound effect
           if (typeof soundManager !== 'undefined') {
               soundManager.playToggleSound(true);
           }
       }
       
       handleScroll() {
           const currentScrollY = window.scrollY;
           
           // Auto-close mobile menu on scroll
           if (this.isMenuOpen && this.currentBreakpoint === 'mobile') {
               if (Math.abs(currentScrollY - this.lastScrollY) > 50) {
                   this.closeMobileMenu();
               }
           }
           
           // Hide/show navbar on scroll (optional)
           if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
               this.navbar.classList.add('navbar-hidden');
           } else {
               this.navbar.classList.remove('navbar-hidden');
           }
           
           this.lastScrollY = currentScrollY;
       }
       
       setupKeyboardNavigation() {
           // Escape key to close menu
           document.addEventListener('keydown', (e) => {
               if (e.key === 'Escape' && this.isMenuOpen) {
                   this.closeMobileMenu();
               }
           });
           
           // Tab navigation within mobile menu
           if (this.mobileMenu) {
               this.mobileMenu.addEventListener('keydown', (e) => {
                   if (e.key === 'Tab') {
                       this.handleTabNavigation(e);
                   }
               });
           }
       }
       
       handleTabNavigation(e) {
           const focusableElements = this.mobileMenu.querySelectorAll(
               'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
           );
           const firstFocusable = focusableElements[0];
           const lastFocusable = focusableElements[focusableElements.length - 1];
           
           if (e.shiftKey) {
               if (document.activeElement === firstFocusable) {
                   lastFocusable.focus();
                   e.preventDefault();
               }
           } else {
               if (document.activeElement === lastFocusable) {
                   firstFocusable.focus();
                   e.preventDefault();
               }
           }
       }
       
       trapFocus() {
           // Focus on first menu item when opened
           setTimeout(() => {
               const firstMenuItem = this.mobileMenu.querySelector('.mobile-menu-item');
               if (firstMenuItem) {
                   firstMenuItem.focus();
               }
           }, 300);
       }
       
       syncMobileControls() {
           // Sync theme button state
           if (this.mobileThemeToggle) {
               const icon = this.mobileThemeToggle.querySelector('i');
               // Même logique que le bouton desktop
               switch(themeManager.current) {
                   case 'pastel':
                       icon.className = 'fas fa-sun'; // soleil pour thème jour/doux
                       break;
                   case 'light':
                       icon.className = 'fas fa-palette'; // palette pour thème violet
                       break;
                   case 'dark':
                       icon.className = 'fas fa-moon'; // lune pour thème sombre
                       break;
                   default:
                       icon.className = 'fas fa-sun';
               }
           }
           
           // Sync sound button state
           if (this.mobileSoundToggle && typeof soundManager !== 'undefined') {
               const icon = this.mobileSoundToggle.querySelector('i');
               if (soundManager.isMuted) {
                   icon.className = 'fas fa-volume-mute';
               } else {
                   icon.className = 'fas fa-volume-up';
               }
           }
       }
       
       // Touch gestures for advanced interaction
       setupTouchGestures() {
           let startX = 0;
           let startY = 0;
           
           this.mobileMenu.addEventListener('touchstart', (e) => {
               startX = e.touches[0].clientX;
               startY = e.touches[0].clientY;
           });
           
           this.mobileMenu.addEventListener('touchmove', (e) => {
               if (!startX || !startY) return;
               
               const currentX = e.touches[0].clientX;
               const currentY = e.touches[0].clientY;
               
               const diffX = startX - currentX;
               const diffY = startY - currentY;
               
               // Swipe right to close
               if (Math.abs(diffX) > Math.abs(diffY) && diffX < -50) {
                   this.closeMobileMenu();
               }
           });
           
           this.mobileMenu.addEventListener('touchend', () => {
               startX = 0;
               startY = 0;
           });
       }
   }

   // Initialize responsive navbar
   let responsiveNavbar;
   
   // Export for external access
   window.ResponsiveNavbar = ResponsiveNavbar;

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
 const dataAnalytics = document.getElementById('data-analytics-container');

 const isVisible = qlearning.style.display === 'block';

 // Masquer tous
 qlearning.style.display = 'none';
 classification.style.display = 'none';
 dataAnalytics.style.display = 'none';

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

// Timeline supprimée - Section expériences professionnelles sans éléments timeline

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
        'R': 'Analyse statistique et data science',
        'MERISE': 'Méthode de conception de systèmes d\'information',
        'UML': 'Langage de modélisation unifié',
        'SysML': 'Langage de modélisation systèmes',
        'Tableau': 'Outil de visualisation de données',
        'Power BI': 'Solution Microsoft de business intelligence',
        'MySQL': 'Système de gestion de base de données relationnelle',
        'Dataiku': 'Plateforme de data science collaborative',
        'PostgreSQL': 'Système de gestion de base de données avancé',
        'IBM': 'Solutions cloud et services IBM',
        'AWS': 'Services cloud Amazon Web Services'
    };
    
    skillTags.forEach(tag => {
        const skillName = tag.textContent.trim();
        if (tooltipData[skillName]) {
            tag.title = tooltipData[skillName];
            tag.style.cursor = 'help';
        }
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

// Les sons sont maintenant gérés par le soundManager

// Optimisation des performances
const ANIMATION_FRAME = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { setTimeout(callback, 1000 / 60); };

// Fonction d'initialisation optimisée
function initCvInteractions() {
    const cvSection = document.querySelector('.cv-section');
    if (cvSection) {
        // Vérifier l'état du son au démarrage
        if (soundManager && soundManager.isMuted) {
            cvSection.classList.add('sounds-disabled');
        }

        // Ajouter les gestionnaires d'événements avec vérification du son
        document.querySelectorAll('.cv-section-header').forEach(header => {
            header.addEventListener('click', () => {
                if (soundManager && !soundManager.isMuted) {
                    soundManager.playHoverSound();
                }
            });
        });

        // Autres gestionnaires d'événements du CV...
    }
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
    // Vérifier si le soundManager existe et est initialisé
    if (typeof soundManager === 'undefined') {
        console.warn('soundManager not initialized');
        return;
    }

    const section = header.parentElement;
    const content = section.querySelector('.cv-section-content');
    const isActive = section.classList.contains('active');

    // Jouer le son uniquement si le son n'est pas désactivé globalement
    if (!soundManager.isMuted) {
        try {
            const oscillator = soundManager.audioContext.createOscillator();
            const gainNode = soundManager.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(soundManager.audioContext.destination);
            
            // Son différent pour l'ouverture et la fermeture
            if (isActive) {
                // Son de fermeture
                oscillator.frequency.setValueAtTime(600, soundManager.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, soundManager.audioContext.currentTime + 0.2);
            } else {
                // Son d'ouverture
                oscillator.frequency.setValueAtTime(400, soundManager.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, soundManager.audioContext.currentTime + 0.2);
            }
            
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.03, soundManager.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, soundManager.audioContext.currentTime + 0.2);
            
            oscillator.start(soundManager.audioContext.currentTime);
            oscillator.stop(soundManager.audioContext.currentTime + 0.2);

            // Nettoyer les nœuds audio après utilisation
            setTimeout(() => {
                oscillator.disconnect();
                gainNode.disconnect();
            }, 300);
        } catch (error) {
            console.error('Error playing section toggle sound:', error);
        }
    }

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

        // Add hover effects and animations after rendering
        document.querySelectorAll('.repo-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
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
    // Nettoyer et formater le nom du repository
    const formattedName = formatRepoName(repo.name);
    
    const topics = repo.topics && repo.topics.length > 0 
        ? `<div class="repo-topics">${repo.topics.map(topic => `<span class="topic">${escapeHtml(topic)}</span>`).join('')}</div>`
        : '';
    
    const homepage = repo.homepage 
        ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="repo-link homepage-link" aria-label="Voir la démo du projet ${formattedName}">
            <i class="fas fa-globe" aria-hidden="true"></i> <span>Demo</span>
           </a>`
        : '';

    // Formater la description pour éviter les problèmes d'affichage
    const description = repo.description 
        ? escapeHtml(repo.description)
        : 'Aucune description disponible';

    return `
        <div class="repo-card" data-repo-id="${repo.id}" role="article" aria-labelledby="repo-title-${repo.id}">
            <div class="repo-header">
                <h3 class="repo-title" id="repo-title-${repo.id}">
                    <a href="${repo.html_url}" target="_blank" rel="noopener" aria-label="Voir le code source de ${formattedName} sur GitHub">
                        <i class="fab fa-github" aria-hidden="true"></i> 
                        <span class="repo-name">${formattedName}</span>
                    </a>
                </h3>
                <div class="repo-links" role="navigation" aria-label="Liens du projet">
                    ${homepage}
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-link" aria-label="Voir le code source de ${formattedName}">
                        <i class="fas fa-code" aria-hidden="true"></i> <span>Code</span>
                    </a>
                </div>
            </div>
            
            <p class="repo-description">${description}</p>
            
            ${topics}
            
            <div class="repo-stats" role="group" aria-label="Statistiques du projet">
                <span class="repo-stat" title="Nombre d'étoiles">
                    <i class="fas fa-star" aria-hidden="true"></i> 
                    <span>${formatNumber(repo.stargazers_count)}</span>
                </span>
                <span class="repo-stat" title="Nombre de forks">
                    <i class="fas fa-code-branch" aria-hidden="true"></i> 
                    <span>${formatNumber(repo.forks_count)}</span>
                </span>
                <span class="repo-stat ${repo.language ? 'with-language' : ''}" title="Langage principal">
                    <i class="fas fa-circle" style="color: ${getLanguageColor(repo.language)}" aria-hidden="true"></i>
                    <span>${repo.language || 'N/A'}</span>
                </span>
                <span class="repo-stat" title="Dernière mise à jour">
                    <i class="fas fa-clock" aria-hidden="true"></i>
                    <span>${formatDate(repo.updated_at)}</span>
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

// Fonction pour formater les noms de repository
function formatRepoName(name) {
    // Remplacer les tirets et underscores par des espaces
    return name
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Séparer les mots en camelCase
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
}

// Fonction pour échapper les caractères HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fonction pour formater les nombres
function formatNumber(num) {
    if (num === 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
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
    // createExperienceTimeline(); // Timeline supprimée - plus d'éléments timeline
    addTooltips();
    createTypingEffect();
    // addSoundEffects(); // Fonction inexistante - supprimée
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
                const closeText = translations[currentLang] ? translations[currentLang]["Fermer l'assistant"] : "Fermer l'assistant";
                toggleText.textContent = closeText;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(() => {
                    const chatInput = document.getElementById('chat-input');
                    if (chatInput) {
                        chatInput.focus();
                    }
                }, 300);
            } else {
                const openText = translations[currentLang] ? translations[currentLang]["Ouvrir l'assistant"] : "Ouvrir l'assistant";
                toggleText.textContent = openText;
            }
        });
    } else {
        console.error('L\'élément chat-toggle n\'a pas été trouvé');
    }
});

// Gestionnaire de son global
const soundManager = {
    audioContext: null,
    isMuted: false,

    initialize() {
        try {
            // Initialiser le contexte audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Récupérer l'état du son depuis le localStorage
            this.isMuted = localStorage.getItem('soundMuted') === 'true';
            
            // Mettre à jour l'icône du son
            this.updateSoundIcon();
            
            // Ajouter le gestionnaire d'événements pour le bouton de son
            const soundToggle = document.getElementById('sound-toggle');
            if (soundToggle) {
                soundToggle.addEventListener('click', () => {
                    const willBeMuted = !this.isMuted;
                    // Suspendre/reprendre le contexte audio en fonction de l'état
                    if (willBeMuted) {
                        this.audioContext.suspend();
                    } else {
                        this.audioContext.resume();
                    }
                    this.playToggleSound(willBeMuted);
                    this.toggleMute();
                });
            }

            // Initialiser les événements pour les éléments statiques
            this.initializeStaticElements();

            // Observer les changements dans le DOM pour les éléments dynamiques
            this.observeDynamicElements();

            // Désactiver tous les sons si nécessaire
            if (this.isMuted) {
                this.disableAllSounds();
                this.audioContext.suspend();
            }

            // Ajouter un gestionnaire global pour les sections CV
            document.addEventListener('click', (event) => {
                if (event.target.closest('.cv-section-header')) {
                    // Le son sera géré par toggleCvSection
                    return;
                }
            });

            // Initialiser les sons SQL
            this.initializeSqlSounds();

            console.log('Sound manager initialized successfully');
        } catch (error) {
            console.error('Error initializing sound manager:', error);
            this.audioContext = null;
            this.isMuted = true;
        }
    },

    initializeStaticElements() {
        // Ajouter les événements pour le bouton de CV
        const cvButton = document.querySelector('.cv-download-btn');
        if (cvButton) {
            cvButton.addEventListener('mouseenter', () => {
                if (!this.isMuted) this.playSoftHoverSound();
            });
            cvButton.addEventListener('click', () => {
                if (!this.isMuted) this.playDownloadSound();
            });
        }

        // Ajouter les événements pour les boutons du footer
        document.querySelectorAll('footer a').forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!this.isMuted) this.playSoftHoverSound();
            });
            button.addEventListener('click', () => {
                if (!this.isMuted) this.playFooterClickSound();
            });
        });

        // Ajouter les événements pour les éléments du CV
        document.querySelectorAll('.cv-section-header').forEach(header => {
            header.addEventListener('click', () => {
                if (!this.isMuted) {
                    this.playSound({
                        frequency: 800,
                        volume: 0.03,
                        duration: 0.1,
                        type: 'sine'
                    });
                }
            });
        });

        // Ajouter les événements pour les tags de compétences
        document.querySelectorAll('.cv-skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                if (!this.isMuted) {
                    this.playSound({
                        frequency: 1000,
                        volume: 0.02,
                        duration: 0.05,
                        type: 'sine'
                    });
                }
            });
        });
    },

    observeDynamicElements() {
        // Créer un observateur pour les changements dans le DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Pour chaque nouveau nœud ajouté
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 1 = ELEMENT_NODE
                        // Vérifier et ajouter les événements aux cartes GitHub
                        node.querySelectorAll('.repo-card').forEach(card => {
                            this.addGitHubCardEvents(card);
                        });

                        // Vérifier et ajouter les événements aux tables
                        node.querySelectorAll('.table-item').forEach(table => {
                            this.addTableEvents(table);
                        });
                    }
                });
            });
        });

        // Observer les changements dans tout le document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Ajouter les événements aux éléments existants
        this.addEventsToExistingElements();
    },

    addEventsToExistingElements() {
        // Ajouter les événements aux cartes GitHub existantes
        document.querySelectorAll('.repo-card').forEach(card => {
            this.addGitHubCardEvents(card);
        });

        // Ajouter les événements aux tables existantes
        document.querySelectorAll('.table-item').forEach(table => {
            this.addTableEvents(table);
        });
    },

    addGitHubCardEvents(card) {
        // Éviter les doublons d'événements
        if (!card.dataset.soundInitialized) {
            card.addEventListener('mouseenter', () => this.playHoverSound());
            card.dataset.soundInitialized = 'true';
        }
    },

    addTableEvents(table) {
        // Éviter les doublons d'événements
        if (!table.dataset.soundInitialized) {
            table.addEventListener('mouseenter', () => this.playHoverSound());
            table.addEventListener('click', () => {
                const tableName = table.getAttribute('data-table-name');
                const sqlInput = document.getElementById('sql-input');
                if (sqlInput) {
                    sqlInput.value = `SELECT * FROM ${tableName};`;
                    this.playTableClickSound();
                }
            });
            table.dataset.soundInitialized = 'true';
        }
    },

    disableAllSounds() {
        // Désactiver tous les éléments audio
        document.querySelectorAll('audio').forEach(audio => {
            audio.muted = true;
            audio.pause();
        });

        // Désactiver les sons dans la section CV
        const cvSections = document.querySelectorAll('.cv-section, .cv-section-header, .cv-section-content');
        cvSections.forEach(section => {
            section.classList.add('sounds-disabled');
            // Désactiver les sons pour les sections accordéon
            const header = section.querySelector('.cv-section-header');
            if (header) {
                header.dataset.soundDisabled = 'true';
            }
        });

        // Désactiver les événements sonores des éléments du CV
        document.querySelectorAll('.cv-section-header, .cv-skill-tag, .cv-download-btn').forEach(element => {
            element.dataset.soundDisabled = 'true';
        });

        // Désactiver les sons SQL
        const sqlInput = document.getElementById('sql-input');
        const executeButton = document.querySelector('.sql-button.primary');
        if (sqlInput) sqlInput.dataset.soundDisabled = 'true';
        if (executeButton) executeButton.dataset.soundDisabled = 'true';

        // Désactiver le contexte audio si existant
        if (this.audioContext) {
            this.audioContext.suspend();
        }

        // Désactiver les sons du chat si le chatbot existe
        if (window.chatBot && chatBot.audioContext) {
            chatBot.audioContext.suspend();
        }

        // Mettre à jour l'état dans le localStorage
        localStorage.setItem('soundMuted', 'true');
    },

    enableAllSounds() {
        // Activer tous les éléments audio
        document.querySelectorAll('audio').forEach(audio => {
            audio.muted = false;
        });

        // Activer les sons dans la section CV
        const cvSections = document.querySelectorAll('.cv-section, .cv-section-header, .cv-section-content');
        cvSections.forEach(section => {
            section.classList.remove('sounds-disabled');
            // Réactiver les sons pour les sections accordéon
            const header = section.querySelector('.cv-section-header');
            if (header) {
                header.dataset.soundDisabled = 'false';
            }
        });

        // Réactiver les événements sonores des éléments du CV
        document.querySelectorAll('.cv-section-header, .cv-skill-tag, .cv-download-btn').forEach(element => {
            element.dataset.soundDisabled = 'false';
        });

        // Réactiver les sons SQL
        const sqlInput = document.getElementById('sql-input');
        const executeButton = document.querySelector('.sql-button.primary');
        if (sqlInput) sqlInput.dataset.soundDisabled = 'false';
        if (executeButton) executeButton.dataset.soundDisabled = 'false';

        // Réactiver le contexte audio si existant
        if (this.audioContext) {
            this.audioContext.resume();
        }

        // Réactiver les sons du chat si le chatbot existe
        if (window.chatBot && chatBot.audioContext) {
            chatBot.audioContext.resume();
        }

        // Mettre à jour l'état dans le localStorage
        localStorage.setItem('soundMuted', 'false');
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('soundMuted', this.isMuted);
        this.updateSoundIcon();
        
        // Suspendre/reprendre immédiatement le contexte audio
        if (this.audioContext) {
            if (this.isMuted) {
                this.audioContext.suspend();
                this.disableAllSounds();
            } else {
                this.audioContext.resume();
                this.enableAllSounds();
            }
        }
        
        // Mettre à jour l'état des sections CV
        document.querySelectorAll('.cv-section-header').forEach(header => {
            header.dataset.soundDisabled = this.isMuted.toString();
        });
    },

    updateSoundIcon() {
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            const icon = soundToggle.querySelector('i');
            icon.className = 'fas ' + (soundManager.isMuted ? 'fa-volume-mute' : 'fa-volume-up');
        }
    },

    canPlaySound() {
        if (this.isMuted) {
            // Vérifier si l'événement actuel provient d'un élément du CV
            if (event && event.target) {
                const cvElement = event.target.closest('.cv-section, .cv-download-btn, [data-section="cv"]');
                if (cvElement) {
                    return false;
                }
            }
        }
        return this.audioContext !== null && !this.isMuted;
    },

    playSound(options) {
        // Bloquer tous les sons si le son est désactivé
        if (this.isMuted) return;

        // Vérifier si l'audioContext est disponible
        if (!this.audioContext) return;

        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.type = options.type || 'sine';
            osc.frequency.setValueAtTime(options.frequency, this.audioContext.currentTime);
            
            if (options.frequencyEnd) {
                osc.frequency.exponentialRampToValueAtTime(
                    options.frequencyEnd,
                    this.audioContext.currentTime + options.duration
                );
            }
            
            gain.gain.setValueAtTime(options.volume, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                this.audioContext.currentTime + options.duration
            );
            
            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + options.duration);

            setTimeout(() => {
                osc.disconnect();
                gain.disconnect();
            }, options.duration * 1000);
        } catch (error) {
            console.error('Erreur lors de la lecture du son:', error);
        }
    },

    playToggleSound(willBeMuted) {
        const tempMuted = this.isMuted;
        this.isMuted = false;
        
        if (willBeMuted) {
            // Son de désactivation : fréquence descendante
            this.playSound({
                frequency: 880,
                frequencyEnd: 440,
                volume: 0.03,
                duration: 0.2,
                type: 'sine'
            });
            
            // Ajouter un son secondaire plus grave
            setTimeout(() => {
                this.playSound({
                    frequency: 440,
                    frequencyEnd: 220,
                    volume: 0.02,
                    duration: 0.15,
                    type: 'sine'
                });
            }, 50);
        } else {
            // Son d'activation : fréquence ascendante
            this.playSound({
                frequency: 440,
                frequencyEnd: 880,
                volume: 0.03,
                duration: 0.2,
                type: 'sine'
            });
            
            // Ajouter un son secondaire plus aigu
            setTimeout(() => {
                this.playSound({
                    frequency: 880,
                    frequencyEnd: 1760,
                    volume: 0.02,
                    duration: 0.15,
                    type: 'sine'
                });
            }, 50);
        }
        
        this.isMuted = tempMuted;
    },

    playHoverSound() {
        if (event && this.isCvSectionEvent(event)) return;
        this.playSound({
            frequency: 440,
            frequencyEnd: 550,
            volume: 0.03,
            duration: 0.3,
            type: 'sine'
        });
    },

    playSoftHoverSound() {
        if (event && this.isCvSectionEvent(event)) return;
        this.playSound({
            frequency: 440,
            frequencyEnd: 466.16,
            volume: 0.02,
            duration: 0.15,
            type: 'sine'
        });
    },

    playTableClickSound() {
        if (event && this.isCvSectionEvent(event)) return;
        this.playSound({
            frequency: 523.25,
            frequencyEnd: 587.33,
            volume: 0.03,
            duration: 0.1,
            type: 'sine'
        });
    },

    playFooterClickSound() {
        if (event && this.isCvSectionEvent(event)) return;
        this.playSound({
            frequency: 783.99,
            frequencyEnd: 880.00,
            volume: 0.015,
            duration: 0.1,
            type: 'sine'
        });
    },

    playDownloadSound() {
        if (event && this.isCvSectionEvent(event)) return;
        const notes = [
            { freq: 392.00, time: 0 },
            { freq: 493.88, time: 0.1 },
            { freq: 587.33, time: 0.2 },
            { freq: 783.99, time: 0.3 }
        ];
        
        notes.forEach(note => {
            setTimeout(() => {
                this.playSound({
                    frequency: note.freq,
                    volume: 0.04,
                    duration: 0.2,
                    type: 'sine'
                });
            }, note.time * 1000);
        });
    },

    isCvSectionEvent(event) {
        // Vérifier si l'événement provient d'une section CV
        const path = event.composedPath();
        return path.some(element => {
            if (element && element.classList) {
                return element.classList.contains('cv-section') ||
                       element.classList.contains('cv-section-header') ||
                       element.classList.contains('cv-download-btn') ||
                       element.classList.contains('cv-skill-tag') ||
                       element.closest('.cv-section');
            }
            return false;
        }) && this.isMuted;
    },

    playSqlKeySound() {
        if (!this.isMuted) {
            this.playSound({
                frequency: 1200,
                volume: 0.01,
                duration: 0.05,
                type: 'sine'
            });
        }
    },

    playSqlDeleteSound() {
        if (!this.isMuted) {
            this.playSound({
                frequency: 800,
                volume: 0.01,
                duration: 0.05,
                type: 'sine'
            });
        }
    },

    playSqlExecuteSound() {
        if (!this.isMuted) {
            // Son plus élaboré pour l'exécution
            const notes = [
                { freq: 600, time: 0 },
                { freq: 800, time: 0.1 },
                { freq: 1000, time: 0.2 }
            ];
            
            notes.forEach(note => {
                setTimeout(() => {
                    this.playSound({
                        frequency: note.freq,
                        volume: 0.03,
                        duration: 0.15,
                        type: 'sine'
                    });
                }, note.time * 1000);
            });
        }
    },

    initializeSqlSounds() {
        const sqlInput = document.getElementById('sql-input');
        const executeButton = document.querySelector('.sql-button.primary');

        if (sqlInput) {
            sqlInput.addEventListener('keydown', (event) => {
                if (event.key === 'Backspace' || event.key === 'Delete') {
                    this.playSqlDeleteSound();
                } else if (event.key.length === 1 || event.key === 'Enter') {
                    this.playSqlKeySound();
                }
            });
        }

        if (executeButton) {
            executeButton.addEventListener('click', () => {
                this.playSqlExecuteSound();
            });
        }
    },
};

// Initialiser le gestionnaire de son au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le gestionnaire de son
    soundManager.initialize();
    
    // Initialiser la navbar responsive
    if (typeof ResponsiveNavbar !== 'undefined') {
        responsiveNavbar = new ResponsiveNavbar();
        console.log('✅ ResponsiveNavbar initialisée');
    } else {
        console.error('❌ ResponsiveNavbar non trouvée');
    }
});

// Appeler loadGitHubRepos au chargement
loadGitHubRepos();

// === TRADUCTION DYNAMIQUE FR/EN ===
const translations = {
  fr: {
    Profil: 'Profil',
    "Compétences": 'Compétences',
    "Expérience": 'Expérience',
    Projets: 'Projets',
    Contact: 'Contact',
    Technologies: 'Technologies',
    Langues: 'Langues',
    Éducation: 'Éducation',
    Certifications: 'Certifications',
    'Data Scientist • Python Enthusiast • Q-Learning Explorer': 'Data Scientist • Python Enthusiast • Q-Learning Explorer',
    'Télécharger mon CV': 'Télécharger mon CV',
    'Disponibilité': 'Disponibilité',
    'À partir de septembre 2025': 'À partir de septembre 2025',
    'Console SQL Interactive': 'Console SQL Interactive',
    'Explorez la base de données avec des requêtes SQL personnalisées': 'Explorez la base de données avec des requêtes SQL personnalisées',
    'Assistant Personnel IA': 'Assistant Personnel IA',
    'Posez vos questions sur mon profil et mes compétences': 'Posez vos questions sur mon profil et mes compétences',
    'Test My Project': 'Test My Project',
    'Découvrez mes projets interactifs en action': 'Découvrez mes projets interactifs en action',
    'FR | EN': 'FR | EN',
    'EN | FR': 'EN | FR',
    // Ajoute ici tous les autres textes à traduire
    'ProfilTexte': `Actuellement étudiant en Master 2 MIAGE, où j'ai acquis une solide expérience en informatique, en gestion et en organisation. Ma spécialisation en conception, développement et gestion de projets informatiques m'a permis de maîtriser plusieurs langages informatiques et de travailler efficacement sur différentes plateformes et logiciels. Mon intérêt pour les nouvelles technologies et les défis complexes m'a rendu curieux, créatif et passionné par la recherche de solutions innovantes.`,
    'Expérience Professionnelle': 'Expérience Professionnelle',
    'Product Owner / Data Engineer': 'Product Owner / Data Engineer',
    'La Banque Postale': 'La Banque Postale',
    'Documentation technique et métier des données': 'Documentation technique et métier des données',
    'Modélisation logique des données et lineage complet': 'Modélisation logique des données et lineage complet',
    'Tableaux de bord avec Tableau & Power BI': 'Tableaux de bord avec Tableau & Power BI',
    'Optimisation des requêtes sur gros volumes': 'Optimisation des requêtes sur gros volumes',
    'Projet Académique - Application Empreinte Carbone': 'Projet Académique - Application Empreinte Carbone',
    'Université Toulouse III': 'Université Toulouse III',
    "Développement d'une application de calcul d'empreinte carbone (Python, React Native)": "Développement d'une application de calcul d'empreinte carbone (Python, React Native)",
    'Reconnaissance caméra et vocale (APIs Google)': 'Reconnaissance caméra et vocale (APIs Google)',
    'Gestion complète du projet (coordination, planification, supervision)': 'Gestion complète du projet (coordination, planification, supervision)',
    'Chef de Projet IT': 'Chef de Projet IT',
    'SHL': 'SHL',
    "Développement full-stack d'une interface d'administration": "Développement full-stack d'une interface d'administration",
    'Leadership dans la finalisation du site': 'Leadership dans la finalisation du site',
    "Gestion d'équipe multidisciplinaire": "Gestion d'équipe multidisciplinaire",
    'Freelance Web': 'Freelance Web',
    'Indépendant': 'Indépendant',
    'Conception et développement de sites web multisecteurs': 'Conception et développement de sites web multisecteurs',
    'Travail en équipe interdisciplinaire': 'Travail en équipe interdisciplinaire',
    'Compétences en gestion, communication, autonomie': 'Compétences en gestion, communication, autonomie',
    'Gestion de Projet': 'Gestion de Projet',
    'Langues': 'Langues',
    'Français': 'Français',
    'Anglais': 'Anglais',
    'Arabe': 'Arabe',
    'Maîtrise 100/100': 'Maîtrise 100/100',
    'Maîtrise 75/100': 'Maîtrise 75/100',
    'Certifications': 'Certifications',
    'Core Designer — Dataiku': 'Core Designer — Dataiku',
    'Certification en conception et développement sur la plateforme Dataiku': 'Certification en conception et développement sur la plateforme Dataiku',
    'Console SQL Interactive': 'Console SQL Interactive',
    'Explorez la base de données avec des requêtes SQL personnalisées': 'Explorez la base de données avec des requêtes SQL personnalisées',
    'Base de données du CV': 'Base de données du CV',
    'Explorez les différentes tables de mon CV interactif avec des requêtes SQL': 'Explorez les différentes tables de mon CV interactif avec des requêtes SQL',
    "Ouvrir l'assistant": "Ouvrir l'assistant",
    "Fermer l'assistant": "Fermer l'assistant",
    'Test My Project': 'Test My Project',
    'Découvrez mes projets interactifs en action': 'Découvrez mes projets interactifs en action',
    'Q-Learning Demo': 'Q-Learning Demo',
    "Algorithme d'apprentissage par renforcement. L'agent apprend à naviguer pour atteindre l'objectif.": "Algorithme d'apprentissage par renforcement. L'agent apprend à naviguer pour atteindre l'objectif.",
    'IA': 'IA',
    'Machine Learning': 'Machine Learning',
    'Python': 'Python',
    '🎮 Essayer': '🎮 Essayer',
    'Classification Iris': 'Classification Iris',
    'Classification de fleurs d\'iris en 3 espèces avec un modèle de machine learning.': 'Classification de fleurs d\'iris en 3 espèces avec un modèle de machine learning.',
    'Classification': 'Classification',
    'Data Science': 'Data Science',
    'R': 'R',
    '🔬 Tester': '🔬 Tester',
    'GitHub Analytics': 'GitHub Analytics',
    'Analyse de mon portfolio GitHub avec métriques réelles, répartition des langages et popularité des projets.': 'Analyse de mon portfolio GitHub avec métriques réelles, répartition des langages et popularité des projets.',
    'GitHub': 'GitHub',
    'Analytics': 'Analytics',
    'Portfolio': 'Portfolio',
    '📈 Analyser': '📈 Analyser',
    'GitHub Analytics Dashboard': 'GitHub Analytics Dashboard',
    'Analyse de Mon Portfolio GitHub • Métriques Réelles • Insights Développeur': 'Analyse de Mon Portfolio GitHub • Métriques Réelles • Insights Développeur',
    'Nom d\'utilisateur GitHub à analyser :': 'Nom d\'utilisateur GitHub à analyser :',
    'Entrez un username GitHub': 'Entrez un username GitHub',
    'Analyser': 'Analyser',
    'Type d\'analyse :': 'Type d\'analyse :',
    'Vue d\'Ensemble': 'Vue d\'Ensemble',
    'Analyse des Langages': 'Analyse des Langages',
    'Top Projets': 'Top Projets',
    'Activité Récente': 'Activité Récente',
    'Total Repos': 'Total Repos',
    'Total Stars': 'Total Stars',
    'Langages': 'Langages',
    'Dernière Activité': 'Dernière Activité',
    'Commits': 'Commits',
    '↗ En cours...': '↗ En cours...',
    'Répartition des Langages': 'Répartition des Langages',
    'Top Projets par Popularité': 'Top Projets par Popularité',
    'Insights Développeur': 'Insights Développeur',
    'Analyse en cours de vos projets GitHub...': 'Analyse en cours de vos projets GitHub...',
    'Chargement des métriques de popularité...': 'Chargement des métriques de popularité...',
    'Évaluation de votre stack technique...': 'Évaluation de votre stack technique...',
    'Actualiser les Données GitHub': 'Actualiser les Données GitHub',
    'Exporter le Rapport GitHub': 'Exporter le Rapport GitHub',
    '❌ Erreur lors du chargement des données GitHub': '❌ Erreur lors du chargement des données GitHub',
    'Vérifiez le username ou la connexion internet': 'Vérifiez le username ou la connexion internet',
    '🔄 Chargement des données GitHub...': '🔄 Chargement des données GitHub...',
    '✓ Données GitHub chargées avec succès': '✓ Données GitHub chargées avec succès',
    'repositories analysés': 'repositories analysés',
    '↗ Données réelles': '↗ Données réelles',
    'Aujourd\'hui': 'Aujourd\'hui',
    'Hier': 'Hier',
    'N/A': 'N/A',
    'Q-Learning en Action': 'Q-Learning en Action',
    'Apprentissage par Renforcement • Algorithme Q-Learning': 'Apprentissage par Renforcement • Algorithme Q-Learning',
    'Mission :': 'Mission :',
    'L\'agent IA doit apprendre à naviguer optimalement vers l\'objectif': 'L\'agent IA doit apprendre à naviguer optimalement vers l\'objectif',
    'Objectif :': 'Objectif :',
    'Case dorée sur la grille 5×5': 'Case dorée sur la grille 5×5',
    'Agent :': 'Agent :',
    'Utilise Q-Learning pour optimiser sa stratégie': 'Utilise Q-Learning pour optimiser sa stratégie',
    'Agent IA': 'Agent IA',
    'Objectif': 'Objectif',
    'Chemin Optimal': 'Chemin Optimal',
    'Démarrer l\'Apprentissage': 'Démarrer l\'Apprentissage',
    'Réinitialiser': 'Réinitialiser',
    // ... autres tags de compétences si besoin
    'Classification des Iris': 'Classification des Iris',
    'Intelligence Artificielle • Classification Multi-Classes': 'Intelligence Artificielle • Classification Multi-Classes',
    'Classifier automatiquement les fleurs d\'iris en 3 espèces distinctes': 'Classifier automatiquement les fleurs d\'iris en 3 espèces distinctes',
    'Machine Learning avec validation croisée': 'Machine Learning avec validation croisée',
    'Données d\'Entraînement': 'Données d\'Entraînement',
    'Lancer la Classification': 'Lancer la Classification',
    'Réinitialiser': 'Réinitialiser',
    'Classification en cours...': 'Classification en cours...',
    'Classification terminée !': 'Classification terminée !',
    'Veuillez saisir toutes les valeurs.': 'Veuillez saisir toutes les valeurs.',
    'Aucune donnée d\'entraînement disponible': 'Aucune donnée d\'entraînement disponible',
    'Éducation': 'Éducation',
    'Master 2 MIAGE - Ingénierie des Données et Protection (IDP)': 'Master 2 MIAGE - Ingénierie des Données et Protection (IDP)',
    'Université Toulouse III - Paul Sabatier, Toulouse (2023 - 2025)': 'Université Toulouse III - Paul Sabatier, Toulouse (2023 - 2025)',
    'Licence Informatique - Parcours MIAGE': 'Licence Informatique - Parcours MIAGE',
    'Université Aix-Marseille, Aix-en-Provence (2021 - 2023)': 'Université Aix-Marseille, Aix-en-Provence (2021 - 2023)',
    'Compétences': 'Compétences',
    'Programmation': 'Programmation',
    'Développement Web': 'Développement Web',
    'Gestion de Projet': 'Gestion de Projet',
    'Data Science': 'Data Science',
    'Cybersécurité': 'Cybersécurité',
    'Conception': 'Conception',
    'Data Analysis': 'Data Analysis',
    'Data Base': 'Data Base',
    'Cloud': 'Cloud',
    'C': 'C',
    'Java': 'Java',
    'Python': 'Python',
    'R': 'R',
    'HTML': 'HTML',
    'CSS': 'CSS',
    'JavaScript': 'JavaScript',
    'Django': 'Django',
    'SCRUM': 'SCRUM',
    'GANTT': 'GANTT',
    'TOGAF': 'TOGAF',
    'ARCHIMATE': 'ARCHIMATE',
    'SQL': 'SQL',
    'NoSQL': 'NoSQL',
    'OpenSSL': 'OpenSSL',
    'RSA': 'RSA',
    'AES': 'AES',
    'MERISE': 'MERISE',
    'UML': 'UML',
    'SysML': 'SysML',
    'Tableau': 'Tableau',
    'Power BI': 'Power BI',
    'MySQL': 'MySQL',
    'Dataiku': 'Dataiku',
    'PostgreSQL': 'PostgreSQL',
    'IBM': 'IBM',
    'AWS': 'AWS',
  },
  en: {
    Profil: 'Profile',
    "Compétences": 'Skills',
    "Expérience": 'Experience',
    Projets: 'Projects',
    Contact: 'Contact',
    Technologies: 'Technologies',
    Langues: 'Languages',
    Éducation: 'Education',
    Certifications: 'Certifications',
    'Data Scientist • Python Enthusiast • Q-Learning Explorer': 'Data Scientist • Python Enthusiast • Q-Learning Explorer',
    'Télécharger mon CV': 'Download my CV',
    'Disponibilité': 'Availability',
    'À partir de septembre 2025': 'From September 2025',
    'Console SQL Interactive': 'Interactive SQL Console',
    'Explorez la base de données avec des requêtes SQL personnalisées': 'Explore the database with custom SQL queries',
    'Assistant Personnel IA': 'Personal AI Assistant',
    'Posez vos questions sur mon profil et mes compétences': 'Ask questions about my profile and skills',
    'Test My Project': 'Test My Project',
    'Découvrez mes projets interactifs en action': 'Discover my interactive projects in action',
    'FR | EN': 'EN | FR',
    'EN | FR': 'FR | EN',
    // Ajoute ici tous les autres textes à traduire
    'ProfilTexte': `Currently a Master 2 MIAGE student, where I have gained solid experience in computer science, management, and organization. My specialization in design, development, and management of IT projects has enabled me to master several programming languages and work efficiently on various platforms and software. My interest in new technologies and complex challenges has made me curious, creative, and passionate about finding innovative solutions.`,
    'Expérience Professionnelle': 'Professional Experience',
    'Product Owner / Data Engineer': 'Product Owner / Data Engineer',
    'La Banque Postale': 'La Banque Postale',
    'Documentation technique et métier des données': 'Technical and business data documentation',
    'Modélisation logique des données et lineage complet': 'Logical data modeling and complete lineage',
    'Tableaux de bord avec Tableau & Power BI': 'Dashboards with Tableau & Power BI',
    'Optimisation des requêtes sur gros volumes': 'Query optimization on large volumes',
    'Projet Académique - Application Empreinte Carbone': 'Academic Project - Carbon Footprint App',
    'Université Toulouse III': 'University of Toulouse III',
    "Développement d'une application de calcul d'empreinte carbone (Python, React Native)": "Development of a carbon footprint calculation app (Python, React Native)",
    'Reconnaissance caméra et vocale (APIs Google)': 'Camera and voice recognition (Google APIs)',
    'Gestion complète du projet (coordination, planification, supervision)': 'Full project management (coordination, planning, supervision)',
    'Chef de Projet IT': 'IT Project Manager',
    'SHL': 'SHL',
    "Développement full-stack d'une interface d'administration": "Full-stack development of an admin interface",
    'Leadership dans la finalisation du site': 'Leadership in site completion',
    "Gestion d'équipe multidisciplinaire": "Multidisciplinary team management",
    'Freelance Web': 'Freelance Web',
    'Indépendant': 'Freelancer',
    'Conception et développement de sites web multisecteurs': 'Design and development of multi-sector websites',
    'Travail en équipe interdisciplinaire': 'Interdisciplinary teamwork',
    'Compétences en gestion, communication, autonomie': 'Skills in management, communication, autonomy',
    'Gestion de Projet': 'Project Management',
    'Langues': 'Languages',
    'Français': 'French',
    'Anglais': 'English',
    'Arabe': 'Arabic',
    'Maîtrise 100/100': 'Mastery 100/100',
    'Maîtrise 75/100': 'Mastery 75/100',
    'Certifications': 'Certifications',
    'Core Designer — Dataiku': 'Core Designer — Dataiku',
    'Certification en conception et développement sur la plateforme Dataiku': 'Certification in design and development on the Dataiku platform',
    'Console SQL Interactive': 'Interactive SQL Console',
    'Explorez la base de données avec des requêtes SQL personnalisées': 'Explore the database with custom SQL queries',
    'Base de données du CV': 'CV Database',
    'Explorez les différentes tables de mon CV interactif avec des requêtes SQL': 'Explore the different tables of my interactive CV with SQL queries',
    "Ouvrir l'assistant": "Open Assistant",
    "Fermer l'assistant": "Close Assistant",
    'Test My Project': 'Test My Project',
    'Découvrez mes projets interactifs en action': 'Discover my interactive projects in action',
    'Q-Learning Demo': 'Q-Learning Demo',
    "Algorithme d'apprentissage par renforcement. L'agent apprend à naviguer pour atteindre l'objectif.": "Reinforcement learning algorithm. The agent learns to navigate to reach the goal.",
    'IA': 'AI',
    'Machine Learning': 'Machine Learning',
    'Python': 'Python',
    '🎮 Essayer': '🎮 Try',
    'Classification Iris': 'Iris Classification',
    'Classification de fleurs d\'iris en 3 espèces avec un modèle de machine learning.': 'Classification of iris flowers into 3 species with a machine learning model.',
    'Classification': 'Classification',
    'Data Science': 'Data Science',
    'R': 'R',
    '🔬 Tester': '🔬 Test',
    'GitHub Analytics': 'GitHub Analytics',
    'Analyse de mon portfolio GitHub avec métriques réelles, répartition des langages et popularité des projets.': 'Analysis of my GitHub portfolio with real metrics, language distribution and project popularity.',
    'GitHub': 'GitHub',
    'Analytics': 'Analytics',
    'Portfolio': 'Portfolio',
    '📈 Analyser': '📈 Analyze',
    'GitHub Analytics Dashboard': 'GitHub Analytics Dashboard',
    'Analyse de Mon Portfolio GitHub • Métriques Réelles • Insights Développeur': 'My GitHub Portfolio Analysis • Real Metrics • Developer Insights',
    'Nom d\'utilisateur GitHub à analyser :': 'GitHub username to analyze:',
    'Entrez un username GitHub': 'Enter a GitHub username',
    'Analyser': 'Analyze',
    'Type d\'analyse :': 'Analysis type:',
    'Vue d\'Ensemble': 'Overview',
    'Analyse des Langages': 'Language Analysis',
    'Top Projets': 'Top Projects',
    'Activité Récente': 'Recent Activity',
    'Total Repos': 'Total Repos',
    'Total Stars': 'Total Stars',
    'Langages': 'Languages',
    'Dernière Activité': 'Last Activity',
    'Commits': 'Commits',
    '↗ En cours...': '↗ Loading...',
    'Répartition des Langages': 'Language Distribution',
    'Top Projets par Popularité': 'Top Projects by Popularity',
    'Insights Développeur': 'Developer Insights',
    'Analyse en cours de vos projets GitHub...': 'Analyzing your GitHub projects...',
    'Chargement des métriques de popularité...': 'Loading popularity metrics...',
    'Évaluation de votre stack technique...': 'Evaluating your tech stack...',
    'Actualiser les Données GitHub': 'Refresh GitHub Data',
    'Exporter le Rapport GitHub': 'Export GitHub Report',
    '❌ Erreur lors du chargement des données GitHub': '❌ Error loading GitHub data',
    'Vérifiez le username ou la connexion internet': 'Check username or internet connection',
    '🔄 Chargement des données GitHub...': '🔄 Loading GitHub data...',
    '✓ Données GitHub chargées avec succès': '✓ GitHub data loaded successfully',
    'repositories analysés': 'repositories analyzed',
    '↗ Données réelles': '↗ Real data',
    'Aujourd\'hui': 'Today',
    'Hier': 'Yesterday',
    'N/A': 'N/A',
    'Q-Learning en Action': 'Q-Learning in Action',
    'Apprentissage par Renforcement • Algorithme Q-Learning': 'Reinforcement Learning • Q-Learning Algorithm',
    'Mission :': 'Mission:',
    'L\'agent IA doit apprendre à naviguer optimalement vers l\'objectif': 'The AI agent must learn to navigate optimally to the goal',
    'Objectif :': 'Goal:',
    'Case dorée sur la grille 5×5': 'Golden cell on the 5×5 grid',
    'Agent :': 'Agent:',
    'Utilise Q-Learning pour optimiser sa stratégie': 'Uses Q-Learning to optimize its strategy',
    'Agent IA': 'AI Agent',
    'Objectif': 'Goal',
    'Chemin Optimal': 'Optimal Path',
    'Démarrer l\'Apprentissage': 'Start Learning',
    'Réinitialiser': 'Reset',
    // ... autres tags de compétences si besoin
    'Classification des Iris': 'Iris Classification',
    'Intelligence Artificielle • Classification Multi-Classes': 'Artificial Intelligence • Multi-Class Classification',
    'Classifier automatiquement les fleurs d\'iris en 3 espèces distinctes': 'Automatically classify iris flowers into 3 distinct species',
    'Machine Learning avec validation croisée': 'Machine Learning with cross-validation',
    'Données d\'Entraînement': 'Training Data',
    'Lancer la Classification': 'Start Classification',
    'Réinitialiser': 'Reset',
    'Classification en cours...': 'Classification in progress...',
    'Classification terminée !': 'Classification complete!',
    'Veuillez saisir toutes les valeurs.': 'Please enter all values.',
    'Aucune donnée d\'entraînement disponible': 'No training data available',
    'Éducation': 'Education',
    'Master 2 MIAGE - Ingénierie des Données et Protection (IDP)': 'Master 2 MIAGE - Data Engineering and Protection (IDP)',
    'Université Toulouse III - Paul Sabatier, Toulouse (2023 - 2025)': 'University of Toulouse III - Paul Sabatier, Toulouse (2023 - 2025)',
    'Licence Informatique - Parcours MIAGE': 'Bachelor in Computer Science - MIAGE Track',
    'Université Aix-Marseille, Aix-en-Provence (2021 - 2023)': 'Aix-Marseille University, Aix-en-Provence (2021 - 2023)',
    'Compétences': 'Skills',
    'Programmation': 'Programming',
    'Développement Web': 'Web Development',
    'Gestion de Projet': 'Project Management',
    'Data Science': 'Data Science',
    'Cybersécurité': 'Cybersecurity',
    'Conception': 'Design',
    'Data Analysis': 'Data Analysis',
    'Data Base': 'Database',
    'Cloud': 'Cloud',
    'C': 'C',
    'Java': 'Java',
    'Python': 'Python',
    'R': 'R',
    'HTML': 'HTML',
    'CSS': 'CSS',
    'JavaScript': 'JavaScript',
    'Django': 'Django',
    'SCRUM': 'SCRUM',
    'GANTT': 'GANTT',
    'TOGAF': 'TOGAF',
    'ARCHIMATE': 'ARCHIMATE',
    'SQL': 'SQL',
    'NoSQL': 'NoSQL',
    'OpenSSL': 'OpenSSL',
    'RSA': 'RSA',
    'AES': 'AES',
    'MERISE': 'MERISE',
    'UML': 'UML',
    'SysML': 'SysML',
    'Tableau': 'Tableau',
    'Power BI': 'Power BI',
    'MySQL': 'MySQL',
    'Dataiku': 'Dataiku',
    'PostgreSQL': 'PostgreSQL',
    'IBM': 'IBM',
    'AWS': 'AWS',
  }
};

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
}

function applyTranslations(lang) {
  // Navbar principaux
  document.querySelectorAll('.navbar-item span').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Navbar secondaires (icônes)
  document.querySelectorAll('.navbar-icon-item').forEach(el => {
    const origTitle = el.dataset.title || el.getAttribute('title');
    if (!el.dataset.title) el.dataset.title = origTitle;
    if (translations[lang][origTitle]) el.setAttribute('title', translations[lang][origTitle]);
    else el.setAttribute('title', origTitle);
  });
  // Mobile menu
  document.querySelectorAll('.mobile-menu-item span').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Titres de section
  document.querySelectorAll('.section-header h2, .section-header h1').forEach(el => {
    let node = el.childNodes[el.childNodes.length-1];
    if (!node.dataset) node.dataset = {};
    if (!node.dataset.text) node.dataset.text = node.textContent.trim();
    const fr = node.dataset.text;
    if (translations[lang][fr]) node.textContent = ' ' + translations[lang][fr];
    else node.textContent = ' ' + fr;
  });
  // Sous-titres
  document.querySelectorAll('.section-subtitle').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Bouton CV
  const cvBtn = document.querySelector('.cv-download-btn .download-text');
  if (cvBtn) {
    if (!cvBtn.dataset.text) cvBtn.dataset.text = cvBtn.textContent.trim();
    const fr = cvBtn.dataset.text;
    if (translations[lang][fr]) cvBtn.textContent = translations[lang][fr];
    else cvBtn.textContent = fr;
  }
  // Disponibilité
  const dispo = document.querySelector('.cv-availability h4');
  if (dispo && dispo.childNodes[1]) {
    let node = dispo.childNodes[1];
    if (!node.dataset) node.dataset = {};
    if (!node.dataset.text) node.dataset.text = node.textContent.trim();
    const fr = node.dataset.text;
    if (translations[lang][fr]) node.textContent = ' ' + translations[lang][fr];
    else node.textContent = ' ' + fr;
  }
  const dispoDate = document.querySelector('.cv-availability p');
  if (dispoDate) {
    if (!dispoDate.dataset.text) dispoDate.dataset.text = dispoDate.textContent.trim();
    const fr = dispoDate.dataset.text;
    if (translations[lang][fr]) dispoDate.textContent = translations[lang][fr];
    else dispoDate.textContent = fr;
  }
  // Met à jour le label du bouton
  const langBtn = document.getElementById('lang-switch-label');
  if (langBtn) langBtn.textContent = translations[lang][lang === 'fr' ? 'FR | EN' : 'EN | FR'];
  // Traduction du texte de profil
  const profileText = document.querySelector('.cv-profile-text');
  if (profileText) {
    if (!profileText.dataset.text) profileText.dataset.text = profileText.textContent.trim();
    const fr = 'ProfilTexte';
    if (translations[lang][fr]) profileText.textContent = translations[lang][fr];
    else profileText.textContent = profileText.dataset.text;
  }
  // Traduction de la section Expérience
  // Titre principal
  document.querySelectorAll('#experience .cv-header h2').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.childNodes[el.childNodes.length-1].textContent = ' ' + translations[lang][fr];
    else el.childNodes[el.childNodes.length-1].textContent = ' ' + fr;
  });
  // Titres de poste et entreprises
  document.querySelectorAll('.cv-experience-title').forEach(el => {
    el.childNodes.forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        if (!node.dataset) node.dataset = {};
        if (!node.dataset.text) node.dataset.text = node.textContent.trim();
        const fr = node.dataset.text;
        if (translations[lang][fr]) node.textContent = translations[lang][fr];
        else node.textContent = fr;
      }
    });
  });
  document.querySelectorAll('.cv-experience-company').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Lieux et années (ne pas traduire les dates)
  document.querySelectorAll('.cv-experience-location').forEach(el => {
    // On ne traduit que le nom de la ville
    const icon = el.querySelector('i');
    let txt = el.textContent.replace(/^[^a-zA-ZÀ-ÿ]+/, '').trim();
    if (!el.dataset.text) el.dataset.text = txt;
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.innerHTML = (icon ? icon.outerHTML + ' ' : '') + translations[lang][fr];
    else el.innerHTML = (icon ? icon.outerHTML + ' ' : '') + fr;
  });
  // Descriptions (li)
  document.querySelectorAll('.cv-experience-description li').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Compétences (tags)
  document.querySelectorAll('.cv-experience-skill').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Traduction de la section Langues
  // Titre principal
  document.querySelectorAll('#langues .cv-header h2').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.childNodes[el.childNodes.length-1].textContent = ' ' + translations[lang][fr];
    else el.childNodes[el.childNodes.length-1].textContent = ' ' + fr;
  });
  // Noms des langues
  document.querySelectorAll('.cv-language-name').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Niveaux de maîtrise
  document.querySelectorAll('.cv-language-level').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Traduction de la section Certifications
  // Titre principal
  document.querySelectorAll('#certifications .cv-header h2').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.childNodes[el.childNodes.length-1].textContent = ' ' + translations[lang][fr];
    else el.childNodes[el.childNodes.length-1].textContent = ' ' + fr;
  });
  // Nom de la certification (dans le lien)
  document.querySelectorAll('#certifications h4 a').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Description de la certification
  document.querySelectorAll('#certifications p').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Traduction de la section Console SQL Interactive
  // Titre principal
  document.querySelectorAll('#sql-console .section-header h2').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.childNodes[el.childNodes.length-1].textContent = ' ' + translations[lang][fr];
    else el.childNodes[el.childNodes.length-1].textContent = ' ' + fr;
  });
  // Sous-titre
  document.querySelectorAll('#sql-console .section-subtitle').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Description de la base de données (dans le script)
  const tableHeader = document.querySelector('.table-header');
  if (tableHeader) {
    if (!tableHeader.dataset.text) tableHeader.dataset.text = tableHeader.textContent.trim();
    const fr = tableHeader.dataset.text;
    if (translations[lang][fr]) tableHeader.textContent = translations[lang][fr];
    else tableHeader.textContent = fr;
  }
  const tableDescription = document.querySelector('.table-description');
  if (tableDescription) {
    if (!tableDescription.dataset.text) tableDescription.dataset.text = tableDescription.textContent.trim();
    const fr = tableDescription.dataset.text;
    if (translations[lang][fr]) tableDescription.textContent = translations[lang][fr];
    else tableDescription.textContent = fr;
  }
  // Traduction du bouton de l'assistant
  const chatToggle = document.querySelector('#chat-toggle span');
  if (chatToggle) {
    if (!chatToggle.dataset.text) chatToggle.dataset.text = chatToggle.textContent.trim();
    const fr = chatToggle.dataset.text;
    if (translations[lang][fr]) chatToggle.textContent = translations[lang][fr];
    else chatToggle.textContent = fr;
  }
  // Traduction de la section Test My Project
  // Titre principal
  document.querySelectorAll('#demos .section-header h2').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.childNodes[el.childNodes.length-1].textContent = ' ' + translations[lang][fr];
    else el.childNodes[el.childNodes.length-1].textContent = ' ' + fr;
  });
  // Sous-titre
  document.querySelectorAll('#demos .section-subtitle').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Titres des cartes
  document.querySelectorAll('.demo-card-title').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Descriptions des cartes
  document.querySelectorAll('.demo-card-description').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Tags des cartes
  document.querySelectorAll('.demo-tag').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Boutons d'action
  document.querySelectorAll('.demo-card-action').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Traduction du GitHub Analytics Dashboard
  // Titre principal
  document.querySelectorAll('#data-analytics-container .panel-title h3').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Sous-titre
  document.querySelectorAll('#data-analytics-container .panel-subtitle').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Label username
  document.querySelectorAll('.github-username-label').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Placeholder input
  const githubUsernameInput = document.getElementById('github-username');
  if (githubUsernameInput) {
    if (!githubUsernameInput.dataset.placeholder) githubUsernameInput.dataset.placeholder = githubUsernameInput.placeholder;
    const fr = githubUsernameInput.dataset.placeholder;
    if (translations[lang][fr]) githubUsernameInput.placeholder = translations[lang][fr];
    else githubUsernameInput.placeholder = fr;
  }
  // Bouton Analyser
  document.querySelectorAll('#data-analytics-container .demo-btn').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Label type d'analyse
  document.querySelectorAll('#data-analytics-container label').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Options du select
  document.querySelectorAll('#github-data-source option').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Titres des KPIs
  document.querySelectorAll('.kpi-content h4').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Tendances des KPIs
  document.querySelectorAll('.kpi-trend').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Titres des graphiques
  document.querySelectorAll('.chart-header h4').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Titre insights
  document.querySelectorAll('.insights-header h4').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Contenu des insights
  document.querySelectorAll('.insight-item span').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Boutons de contrôle
  document.querySelectorAll('#data-analytics-container .demo-controls .demo-btn').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Traduction du Q-Learning Panel
  // Titre principal
  document.querySelectorAll('#qlearning-container .panel-title h3').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Sous-titre
  document.querySelectorAll('#qlearning-container .panel-subtitle').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Descriptions de mission
  document.querySelectorAll('#qlearning-container .intro-text p').forEach(el => {
    // Sauvegarder le HTML d'origine une seule fois
    if (!el.dataset.html) el.dataset.html = el.innerHTML.trim();
    // Toujours repartir du HTML d'origine
    let htmlOrig = el.dataset.html;
    let fr = htmlOrig.split('</strong>')[1];
    if (fr) fr = fr.trim();
    if (translations[lang][fr]) {
      if (htmlOrig.includes('Mission')) {
        el.innerHTML = '🎯 <strong>' + (lang === 'en' ? 'Mission:' : 'Mission :') + '</strong> ' + translations[lang][fr];
      } else if (htmlOrig.includes('Objectif')) {
        el.innerHTML = '🌟 <strong>' + (lang === 'en' ? 'Goal:' : 'Objectif :') + '</strong> ' + translations[lang][fr];
      } else if (htmlOrig.includes('Agent')) {
        el.innerHTML = '🤖 <strong>' + (lang === 'en' ? 'Agent:' : 'Agent :') + '</strong> ' + translations[lang][fr];
      } else {
        el.textContent = translations[lang][fr];
      }
    } else {
      el.textContent = fr;
    }
  });
  // Légende
  document.querySelectorAll('#qlearning-container .legend-item span').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Boutons de contrôle Q-Learning
  document.querySelectorAll('#qlearning-container .demo-controls .demo-btn').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Descriptions de mission Classification des Iris robustes
  document.querySelectorAll('#classification-container .intro-text p').forEach(el => {
    if (!el.dataset.html) el.dataset.html = el.innerHTML.trim();
    let htmlOrig = el.dataset.html;
    // Pour chaque <p>, on regarde si c'est Objectif, Espèces ou Algorithme
    if (htmlOrig.includes('Objectif')) {
      // Objectif : texte simple
      let fr = htmlOrig.split('</strong>')[1];
      if (fr) fr = fr.trim();
      if (translations[lang][fr]) {
        el.innerHTML = translations[lang][fr];
      } else {
        el.innerHTML = fr;
      }
    } else if (htmlOrig.includes('Espèces')) {
      // Espèces : label traduit + spans inchangés
      let labelFr = 'Espèces :';
      let labelEn = 'Species:';
      let label = (lang === 'en' ? labelEn : labelFr);
      let species = htmlOrig.match(/<span.*?setosa.*?span>.*?<span.*?versicolor.*?span>.*?<span.*?virginica.*?span>/);
      let speciesHtml = species ? species[0] : '';
      el.innerHTML = label + ' ' + speciesHtml;
    } else if (htmlOrig.includes('Algorithme')) {
      let fr = htmlOrig.split('</strong>')[1];
      if (fr) fr = fr.trim();
      if (translations[lang][fr]) {
        el.innerHTML = translations[lang][fr];
      } else {
        el.innerHTML = fr;
      }
    }
  });
  // Traduction du titre et sous-titre du panel Classification des Iris
  document.querySelectorAll('#classification-container .panel-title h3').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  document.querySelectorAll('#classification-container .panel-subtitle').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Traduction dynamique des boutons et messages Classification Iris
  document.querySelectorAll('#classification-container .panel-section-header h4').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  document.querySelectorAll('#classify-btn').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.innerHTML = `<i class='fas fa-play'></i> ${translations[lang][fr]}`;
    else el.innerHTML = `<i class='fas fa-play'></i> ${fr}`;
  });
  document.querySelectorAll('#reset-btn').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.innerHTML = `<i class='fas fa-redo'></i> ${translations[lang][fr]}`;
    else el.innerHTML = `<i class='fas fa-redo'></i> ${fr}`;
  });
  // Messages d'état
  const status = document.getElementById('classification-status');
  if (status && status.textContent.trim()) {
    const fr = status.textContent.trim();
    if (translations[lang][fr]) status.textContent = translations[lang][fr];
  }
  // Traduction dynamique de la section Éducation
  document.querySelectorAll('#education .cv-header h2').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.childNodes[el.childNodes.length-1].textContent = ' ' + translations[lang][fr];
    else el.childNodes[el.childNodes.length-1].textContent = ' ' + fr;
  });
  document.querySelectorAll('#education .cv-education-details h4, #education .cv-education-details p').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
  // Traduction dynamique de la section Compétences
  document.querySelectorAll('#competences .cv-header h2').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.childNodes[el.childNodes.length-1].textContent = ' ' + translations[lang][fr];
    else el.childNodes[el.childNodes.length-1].textContent = ' ' + fr;
  });
  document.querySelectorAll('#competences .cv-skill-category h4').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.childNodes[el.childNodes.length-1].textContent = ' ' + translations[lang][fr];
    else el.childNodes[el.childNodes.length-1].textContent = ' ' + fr;
  });
  document.querySelectorAll('#competences .cv-skill-tag').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    const fr = el.dataset.text;
    if (translations[lang][fr]) el.textContent = translations[lang][fr];
    else el.textContent = fr;
  });
}

// Gestion du clic sur le bouton
const langSwitch = document.getElementById('lang-switch');
if (langSwitch) {
  langSwitch.addEventListener('click', () => {
    const current = localStorage.getItem('lang') || 'fr';
    const next = current === 'fr' ? 'en' : 'fr';
    setLanguage(next);
  });
}

// ===============================================
// 🎯 ANIMATION DES BARRES DE PROGRESSION DES COMPÉTENCES
// ===============================================

function initializeSkillsAnimation() {
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  };

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          if (width) {
            setTimeout(() => {
              bar.style.width = width + '%';
            }, Math.random() * 500); // Animation décalée pour effet cascade
          }
        });
        
        // Animer les skill items avec délai
        const skillItems = entry.target.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(30px)';
          setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 100);
        });
        
        // Animer les tags de compétences
        const skillTags = entry.target.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
          tag.style.opacity = '0';
          tag.style.transform = 'scale(0.8)';
          setTimeout(() => {
            tag.style.transition = 'all 0.4s ease';
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
          }, index * 50);
        });
        
        skillsObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observer toutes les catégories de compétences
  const skillCategories = document.querySelectorAll('.skills-category-group');
  skillCategories.forEach(category => {
    skillsObserver.observe(category);
  });
}

// Fonction pour réinitialiser les animations lors du changement de thème
function resetSkillsAnimations() {
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach(bar => {
    bar.style.width = '0%';
  });
  
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.style.opacity = '';
    item.style.transform = '';
    item.style.transition = '';
  });
  
  const skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach(tag => {
    tag.style.opacity = '';
    tag.style.transform = '';
    tag.style.transition = '';
  });
  
  // Réinitialiser l'observer
  setTimeout(() => {
    initializeSkillsAnimation();
  }, 100);
}

// Initialiser les animations au chargement
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initializeSkillsAnimation();
  }, 1000); // Délai pour laisser le preloader se terminer
});

// Ajouter des effets de hover avancés pour les compétences
function enhanceSkillsInteraction() {
  // Effet de progression au hover
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const progressBar = item.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.transform = 'scaleY(1.2)';
        progressBar.style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.6)';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const progressBar = item.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.transform = 'scaleY(1)';
        progressBar.style.boxShadow = 'none';
      }
    });
  });
  
  // Effet de pulsation pour les tags de niveau expert
  const expertTags = document.querySelectorAll('.skill-tag.expert');
  expertTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.animation = 'pulse 0.6s ease-in-out';
    });
    
    tag.addEventListener('mouseleave', () => {
      tag.style.animation = '';
    });
  });
}

// Initialiser les interactions avancées
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    enhanceSkillsInteraction();
  }, 1500);
});

// Animation CSS pour le pulse
const pulseKeyframes = `
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
`;

// Ajouter les keyframes au document
if (!document.querySelector('#pulse-animation')) {
  const style = document.createElement('style');
  style.id = 'pulse-animation';
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}

// Applique la langue au chargement
window.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('lang') || 'fr';
  setLanguage(lang);
});
// === FIN TRADUCTION ===

// === Avatar dynamique selon le thème ===
function updateAvatarByTheme() {
  const avatar = document.getElementById('main-avatar');
  if (!avatar) return;
  if (document.body.classList.contains('dark-theme')) {
    avatar.src = 'images/Photo_dark.png';
  } else if (document.body.classList.contains('pastel-theme')) {
    avatar.src = 'images/Photo.jpg';
  } else {
    avatar.src = 'images/Photo_light.png';
  }
}

// Applique au chargement
window.addEventListener('DOMContentLoaded', updateAvatarByTheme);
// Applique lors du switch de thème
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle && !themeToggle._avatarBound) {
  themeToggle._avatarBound = true;
  themeToggle.addEventListener('click', () => {
    setTimeout(updateAvatarByTheme, 100);
  });
}
// === Fin avatar dynamique ===

document.addEventListener('DOMContentLoaded', function() {
  resetClassification();
});