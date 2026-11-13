# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# 1. Build du frontend (Vite)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS frontend

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

# URL relative : le frontend est servi par le même nginx que l'API.
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------------------------------------------------------------------------
# 2. Image d'exécution : nginx (statique) + gunicorn (API Flask)
# ---------------------------------------------------------------------------
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx curl \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default

WORKDIR /app/backend

COPY backend/requirements.txt ./
RUN pip install -r requirements.txt

COPY backend/ ./
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY --from=frontend /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -fsS http://127.0.0.1/health || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
