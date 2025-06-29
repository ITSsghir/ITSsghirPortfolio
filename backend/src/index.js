const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat');

// Charger les variables d'environnement
dotenv.config();

console.log('Environment variables loaded:');
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

// Route de test
app.get('/', (req, res) => {
    res.json({ 
        message: 'Portfolio Backend API is running',
        service: 'Intelligent Chat System',
        version: '2.0.0'
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        service: 'Portfolio Backend',
        version: '2.0.0',
        chatSystem: 'Intelligent (OpenAI-free)'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/health`);
}); 