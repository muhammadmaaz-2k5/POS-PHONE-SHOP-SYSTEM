FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 5000

# Start command
# We use a shell form here to run migrations before starting the server in production.
CMD npx prisma migrate deploy && node dist/server.js
