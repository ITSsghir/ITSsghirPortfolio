const { ANAS_PROFILE, FREQUENT_QUESTIONS, GENERAL_RESPONSES } = require('../data/anasProfile');

class IntelligentChat {
    constructor() {
        this.lastResponses = new Map(); // Pour éviter les répétitions
    }

    // Fonction principale de traitement
    async processMessage(message) {
        const cleanMessage = this.cleanMessage(message);
        const questionType = this.detectQuestionType(cleanMessage);
        
        console.log(`[IntelligentChat] Message: "${message}"`);
        console.log(`[IntelligentChat] Type détecté: ${questionType.type} (score: ${questionType.confidence})`);
        
        let response;
        let responseType;

        if (questionType.type === 'personal' && questionType.confidence > 0.08) {
            response = this.generatePersonalResponse(cleanMessage, questionType.category);
            responseType = 'personal';
        } else if (questionType.type === 'greeting' || questionType.type === 'help' || questionType.type === 'thanks') {
            response = this.generateGeneralResponse(cleanMessage, questionType.type);
            responseType = 'general';
        } else {
            response = this.generateFallbackResponse();
            responseType = 'general';
        }

        // Éviter les répétitions
        response = this.avoidRepetition(response, message);
        
        console.log(`[IntelligentChat] Réponse générée: "${response.substring(0, 50)}..."`);
        
        return {
            message: response,
            type: responseType,
            confidence: questionType.confidence
        };
    }

    // Nettoyer le message
    cleanMessage(message) {
        return message.toLowerCase()
            .trim()
            .replace(/[^\w\s\-àâäéèêëïîôöùûüÿç]/g, ' ')
            .replace(/\s+/g, ' ');
    }

    // Détecter le type de question avec score de confiance
    detectQuestionType(message) {
        const words = message.split(' ');
        let bestMatch = { type: 'unknown', category: null, confidence: 0 };

        // Vérifier les questions personnelles par mots-clés en PREMIER (avec tous les nouveaux mots-clés)
        for (const [category, data] of Object.entries(FREQUENT_QUESTIONS)) {
            const score = this.calculateMatchScore(message, data.keywords);
            if (score > 0.05 && score > bestMatch.confidence) { // Seuil très bas pour être plus permissif
                bestMatch = { type: 'personal', category, confidence: score };
            }
        }

        // Patterns spéciaux pour améliorer la détection (garder pour compatibilité)
        const personalPatterns = [
            { pattern: /compétences?|skills?|savoir[- ]faire|expertise/i, category: 'skills' },
            { pattern: /expérience|travail|stage|banque postale|shl|freelance/i, category: 'experience' },
            { pattern: /formation|études?|diplôme|université|miage|toulouse|master|licence/i, category: 'formation' },
            { pattern: /contact|email|cv|recrutement|embauche|recruter/i, category: 'contact' },
            { pattern: /dataiku|certification/i, category: 'dataiku' },
            { pattern: /python|tensorflow|pytorch|sql|tableau|power bi/i, category: 'skills' },
            { pattern: /projets?|application|carbone|empreinte|reconnaissance|vocale/i, category: 'projects' },
            { pattern: /disponible|disponibilité|emploi|job|poste|recruter|embauche/i, category: 'availability' },
            { pattern: /âge|age|années|vieux|jeune|né|naissance/i, category: 'personal_details' },
            { pattern: /où|ou|lieu|ville|habite|vis|résides|toulouse|marseille|france/i, category: 'location' },
            { pattern: /mec|gars|type|personne|site|portfolio|profil/i, category: 'casual_references' }
        ];

        // Vérifier les patterns personnels
        for (const {pattern, category} of personalPatterns) {
            if (pattern.test(message)) {
                return { type: 'personal', category, confidence: 0.9 };
            }
        }

        // Vérifier les réponses générales
        for (const [category, data] of Object.entries(GENERAL_RESPONSES)) {
            if (category === 'unknown') continue;
            const score = this.calculateMatchScore(message, data.keywords);
            if (score > bestMatch.confidence) {
                bestMatch = { type: category, category, confidence: score };
            }
        }

        // Si confiance trop faible pour personnel, classer comme général
        if (bestMatch.type === 'personal' && bestMatch.confidence < 0.08) { // Seuil très bas
            bestMatch = { type: 'unknown', category: null, confidence: 0 };
        }

        return bestMatch;
    }

    // Calculer le score de correspondance amélioré
    calculateMatchScore(message, keywords) {
        let score = 0;
        let maxPossibleScore = 0;
        
        for (const keyword of keywords) {
            const keywordLower = keyword.toLowerCase();
            maxPossibleScore += 1.0;
            
            // Correspondance exacte
            if (message === keywordLower) {
                score += 1.0;
                continue;
            }
            
            // Correspondance complète dans la phrase
            if (message.includes(keywordLower)) {
                // Bonus si le mot-clé est un mot complet
                const messageWords = message.split(' ');
                const keywordWords = keywordLower.split(' ');
                
                if (keywordWords.length === 1) {
                    if (messageWords.includes(keywordLower)) {
                        score += 1.0; // Mot exact trouvé
                    } else {
                        score += 0.8; // Contenu mais pas mot exact
                    }
                } else {
                    // Expression multi-mots
                    score += 0.9;
                }
                continue;
            }
            
            // Correspondance partielle pour variations orthographiques
            const keywordWords = keywordLower.split(' ');
            let partialScore = 0;
            
            for (const keywordWord of keywordWords) {
                for (const messageWord of message.split(' ')) {
                    // Correspondance partielle (ex: "tes" matches "t'es", "tu es")
                    if (this.isPartialMatch(messageWord, keywordWord)) {
                        partialScore += 0.6 / keywordWords.length;
                    }
                }
            }
            
            score += partialScore;
        }
        
        return Math.min(score / maxPossibleScore, 1.0);
    }
    
    // Vérifier correspondance partielle pour gérer les variations
    isPartialMatch(messageWord, keywordWord) {
        // Supprimer apostrophes et caractères spéciaux pour comparaison
        const cleanMessage = messageWord.replace(/[''`]/g, '');
        const cleanKeyword = keywordWord.replace(/[''`]/g, '');
        
        // Correspondances exactes après nettoyage
        if (cleanMessage === cleanKeyword) return true;
        
        // Variations courantes
        const variations = [
            ['tes', 'tu es', 't\'es', 'tu_es'],
            ['qui', 'qui_es', 'qui_tu'],
            ['comment', 'comment_tu', 'comment_ca'],
            ['quest', 'qu\'est', 'qu_est', 'quoi'],
            ['ton', 'ta', 'tes', 'votre', 'vos'],
            ['ou', 'où'],
            ['etudes', 'études'],
            ['age', 'âge']
        ];
        
        for (const group of variations) {
            if (group.includes(cleanMessage) && group.includes(cleanKeyword)) {
                return true;
            }
        }
        
        // Correspondance de sous-chaîne pour mots longs
        if (cleanKeyword.length > 4 && cleanMessage.includes(cleanKeyword.substring(0, 4))) {
            return true;
        }
        
        return false;
    }

    // Générer une réponse personnelle sur Anas
    generatePersonalResponse(message, category) {
        const questionData = FREQUENT_QUESTIONS[category];
        if (!questionData) {
            return this.generateFallbackPersonalResponse();
        }

        // Choisir une réponse aléatoire
        const responses = questionData.responses;
        const randomIndex = Math.floor(Math.random() * responses.length);
        let response = responses[randomIndex];

        // Ajouter des détails contextuels selon la question
        response = this.enrichResponse(response, message, category);
        
        return response;
    }

    // Enrichir la réponse avec des détails contextuels
    enrichResponse(response, message, category) {
        // Ajouter des détails spécifiques selon le contexte
        if (category === 'skills' && message.includes('python')) {
            response += " J'ai une expertise particulière en Python pour la Data Science et le Machine Learning.";
        }
        
        if (category === 'experience' && message.includes('stage')) {
            response += " Mon stage actuel me permet d'appliquer concrètement mes compétences en Data Engineering.";
        }
        
        if (category === 'formation' && message.includes('pourquoi')) {
            response += " J'ai choisi MIAGE pour sa double compétence technique et managériale, idéale pour la Data Science.";
        }

        return response;
    }

    // Générer une réponse générale
    generateGeneralResponse(message, type) {
        const responseData = GENERAL_RESPONSES[type];
        if (!responseData) {
            return GENERAL_RESPONSES.unknown.responses[0];
        }

        const responses = responseData.responses;
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }

    // Réponse par défaut pour questions personnelles non reconnues
    generateFallbackPersonalResponse() {
        const fallbacks = [
            "C'est une excellente question sur Anas ! Pour vous aider mieux, essayez une de ces questions précises :\n\n🎯 **Questions détaillées :**\n• \"Tes compétences en Python ?\"\n• \"Ton rôle à La Banque Postale ?\"\n• \"Tes projets en IA ?\"\n• \"Pourquoi Dataiku ?\"\n• \"Ton Master MIAGE ?\"\n\n💬 **Ou reformulez votre question** pour que je puisse mieux vous renseigner !",
            
            "Je veux vous donner la meilleure information sur Anas ! Voici des suggestions selon votre intérêt :\n\n🏢 **Côté professionnel :**\n• \"Ton stage actuel ?\"\n• \"Tes responsabilités ?\"\n• \"Tes outils de travail ?\"\n\n🎓 **Côté formation :**\n• \"Tes études ?\"\n• \"Pourquoi MIAGE ?\"\n• \"Tes certifications ?\"\n\n💻 **Côté technique :**\n• \"Tes langages de programmation ?\"\n• \"Tes frameworks ?\"\n• \"Machine Learning ?\"\n\nQuelle direction vous intéresse le plus ?",
            
            "Anas a effectivement un parcours riche ! Laissez-moi vous guider vers les bonnes questions :\n\n📊 **Data Science :**\n• \"Tes compétences en Data Science ?\"\n• \"Python ou R ?\"\n• \"TensorFlow et PyTorch ?\"\n\n🏦 **Expérience bancaire :**\n• \"La Banque Postale ?\"\n• \"Product Owner ?\"\n• \"Data Engineer ?\"\n\n🚀 **Projets innovants :**\n• \"Application empreinte carbone ?\"\n• \"Reconnaissance vocale ?\"\n• \"Tes autres projets ?\"\n\nChoisissez ce qui vous passionne le plus !"
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Réponse de fallback général
    generateFallbackResponse() {
        return GENERAL_RESPONSES.unknown.responses[Math.floor(Math.random() * GENERAL_RESPONSES.unknown.responses.length)];
    }

    // Éviter les répétitions de réponses
    avoidRepetition(response, originalMessage) {
        const key = originalMessage.toLowerCase().substring(0, 20);
        
        if (this.lastResponses.has(key)) {
            const lastResponse = this.lastResponses.get(key);
            if (lastResponse === response) {
                // Générer une variation
                return this.generateResponseVariation(response);
            }
        }
        
        this.lastResponses.set(key, response);
        
        // Nettoyer la cache si trop grande
        if (this.lastResponses.size > 50) {
            const firstKey = this.lastResponses.keys().next().value;
            this.lastResponses.delete(firstKey);
        }
        
        return response;
    }

    // Générer une variation de réponse
    generateResponseVariation(originalResponse) {
        const variations = [
            `Pour compléter ma réponse précédente : ${originalResponse}`,
            `Comme je le mentionnais : ${originalResponse}`,
            `En effet, ${originalResponse.toLowerCase()}`,
            `Exactement ! ${originalResponse}`
        ];
        
        return variations[Math.floor(Math.random() * variations.length)];
    }

    // Obtenir des statistiques de performance
    getStats() {
        return {
            cacheSize: this.lastResponses.size,
            availableCategories: Object.keys(FREQUENT_QUESTIONS),
            totalPreDefinedResponses: Object.values(FREQUENT_QUESTIONS)
                .reduce((sum, cat) => sum + cat.responses.length, 0)
        };
    }
}

module.exports = IntelligentChat; 