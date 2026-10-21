# ToolShare

ToolShare est une API Node.js/Express avec MongoDB et Mongoose.

Le backend est organisé sous `src/` en configurations, modèles, repositories,
services, contrôleurs, routes, middlewares et utilitaires. Les modules métier
encore vides sont des points de départ : ils ne fournissent pas de CRUD.

## Architecture

La vue d'ensemble, les composants déjà présents et les prochaines étapes de
l'architecture API sont décrits dans [docs/API_ARCHITECTURE.md](./docs/API_ARCHITECTURE.md).

## Démarrage

Copiez `.env.example` vers `.env`, puis démarrez les services avec Docker Compose :

```sh
docker compose -f docker-compose.yml up --build
```

L'API écoute sur le port `5000`. Les routes actuellement disponibles sont
`GET /` et `GET /api/v1/health`.