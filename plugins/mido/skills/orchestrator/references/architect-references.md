# Architect Reference Tables

## Output Formats

### Health Check (for existing system analysis)

```json
{
  "agent": "mido-architect",
  "assessment_type": "health_check",
  "findings": [
    {
      "area": "coupling",
      "severity": "medium",
      "finding": "UserService directly queries OrdersRepository, bypassing OrderService",
      "impact": "Changes to order storage require modifying both OrderService and UserService",
      "recommendation": "UserService should call OrderService.getOrdersForUser() instead",
      "adr_needed": true
    }
  ],
  "adrs_proposed": [],
  "tech_debt_score": "B+",
  "scalability_concerns": []
}
```

### Architecture Proposal (for greenfield or major restructuring)

```json
{
  "agent": "mido-architect",
  "assessment_type": "architecture_proposal",
  "problem_sizing": {
    "throughput": "2,000 writes/second (10k devices x 5s interval)",
    "read_load": "500 concurrent dashboard viewers",
    "storage_growth": "~17 GB/day (2k writes/s x 100 bytes x 86,400s)",
    "team_size": 5,
    "key_constraints": ["real-time updates required", "TypeScript team"]
  },
  "pattern": "modular_monolith",
  "pattern_rationale": "Team of 5 lacks operational maturity for microservices; monolith with clear module boundaries allows future extraction",
  "components": [
    {
      "name": "ingestion-module",
      "responsibility": "Receive and validate sensor data",
      "technology": "Bun HTTP server with WebSocket upgrade",
      "scaling_notes": "First extraction candidate -- isolate when write throughput exceeds 5k/s"
    }
  ],
  "communication_patterns": [
    {
      "from": "ingestion-module",
      "to": "storage-module",
      "protocol": "In-process function call (monolith); extract to message queue later",
      "why": "Simplicity now; extraction boundary is already defined"
    }
  ],
  "adrs_proposed": [
    {
      "title": "ADR-001: Modular monolith over microservices for initial launch",
      "status": "Proposed",
      "trade_offs_accepted": "Deployment coupling in exchange for simpler operations and strong consistency"
    }
  ],
  "evolution_triggers": [
    "Write throughput exceeds 5k/s -> extract ingestion-module",
    "Team grows beyond 10 -> evaluate per-module ownership",
    "Dashboard p95 exceeds 200ms -> add read replica or cache"
  ]
}
```

### Design Brief (for Phase 1 pre-implementation)

```json
{
  "agent": "mido-architect",
  "output_type": "design_brief",
  "pattern": "strategy_pattern_with_modular_monolith",
  "pattern_rationale": "Strategy pattern for notification channels because new channels should not require modifying existing code",
  "constraints": [
    "All sends MUST go through NotificationService -- no direct email/push calls",
    "Each channel adapter MUST implement NotificationChannel interface",
    "Rate limiting MUST be per-user per-channel with configurable windows",
    "Send operations MUST be idempotent via idempotency key"
  ],
  "interface_contracts": [
    "NotificationChannel { send(recipient: UserId, message: RenderedMessage): Promise<SendResult> }",
    "NotificationService.dispatch(userId, templateId, data, channels?): Promise<DispatchResult>"
  ],
  "first_extraction_trigger": "Extract when send volume exceeds 10k/min",
  "anti_patterns": [
    "Do NOT put channel-specific formatting in NotificationService",
    "Do NOT query user preferences inside channel adapters"
  ]
}
```

## SSRF Protection Pattern (Reference)

**OutboundRequestGuard middleware contract:**

- **Input**: URL string (from user/webhook/integration)
- **Validation steps (all mandatory):**
  1. Parse URL -- reject malformed, reject non-HTTP(S) schemes (file://, ftp://, gopher://)
  2. Resolve DNS BEFORE making request -- prevents DNS rebinding
  3. Validate resolved IP -- reject private/reserved: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16, ::1, fc00::/7
  4. Optional allowlist for known domains
  5. Re-validate resolved IP at each redirect hop
- **Output**: Validated URL + resolved IP, or rejection with reason
- **Enforcement**: All endpoints making outbound HTTP requests from user input MUST call OutboundRequestGuard

## Extraction Candidate Signal Table

| Signal | Example | Weight |
|---|---|---|
| **Scaling mismatch** | Auth: 100 req/s steady; Tracking: 1,000 req/s with 10x spikes | High |
| **Team ownership** | Payments team owns billing; core team owns everything else | High |
| **Deployment frequency** | Notification templates change daily; core logic ships weekly | Medium |
| **Data isolation** | Payment card data must be isolated from analytics | High |
| **Failure blast radius** | Tracking outage must not take down order placement | Medium |

When >= 2 high-weight or >= 3 signals total are present, name it as the **first extraction candidate** with a concrete trigger metric.

## Breaking vs Non-Breaking Change Classification

| Change type | Breaking? | Action |
|---|---|---|
| Add optional field to response | No | Ship, document |
| Add required field to request | **Yes** | New version |
| Rename response field | **Yes** | New version |
| Remove endpoint | **Yes** | Deprecate → sunset → remove |
| Change status code semantics | **Yes** | New version |
| Add new endpoint | No | Ship, document |
| Tighten existing validation | **Yes** | New version |
| Loosen existing validation | No | Ship, verify clients |
