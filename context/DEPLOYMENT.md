# Déploiement — BudgetFlow

Procédure de mise en production. Aucun déploiement n'est automatisé : les étapes
ci-dessous sont à exécuter sur l'infrastructure cible.

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

## 2. Backend

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
