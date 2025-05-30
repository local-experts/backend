ARG BUN_VERSION=1.2.15
FROM oven/bun:${BUN_VERSION}-slim AS base

RUN apt-get update -y && \
    apt-get install -y openssl build-essential

FROM base AS build

WORKDIR /app

COPY package.json bun.lock src prisma/schema.prisma ./

RUN bun install --ci && \
  bunx prisma generate

FROM base AS runner
WORKDIR /app

COPY --from=build /app /app

RUN adduser --system --uid 999 honobun

USER honobun
EXPOSE 3234
ENTRYPOINT [ "bun", "run", "index.ts" ]
