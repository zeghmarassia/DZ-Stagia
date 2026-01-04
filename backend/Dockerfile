# Utiliser Node.js comme image de base
FROM node:18-alpine

# Créer le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
# Note: assurez-vous d'avoir un fichier package.json dans backend/ plus tard
COPY package*.json ./

# Installer les dépendances (ignoré si le fichier package.json n'existe pas encore)
RUN npm install || true

# Copier le reste du code
COPY . .

# Port exposé pour l'API
EXPOSE 5000

# Commande par défaut (à adapter selon votre fichier principal, ex: server.js)
CMD ["npm", "start"]