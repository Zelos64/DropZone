Étape 1 — Créer le fichier de configuration  
`cp .env.example .env`  

Étape 2 — Construire et démarrer les trois services  
`docker compose up --build -d`  

Étape 3 — Vérifier les conteneurs  
`docker compose ps`

Étape 4 — Consulter les logs  
`docker compose logs -f`

Étape 5 — Arrêter l'application  
`docker compose down -v`  
*`-v` sert à supprimer également les données PostgreSQL*

Dernière étape : valider le résultat  
```
docker compose config
docker compose build
docker compose up -d
docker compose ps
```