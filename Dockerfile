# Build stage
FROM node:22-alpine AS deps

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json .

# Copy environment file
COPY .env* ./

COPY . .

RUN npm install -g bun
RUN bun install

RUN bunx prisma generate

RUN bun run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "dev:docker"] 