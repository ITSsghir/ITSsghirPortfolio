class ChatBot {
    constructor() {
        this.createChatInterface();
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;
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

    toggleChat() {
        this.isOpen = !this.isOpen;
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
            // Envoyer le message au backend
            const response = await fetch('http://localhost:3000/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Erreur de communication avec le serveur');
            }

            const data = await response.json();
            
            // Petit délai pour une expérience plus naturelle
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Supprimer l'indicateur de frappe et ajouter la réponse
            this.removeTypingIndicator();
            this.addMessage('bot', data.message);
        } catch (error) {
            console.error('Erreur:', error);
            this.removeTypingIndicator();
            this.addMessage('error', 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.');
        } finally {
            // Réactiver l'input et le bouton
            this.input.disabled = false;
            this.sendButton.disabled = false;
            this.input.focus();
        }
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        const icon = type === 'user' ? 'user' : 'robot';
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${icon}"></i>
                ${content}
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Ne pas initialiser automatiquement - laissez le script principal le faire
console.log('ChatBot class loaded successfully'); 