const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat');
const githubRoutes = require('./routes/github');

// Charger les variables d'environnement depuis la racine du backend
const envPath = path.join(__dirname, '..', '.env');
console.log('Trying to load .env from:', envPath);
dotenv.config({ path: envPath });

// Vérifier si la clé API est disponible
console.log('Environment variables loaded:');
console.log('- OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('- OPENAI_API_KEY length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
console.log('- PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // En développement, accepter toutes les origines
    credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/github', githubRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend API is running',
        envPath: envPath,
        apiKeyExists: !!process.env.OPENAI_API_KEY,
        apiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        apiKeyExists: !!process.env.OPENAI_API_KEY,
        apiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/health`);
}); 