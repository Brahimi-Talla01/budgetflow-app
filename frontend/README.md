# BudgetFlow — Frontend

Interface web de BudgetFlow (React 19, TypeScript, Vite, Tailwind CSS v4).

## Installation

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

`.env` doit contenir `VITE_API_URL` pointant vers l'API, préfixe `/api/v1` inclus :

```env
VITE_API_URL=http://127.0.0.1:5000/api/v1
```

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | serveur de développement (HMR) |
| `npm run build` | `tsc -b` puis build de production dans `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | prévisualisation du build |

## Organisation

```
src/
├── domain/           # entités, erreurs, interfaces de repositories, use-cases
├── application/      # contexts React, hooks, store, injection de dépendances
├── infrastructure/   # clients API, DTOs, mappers, repositories, stockage
├── presentation/     # composants, pages, hooks d'écran, styles
├── routes/           # routes et PrivateRoute
├── shared/           # types et utilitaires transverses
└── services/         # anciens services Axios directs (dette technique)
```

Pages : accueil, authentification (connexion / inscription / mot de passe oublié),
dashboard, transactions, projets, analyse, conseil.

Conventions détaillées : voir [`../AGENTS.md`](../AGENTS.md).
