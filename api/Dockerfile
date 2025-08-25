# Backend Dockerfile

# Use a Node.js 20 LTS Alpine base image for smaller size
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker cache
# for dependencies installation.
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy tsconfig.json and drizzle.config.ts for build and migrations
COPY tsconfig.json drizzle.config.ts tsconfig.bundle.json tsdown.config.js ./
# Copy source code and tests
COPY src ./src
COPY tests ./tests
COPY drizzle ./drizzle

# Build the TypeScript project
RUN npm run build:bundle

COPY build ./build

# Expose the port the API server will run on
EXPOSE 3000

# Set environment variables (these will be overridden by docker-compose .env)
ENV PORT=3000
ENV DATABASE_URL="postgresql://user:password@app_db:5432/snippets_db?sslmode=disable"
ENV OPENAI_API_KEY=dummy_key

# Command to start the server 
#CMD ["node build/server.js"]