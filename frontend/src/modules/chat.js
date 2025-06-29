class ChatBot {
    constructor() {
        this.createChatInterface();
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;
        
        // Initialiser le contexte audio
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    createChatInterface() {
        // Créer le bouton de chat
        const chatButton = document.createElement('div');
        chatButton.className = 'chat-button';
        chatButton.innerHTML = '<i class="fas fa-robot"></i>';
        document.body.appendChild(chatButton);

        // Créer la fenêtre de chat
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <h3><i class="fas fa-robot"></i> Assistant IA</h3>
                <button class="close-chat"><i class="fas fa-times"></i></button>
            </div>
            <div class="welcome-message">
                Je suis là pour répondre à vos questions sur le profil d'Anas !
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <input type="text" placeholder="Posez votre question...">
                <button class="send-message" disabled>
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        document.body.appendChild(chatWindow);

        // Ajouter les événements
        chatButton.addEventListener('click', () => this.toggleChat());
        chatWindow.querySelector('.close-chat').addEventListener('click', () => this.toggleChat());
        
        const input = chatWindow.querySelector('.chat-input input');
        const sendButton = chatWindow.querySelector('.send-message');
        
        input.addEventListener('input', (e) => {
            sendButton.disabled = !e.target.value.trim();
        });
        
        sendButton.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !sendButton.disabled) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.chatWindow = chatWindow;
        this.chatButton = chatButton;
        this.messagesContainer = chatWindow.querySelector('.chat-messages');
        this.input = input;
        this.sendButton = sendButton;

        // Message de bienvenue
        setTimeout(() => {
            this.addMessage('bot', 'Bonjour ! Je suis l\'assistant IA d\'Anas. Comment puis-je vous aider ?');
        }, 500);
    }

    playToggleSound(isOpening) {
        // Vérifier si le son est désactivé via le soundManager
        if (soundManager && soundManager.isMuted) return;

        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode1 = this.audioContext.createGain();
        const gainNode2 = this.audioContext.createGain();

        oscillator1.connect(gainNode1);
        oscillator2.connect(gainNode2);
        gainNode1.connect(this.audioContext.destination);
        gainNode2.connect(this.audioContext.destination);

        if (isOpening) {
            // Son d'ouverture : montée
            oscillator1.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);
            oscillator2.frequency.setValueAtTime(900, this.audioContext.currentTime);
            oscillator2.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.2);
        } else {
            // Son de fermeture : descente
            oscillator1.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.2);
            oscillator2.frequency.setValueAtTime(1200, this.audioContext.currentTime);
            oscillator2.frequency.exponentialRampToValueAtTime(900, this.audioContext.currentTime + 0.2);
        }

        oscillator1.type = 'sine';
        oscillator2.type = 'triangle';

        gainNode1.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode2.gain.setValueAtTime(0.05, this.audioContext.currentTime);

        gainNode1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.3);
        oscillator2.stop(this.audioContext.currentTime + 0.3);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        
        // Jouer le son correspondant
        this.playToggleSound(this.isOpen);
        
        if (this.isOpen) {
            this.chatWindow.style.display = 'flex';
            requestAnimationFrame(() => {
                this.chatWindow.classList.add('active');
                this.input.focus();
            });
        } else {
            this.chatWindow.classList.remove('active');
            setTimeout(() => {
                this.chatWindow.style.display = 'none';
            }, 300);
        }
    }

    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Désactiver l'input et le bouton pendant l'envoi
        this.input.disabled = true;
        this.sendButton.disabled = true;

        // Ajouter le message de l'utilisateur
        this.addMessage('user', message);
        this.input.value = '';

        // Montrer l'indicateur de frappe
        this.showTypingIndicator();

        try {
            // Envoyer le message au backend via le proxy nginx
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Erreur de communication avec le serveur');
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Petit délai pour une expérience plus naturelle
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Supprimer l'indicateur de frappe et ajouter la réponse
            this.removeTypingIndicator();
            this.addMessage('bot', data.message, data.type);
        } catch (error) {
            console.error('Erreur:', error);
            this.removeTypingIndicator();
            this.addMessage('error', error.message || 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.');
        } finally {
            // Réactiver l'input et le bouton
            this.input.disabled = false;
            this.sendButton.disabled = false;
            this.input.focus();
        }
    }

    addMessage(type, content, responseType = null) {
        const messageDiv = document.createElement('div');
        let className = `chat-message ${type}-message`;
        
        // Ajouter une classe spéciale pour les réponses personnelles
        if (type === 'bot' && responseType === 'personal') {
            className += ' personal-response';
        } else if (type === 'bot' && responseType === 'general') {
            className += ' general-response';
        }
        
        messageDiv.className = className;
        
        const icon = type === 'user' ? 'user' : (type === 'error' ? 'exclamation-triangle' : 'robot');
        let iconColor = '';
        
        // Couleurs différentes selon le type de réponse
        if (type === 'bot' && responseType === 'personal') {
            iconColor = 'style="color: #4a90e2;"'; // Bleu pour personnel
        } else if (type === 'bot' && responseType === 'general') {
            iconColor = 'style="color: #50c878;"'; // Vert pour général
        }
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${icon}" ${iconColor}></i>
                ${content}
                ${responseType ? `<span class="response-type">${responseType === 'personal' ? '👤' : '🌍'}</span>` : ''}
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Ne pas initialiser automatiquement - laissez le script principal le faire
console.log('ChatBot class loaded successfully'); 