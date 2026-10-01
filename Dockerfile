# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci

# Copy full application code and build
COPY . .
RUN npm run build

# Stage 2: Serve application and local realtime channel with Node
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY server ./server
COPY package*.json ./

EXPOSE 80

CMD ["npm", "start"]
