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
COPY tsconfig.json drizzle.config.ts ./
# Copy source code and tests
COPY src ./src
COPY tests ./tests
COPY drizzle ./drizzle # Copy drizzle migrations folder

# Build the TypeScript project
RUN npm run build

# Expose the port the API server will run on
EXPOSE 3000

# Set environment variables (these will be overridden by docker-compose .env)
ENV PORT=3000
ENV DATABASE_URL="postgresql://user:password@db:5432/snippets_db"
ENV OPENAI_API_KEY=dummy_key # Will be replaced by .env in compose

# Command to run tests, then start the server if tests pass
# Using sh -c allows running multiple commands.
# Vitest exits with a non-zero code on test failure, which Docker respects.
CMD ["sh", "-c", "npm test && node dist/server.js"]