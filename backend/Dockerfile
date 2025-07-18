 # Stage 1: Builder/Installer
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema to generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# ---

# Stage 2: Production Image
FROM node:18-alpine

WORKDIR /app

# Copy installed dependencies and prisma client from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]