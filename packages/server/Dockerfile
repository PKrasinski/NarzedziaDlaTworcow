# Base image with Bun
FROM oven/bun:alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

# Copy all workspace files needed for building
COPY package.json .
COPY packages packages
COPY apps/narzedziadlatworcow.pl/server/package.json apps/narzedziadlatworcow.pl/server/package.json
COPY apps/narzedziadlatworcow.pl/context/package.json apps/narzedziadlatworcow.pl/context/package.json

# ... and then find and remove non-package.json files
RUN find packages -mindepth 2 -maxdepth 3 -type d '!' -exec test -e "{}/package.json" \; -print | xargs rm -rf

# Install dependencies
RUN bun install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app .
COPY . .

RUN bunx @arcote.tech/arc-cli build
RUN cd apps/narzedziadlatworcow.pl/server && bun run build

# Run the application
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/apps/narzedziadlatworcow.pl/server/out ./out
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Create data directory for SQLite database
RUN mkdir -p /app/data

ENV NODE_ENV production
ENV DATABASE_PATH /app/data/narzedziadlatworcow.pl.sql
ENV DATABASE_VERSION 1
EXPOSE 5005

CMD ["bun", "run", "./out/index.js"]
