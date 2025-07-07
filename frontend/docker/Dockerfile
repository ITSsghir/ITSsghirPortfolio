# Utiliser l'image nginx officielle
FROM nginx:alpine

# Copier les fichiers du frontend
COPY . /usr/share/nginx/html/

# Copier la configuration nginx personnalisée
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"] 