# Contribuer à DropZone

## Principe

Personne ne pousse directement sur `main`. Chaque changement passe par une branche, puis une pull request relue et vérifiée par la CI.

## Nommage des branches

Format : `type/description-courte-en-minuscules`.

| Préfixe | Usage | Exemple |
| --- | --- | --- |
| `feat/` | nouvelle fonctionnalité | `feat/filtre-par-prix` |
| `fix/` | correction de bug | `fix/stock-negatif` |
| `docs/` | documentation seule | `docs/audit-et-contributing` |
| `ci/` | workflows GitHub Actions | `ci/pipeline-pull-request` |
| `chore/` | maintenance, dépendances, outillage | `chore/mise-a-jour-ruff` |
| `refactor/` | réécriture sans changement de comportement | `refactor/service-commandes` |
| `test/` | ajout ou correction de tests | `test/commandes-api` |

## Format des commits

[Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/) :

```text
type(portée facultative): description à l'impératif, en minuscules, sans point final
```

Types utilisés : `feat`, `fix`, `docs`, `test`, `ci`, `build`, `chore`, `refactor`, `perf`.

Exemples :

```text
feat(front): ajouter un filtre par statut
fix(api): refuser une commande sur un drop épuisé
docs: expliquer la procédure de retour arrière
ci: mettre en cache les dépendances pip et npm
feat(api)!: renommer le champ remaining en stock_left
```

Le `!` après le type (ou un pied de page `BREAKING CHANGE:`) signale un changement incompatible.

## Cycle d'une pull request

1. Mettre `main` à jour : `git switch main && git pull`.
2. Créer une branche : `git switch -c feat/ma-fonctionnalite`.
3. Commiter par petits changements cohérents, au format conventionnel.
4. Vérifier en local (voir la section « Qualité et tests » du README).
5. Pousser : `git push -u origin feat/ma-fonctionnalite`, puis ouvrir la PR en remplissant le modèle.
6. Attendre que la CI soit verte ; corriger sur la même branche si elle est rouge.
7. Faire relire la PR, puis la fusionner (squash de préférence, le titre de la PR suivant le format conventionnel).
8. Supprimer la branche, puis mettre à jour `CHANGELOG.md` si le changement est visible pour les utilisateurs.

## Versions

[Semantic Versioning](https://semver.org/lang/fr/) : `MAJEUR.MINEUR.CORRECTIF`.

- `fix` : le numéro de correctif augmente (1.0.0 devient 1.0.1) ;
- `feat` : le numéro mineur augmente (1.0.1 devient 1.1.0) ;
- changement incompatible : le numéro majeur augmente (1.1.0 devient 2.0.0).

Une version se publie en posant un **tag annoté** sur `main` :

```bash
git switch main && git pull
git tag -a v1.2.0 -m "Version 1.2.0"
git push origin v1.2.0
```

Le tag déclenche le workflow de déploiement (images, Pages, release).

## Ce qui ne doit jamais être commité

Le fichier `.env`, les mots de passe, jetons et clés, les bases de données locales (`*.db`), les dossiers `node_modules`, `.venv` et `dist`.
