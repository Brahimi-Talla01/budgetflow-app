# Déploiement — BudgetFlow

Procédure de mise en production. Aucun déploiement n'est automatisé : les étapes
ci-dessous sont à exécuter sur l'infrastructure cible.

## 0. Tester avec Docker (recommandé)

Un seul conteneur applicatif sert **le frontend et l'API** derrière nginx ;
PostgreSQL tourne dans un second conteneur (volume persistant). Seule l'URL
`http://localhost:8080` est exposée.

```bash
cp .env.example .env      # puis renseigner JWT_SECRET_KEY et POSTGRES_PASSWORD
docker compose up -d --build
docker compose ps         # les deux services doivent être « healthy »
```

Ouvrir <http://localhost:8080>.

### Reprendre une base PostgreSQL existante

Le script copie la base locale indiquée par `DATABASE_URL` (dans `backend/.env`)
vers le volume Docker, sans toucher à la source :

```bash
./scripts/import-db.sh      # démarre db, sauvegarde, restaure, liste les comptes
docker compose up -d app
```

### Variables d'environnement Docker (`.env` à la racine)

| Variable | Rôle |
| --- | --- |
| `APP_PORT` | port public (défaut `8080`) |
| `APP_ENV` | `production` en conteneur |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | base interne ; le mot de passe est obligatoire |
| `JWT_SECRET_KEY` | signature des JWT, obligatoire (`openssl rand -hex 32`) |
| `JWT_COOKIE_SECURE` | `false` en HTTP local, `true` derrière HTTPS |
| `JWT_COOKIE_SAMESITE` | `Lax` (même domaine) |
| `CORS_ORIGINS` | URL du frontend, ex. `http://localhost:8080` |
| `GUNICORN_WORKERS` | nombre de workers (défaut `3`) |

Le frontend est compilé avec `VITE_API_URL=/api/v1` (appels relatifs, même origine,
donc pas de CORS ni de cookie tiers).

### Comptes et mots de passe

Les mots de passe sont hachés avec bcrypt : **ils ne peuvent pas être récupérés**.
Pour retrouver les comptes importés et en réinitialiser un :

```bash
docker compose exec app flask --app manage.py users-list
docker compose exec app flask --app manage.py user-set-password --email vous@example.com
```

### Commandes utiles

```bash
docker compose logs -f app          # logs nginx + gunicorn
docker compose exec app flask --app manage.py db upgrade
docker compose down                 # arrêt (les données restent dans le volume)
docker compose down -v              # arrêt + suppression des données du conteneur
```

> `docker compose down -v` supprime la base du conteneur. La base locale d'origine
> n'est jamais modifiée par ces commandes.

## 1. Variables d'environnement

### Backend (`backend/.env` ou variables de la plateforme)

| Variable | Obligatoire | Exemple production |
| --- | --- | --- |
| `DATABASE_URL` | oui | `postgresql://user:pass@host:5432/budgetflow` |
| `JWT_SECRET_KEY` | oui | chaîne aléatoire de 64 caractères |
| `APP_ENV` | oui | `production` |
| `JWT_COOKIE_SECURE` | oui | `true` (HTTPS obligatoire) |
| `JWT_COOKIE_SAMESITE` | oui | `Lax` si même site, `None` si domaines différents |
| `CORS_ORIGINS` | oui | `https://app.budgetflow.example` |
| `FLASK_APP` | non | `manage.py` |

Le démarrage échoue volontairement si `APP_ENV=production` sans `JWT_SECRET_KEY`.

### Frontend (build)

| Variable | Exemple |
| --- | --- |
| `VITE_API_URL` | `https://api.budgetflow.example` (le `/api/v1` est ajouté automatiquement) |

## 2. Backend (sans Docker)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
flask --app manage.py db upgrade   # applique les migrations Alembic
python seed_roles.py               # rôles admin / user (une seule fois)
gunicorn -w 3 -b 0.0.0.0:8000 "app:create_app()"
```

Vérifier ensuite `GET https://api.budgetflow.example/health`.

## 3. Frontend

```bash
cd frontend
npm ci
VITE_API_URL=https://api.budgetflow.example npm run build
# servir dist/ en statique (Nginx, CDN, hébergeur statique)
```

Le site doit être servi en HTTPS : les cookies `Secure` et la protection CSRF
en dépendent.

## 4. Contraintes réseau

- L'API et le frontend doivent partager le même site (même domaine, ports différents autorisés)
  pour que `SameSite=Lax` fonctionne. Sinon utiliser `SameSite=None` + `Secure`.
- Les requêtes d'écriture envoient `X-CSRF-TOKEN` : le reverse proxy doit laisser passer
  les en-têtes personnalisés et ne doit pas mettre en cache les réponses authentifiées.
- CORS n'autorise que les origines listées dans `CORS_ORIGINS`, avec credentials.

## 5. Base de données

Sauvegarde quotidienne (à planifier via cron ou le service managé) :

```bash
pg_dump --format=custom "$DATABASE_URL" > budgetflow-$(date +%F).dump
```

Restauration :

```bash
pg_restore --clean --if-exists --dbname "$DATABASE_URL" budgetflow-2026-01-01.dump
```

Tester une restauration sur une base jetable au moins une fois par trimestre.

## 6. Checklist de mise en production

- [ ] `APP_ENV=production`, `JWT_SECRET_KEY` défini et stocké dans un gestionnaire de secrets
- [ ] `JWT_COOKIE_SECURE=true` et HTTPS actif
- [ ] `CORS_ORIGINS` limité au domaine du frontend
- [ ] `flask --app manage.py db upgrade` exécuté
- [ ] `python seed_roles.py` exécuté
- [ ] Frontend construit avec la bonne `VITE_API_URL`
- [ ] CI verte sur `main`
- [ ] Sauvegarde de la base avant migration
- [ ] Test manuel : inscription, connexion, création d'une dépense et d'un revenu, déconnexion
