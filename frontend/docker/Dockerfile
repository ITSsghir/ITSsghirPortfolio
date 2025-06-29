# Utiliser nginx directement pour servir les fichiers statiques
FROM nginx:alpine as production-stage

# Copier tous les fichiers statiques
COPY . /usr/share/nginx/html

# Copier les assets dans les bons répertoires
COPY assets/images/ /usr/share/nginx/html/images/
COPY assets/cv.pdf /usr/share/nginx/html/cv.pdf

# Copier la configuration nginx personnalisée
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"] 