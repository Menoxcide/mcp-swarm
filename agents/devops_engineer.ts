export default {
  name: 'devops_engineer',
  async run(state: any, { explorer, model }: any) {
    console.log(`🚀 DevOps Engineer setting up deployment for: "${state.task}"`);

    // Create Dockerfile
    const dockerfile = `FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \\
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --network-timeout 600000; \\
  elif [ -f package-lock.json ]; then npm ci; \\
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \\
  else echo "Lockfile not found." && exit 1; \\
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN \\
  if [ -f yarn.lock ]; then yarn build; \\
  elif [ -f package-lock.json ]; then npm run build; \\
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \\
  else echo "Lockfile not found." && exit 1; \\
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]`;

    // Create Fly.io configuration
    const flyToml = `app = "mcp-swarm"
primary_region = "ord"
console_command = "/bin/bash"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  size = "shared-cpu-1x"
  memory = "256mb"

[mounts]
  source = "mcp_swarm_data"
  destination = "/data"

[[statics]]
  guest_path = "/app/public"
  url_prefix = "/"

[env]
  NODE_ENV = "production"
  PORT = "3000"`;

    // Create GitHub Actions workflow
    const githubWorkflow = `name: Deploy to Fly.io

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    concurrency: deploy-group # optional: ensure only one action runs at a time
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: \${{ secrets.FLY_API_TOKEN }}

  test:
    name: Run tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm test`;

    // Create docker-compose for local development
    const dockerCompose = `version: '3.8'

services:
  mcp-swarm:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./sandbox:/app/sandbox
    restart: unless-stopped

  # Optional: LM Studio for local AI
  lm-studio:
    image: linuxserver/lm-studio:latest
    ports:
      - "1234:1234"
    volumes:
      - ./models:/config/models
    environment:
      - PUID=1000
      - PGID=1000
    restart: unless-stopped

  # Optional: PostgreSQL for data persistence
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=mcp_swarm
      - POSTGRES_USER=mcp_swarm
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:`;

    console.log(`🏗️ Creating deployment infrastructure...`);
    await explorer.writeFile('deploy/Dockerfile', dockerfile);
    await explorer.writeFile('deploy/fly.toml', flyToml);
    await explorer.writeFile('deploy/docker-compose.yml', dockerCompose);
    await explorer.writeFile('.github/workflows/deploy.yml', githubWorkflow);

    return {
      results: {
        ...state.results,
        [this.name]: 'Created Dockerfile, fly.toml, docker-compose.yml, and GitHub Actions workflow'
      }
    };
  }
};
