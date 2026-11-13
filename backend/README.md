# BudgetFlow — API

API REST Flask de BudgetFlow (authentification JWT, revenus, dépenses, projets,
notifications).

## Stack

Flask 3 · Flask-JWT-Extended · Flask-SQLAlchemy · Flask-Migrate (Alembic) ·
Flask-Bcrypt · Flask-CORS · PostgreSQL (`psycopg2`)

## Installation

```bash
python -m venv .venv
source .venv/bin/activate          # Windows : .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Variables attendues dans `.env` :

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | URI SQLAlchemy PostgreSQL |
| `JWT_SECRET_KEY` | clé de signature des tokens (obligatoire hors dev) |
| `FLASK_APP` / `FLASK_DEBUG` | configuration Flask locale |

## Base de données

```bash
flask --app manage.py db upgrade     # appliquer les migrations
flask --app manage.py db migrate -m "..."   # après modification d'un modèle
python seed_roles.py                 # insérer les rôles admin / user
```

## Lancer le serveur

```bash
python manage.py                     # http://127.0.0.1:5000
```

`GET /health` → `{"message": "Backend Running"}`.

## Organisation

```
app/
├── __init__.py        # create_app(), enregistrement des blueprints (/api/v1)
├── congig.py          # configuration (nom historique, conservé)
├── extensions.py      # instances SQLAlchemy / JWT / Bcrypt / CORS / Migrate
├── api/               # blueprints : auth, income, expense, project, role, notification
├── services/          # logique métier
├── repositories/      # accès aux données
├── models/            # modèles SQLAlchemy
├── schemas/           # validation / sérialisation
└── notifications/     # NotificationManager et triggers
migrations/            # migrations Alembic
tests/                 # tests backend
```

Règles d'architecture et convention de réponse JSON : voir [`../AGENTS.md`](../AGENTS.md).
