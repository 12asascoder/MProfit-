# Builder stage
FROM node:20-alpine AS builder
# Install build tools
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Install turbo
RUN npm install -g turbo

# Copy all files
COPY . .

# Prune unnecessary files for the api workspace
RUN turbo prune --scope=api --docker

# Installer stage
FROM node:20-alpine AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy pruned lockfile and install dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

# Build the project
COPY --from=builder /app/out/full/ .
# Generate Prisma Client
RUN cd apps/api && npx prisma generate
RUN npm run build --workspace=api

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app/apps/api/package.json .

# Automatically leverage output traces to reduce image size
# Copy built output
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules

CMD ["node", "dist/src/main.js"]
