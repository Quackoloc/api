# Quackoloc - API

A modern **RESTful API** built with **NestJS** and **TypeScript**, designed to provide a robust and scalable backend for
shared housing management.

## Technologies

* **NestJS** – Progressive Node.js framework
* **TypeScript** – Strongly typed programming language
* **TypeORM** – ORM for database interaction
* **PostgreSQL** – Relational database
* **JWT** – Authentication
* **Docker** – Containerization
* **Jest** – Unit and integration testing
* **ESLint** + **Prettier** – Code quality and formatting

---

## Requirements

* Node.js (version specified in `.nvmrc`)
* npm or yarn
* Docker & Docker Compose

---

## Installation

1. Use the correct Node.js version:

   ```bash
   nvm use
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Then edit the .env file with your configurations
   ```

4. Start the database with Docker:

   ```bash
   docker-compose up -d
   ```

5. Run migrations:

    ```bash
    npm run migration:run
    ```

Refer to the [Migrations](#migrations) section for more information about database migrations.

---

## Development

* Start the application in development mode:

  ```bash
  npm run start:dev
  ```

* The API will be available at: `http://localhost:3000`

---

## Migrations

This project uses **TypeORM** for database migrations.

> Migrations are stored in the `migrations/` directory.
> Make sure the database is running before executing these commands.

### Create an empty migration

```bash
npm run migration:create -- name-of-the-migration
```

### Generate a migration from entities

```bash
npm run migration:generate -- name-of-the-migration
```

### Run migrations

```bash
npm run migration:run
```

### Revert the last migration

```bash
npm run migration:revert
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

---

## Linting & Formatting

```bash
# Check for lint errors
npm run lint

# Automatically fix lint errors
npm run lint:fix

# Format code
npm run format
```

---

## Project Structure

```
src/
├── app/                    # Core application modules
│   ├── user/               # User module
│   │   ├── application/    # Use cases
│   │   ├── domain/         # Entities & interfaces
│   │   └── infrastructure/ # Implementations & repositories
│   └── ...
├── common/                 # Shared code between modules
│   ├── decorators/         # Custom decorators
│   ├── exceptions/         # Custom exceptions
│   └── interfaces/         # Shared interfaces
├── config/                 # Configuration files
├── middleware/             # Custom middleware
├── main.ts                 # Application entry point
└── data-source.ts          # TypeORM configuration
```

---

## Docker

```bash
# Build the Docker image
docker-compose build

# Start containers
docker-compose up -d

# Stop containers
docker-compose down
```

---

## Contributing

1. Create a feature branch:

   ```bash
   git checkout -b feature/QUAC-jira-ticket-number # e.g. feature/QUAC-51
   ```

2. Commit your changes:

   ```bash
   git commit -m "feat(scope): [QUAC-jira-ticket-number] add new feature"
   ```

3. Push to the remote repository:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request
