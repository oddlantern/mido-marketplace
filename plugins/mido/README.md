# Mido — Autonomous Development Orchestrator

Mido is a persistent development orchestrator that takes over your coding session. Once initialized on a codebase, every interaction flows through its specialist agent pipeline — code review, security analysis, testing, documentation, and reporting happen automatically.

## What it does

- Detects your stack (language, framework, architecture) and adapts to it
- Dispatches 8 specialist agents for every code change
- Generates HTML reports for every task, analysis, and pentest
- Learns your project conventions and enforces them
- Works with any language: TypeScript, Dart, Python, Rust, Go, PHP, Swift, Kotlin

## Agents

| Agent | Role |
|---|---|
| mido-engineer | Writes code across all languages and platforms |
| mido-reviewer | Reviews code for quality, correctness, maintainability |
| mido-security | Security analysis, threat modeling, vulnerability detection |
| mido-architect | System design, architecture decisions, trade-off analysis |
| mido-tester | Test generation, execution, coverage analysis |
| mido-scribe | Documentation, changelogs, CLAUDE.md evolution |
| mido-guardian | Constraint enforcement, reality checking, compliance |
| mido-pentester | Active penetration testing, exploitation, re-verification |

## Modes

| Command | Mode | What it does |
|---|---|---|
| `/mido:init` | INIT | Set up mido on a new codebase |
| `/mido:task` | TASK | Execute development work with full agent pipeline |
| `/mido:analyse` | ANALYSE | Deep codebase analysis without making changes |
| `/mido:pentest` | PENTEST | Active penetration testing |
| `/mido:report` | REPORT | View and compare past reports |

You don't need to use commands explicitly. Once initialized, mido infers the mode from natural language: "add a health check endpoint" routes to TASK, "how's the codebase looking?" routes to ANALYSE.

## Setup

Install the plugin in Claude Cowork or Claude Code. No environment variables or external services required — mido uses only the tools available in your Claude session.

## Usage

1. Open a project folder in Cowork
2. Say "mido" or "dispatch agents" or just start asking for code changes
3. Mido initializes itself on first contact (creates `.mido/config.yml`)
4. Every subsequent request goes through the full agent pipeline
