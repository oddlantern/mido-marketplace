---
description: "Run a full codebase analysis — dispatch all review agents, generate findings report, and offer automated fix cycle. Use when: analyse, analyze, review, audit, dispatch reviewers, dispatch agents, run agents, codebase health, security sweep, mido analyse."
---

# /mido:analyse — Codebase Analysis

This is a shortcut into mido's **ANALYSE** mode.

## Execution

1. Read the main orchestrator skill at `skills/mido/SKILL.md` (relative to this plugin).
2. Verify mido is initialized (`.mido/config.yml` exists). If not, run INIT first.
3. Execute the **ANALYSE** flow exactly as documented there — all steps including the post-analysis fix cycle offer.
4. All rules from the main skill apply in full.

This wrapper exists for discoverability. The main skill contains all implementation detail.
