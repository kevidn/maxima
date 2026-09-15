# ════════════════════════════════════════════════════════
#  Stage 1: Build Vite React Application
# ════════════════════════════════════════════════════════
FROM node:20-alpine AS build

WORKDIR /app

# Copy package dependency manifests
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy application source code
COPY . .

# Build argument for backend API URL (default to live production endpoint)
ARG VITE_API_BASE_URL=https://api.maximaa.tech
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build optimized production bundle
RUN npm run build

# ════════════════════════════════════════════════════════
#  Stage 2: Serve with Lightweight Nginx
# ════════════════════════════════════════════════════════
FROM nginx:alpine

# Copy custom Nginx configuration with SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
