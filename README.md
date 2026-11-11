# HR Management System

Production-ready HR Management System monorepo featuring Next.js (App Router), NestJS, MySQL 8, TypeORM, Bun, Tailwind CSS v4, and NixOS development environment.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- Optional: [Nix](https://nixos.org/) with Flakes enabled (or `nix-shell`)
- Optional for local run: [Bun](https://bun.sh/) (v1.1+)

> **NixOS Note:** Ensure Docker is enabled in your `configuration.nix` (`virtualisation.docker.enable = true;`) and your user is added to the `docker` group (`users.users.<user>.extraGroups = [ "docker" ];`).

## Quick Start

### 1. Dev Shell (Nix)

```bash
# Using Nix flakes
nix develop

# Or using classic nix-shell
nix-shell
```

`direnv` is also configured via `.envrc` (`use flake`).

### 2. Run with Docker Compose

```bash
# Start production containers (DB, Backend, Frontend)
make up

# Tail logs
make logs

# Stop containers
make down
```

### 3. Local Development (Hot Reload)

```bash
# Start development mode with bind mounts and live reloading
make dev
```

### 4. Seed Demo Data

The default initialization loads the strict exercise seed (5 employees, 8 attendance records). To load the extended demo dataset (40+ employees, Q2 weekday attendance) for chart visualization:

```bash
make seed-demo
```

To reset the database back to clean exercise seed:

```bash
make reset-db
```

## URLs & Ports

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:4000/api | 4000 |
| Swagger Docs | http://localhost:4000/api/docs | 4000 |
| MySQL Database | localhost:3306 | 3306 |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `db` (or `localhost`) |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | MySQL database name | `hr_db` |
| `DB_USER` | MySQL user | `hr_user` |
| `DB_PASSWORD` | MySQL password | `hr_password` |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `root_password` |
| `PORT` | Backend listening port | `4000` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Frontend browser API URL | `http://localhost:4000/api` |
| `API_URL_INTERNAL` | Frontend internal SSR URL | `http://backend:4000/api` |
| `PORT_FRONTEND` | Frontend listening port | `3000` |

## Bun + NestJS Architecture

NestJS relies on TypeScript's `emitDecoratorMetadata`, which Bun's native transpiler does not emit. Consequently:
- Dependencies are managed and installed with **Bun**.
- The backend is compiled using `nest build` (`tsc`).
- Production execution runs the compiled output directly via `bun dist/main.js`.
- Development watcher runs `nest start --watch` (or `bun run start:dev`).

## API Endpoints

### Health
- `GET /api/health` - Database connection and healthcheck

### Departments
- `GET /api/departments` - List departments
- `GET /api/departments/:id` - Department detail
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Employees
- `GET /api/employees` - List employees with department relation
- `GET /api/employees/:id` - Employee detail
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Salaries
- `GET /api/salaries` - List salary records
- `GET /api/salaries/:id` - Salary detail
- `POST /api/salaries` - Create salary record
- `PUT /api/salaries/:id` - Update salary record
- `DELETE /api/salaries/:id` - Delete salary record

### Attendance
- `GET /api/attendance` - Filter by `from`, `to`, `employeeId`, `status`
- `GET /api/attendance/:id` - Attendance detail
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `DELETE /api/attendance/:id` - Delete attendance record

### Dashboard
- `GET /api/dashboard/summary` - KPI summary with sparkline series

### Analytics
- `GET /api/analytics/headcount-by-department`
- `GET /api/analytics/payroll-by-department`
- `GET /api/analytics/salary-distribution`
- `GET /api/analytics/salary-range-by-department`
- `GET /api/analytics/top-earners?limit=10`
- `GET /api/analytics/salary-vs-bonus`
- `GET /api/analytics/bonus-ratio`
- `GET /api/analytics/attendance/status-distribution`
- `GET /api/analytics/attendance/daily-trend`
- `GET /api/analytics/attendance/by-department`
- `GET /api/analytics/attendance/by-employee`
- `GET /api/analytics/attendance/by-weekday`
- `GET /api/analytics/attendance/heatmap`
- `GET /api/analytics/attendance/flow`
- `GET /api/analytics/department-scorecard`

### Report
- `GET /api/report` - Paginated, filtered, sortable HR report (LEFT JOINs)
- `GET /api/report/export` - Filtered report CSV download

## Deploying on Render

You can deploy the HR Management System on Render using either the **1-Click Unified Container** (simplest, single free web service) or as **Separate Microservices** via Render Blueprints.

### Option A: 1-Click Unified Web Service (Recommended for Render Free Tier)

Runs both Next.js and NestJS in a single Web Service with internal proxy routing.

1. Create a free MySQL database on a cloud provider (e.g. [Aiven](https://aiven.io), [TiDB Cloud](https://tidbcloud.com), or [Railway](https://railway.app)).
2. In the MySQL database, run `db/init/01-schema.sql` and `db/init/02-seed.sql` (and optionally `db/demo/03-demo-data.sql`).
3. In Render Dashboard: Click **New +** -> **Web Service**.
4. Connect your GitHub repository (`rezwanahmedratul/HR-Management-System`).
5. Configure:
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./Dockerfile` (or leave default `Dockerfile`)
   - **Docker Context:** `.` (default)
6. Under **Environment Variables**, add:
   - `DB_HOST`: Your remote MySQL host
   - `DB_PORT`: `3306` (or provider's port)
   - `DB_NAME`: Your database name
   - `DB_USER`: Your database username
   - `DB_PASSWORD`: Your database password
   - `DB_SSL`: `true` (if using cloud MySQL like Aiven/TiDB)
7. Click **Deploy Web Service**. Render will build and launch the application!

### Option B: Render Blueprint (`render.yaml`)

1. In Render Dashboard, click **Blueprints** -> **New Blueprint Instance**.
2. Select your repository.
3. Render reads `render.yaml` automatically and configures the service and health checks.
4. Fill in the requested database credentials in the environment prompt and click **Apply**.

