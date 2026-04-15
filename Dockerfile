# =============================================================================
# Multi-stage Dockerfile for Pixielity Frontend Monorepo
# =============================================================================
#
# Builds the Vite app with all workspace packages in a minimal production image.
# Supports wildcard subdomains for multi-tenancy via Caddy reverse proxy.
#
# Build args:
#   APP_NAME  — which app to build (default: vite)
#
# Usage:
#   docker build -t pixielity-frontend .
#   docker build --build-arg APP_NAME=vite -t pixielity-frontend .
#   docker run -p 8080:8080 pixielity-frontend
#
# With docker-compose:
#   docker-compose up --build
#
# =============================================================================

# ─── Stage 1: Base ──────────────────────────────────────────────────────────
# Node.js 20 Alpine with pnpm enabled via corepack.
FROM node:20-alpine AS base

# Enable pnpm via corepack (built into Node.js 16.13+)
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Set pnpm store directory for caching
ENV PNPM_HOME=/usr/local/bin

# ─── Stage 2: Dependencies ──────────────────────────────────────────────────
# Install all workspace dependencies using the lockfile.
FROM base AS deps
WORKDIR /app

# Copy workspace config files first (for Docker layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files from workspace packages
# This allows pnpm to resolve the workspace dependency graph
COPY apps/vite/package.json ./apps/vite/
COPY packages/cache/package.json ./packages/cache/
COPY packages/config/package.json ./packages/config/
COPY packages/container/container/package.json ./packages/container/container/
COPY packages/container/application/package.json ./packages/container/application/
COPY packages/container/react/package.json ./packages/container/react/
COPY packages/desktop/package.json ./packages/desktop/
COPY packages/events/package.json ./packages/events/
COPY packages/kbd/package.json ./packages/kbd/
COPY packages/logger/package.json ./packages/logger/
COPY packages/multitenancy/package.json ./packages/multitenancy/
COPY packages/pwa/package.json ./packages/pwa/
COPY packages/redis/package.json ./packages/redis/
COPY packages/refine/package.json ./packages/refine/
COPY packages/rxdb-eloquent/package.json ./packages/rxdb-eloquent/
COPY packages/settings/package.json ./packages/settings/
COPY packages/support/package.json ./packages/support/
COPY packages/theming/package.json ./packages/theming/
COPY packages/ui/package.json ./packages/ui/

# Install all dependencies (including devDependencies for building)
RUN pnpm install --frozen-lockfile

# ─── Stage 3: Builder ──────────────────────────────────────────────────────
# Build all packages and the target app.
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/vite/node_modules ./apps/vite/node_modules

# Copy all source code
COPY . .

# Build all packages first (respects dependency order via turbo)
RUN pnpm turbo run build --filter='./packages/*'

# Build the target app
ARG APP_NAME=vite
RUN pnpm turbo run build --filter="./apps/${APP_NAME}"

# ─── Stage 4: Production ───────────────────────────────────────────────────
# Minimal image serving the built static files via Caddy.
# Caddy handles:
#   - Static file serving
#   - Gzip/Brotli compression
#   - SPA fallback (index.html for client-side routing)
#   - Wildcard subdomain support for multi-tenancy
#   - Automatic HTTPS in production
FROM caddy:2-alpine AS runner

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy the built Vite app
ARG APP_NAME=vite
COPY --from=builder /app/apps/${APP_NAME}/dist /srv

# Copy the Caddyfile for production
COPY <<'CADDYFILE' /etc/caddy/Caddyfile
# =============================================================================
# Caddyfile — Production Static File Server
# =============================================================================
#
# Serves the Vite SPA with:
#   - Gzip + Brotli compression
#   - SPA fallback (try_files → index.html)
#   - Security headers
#   - Wildcard subdomain support for multi-tenancy
#   - Cache headers for static assets
#

{
    # Listen on port 8080 (non-privileged)
    http_port 8080
    # Disable automatic HTTPS in container (handled by load balancer)
    auto_https off
}

:8080 {
    # Serve static files from /srv
    root * /srv

    # Enable compression
    encode gzip zstd

    # SPA fallback — serve index.html for all non-file routes
    try_files {path} /index.html

    # Serve files
    file_server

    # Security headers
    header {
        # Prevent MIME type sniffing
        X-Content-Type-Options "nosniff"
        # Prevent clickjacking
        X-Frame-Options "SAMEORIGIN"
        # XSS protection
        X-XSS-Protection "1; mode=block"
        # Referrer policy
        Referrer-Policy "strict-origin-when-cross-origin"
        # Remove server header
        -Server
    }

    # Cache static assets aggressively (JS, CSS, images have content hashes)
    @static path *.js *.css *.woff2 *.woff *.ttf *.ico *.png *.jpg *.jpeg *.svg *.webp *.avif
    header @static Cache-Control "public, max-age=31536000, immutable"

    # Don't cache HTML (SPA entry point must always be fresh)
    @html path *.html /
    header @html Cache-Control "no-cache, no-store, must-revalidate"
}
CADDYFILE

# Switch to non-root user
USER app

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
