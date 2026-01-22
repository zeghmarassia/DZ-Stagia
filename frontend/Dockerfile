# Use Node 22 Alpine (Lightweight)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files first (optimizes cache)
COPY package.json package-lock.json ./

# Install dependencies inside container
RUN npm install

# Copy source code
COPY . .

# Expose Vite's default port
EXPOSE 3000

# Start command
CMD ["npm", "run", "dev", "--", "--host"]