# .mido/config.yml Schema

This file lives at the project root in `.mido/config.yml`. It's created by `/mido:init` and
read at the start of every subsequent command.

## Full Schema

```yaml
# Project identity
project:
  name: "nextsaga"                          # Project name
  description: "Walk delivery platform"     # One-line description
  type: "monorepo"                          # monorepo | single
  domain: "saas"                            # web | mobile | saas | ecommerce | api | realtime

# Technical stack
stack:
  languages:
    - name: "typescript"
      version: "5.x"
    - name: "dart"
      version: "3.x"
  frameworks:
    - "elysia"
    - "flutter"
    - "riverpod"
  runtime: "bun"                            # bun | node | deno | python | cargo | go
  package_managers:
    - "bun"
    - "pub"
  databases:
    - type: "postgresql"
      orm: "drizzle"
    - type: "postgis"
  linter: "oxlint"                          # oxlint | eslint | pylint | clippy | golangci-lint
  formatter: "oxfmt"                        # oxfmt | prettier | black | rustfmt | gofmt

# Architecture per app/workspace
architecture:
  apps/server:
    pattern: "layered"                      # layered | clean | hexagonal | cqrs | event-sourced
    layers: "routes → services → repositories"
    validation: "elysia t.* at routes, zod at service boundaries"
  apps/flutter:
    pattern: "mvvm"                         # mvvm | mvc | clean | bloc
    state: "riverpod"
    navigation: "go_router"
    models: "freezed sealed classes"

# Project structure (for monorepos)
structure:
  directories:
    apps/server: "Backend API (TypeScript/Elysia)"
    apps/flutter: "Mobile app (Dart/Flutter)"
    apps/infra: "Infrastructure (Docker/PostGIS)"
    packages/design-system: "Shared design tokens"

# Non-negotiable project rules
constraints:
  - "No `any` types — use `unknown` and narrow, or parse with Zod"
  - "No `console.log` — use structured logging (pino)"
  - "No relative imports — use `@/` path aliases"
  - "Named exports only, no default exports"
  - "No magic strings or numbers — use named constants"
  - "uuidv7() for all generated IDs"
  - "timestamp with time zone for all timestamp columns"
  - "Plural table names everywhere"
  - "No `as` variable casting — parse using Zod"
  - "Password hashing: argon2id via @node-rs/argon2"

# Testing
testing:
  frameworks:
    - name: "vitest"
      for: "typescript"
    - name: "flutter_test"
      for: "dart"
  coverage_target: 80                       # percentage
  require_tests_for_new_code: true

# Deployment
deployment:
  targets:
    - platform: "docker"
      config: "apps/infra/docker-compose.yml"
    - platform: "app-store"
      app: "apps/flutter"
  ci: "github-actions"

# Documentation
documentation:
  changelog: true                           # maintain CHANGELOG.md
  claude_md: true                           # evolve CLAUDE.md files
  api_docs: true                            # generate API documentation
  adr: true                                 # architecture decision records

# Mido internal state
mido:
  version: "1.0.0"
  initialised_at: "2026-03-24T21:00:00Z"
  last_task: "2026-03-24T22:30:00Z"
  last_analysis: null
  reports_dir: ".mido/reports"
  agents_version: "1.0.0"                  # tracks which version of mido agents generated this
```

## Required Fields

These fields must be present after init:
- `project.name`
- `project.description`
- `project.type`
- `stack.languages` (at least one)
- `constraints` (at least one)
- `mido.version`
- `mido.initialised_at`
- `mido.reports_dir`

## Optional Fields

Everything else is optional and can be added incrementally. Mido will suggest additions
during init based on what it detects in the codebase and the project's domain.

## Stack Drift Detection

On every `/mido:task` and `/mido:analyse`, mido runs stack detection and compares with
the config. If new languages, frameworks, or databases are detected that aren't in the config,
mido reports it as "stack drift" and offers to update the config.
