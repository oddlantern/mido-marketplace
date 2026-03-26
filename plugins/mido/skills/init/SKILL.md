---
name: init
description: "Initialize mido on the current codebase — detect stack, generate config, create CLAUDE.md, and produce the first health report. Use when: init, initialize, set up mido, start mido, scaffold mido, mido init."
---

# /mido:init — Initialize Orchestrator

This is a shortcut into mido's **INIT** mode.

## Execution

1. Read the main orchestrator skill at `skills/mido/SKILL.md` (relative to this plugin).
2. Execute the **INIT** flow exactly as documented there — no steps skipped.
3. All rules, checkpoints, and post-init resumption logic from the main skill apply in full.

This wrapper exists for discoverability. The main skill contains all implementation detail.
