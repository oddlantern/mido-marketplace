# Report Metadata Reference

## Pentest Report Meta Tags

```html
<meta name="mido-report-type" content="pentest">
<meta name="mido-target" content="https://api.staging.example.com">
<meta name="mido-scope" content="api,web,infra">
<meta name="mido-findings-total" content="12">
<meta name="mido-findings-chains" content="1">
<meta name="mido-findings-remediated" content="9">
<meta name="mido-findings-manual" content="2">
<meta name="mido-findings-accepted" content="1">
<meta name="mido-post-exploitation-scope" content="47000-user-documents">
<meta name="mido-date" content="2026-03-25">
```

## Task/Analysis Report Meta Tags

```html
<meta name="mido-summary" content="1-line summary of the task and outcome">
<meta name="mido-type" content="task|init|analysis|pentest">
<meta name="mido-health-score" content="B (78)">
```

## Per-Report-Type mido-summary Format

| Report Type | mido-summary Format | Example |
|---|---|---|
| **task** | "[Action verb phrase]. [N] files changed, [blocker outcome]." | `"Added walk_sizes table and POST endpoint. 3 files changed, 0 blockers."` |
| **analysis** | "Health [grade] ([score]) — [N critical/high findings]. [N]-workspace [stack] repo." | `"Health B (78) — 1 high, 3 medium findings. 2-workspace TypeScript + Dart repo."` |
| **init** | "Initialised [project_name]: [languages]. [N] CLAUDE.md rules, [N] suggestions applied." | `"Initialised walk-app: TypeScript + Dart. 18 rules, 5 suggestions applied."` |
| **pentest** | "Pentest: [N] findings ([N chains]). [N] remediated, [N] open. Health: [grade]." | `"Pentest: 12 findings (1 chain). 9 remediated, 3 open. Severity: 1 critical, 3 high."` |
