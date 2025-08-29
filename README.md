# Deno + HTMX + PostgreSQL Todo App

A modern full-stack todo application built with the latest Deno ecosystem libraries, HTMX for dynamic interactions, and
PostgreSQL for data persistence.

## Features

- 🦕 **Deno 2.x** with modern JSR imports
- ⚡ **HTMX** for seamless server-side rendered interactions
- 🐘 **PostgreSQL 17** for reliable data storage
- 🐳 **Docker Compose** for easy development setup
- 🔄 **Auto-migrations** with sample data
- 📦 **Connection pooling** with enhanced error handling
- 🛡️ **CORS support** and security best practices

## Quick Start

### Prerequisites

- [Deno](https://deno.land/) 2.x or later
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

### Installation & Setup

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo-url>
   cd DAN

   # Install/update Deno to latest version
   deno upgrade
   ```

2. **Start the development environment:**
   ```bash
   # Start PostgreSQL database
   docker compose up -d db

   # Wait for database to be ready, then run migrations
   deno task migrate
   ```

3. **Start the development server:**
   ```bash
   # Start the Deno server
   deno task dev

   # Or run everything with Docker
   docker compose up
   ```

4. **Open your browser:**
   ```
   http://localhost:8000
   ```

## Available Scripts

- `deno task dev` - Start development server
- `deno task start` - Start production server
- `deno task migrate` - Run database migrations

## Project Structure

```
src/
├── config/
│   └── db.ts              # Database configuration
├── db/
│   ├── pool.ts           # Connection pool with error handling
│   └── migrate.ts        # Database migrations
├── features/
│   └── todos/
│       ├── router.ts     # Todo routes and HTMX templates
│       └── service.ts    # Todo business logic
├── middleware/
│   └── logger.ts         # Request logging middleware
├── router.ts             # Enhanced router with CORS
└── server.ts             # Main server with graceful shutdown
```

## Technology Stack

| Component      | Version   | Purpose                        |
| -------------- | --------- | ------------------------------ |
| **Deno**       | 2.3.4     | Runtime and package management |
| **@std/http**  | ^1.0.8    | Modern HTTP server (JSR)       |
| **postgres**   | v0.19.5   | PostgreSQL driver              |
| **HTMX**       | 1.9.10    | Dynamic HTML interactions      |
| **PostgreSQL** | 17-alpine | Database                       |

## Key Updates from Legacy Versions

- ✅ Migrated from `https://deno.land/std@` to `jsr:@std/`
- ✅ Updated PostgreSQL driver from v0.17.0 to v0.19.5
- ✅ Enhanced connection pooling (10 connections)
- ✅ Added graceful shutdown handling
- ✅ Improved error handling and logging
- ✅ Production-ready TLS support
- ✅ Modern Docker setup with health checks

## API Endpoints

- `GET /` - Todo app homepage with HTMX interface
- `GET /todos` - Get all todos (JSON API)
- `POST /todos` - Create new todo (HTMX form)
- `PUT /todos/:id/toggle` - Toggle todo completion (HTMX)
- `DELETE /todos/:id` - Delete todo (HTMX)

## Environment Variables

| Variable     | Default     | Description       |
| ------------ | ----------- | ----------------- |
| `PGHOST`     | localhost   | PostgreSQL host   |
| `PGPORT`     | 5432        | PostgreSQL port   |
| `PGUSER`     | deno        | Database user     |
| `PGPASSWORD` | secret      | Database password |
| `PGDATABASE` | denodb      | Database name     |
| `PORT`       | 8000        | Server port       |
| `DENO_ENV`   | development | Environment mode  |

## Development

### Running Tests

```bash
# Add your test files to a tests/ directory
deno test --allow-all
```

### Database Operations

```bash
# Connect to database
docker compose exec db psql -U deno -d denodb

# View logs
docker compose logs -f db
docker compose logs -f api
```

### Adding New Features

1. Create feature directory in `src/features/`
2. Add router, service, and templates
3. Register router in `src/server.ts`
4. Add database migrations if needed

## Production Deployment

1. **Environment Setup:**
   ```bash
   export DENO_ENV=production
   export PGHOST=your-production-db-host
   # ... other production variables
   ```

2. **Deploy with Docker:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

## Troubleshooting

**Database Connection Issues:**

```bash
# Check if PostgreSQL is running
docker compose ps db

# View database logs
docker compose logs db

# Reset database
docker compose down -v && docker compose up -d db
```

**Deno Permission Issues:**

- Ensure you're using `--allow-all` or specific permissions
- Check file paths are absolute when needed

**HTMX Not Working:**

- Verify HTMX script is loaded in templates
- Check browser console for errors
- Ensure CORS headers are properly set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own applications.
