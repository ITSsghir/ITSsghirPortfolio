#!/bin/bash

echo "🚀 Déploiement du Portfolio ITSsghir avec Traefik"
echo "================================================"

# Vérifier que Traefik fonctionne
echo "📋 Vérification des prérequis..."

# Vérifier le réseau proxy
if ! docker network ls | grep -q proxy; then
    echo "❌ Le réseau 'proxy' n'existe pas. Création..."
    docker network create proxy
else
    echo "✅ Réseau 'proxy' trouvé"
fi

# Vérifier que Traefik fonctionne
if ! docker ps | grep -q traefik; then
    echo "⚠️  Traefik ne semble pas fonctionner. Assurez-vous qu'il soit démarré."
    echo "   Vous pouvez le démarrer avec : cd ../traefik && docker compose -f ../docker/docker-compose.yml up -d"
else
    echo "✅ Traefik est actif"
fi

echo ""
echo "🏗️  Construction et démarrage des services..."

# Arrêter les anciens conteneurs s'ils existent
docker compose -f ../docker/docker-compose.yml down

# Construire et démarrer
docker compose -f ../docker/docker-compose.yml up --build -d

echo ""
echo "📊 Statut des services :"
docker compose -f ../docker/docker-compose.yml ps

echo ""
echo "🌐 Accès aux services :"
echo "   Frontend : https://anas.itssghir.com"
echo "   API Backend : 🔒 Interne seulement (sécurisé)"
echo ""
echo "📝 Pour voir les logs :"
echo "   docker compose -f ../docker/docker-compose.yml logs -f frontend"
echo "   docker compose -f ../docker/docker-compose.yml logs -f backend"
echo ""
echo "✅ Déploiement terminé !" 