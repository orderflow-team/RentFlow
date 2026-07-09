# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install Prisma deps
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npx prisma generate
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
