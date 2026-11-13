#!/usr/bin/env bash
# Importe la base PostgreSQL locale (backend/.env -> DATABASE_URL) dans le
# volume du service `db` de docker-compose. À lancer avant `docker compose up`.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f backend/.env ]; then
    echo "ERREUR : backend/.env introuvable (il contient DATABASE_URL de la base source)." >&2
    exit 1
fi

if [ ! -f .env ]; then
    echo "ERREUR : .env introuvable. Copiez .env.example vers .env d'abord." >&2
    exit 1
fi

set -a
# shellcheck disable=SC1091
. backend/.env
# shellcheck disable=SC1091
. ./.env
set +a

if [ -z "${DATABASE_URL:-}" ]; then
    echo "ERREUR : DATABASE_URL absent de backend/.env." >&2
    exit 1
fi

echo "Démarrage de PostgreSQL (conteneur)..."
docker compose up -d db

echo "Attente de PostgreSQL..."
for _ in $(seq 1 30); do
    if docker compose exec -T db pg_isready -U "${POSTGRES_USER:-budgetflow}" -d "${POSTGRES_DB:-budgetflow}" >/dev/null 2>&1; then
        break
    fi
    sleep 2
done

echo "Arrêt de l'application pour éviter les écritures pendant l'import..."
docker compose stop app >/dev/null 2>&1 || true

dump_file="$(mktemp --suffix=.dump)"
trap 'rm -f "$dump_file"' EXIT

echo "Sauvegarde de la base source..."
pg_dump --format=custom --no-owner --no-privileges "$DATABASE_URL" > "$dump_file"
echo "  $(du -h "$dump_file" | cut -f1) sauvegardés."

echo "Réinitialisation du schéma public du conteneur..."
docker compose exec -T db psql -U "${POSTGRES_USER:-budgetflow}" -d "${POSTGRES_DB:-budgetflow}" \
    -v ON_ERROR_STOP=1 \
    -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;" >/dev/null

echo "Restauration..."
docker compose exec -T db pg_restore --no-owner --no-privileges \
    -U "${POSTGRES_USER:-budgetflow}" -d "${POSTGRES_DB:-budgetflow}" < "$dump_file"

echo "Import terminé. Démarrage de l'application :"
echo "  docker compose up -d app"
echo "Comptes disponibles :"
docker compose run --rm --no-deps app flask --app manage.py users-list
