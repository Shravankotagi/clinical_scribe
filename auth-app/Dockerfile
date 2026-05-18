FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
ENV DATABASE_URL=postgresql://placeholder:placeholder@placeholder/placeholder?sslmode=require
RUN npm ci --ignore-scripts
RUN npx prisma generate

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=postgresql://placeholder:placeholder@placeholder/placeholder?sslmode=require
ENV RESEND_API_KEY=re_placeholder
ENV BETTER_AUTH_SECRET=placeholder_secret_32_characters_long
ENV BETTER_AUTH_URL=http://localhost:3000
ENV GEMINI_API_KEY=placeholder
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/generated ./src/generated
EXPOSE 3000
CMD ["node", "server.js"]