include .env
export $(shell [ -f .env ] && sed 's/=.*//' .env)

.PHONY: up down dev logs reset-db build seed-demo clean

up:
	docker compose up --build -d

down:
	docker compose down

dev:
	docker compose -f docker-compose.dev.yml up --build

logs:
	docker compose logs -f

build:
	docker compose build

reset-db:
	docker compose down -v
	docker compose up --build -d

seed-demo:
	docker compose exec -T db mysql -u$${DB_USER:-hr_user} -p$${DB_PASSWORD:-hr_password} $${DB_NAME:-hr_db} < db/demo/03-demo-data.sql
	@echo "Demo dataset loaded successfully."

clean:
	docker compose down -v --remove-orphans
