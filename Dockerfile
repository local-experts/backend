FROM node:23-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json src prisma/schema.prisma ./

RUN corepack enable pnpm && \
  pnpm i && \
  npx prisma generate && \
  pnpm build && \
  pnpm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=hono:nodejs /app/src/lib/generated /app/src/lib/generated

USER hono
EXPOSE 3234

CMD ["node", "/app/dist/index.js"]
