# Find a Friend API

A RESTful API for pet adoption services, connecting people with pets available for adoption.

## Technologies

- **Node.js** - JavaScript runtime
- **TypeScript** - Static typing for JavaScript
- **Fastify** - Web framework
- **Prisma** - ORM for database interactions
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Vitest** - Testing framework
- **Docker** - Container platform
- **Zod** - Schema validation

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Docker and Docker Compose

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nicholascostadev/find-a-friend-api.git
cd find-a-friend-api
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables. You have two simple options for doing so:

    1. Copy the .env.example into .env 
       ```bash
       cp .env.example .env
       ```

    2. Create a .env file with the following variables
        ```bash
        # Create a .env file with the following variables
        DATABASE_URL="postgresql://docker:docker@localhost:5432/findafriend?schema=public"
        JWT_SECRET="your-jwt-secret"
        NODE_ENV="development"
        PORT=8080
        ```

### Running the Application

1. Start the database with Docker:
```bash
docker-compose up -d
```

2. Run database migrations:
```bash
pnpm prisma migrate dev
```

3. Start the development server:
```bash
pnpm start:dev
```

The API will be available at http://localhost:3333.

### Building for Production

```bash
pnpm build
pnpm start
```

## Testing

### Running Unit Tests

```bash
pnpm test
```

### Running Unit Tests in Watch Mode

```bash
pnpm test:watch
```

### Running E2E Tests

```bash
pnpm test:e2e
```

### Running E2E Tests in Watch Mode

```bash
pnpm test:e2e:watch
```

### Prisma Test Environment

The project implements a custom Vitest environment for E2E tests, which provides an isolated database schema for each test suite:

```
prisma/vitest-environment-prisma/
└── prisma-test-environment.ts  # Custom Vitest environment
```

Key features of the Prisma test environment:

1. **Isolated Test Database**: For each test run, it creates a unique PostgreSQL schema with a randomly generated UUID
2. **Automatic Setup and Teardown**: 
   - **Setup**: Creates a fresh schema and runs migrations to set up tables before tests
   - **Teardown**: Drops the schema after tests complete, ensuring no test data persists
3. **Environment Variables**: Modifies the `DATABASE_URL` environment variable during tests to point to the test schema
4. **Zero Test Interference**: Tests run in isolation without affecting other test suites or the development database

This approach offers several benefits:
- Tests run against a real database, not mocks, ensuring accurate behavior
- Each test starts with a clean database state
- Tests can run in parallel without data conflicts
- No manual cleanup required between test runs

The test environment is configured in `vite.config.ts` and used specifically for E2E tests in the `src/http/controllers` directory.

## Project Structure

```
find-a-friend-api/
├── prisma/                  # Prisma ORM configuration and migrations
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Database schema
│   └── vitest-environment-prisma/ # Prisma test environment
├── src/                     # Source code
│   ├── @types/              # TypeScript type definitions
│   ├── exceptions/          # Custom exception classes
│   ├── http/                # HTTP layer
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # HTTP middlewares
│   │   └── tests/           # HTTP tests
│   ├── lib/                 # Utility libraries
│   ├── repositories/        # Data access layer
│   │   ├── in-memory/       # In-memory repositories for testing
│   │   └── prisma/          # Prisma repositories implementation
│   ├── services/            # Business logic
│   │   ├── factories/       # Service factories
│   │   ├── organizations/   # Organization-related services
│   │   └── pets/            # Pet-related services
│   ├── app.ts               # Fastify application setup
│   └── server.ts            # Server entry point
├── docker-compose.yml       # Docker Compose configuration
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration for tests
```

The project follows a clean architecture approach with the following layers:
- **HTTP Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic
- **Repository Layer**: Responsible for data access
- **Domain Layer**: Defines domain models and business rules

## API Documentation

The API provides endpoints for:
- Organization registration and authentication
- Pet registration and management
- Searching for pets by location and characteristics
- Viewing detailed pet information

## Database Schema

The application uses a PostgreSQL database with the following main entities:
- Organizations - rescue groups and shelters with pets for adoption
- Pets - animals available for adoption
- Pet Requirements - specific requirements for adopting a pet

## Rules

### Application Rules

- [x] It must be possible to register a pet
- [x] It must be possible to list all pets available for adoption in a city
- [x] It must be possible to filter pets by their characteristics
- [x] It must be possible to view details of a pet for adoption
- [x] It must be possible to register as an ORG
- [x] It must be possible to login as an ORG

### Business Rules

- [x] To list pets, we must provide the city
- [x] An ORG needs to have an address and a WhatsApp number
- [x] A pet must be linked to an ORG
- [x] The user who wants to adopt will contact the ORG via WhatsApp
- [x] All filters, besides the city, are optional
- [x] For an ORG to access the application as admin, it needs to be logged in