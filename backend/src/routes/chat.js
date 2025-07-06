const express = require('express');
const router = express.Router();
const IntelligentChat = require('../services/intelligentChat');

// Initialiser le service de chat intelligent
const chatService = new IntelligentChat();

console.log('[ChatRouter] Service de chat intelligent initialisé');
console.log('[ChatRouter] Stats:', chatService.getStats());

// Middleware de validation des requêtes
function validateChatRequest(req, res, next) {
    const { message } = req.body;
    
    // Validation de base
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ 
            error: 'Message invalide',
            details: 'Le message doit être une chaîne de caractères non vide'
        });
    }
    
    // Nettoyage du message
    const cleanMessage = message.trim();
    if (cleanMessage.length === 0) {
            return res.status(400).json({ 
            error: 'Message vide',
                details: 'Le message ne peut pas être vide'
            });
        }
        
    if (cleanMessage.length > 1000) {
            return res.status(400).json({ 
                error: 'Message trop long',
                details: 'Le message ne peut pas dépasser 1000 caractères'
            });
        }

    // Ajouter le message nettoyé à la requête
    req.cleanMessage = cleanMessage;
    next();
}

// Route principale pour les messages de chat
router.post('/message', validateChatRequest, async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { cleanMessage } = req;
        
        console.log(`[ChatAPI] Nouveau message reçu: "${cleanMessage}"`);
        
        // Traiter le message avec le service intelligent
        const result = await chatService.processMessage(cleanMessage);
        
        const processingTime = Date.now() - startTime;
        console.log(`[ChatAPI] Réponse générée en ${processingTime}ms`);
        
        // Répondre avec la même structure que l'ancien système
        res.json({
            message: result.message,
            type: result.type,
            confidence: result.confidence,
            processingTime: processingTime
        });
        
    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error('[ChatAPI] Erreur lors du traitement:', error);
        
        // Réponse d'erreur gracieuse
        res.status(500).json({ 
            error: 'Désolé, une erreur technique est survenue. Veuillez réessayer.',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne',
            processingTime: processingTime
        });
    }
});

// Route de test pour la détection de type de question (conservée pour compatibilité)
router.post('/detect', validateChatRequest, async (req, res) => {
    try {
        const { cleanMessage } = req;
        
        // Utiliser directement la méthode de détection
        const detection = chatService.detectQuestionType(cleanMessage.toLowerCase());
        
        res.json({
            message: cleanMessage,
            isPersonalQuestion: detection.type === 'personal',
            type: detection.type,
            category: detection.category,
            confidence: detection.confidence,
            systemPromptPreview: `Type détecté: ${detection.type}, Catégorie: ${detection.category || 'N/A'}`
        });
        
    } catch (error) {
        console.error('[ChatAPI] Erreur détection:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la détection du type de question',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
        });
    }
});

// Route de santé pour vérifier le statut du service
router.get('/health', (req, res) => {
    const stats = chatService.getStats();
    
    res.json({
        status: 'healthy',
        service: 'Intelligent Chat Service',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        stats: stats,
        capabilities: [
            'Personal questions about Anas',
            'General conversation',
            'Smart response generation',
            'Context awareness',
            'Anti-repetition system'
        ]
    });
});

// Route de statistiques (pour debugging/monitoring)
router.get('/stats', (req, res) => {
    const stats = chatService.getStats();
    res.json(stats);
});

// Middleware de gestion d'erreurs pour ce routeur
router.use((error, req, res, next) => {
    console.error('[ChatRouter] Erreur non gérée:', error);
    res.status(500).json({
        error: 'Erreur du service de chat',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
    });
});

module.exports = router; 