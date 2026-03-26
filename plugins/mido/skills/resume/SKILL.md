---
name: resume
description: "Resume pending work from a previous session — deferred fix cycles, interrupted batches, or incomplete tasks. Use when: resume, pick up where we left off, continue fixes, pending fixes, what was I working on, mido resume."
---

# /mido:resume — Resume Pending Work

This is a shortcut into mido's **RESUME** mode.

## Execution

1. Read the main orchestrator skill at `skills/orchestrator/SKILL.md` (relative to this plugin).
2. Verify mido is initialized (`.mido/config.yml` exists). If not, run INIT first.
3. Execute the **Resume Flow** exactly as documented there — check MEMORY.md for pending fix cycles and other deferred work.
4. All rules from the main skill apply in full.

This wrapper exists for discoverability. The main skill contains all implementation detail.
