# Security Checklist

Mido runs this during Phase 5 (Security Sweep) of every task and during `/mido:analyse`.

## OWASP Top 10 Review

### A01: Broken Access Control
- [ ] All endpoints require authentication (unless explicitly public)
- [ ] Authorisation checked at service layer, not just route level
- [ ] IDOR prevention: user can only access their own resources
- [ ] CORS configured with specific origins, not wildcard
- [ ] Directory traversal prevention on file operations
- [ ] Rate limiting on sensitive endpoints (auth, payment, admin)

### A02: Cryptographic Failures
- [ ] Passwords hashed with argon2id, bcrypt, or scrypt (never MD5, SHA-1, SHA-256 alone)
- [ ] Sensitive data encrypted at rest
- [ ] TLS enforced for all connections
- [ ] No secrets in code, logs, or error messages
- [ ] Secure random number generation for tokens
- [ ] Key rotation strategy documented

### A03: Injection
- [ ] Parameterised queries for all database operations
- [ ] No string concatenation in queries
- [ ] HTML output escaped / sanitised
- [ ] Template injection prevention
- [ ] OS command injection prevention (no shell exec with user input)

### A04: Insecure Design
- [ ] Threat model exists for security-critical features
- [ ] Business logic validated server-side
- [ ] Anti-automation measures for abuse-prone endpoints
- [ ] Fail securely — errors don't bypass security controls

### A05: Security Misconfiguration
- [ ] Debug mode disabled in production
- [ ] Unnecessary features/endpoints disabled
- [ ] Security headers set (CSP, X-Frame-Options, X-Content-Type-Options, HSTS)
- [ ] Default credentials changed
- [ ] Error responses don't leak stack traces or internal details

### A06: Vulnerable Components
- [ ] Dependencies up to date
- [ ] No known CVEs in dependency tree
- [ ] Dependency audit passing (see commands below)
- [ ] Unused dependencies removed

### A07: Authentication Failures
- [ ] Strong password policy enforced
- [ ] Account lockout after failed attempts
- [ ] Secure session management (HttpOnly, Secure, SameSite cookies)
- [ ] Token expiry and rotation
- [ ] MFA available for sensitive accounts

### A08: Data Integrity Failures
- [ ] Webhook signatures verified
- [ ] CI/CD pipeline secured (no arbitrary code execution)
- [ ] Software updates verified (checksums, signatures)

### A09: Logging & Monitoring Failures
- [ ] Security events logged (login, failed auth, permission denied, data access)
- [ ] Logs don't contain sensitive data (passwords, tokens, PII)
- [ ] Log injection prevention
- [ ] Alerting on suspicious patterns

### A10: SSRF
- [ ] URL inputs validated against allowlist
- [ ] Internal network not accessible via user-provided URLs
- [ ] DNS rebinding prevention
- [ ] Redirect following disabled or restricted

## Dependency Audit Commands

```yaml
typescript/bun:
  audit: "bun audit"
  outdated: "bun outdated"

typescript/npm:
  audit: "npm audit"
  outdated: "npm outdated"

typescript/pnpm:
  audit: "pnpm audit"
  outdated: "pnpm outdated"

python:
  audit: "pip audit"
  safety: "safety check"
  outdated: "pip list --outdated"

rust:
  audit: "cargo audit"
  outdated: "cargo outdated"

go:
  vuln: "govulncheck ./..."
  outdated: "go list -u -m all"

dart:
  outdated: "dart pub outdated"
  audit: "dart pub deps --json | jq '.packages[] | select(.kind == \"direct\")'"

php:
  audit: "composer audit"
  outdated: "composer outdated --direct"

ruby:
  audit: "bundle audit check --update"
  outdated: "bundle outdated"

java:
  audit: "mvn dependency-check:check"
  outdated: "mvn versions:display-dependency-updates"
```

## Secrets Scanning Patterns

### High Confidence (almost always real secrets)
```regex
AKIA[0-9A-Z]{16}                                    # AWS Access Key
-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY----- # Private keys
eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}       # JWT tokens
ghp_[A-Za-z0-9_]{36}                                # GitHub PAT
sk-[A-Za-z0-9]{48}                                   # OpenAI/Stripe secret key
xox[bpsa]-[A-Za-z0-9-]{10,}                         # Slack tokens
```

### Medium Confidence (context-dependent)
```regex
(password|passwd|pwd|secret|token)\s*[:=]\s*['"][^'"]{8,}
(api[_-]?key|apikey)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}
(postgres|mysql|mongodb|redis):\/\/[^:]+:[^@]+@
```

### Exclusions
- Files matching: `*.test.*`, `*.spec.*`, `*.example`, `*.md`, `fixtures/`
- Lines containing: `example`, `placeholder`, `your-key-here`, `xxx`, `TODO`

## API Security Checks

- [ ] Authentication on all non-public endpoints
- [ ] Authorisation granularity (role-based or attribute-based)
- [ ] Input validation with schema (Zod, Joi, class-validator)
- [ ] Output filtering — don't return more data than the client needs
- [ ] Rate limiting with appropriate limits per endpoint type
- [ ] Request size limits to prevent DoS
- [ ] Content-Type enforcement
- [ ] CORS properly configured
- [ ] No sensitive data in URL query parameters
- [ ] Pagination to prevent data dumps

## Infrastructure Security

### Docker
- [ ] Non-root user in containers
- [ ] Minimal base images (alpine, distroless)
- [ ] No secrets in Dockerfiles or build args
- [ ] Read-only file systems where possible
- [ ] Resource limits set (CPU, memory)

### CI/CD
- [ ] Secrets in CI stored as encrypted variables, not in code
- [ ] Branch protection on main/production branches
- [ ] Dependency caching doesn't bypass security checks
- [ ] Build artifacts verified before deployment

### Cloud
- [ ] IAM follows least privilege
- [ ] Network segmentation (VPC, security groups)
- [ ] Encryption at rest enabled on all storage
- [ ] Logging enabled on all services
- [ ] Public access restricted to intended services only
