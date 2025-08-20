# Frontend Dockerfile

# Use the official Node.js 20 LTS Alpine image for a small footprint
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the static files with a minimal web server
FROM nginx:alpine AS runner

# Copy the built application from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to enable proxying /api
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3030 (as specified in docker-compose.yml)
EXPOSE 3030

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]