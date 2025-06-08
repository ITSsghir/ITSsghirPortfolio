const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = new OpenAI({
    apiKey: apiKey
});

const SYSTEM_PROMPT = `Tu es un assistant virtuel pour le portfolio d'Anas Sghir. 
Tu as accès à toutes les informations sur son profil, ses compétences et son expérience.
Réponds de manière professionnelle et concise aux questions sur son parcours.
Informations principales:
- Data Scientist & ML Engineer
- Expert en Python, TensorFlow, PyTorch
- Certifié Dataiku Core Designer
- Formation: Master MIAGE
- Expérience en IA et automatisation`;

router.post('/message', async (req, res) => {
    try {
        const { message } = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: SYSTEM_PROMPT
                },
                { role: "user", content: message }
            ],
            max_tokens: 150
        });

        res.json({
            message: completion.choices[0].message.content
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Error processing your message',
            details: error.message 
        });
    }
});

module.exports = router; 