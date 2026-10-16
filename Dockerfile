# syntax=docker/dockerfile:1

# ---- Build stage ----------------------------------------------------------
# Runs on the *build* platform: the output is static HTML/JS/CSS, so it is
# architecture-independent. This avoids slow QEMU emulation when building an
# ARM image from an x86 machine (and vice versa).
# Debian (glibc) rather than Alpine (musl) to stay on the most tested path
# for native bindings (rolldown, lightningcss, @tailwindcss/oxide).
FROM --platform=$BUILDPLATFORM node:24-slim AS build
WORKDIR /app

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    npm_config_fund=false \
    npm_config_audit=false

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build

# ---- Runtime stage --------------------------------------------------------
# Multi-arch image: Docker pulls the variant matching the target (arm64 on the VM).
FROM nginx:stable-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/healthz || exit 1
