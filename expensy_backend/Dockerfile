# Backend Dockerfile for Expensy

# ---- Build stage ----
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install deps
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:18-alpine

WORKDIR /app

# Copy only built files + node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Expose port (matches backend PORT=3001)
EXPOSE 3001

CMD ["node", "dist/server.js"]
