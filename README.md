# NestJS microservices flights application

HTTP API gateway plus flights, passengers and users services communicating through RabbitMQ; MongoDB stores service data.

## Local development

1. In each directory (`api-gateway`, `microservice-flights`, `microservice-passengers`, `microservice-users`), run `npm ci`.
2. Configure each service's `.env.development`: `AMQP_URL`; database services also need `URI_MONGODB`. The gateway additionally uses `JWT_SECRET`, `EXPIRES_IN`, `APP_URL` and optional `PORT` (default 3000). Use local credentials.
3. Start RabbitMQ and MongoDB, then run `npm run start:dev` in all four directories.
4. Gateway Swagger: `http://localhost:3000/api/docs`; requests: `docs/api-superflights.postman_collection.json`.

## Docker and checks

Build every service with `npm run build` before `docker compose -f docker-compose.dev.yaml up --build`: the Dockerfiles copy existing `dist/` output. Compose reads root `.env` and exposes the gateway on port 80; its connection URLs must use the `rabbitmq` and `mongodb` service names. `docker-compose.yaml` instead pulls prebuilt images.

In each service: `npm test -- --runInBand`, `npm run test:e2e -- --runInBand`, `npm run test:cov`. Scaffold tests are not a full integration suite; running services needs RabbitMQ/MongoDB. Production without Docker: `npm run build`, then `npm run start:prod`.

RabbitMQ configuration regression (Node.js 18+): from `api-gateway`, run `node --test test/rabbitmq-config.test.cjs`.
