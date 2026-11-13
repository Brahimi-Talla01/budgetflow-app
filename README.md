# BudgetFlow

Application de gestion de budget personnel : suivi des revenus, dépenses, projets
et analyses, avec notifications et authentification JWT.

Dépôt unique regroupant l'API et l'interface :

| Dossier | Description | Stack |
| --- | --- | --- |
| [`frontend/`](frontend) | Interface web | React 19, TypeScript, Vite, Tailwind CSS v4 |
| [`backend/`](backend) | API REST | Flask 3, SQLAlchemy, Alembic, PostgreSQL |

## Démarrage rapide

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows : .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env               # puis renseigner DATABASE_URL et JWT_SECRET_KEY
flask --app manage.py db upgrade   # créer/mettre à jour le schéma
python seed_roles.py               # rôles admin / user
python manage.py                   # http://127.0.0.1:5000
```

Vérification : `GET http://127.0.0.1:5000/health` renvoie `{"message": "Backend Running"}`.
Les routes métier sont exposées sous `/api/v1`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env               # VITE_API_URL=http://127.0.0.1:5000/api/v1
npm run dev                        # http://localhost:5173
```

## Scripts

| Commande | Où | Effet |
| --- | --- | --- |
| `npm run dev` | `frontend/` | serveur de développement Vite |
| `npm run build` | `frontend/` | vérification TypeScript + build de production |
| `npm run lint` | `frontend/` | ESLint |
| `npm test` | `frontend/` | tests Vitest |
| `python manage.py` | `backend/` | serveur Flask (mode debug) |
| `flask --app manage.py db upgrade` | `backend/` | applique les migrations Alembic |
| `pytest -q` | `backend/` | tests pytest |
| `ruff check app tests` | `backend/` | lint Python |

La CI GitHub Actions (`.github/workflows/ci.yml`) vérifie le lint, les tests, le build
et le démarrage de l'API sur chaque pull request vers `develop` et `main`.

## Documentation

- Conventions de code, architecture et règles Git : [`AGENTS.md`](AGENTS.md)
- Plan de livraison et état d'avancement : [`context/PLAN.md`](context/PLAN.md)
- Procédure de mise en production : [`context/DEPLOYMENT.md`](context/DEPLOYMENT.md)
- Frontend : [`frontend/README.md`](frontend/README.md)
- Backend : [`backend/README.md`](backend/README.md)

## Sécurité

Les fichiers `.env` ne sont pas versionnés. Copier les `.env.example` et fournir
les secrets localement ou via les variables d'environnement de la plateforme de déploiement.
