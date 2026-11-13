# AGENTS.md

Consignes pour tout agent IA (ou développeur) travaillant sur ce dépôt.

## 1. Règles Git — IMPORTANT

- **Ne jamais ajouter de co-auteur ni d'attribution IA dans un commit.**
  Aucun trailer `Co-Authored-By:` (y compris `Codebuff`, `Claude`, `Cursor`, ...),
  aucune ligne `Generated with ...`, aucun emoji d'attribution.
  Le message de commit doit se terminer par sa dernière ligne de description.
- **Ne jamais pousser (`git push`) sans demande explicite de l'utilisateur.**
- Ne jamais committer de secrets : `.env` est ignoré, seuls les `.env.example` sont versionnés.
- Messages de commit en français, à l'impératif, une ligne courte et explicite
  (ex. `Ajoute la validation du formulaire de dépense`).
- Une branche par sujet (`feat/...`, `fix/...`, `chore/...`) ; la branche par défaut est `main`.
- Pas de force-push sur `main`, pas de réécriture d'historique partagé.

## 2. Structure du dépôt (monorepo)

```
.
├── frontend/   # React 19 + TypeScript + Vite + Tailwind CSS v4
├── backend/    # API Flask + SQLAlchemy + Alembic (PostgreSQL)
├── AGENTS.md
├── README.md
└── .gitignore
```

Chaque application garde son propre `package.json` / `requirements.txt` :
il n'y a **pas** de gestionnaire de monorepo (pas de workspaces npm).

## 3. Frontend (`frontend/`)

**Stack** : React 19, TypeScript, Vite 7, Tailwind CSS v4 (`@tailwindcss/vite`),
React Router 7, TanStack Query, Axios, Framer Motion, Recharts, Lucide.

**Architecture (clean architecture)** :

| Dossier | Rôle |
| --- | --- |
| `src/domain/` | Entités, erreurs, interfaces de repositories, use-cases — aucune dépendance UI/réseau |
| `src/application/` | Contexts React, hooks applicatifs, store, injection de dépendances (`di/`) |
| `src/infrastructure/` | Appels API (`api/`), DTOs, mappers, implémentations des repositories, stockage local |
| `src/presentation/` | Composants, pages, hooks d'écran, styles |
| `src/routes/` | Définition et garde des routes (`PrivateRoute`) |
| `src/shared/` | Types et utilitaires transverses |
| `src/services/` | Anciens services Axios directs — **dette technique**, ne pas y ajouter de nouveau code |

**Conventions** :
- Composants en `.tsx` avec `PascalCase`, hooks en `useXxx.ts`.
- Styles via classes Tailwind ; le CSS global reste dans `src/presentation/styles/index.css`.
- L'interface et les messages utilisateur sont en **français**.
- Pas de `any` dans le nouveau code ; typer les réponses API via `infrastructure/dtos` + mappers.
- Ne jamais appeler `axios` depuis un composant : passer par un repository/use-case.
- Toute nouvelle variable d'environnement publique doit être préfixée `VITE_` et documentée
  dans `frontend/.env.example`.

**Commandes** (depuis `frontend/`) :
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint
npm run preview
```

## 4. Backend (`backend/`)

**Stack** : Flask 3, Flask-JWT-Extended, Flask-SQLAlchemy, Alembic (Flask-Migrate),
Flask-Bcrypt, Flask-CORS, PostgreSQL (`psycopg2`).

**Architecture en couches** :

```
api/ (blueprints) -> services/ (métier) -> repositories/ (accès données) -> models/ (SQLAlchemy)
                              |
                        schemas/ (validation / sérialisation)
```

- Les routes ne contiennent pas de logique métier : elles délèguent aux services.
- Les services n'utilisent jamais `db.session` directement : ils passent par les repositories.
- Les notifications passent par `app/notifications/` (`NotificationManager`, `triggers`).
- Toutes les routes sont exposées sous le préfixe `/api/v1` (voir `app/__init__.py`).
- Les noms de fichiers historiques `*_shema.py` et `app/congig.py` sont conservés :
  ne pas les renommer sans migration associée.
- Les erreurs renvoient un JSON `{ "success": false, "message": "..." }` avec un code HTTP explicite.

**Commandes** (depuis `backend/`, environnement virtuel activé) :
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
flask --app manage.py db upgrade   # appliquer les migrations
python seed_roles.py                # créer les rôles admin/user
python manage.py                    # serveur de dev sur http://127.0.0.1:5000
```

**Variables d'environnement** : `DATABASE_URL`, `JWT_SECRET_KEY`
(voir `backend/.env.example`). `JWT_SECRET_KEY` a une valeur par défaut de dev :
elle doit être remplacée hors développement.

**Migrations** : toute modification de `app/models/` doit être accompagnée d'une migration
(`flask --app manage.py db migrate -m "..."`), versionnée dans `migrations/versions/`.

## 5. Vérifications avant de livrer

- Frontend : `npm run build` (compile TypeScript + Vite) et `npm run lint`.
- Backend : au minimum `python -m compileall app` ; lancer les tests de `backend/tests/`
  s'ils existent.
- Ne jamais désactiver une règle de lint, un test ou une assertion pour faire passer une
  vérification : corriger la cause.

## 6. Sécurité

- `.env`, clés JWT, identifiants de base de données : jamais dans le dépôt.
- CORS : restreindre les origines autorisées en production.
- Les mots de passe sont hachés avec Flask-Bcrypt ; ne jamais logguer de token ni de mot de passe.
