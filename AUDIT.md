# Audit du dépôt DropZone

Audit réalisé le 9 novembre 2026 sur le commit `4159e8b` (« Initial commit »), avant toute modification.
Il repose uniquement sur la lecture des fichiers du dépôt : rien n'a été exécuté en production.

Grille : **présent / manquant / risqué**, par thème (code, qualité, livraison, exploitation, collaboration).
À adapter au vocabulaire exact de la grille vue en cours si elle diffère.

## Présent

| Thème | Constat |
| --- | --- |
| Code | API FastAPI structurée (routes, services, domaine, modèles, schémas) et front React/TypeScript. |
| Configuration | Variables d'environnement lues via `pydantic-settings` (principe 12-factor), valeurs par défaut sûres pour le développement. |
| Dépendances | Versions épinglées (`requirements*.txt`, `package.json` en versions exactes, `package-lock.json`, `.npmrc` avec `save-exact`). |
| Qualité | Ruff (lint et format), ESLint, TypeScript, pytest avec seuil de couverture de 85 %, Vitest, Playwright. |
| Tests existants | 4 fichiers pytest, 3 fichiers Vitest, 1 scénario Playwright. |
| Hygiène Git | `.gitignore` couvrant `.env`, `.venv`, `node_modules`, `dist`, `*.db`, rapports de tests ; `.editorconfig`. |
| Santé | Endpoints `/health` (liveness) et `/health/ready` (readiness, teste la base). |
| Documentation | README détaillé : lancement local, API, configuration, structure. |

## Manquant

| Thème | Constat | Effet |
| --- | --- | --- |
| Livraison | Aucun Dockerfile, aucun `compose.yml`, aucun `.dockerignore`, aucun `.env.example`. | Impossible de lancer ou livrer l'application sans installer Python et Node. |
| Intégration continue | Aucun dossier `.github/`, aucun workflow. | Rien ne vérifie automatiquement une modification. |
| Déploiement | Aucun workflow de publication, aucune image dans un registre, aucun tag, aucune release. | Aucune version identifiable ni retour arrière possible. |
| Tests | Pas de `test_orders.py` (règles de commande), pas de test du composant `DropCard`, un seul scénario E2E. | La règle « jamais deux fois la dernière paire » n'est pas couverte côté API. |
| Exploitation | Logs au format texte, pas de `/metrics`, pas de `HEALTHCHECK`, pas de supervision. | On ne sait pas que l'application est tombée avant qu'un utilisateur se plaigne. |
| Collaboration | Pas de `CONTRIBUTING.md`, de `CHANGELOG.md`, de modèle de pull request, de protection de `main`. | Les conventions sont orales ; un push direct sur `main` est possible. |
| Licence | Le README annonce la licence MIT mais il n'y a pas de fichier `LICENSE`. | La licence n'a pas de valeur juridique claire. |

## Risqué

| Risque | Gravité | Remarque |
| --- | --- | --- |
| Push direct sur `main` possible, sans relecture ni test | Élevée | À traiter en premier : protection de branche, puis CI obligatoire. |
| Données de démonstration insérées par défaut (`SEED_DEMO_DATA=true`) | Moyenne | En production, il faut les désactiver explicitement. |
| `POST /drops` sans authentification (indiqué dans le README) | Moyenne | N'importe qui peut créer des drops. Acceptable pour un projet pédagogique, à connaître. |
| Schéma de base créé par `create_all` au démarrage, sans migrations | Moyenne | Un retour arrière de version ne revient pas sur le schéma ; un changement de schéma n'est pas géré. |
| Mot de passe de la base dans `DATABASE_URL` | Moyenne | Doit venir d'un `.env` non commité (jamais de la ligne de commande ni du dépôt). |
| Version écrite à trois endroits (`app/__init__.py`, `pyproject.toml`, `package.json`) | Faible | Risque de divergence entre les versions et les tags Git. |
| `frontend/.nvmrc` indique Node 24 alors que `engines` exige `>=22.12` et que la consigne vise Node 22 | Faible | Choisir une version et l'aligner partout (développement, Docker, CI). |
| `.gitignore` ne couvre que `.env` et `.env.act`, pas `.env.local` ou `.env.production` | Faible | Élargir le motif (`.env.*` avec exception pour `.env.example`). |

## Priorités

1. Protéger `main` et mettre en place le flux branche, PR, commits conventionnels.
2. Conteneuriser (Dockerfiles, Compose, `.env.example`).
3. Automatiser la vérification (CI) et rendre ses jobs obligatoires.
4. Automatiser la livraison (CD) avec un retour arrière documenté.
5. Observer : health checks, logs JSON, métriques, supervision.
