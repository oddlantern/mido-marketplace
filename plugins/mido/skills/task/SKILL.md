---
name: task
description: "Execute a development task through mido's full agent pipeline — plan, implement, review, and validate. Use when: build, add, fix, implement, create, change, task, mido task."
---

# /mido:task — Execute Development Task

This is a shortcut into mido's **TASK** mode.

## Execution

1. Read the main orchestrator skill at `skills/mido/SKILL.md` (relative to this plugin).
2. Verify mido is initialized (`.mido/config.yml` exists). If not, run INIT first.
3. Execute the **TASK** flow exactly as documented there — all 7 phases, all agent dispatches, all checkpoints.
4. All rules from the main skill apply in full.

This wrapper exists for discoverability. The main skill contains all implementation detail.
