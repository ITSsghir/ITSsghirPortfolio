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



       // Initialisation de la base de données SQL.js
   let db;
   const tableList = document.getElementById("table-list");

   initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` })
     .then(SQL => {
       db = new SQL.Database();
       db.run(`CREATE TABLE Utilisateur (id INTEGER PRIMARY KEY, nom TEXT);
               INSERT INTO Utilisateur VALUES (1, 'Itssghir');
               CREATE TABLE Competences (id INTEGER PRIMARY KEY, nom TEXT);
               INSERT INTO Competences VALUES 
                 (1, 'Python'), (2, 'Machine Learning'),
                 (3, 'Deep Learning'), (4, 'Data Analysis');
               CREATE TABLE Experiences (
                 id INTEGER PRIMARY KEY,
                 poste TEXT,
                 entreprise TEXT,
                 duree TEXT
               );
               INSERT INTO Experiences VALUES
                 (1, 'Data Scientist', 'TechCorp', '2022-2024'),
                 (2, 'ML Engineer', 'AI StartUp', '2020-2022');`);

       const res = db.exec("SELECT name FROM sqlite_master WHERE type='table';");
       const tableNames = res[0].values.map(row => row[0]);
       tableList.textContent = "📂 Tables disponibles : " + tableNames.join(", ");
     });
   // Fonction pour exécuter une requête SQL
   function runSQL() {
     const output = document.getElementById("sql-output");
     const input = document.getElementById("sql-input").value;
     try {
       const results = db.exec(input);
       output.textContent = results.length > 0 
         ? results.map(r => `${r.columns.join(" | ")}\n${r.values.map(v => v.join(" | ")).join("\n")}`).join("\n\n")
         : "✔️ Requête exécutée avec succès.";
     } catch (e) {
       output.textContent = "❌ Erreur : " + e.message;
     }
   }

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

async function generateImage() {
 const prompt = document.getElementById('gbt-prompt').value.trim();
 const status = document.getElementById('image-status');
 const result = document.getElementById('image-result');

 if (!prompt) {
   status.innerHTML = '<div class="loading-message">❗ Veuillez entrer un prompt.</div>';
   return;
 }

 status.innerHTML = '<div class="loading-message">🖌️ Génération de l’image en cours...</div>';
 result.innerHTML = '';

 try {
   const response = await fetch("https://api.openai.com/v1/images/generations", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "Authorization": "Token" // Remplace par ta vraie clé secrète API
     },
     body: JSON.stringify({
       model: "dall-e-3",
       prompt: prompt,
       n: 1,
       size: "1024x1024"
     })
   });

   const data = await response.json();

   if (data.error) {
     status.innerHTML = `<span style="color:red;">❌ Erreur: ${data.error.message}</span>`;
   } else {
     const imageUrl = data.data[0].url;
     result.innerHTML = `<img src="${imageUrl}" alt="Image générée par l'IA" style="max-width:100%; border-radius:12px;">`;
     status.innerHTML = '<div style="color:#00ffcc">✅ Image générée avec succès !</div>';
   }

 } catch (error) {
   status.innerHTML = `<span style="color:red;">❌ Erreur: ${error.message}</span>`;
 }
}
