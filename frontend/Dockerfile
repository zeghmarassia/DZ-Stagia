# Image de base
FROM node:18-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

# Lancer l'application
CMD ["npm", "start"]