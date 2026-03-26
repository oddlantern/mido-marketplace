# Stack Detection Reference

Mido runs stack detection at the start of every TASK and ANALYSE to understand the current
state of the project. Compare results with `.mido/config.yml` to detect stack drift.

## Detection Logic

Scan the project root and immediate subdirectories for these indicators.

### Language Detection

| Indicator File | Language | Confidence |
|---|---|---|
| `package.json` | JavaScript/TypeScript | High |
| `tsconfig.json` | TypeScript | High |
| `pubspec.yaml` | Dart | High |
| `Cargo.toml` | Rust | High |
| `go.mod` | Go | High |
| `requirements.txt` or `pyproject.toml` or `setup.py` | Python | High |
| `composer.json` | PHP | High |
| `Gemfile` | Ruby | High |
| `pom.xml` or `build.gradle` or `build.gradle.kts` | Java/Kotlin | High |
| `Package.swift` | Swift | High |
| `*.sol` files | Solidity | Medium |
| `CMakeLists.txt` or `Makefile` | C/C++ | Medium |

### Framework Detection

| Indicator | Framework | Language |
|---|---|---|
| `"elysia"` in package.json deps | Elysia | TypeScript |
| `"express"` in package.json deps | Express | TypeScript/JS |
| `"@nestjs/core"` in package.json deps | NestJS | TypeScript |
| `"next"` in package.json deps | Next.js | TypeScript/JS |
| `"react"` in package.json deps | React | TypeScript/JS |
| `"vue"` in package.json deps | Vue | TypeScript/JS |
| `"svelte"` in package.json deps | Svelte | TypeScript/JS |
| `"flutter"` in pubspec.yaml deps | Flutter | Dart |
| `"riverpod"` in pubspec.yaml deps | Riverpod | Dart |
| `"fastapi"` in requirements.txt | FastAPI | Python |
| `"django"` in requirements.txt | Django | Python |
| `"actix-web"` in Cargo.toml deps | Actix | Rust |
| `"axum"` in Cargo.toml deps | Axum | Rust |
| `"gin"` in go.mod | Gin | Go |
| `"laravel"` in composer.json | Laravel | PHP |

### Package Manager Detection

| Indicator | Package Manager |
|---|---|
| `bun.lockb` or `bun.lock` | bun |
| `package-lock.json` | npm |
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |
| `pubspec.lock` | pub (Dart) |
| `Cargo.lock` | cargo |
| `go.sum` | go modules |
| `Pipfile.lock` or `poetry.lock` | pip/poetry |
| `composer.lock` | composer |

### Database Detection

| Indicator | Database |
|---|---|
| `"drizzle-orm"` in deps | PostgreSQL (via Drizzle) |
| `"prisma"` in deps | PostgreSQL/MySQL (via Prisma) |
| `"@prisma/client"` in deps | PostgreSQL/MySQL (via Prisma) |
| `"typeorm"` in deps | Various (via TypeORM) |
| `"sqlalchemy"` in deps | Various (via SQLAlchemy) |
| `"diesel"` in Cargo.toml | PostgreSQL/MySQL (via Diesel) |
| `docker-compose.yml` with `postgis` | PostGIS |
| `docker-compose.yml` with `postgres` | PostgreSQL |
| `docker-compose.yml` with `redis` | Redis |
| `docker-compose.yml` with `mongo` | MongoDB |

### Linter/Formatter Detection

| Indicator | Tool |
|---|---|
| `.oxlintrc.json` or `oxlint` in scripts | oxlint |
| `.eslintrc.*` or `eslint.config.*` | ESLint |
| `.prettierrc.*` | Prettier |
| `biome.json` | Biome |
| `analysis_options.yaml` | Dart analyzer |
| `rustfmt.toml` | rustfmt |
| `.golangci.yml` | golangci-lint |

## Output Format

```json
{
  "detected_at": "2026-03-24T21:30:00Z",
  "languages": [
    { "name": "typescript", "confidence": "high", "indicators": ["tsconfig.json", "package.json"] },
    { "name": "dart", "confidence": "high", "indicators": ["pubspec.yaml"] }
  ],
  "frameworks": [
    { "name": "elysia", "language": "typescript", "indicator": "package.json deps" },
    { "name": "flutter", "language": "dart", "indicator": "pubspec.yaml deps" },
    { "name": "riverpod", "language": "dart", "indicator": "pubspec.yaml deps" }
  ],
  "package_managers": ["bun", "pub"],
  "databases": [
    { "type": "postgresql", "orm": "drizzle", "indicator": "drizzle-orm in package.json" },
    { "type": "postgis", "indicator": "docker-compose.yml" }
  ],
  "linters": ["oxlint", "dart-analyzer"],
  "formatters": ["oxfmt"],
  "config_files": ["tsconfig.json", "pubspec.yaml", "docker-compose.yml", ".oxlintrc.json"],
  "project_type": "monorepo",
  "workspaces": ["apps/server", "apps/flutter", "apps/infra", "packages/design-system"]
}
```

## Stack Drift

After detection, compare with `.mido/config.yml`:

- **New language detected** → Report as drift, offer to update config
- **New framework detected** → Report as drift, offer to update config
- **Language removed** → Report as drift, offer to clean config
- **New database detected** → Report as drift, offer to update config

Stack drift is informational, not blocking. Include in the task report.
