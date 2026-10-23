FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy full source and build both client & server
COPY . .
RUN npm run build

# --- Production runner image ---
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled bundles and static assets from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server/index.js"]
