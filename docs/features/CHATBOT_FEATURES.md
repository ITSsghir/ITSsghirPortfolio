# 🤖 Système de Chatbot Intelligent

## 🎯 Nouvelles Fonctionnalités

Votre chatbot peut maintenant répondre à **deux types de questions** :

### 👤 Questions Personnelles (sur Anas Sghir)
- **Détection automatique** des questions vous concernant
- **Réponses personnalisées** basées sur votre CV et profil
- **Réponses à la première personne** ("Je suis...", "J'ai étudié...")

**Exemples :**
- "Qui es-tu ?" → Réponse personnalisée d'Anas
- "Quel est ton parcours ?" → Détails sur la formation et expérience
- "Quelles sont tes compétences ?" → Liste des compétences techniques
- "Parle-moi de ton expérience chez La Banque Postale" → Détails du stage

### 🌍 Questions Générales (Culture générale)
- **Réponses d'assistant IA** sur tous sujets
- **Connaissances générales** illimitées
- **Assistant intelligent** pour questions diverses

**Exemples :**
- "Qui est le roi du Maroc ?" → Mohammed VI
- "Quelle est la capitale de la France ?" → Paris
- "Comment faire un bon café ?" → Conseils pratiques
- "Explique-moi l'intelligence artificielle" → Explication technique

## ⚡ Détection Intelligente

Le système détecte automatiquement le type de question grâce à :

### 🔍 Mots-clés personnels
```javascript
'anas', 'sghir', 'ton', 'votre', 'vous', 'toi', 'parcours', 
'profil', 'expérience', 'compétences', 'formation', 'étude', 
'université', 'stage', 'projet', 'cv', 'diplôme', 'certification', 
'miage', 'toulouse', 'banque postale', 'dataiku', 'portfolio'
```

### 💬 Questions directes
- "Qui es-tu ?" / "Qui êtes-vous ?"
- "Présente-toi" / "Présentez-vous"

## 🎨 Interface Visuelle

### 🏷️ Indicateurs de type
- **👤 Icône personne** : Réponse personnelle
- **🌍 Icône monde** : Réponse générale

### 🎨 Codes couleur
- **Bleu (#4a90e2)** : Questions personnelles
- **Vert (#50c878)** : Questions générales

### 📱 Bordures colorées
- **Bordure bleue** pour réponses personnelles
- **Bordure verte** pour réponses générales

## 🔧 API Endpoints

### `/api/chat/message` (Existant amélioré)
```json
POST /api/chat/message
{
  "message": "Votre question"
}

Response:
{
  "message": "Réponse du chatbot",
  "type": "personal|general"
}
```

### `/api/chat/detect` (Nouveau)
```json
POST /api/chat/detect
{
  "message": "Votre question"
}

Response:
{
  "message": "Question testée",
  "isPersonalQuestion": true/false,
  "type": "personal|general",
  "systemPromptPreview": "Aperçu du prompt..."
}
```

## 📊 Profil d'Anas Intégré

### 📋 Informations personnelles
- **Nom :** Anas Sghir
- **Statut :** Étudiant en Master 2 MIAGE
- **Spécialisation :** Ingénierie des Données et Protection (IDP)
- **Université :** Toulouse III - Paul Sabatier
- **Disponibilité :** À partir de septembre 2025

### 💻 Compétences techniques
- **Programmation :** C, Java, Python, R
- **Web :** HTML, CSS, JavaScript, Django
- **Data :** SQL, NoSQL, Tableau, Power BI
- **Cloud :** IBM, AWS
- **Bases de données :** MySQL, PostgreSQL, MongoDB

### 🎓 Formation
- **Master 2 MIAGE - IDP** (2023-2025) - Université Toulouse III
- **Licence Informatique MIAGE** (2021-2023) - Université Aix-Marseille

### 💼 Expérience
1. **Stage Product Owner / Data Engineer** - La Banque Postale (2025)
2. **Projet académique** - Université Toulouse III (2023-2024)
3. **Alternance Chef de Projet IT** - SHL, Marseille (2022-2023)
4. **Freelance Web** - Aix-en-Provence (2021-2022)

## 🧪 Test du Système

### 📄 Page de test disponible
- **URL :** `https://anas.itssghir.com/test-chat.html`
- **Tests prédéfinis** pour questions personnelles et générales
- **Tests personnalisés** avec champ libre
- **Visualisation** des types détectés

### 🔨 Scripts de test
- `test_chatbot.sh` : Tests en ligne de commande
- `test_chatbot.js` : Tests avec Node.js

## 🚀 Utilisation

1. **Visitez** votre portfolio : `https://anas.itssghir.com`
2. **Cliquez** sur l'icône de chat (coin inférieur droit)
3. **Posez** des questions personnelles ou générales
4. **Observez** les indicateurs visuels de type de réponse

### Exemples concrets :

**Questions personnelles :**
```
"Présente-toi"
"Quel est ton parcours universitaire ?"
"Quelles sont tes compétences en Data Science ?"
"Parle-moi de ton stage à La Banque Postale"
```

**Questions générales :**
```
"Qui est le roi du Maroc ?"
"Comment fonctionne l'intelligence artificielle ?"
"Quelle est la meilleure façon d'apprendre Python ?"
"Explique-moi le machine learning"
```

## 🔄 Système de Prompts

### 📝 Prompt Personnel
```
Tu es l'assistant virtuel d'Anas Sghir. Tu connais parfaitement son profil...
- Réponds à la première personne quand tu parles d'Anas
- Sois précis et utilise les vraies informations du profil
- Reste professionnel mais chaleureux
```

### 📝 Prompt Général
```
Tu es un assistant IA intelligent et serviable...
- Connaissances générales (géographie, histoire, sciences)
- Questions culturelles
- Conseils pratiques
- Explications techniques
```

---

*Système développé pour offrir une expérience de chat personnalisée et intelligente sur le portfolio d'Anas Sghir.* 