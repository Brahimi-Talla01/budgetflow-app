#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
    echo "ERREUR : DATABASE_URL n'est pas défini." >&2
    exit 1
fi

if [ -z "${JWT_SECRET_KEY:-}" ]; then
    echo "ERREUR : JWT_SECRET_KEY n'est pas défini." >&2
    exit 1
fi

# Commande explicite (ex. `docker compose run --rm app flask ...`) : on l'exécute telle quelle.
if [ "$#" -gt 0 ]; then
    exec "$@"
fi

echo "Application des migrations..."
attempt=1
while ! flask --app manage.py db upgrade; do
    if [ "$attempt" -ge 30 ]; then
        echo "ERREUR : base de données injoignable après ${attempt} tentatives." >&2
        exit 1
    fi
    attempt=$((attempt + 1))
    sleep 2
done

echo "Vérification des rôles..."
python seed_roles.py || echo "Rôles déjà présents."

echo "Démarrage de nginx et gunicorn..."
nginx -g 'daemon off;' &

exec gunicorn \
    --bind 0.0.0.0:5000 \
    --workers "${GUNICORN_WORKERS:-3}" \
    --access-logfile - \
    --error-logfile - \
    "app:create_app()"
