# BudgetFlow — plan de continuation

Document de référence pour la suite du projet. Il décrit l'état du dépôt, ce qui a été
livré, la dette technique restante et l'ordre dans lequel traiter les prochains lots.

Dernière mise à jour : novembre 2026.

---

## 1. État du dépôt

Monorepo `budgetflow-app` (public) :

```
.
├── frontend/   React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · React Router 7
├── backend/    Flask 3 · SQLAlchemy 2 · Alembic · PostgreSQL · JWT
├── context/    Ce plan
├── .github/workflows/ci.yml
├── AGENTS.md
└── README.md
```

### Branches

| Branche | Rôle | Protection |
| --- | --- | --- |
| `main` | état stable / livrable | PR obligatoire, admins inclus, historique linéaire, force-push et suppression interdits, 2 checks CI requis |
| `develop` | intégration | mêmes règles |

### Workflow

1. `git checkout develop && git pull --ff-only`
2. `git checkout -b <feat|fix|chore|docs|ci|refactor>/<sujet>`
3. commits en français, à l'impératif, **sans co-auteur ni attribution IA**
4. `git push -u origin <branche>` puis PR vers `develop`
5. merge en **squash** une fois les deux checks CI verts, branche supprimée
6. release : PR `develop` → `main`

### CI (`.github/workflows/ci.yml`)

Déclenchée sur toute PR et tout push vers `main`/`develop` :

- **Frontend (lint + build)** : `npm ci`, `npm run lint`, `npm run build`
- **Backend (compile + démarrage)** : `pip install -r requirements.txt`, `compileall`, chargement de l'application Flask sur SQLite

Les deux checks sont obligatoires. Il n'y a **aucun test automatisé** pour l'instant (voir lot 3).

---

## 2. Ce qui a été livré

### PR #1 — Workflow de branches
`AGENTS.md` documente le flux `develop` → `main`, la protection des branches et les conventions.

### PR #2 — Couche API et correctifs
- Client Axios unique : `infrastructure/api/apiClient.ts`
  (URL de base, injection du token, erreurs typées, déconnexion sur 401)
- Normalisation de `VITE_API_URL` : avec ou sans `/api/v1`
- DTOs, mappers, interfaces de repositories, implémentations HTTP pour auth / dépenses / revenus
- Container d'injection : `application/di/container.ts`
- Contexts découpés en `*Context.ts` (contexte + hook) et `*Provider.tsx` (composant)
- Suppression de `src/services/` ; plus aucun `import axios` hors `infrastructure/`
- Correctifs : double préfixe d'URL à l'inscription, `/income/:id` → `/incomes/:id`,
  vue « Revenu » du graphique, `useId` conditionnel, `Math.random` au rendu,
  `setState` dans `useMemo`, date vidée dans le modal, double modal,
  fuite de données après déconnexion, fermeture de `EditProfileCard`

### PR #3 — CI
Workflow GitHub Actions + remplacement de `react-helmet-async` (incompatible React 19)
par le `<title>` natif de React 19, ajout de `Flask-Cors` et `marshmallow` aux dépendances backend.

### État des vérifications

| Commande | Résultat |
| --- | --- |
| `cd frontend && npm ci` | OK |
| `cd frontend && npm run lint` | 0 erreur, 0 avertissement |
| `cd frontend && npm run build` | OK (avertissement de taille de chunk) |
| `cd backend && python -m compileall -q app` | OK |
| Chargement de `create_app()` | OK |

---

## 3. Dette technique et bugs connus

### Frontend

| Sujet | Détail | Fichier |
| --- | --- | --- |
| Revenus non créables | `handleSubmit` sort si `type !== "expense"` : le modal de transaction ne crée jamais de revenu alors que `createIncome` existe | `pages/dashboard/DashboardPage.tsx` |
| Projets factices | liste codée en dur dans le modal, aucune utilisation de l'API projets | `components/transaction/TransactionModal.tsx` |
| Catégories codées en dur | listes dans le composant | idem |

> Les trois lignes ci-dessus sont traitées par le lot 1 (voir § 4).
| Pages vides | `Analyse`, `Conseil`, `Projets`, `Transaction` = 13 à 16 lignes de placeholder | `pages/*` |
| Composants vides | `ExpenseCard`, `ExpenseForm`, `ExpenseList`, `ProtectedRoute` (doublon de `routes/PrivateRoute.tsx`) | `components/expenses/*` |
| Couches inutilisées | interfaces notification/projet, use-cases, `DIContext.tsx` vides | `domain/`, `application/` |
| TanStack Query inutilisé | dépendance installée mais aucun `QueryClient` | `main.tsx` |
| Session | token en `localStorage`, pas de refresh token | `infrastructure/storage/` |
| Poids du bundle | 892 kB de JS et une vidéo de 17 MB dans le bundle, blob de commentaires retiré mais assets à traiter | `src/assets/` |

### Backend

| Sujet | Détail |
| --- | --- |
| Aucun test | ni `pytest`, ni fixtures, ni base de test |
| CORS ouvert | `cors.init_app(app)` sans restriction d'origine |
| Clé JWT par défaut | `default-dev-key` si `JWT_SECRET_KEY` absent |
| Gestion d'erreurs | pas de handler global, réponses hétérogènes (`errors` / `message`) |
| Typos historiques | `app/congig.py`, `*_shema.py`, `migrations/alembic.ini` |
| Dépendances | `flask_sqlalchemy`, `dotenv`, `psycopg2-binary` non épinglés |
| Rôles | `seed_roles.py` à lancer manuellement |

---

## 4. Prochains lots (dans l'ordre)

### Lot 1 — Terminer le flux transactionnel (priorité haute)

Objectif : créer, modifier et supprimer dépenses **et** revenus depuis l'interface.

- [x] `DashboardPage.handleSubmit` : router vers `createExpense` ou `createIncome` selon `type`
- [x] Afficher un retour utilisateur (succès / erreur) au lieu de `alert`
- [x] Charger les projets depuis `GET /projects` (créer `HttpProjectRepository` + DTO/mapper)
- [x] Remplacer les catégories codées en dur par une constante partagée (`shared/constants`)
- [x] Afficher les revenus dans `TransactionsBar` et le solde net sur le dashboard

Critère d'acceptation : ajouter un revenu depuis le modal met à jour la liste et le
graphique sans rechargement, et une erreur API s'affiche dans l'UI.

### Lot 2 — Pages réelles

- [x] `TransactionPage` : liste complète dépenses + revenus, filtres par type/période/catégorie + recherche
- [ ] `ProjectsPage` : CRUD projets, rattachement d'une transaction à un projet
- [ ] `AnalysePage` : agrégats par catégorie et évolution mensuelle
- [ ] `ConseilPage` : contenu statique utile ou retrait de la route
- [ ] Notifications : brancher `notifications` (contexte ou TanStack Query) sur le backend

Critère d'acceptation : aucune page ne contient de placeholder ni de `console.log`.

### Lot 3 — Qualité et tests

- [ ] Frontend : Vitest + Testing Library, tests des mappers, du client API (MSW) et du flux de connexion
- [ ] Backend : `pytest` + `pytest-flask`, base SQLite en mémoire, tests des services et des routes auth/dépenses
- [ ] CI : ajouter `npm test` et `pytest`, rendre ces étapes bloquantes
- [ ] Backend : `ruff` (lint + format) dans la CI, typage progressif
- [ ] Supprimer les fichiers vides non utilisés (use-cases, `DIContext.tsx`, `ProtectedRoute.tsx`)

Critère d'acceptation : la CI exécute les tests et échoue si la couverture des services
backend ou du client API régresse.

### Lot 4 — Sécurité et configuration

- [ ] CORS restreint aux origines de développement / production via variable d'environnement
- [ ] `JWT_SECRET_KEY` obligatoire hors développement (échec au démarrage si absent)
- [ ] Migration du token vers cookie `httpOnly` + `Secure`, avec protection CSRF
- [ ] Handler d'erreurs Flask global et format de réponse unique
- [ ] Renommer `app/congig.py` → `app/config.py` et `*_shema.py` → `*_schema.py` (avec mise à jour des imports)
- [ ] Épingler toutes les dépendances Python

Critère d'acceptation : démarrage impossible sans secret en production, aucune origine
`*` dans la configuration CORS de production.

### Lot 5 — Performance et UX

- [ ] Code splitting par route (`React.lazy` + `Suspense`), objectif < 300 kB par chunk
- [ ] Sortir la vidéo et les images lourdes du bundle (dossier `public/` ou CDN)
- [ ] Adopter TanStack Query pour le cache, les revalidations et les états de chargement
- [ ] Skeletons au lieu des spinners pleine page
- [ ] Passe d'accessibilité (labels, focus, contrastes, navigation clavier du modal)

Critère d'acceptation : plus d'avertissement de chunk > 500 kB au build.

### Lot 6 — Release

- [ ] PR `develop` → `main` une fois les lots 1 à 3 terminés
- [ ] Tag de version (`v0.1.0`) et notes de version
- [ ] Déploiement (frontend statique + API) et variables d'environnement documentées
- [ ] Sauvegarde / restauration de la base PostgreSQL

---

## 5. Définition de « terminé » pour une PR

- `npm run lint`, `npm run build` et les tests concernés passent en local
- Les deux checks CI sont verts
- Aucun `any` ajouté, aucun appel `axios` hors de `src/infrastructure/`
- Aucune donnée sensible dans le diff (`.env`, token, mot de passe)
- La PR explique le **pourquoi**, pas seulement le **quoi**

---

## 6. Commandes utiles

```bash
# Frontend
cd frontend
npm ci
npm run dev
npm run lint
npm run build

# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # puis renseigner DATABASE_URL et JWT_SECRET_KEY
flask --app manage.py db upgrade
python seed_roles.py
python manage.py                # http://127.0.0.1:5000

# Branche + PR
git checkout develop && git pull --ff-only
git checkout -b feat/mon-sujet
git push -u origin feat/mon-sujet
gh pr create --base develop --fill
```
