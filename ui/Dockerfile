# Frontend Dockerfile

# Use the official Node.js 20 LTS Alpine image for a small footprint
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3030
CMD ["npm", "run", "start", "--", "--port", "3030", "--host"]
