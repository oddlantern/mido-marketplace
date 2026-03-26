# Domain Knowledge Reference

Mido reads this during `/mido:init` to suggest constraints and best practices that the user
may not have thought of. Select suggestions based on the project's domain and stack.

## Web Applications

1. **Content Security Policy (CSP)** — Set strict CSP headers to prevent XSS. Start with
   `default-src 'self'` and whitelist only what's needed. This blocks inline scripts and
   untrusted sources from executing in the browser.

2. **Rate limiting on all public endpoints** — Prevent abuse and DoS. Use sliding window
   rate limiting with different tiers: stricter on auth endpoints, moderate on API, lenient
   on static assets.

3. **CORS configuration** — Whitelist specific origins, never use `*` in production. Include
   credentials handling and preflight caching for performance.

4. **Cookie security** — HttpOnly, Secure, SameSite=Strict for auth cookies. Set appropriate
   expiry. Never store sensitive data in cookies readable by JavaScript.

5. **Input validation at every trust boundary** — Validate on the client for UX, on the server
   for security. Never trust client-side validation alone.

6. **Structured error responses** — Consistent error shape across all endpoints. Never leak
   stack traces, SQL errors, or internal paths in production responses.

7. **Request ID tracking** — Generate a unique ID for every request, include in logs and error
   responses. Makes debugging distributed systems possible.

## Mobile Applications

1. **Offline-first architecture** — Assume the network is unreliable. Cache critical data locally,
   queue mutations, sync when connected. Show stale data with freshness indicators rather than
   error screens.

2. **Deep linking** — Handle both universal links (iOS) and app links (Android). Map URL paths
   to in-app screens. Essential for push notifications and marketing.

3. **Push notification strategy** — Request permission at the right moment (not on first launch).
   Categorise notifications, allow granular user control, handle background processing.

4. **Biometric authentication** — Use platform biometrics (Face ID, Touch ID, fingerprint) for
   sensitive operations. Fall back to PIN, never to just password.

5. **App size budget** — Set a max APK/IPA size. Monitor bundle size in CI. Large apps get
   fewer installs. Use deferred components and asset downloading.

6. **Accessibility from day one** — Semantic labels, sufficient contrast, dynamic type support,
   VoiceOver/TalkBack testing. Retrofitting accessibility is 10x harder.

7. **Platform-specific patterns** — Follow Material Design on Android, Human Interface Guidelines
   on iOS. Users expect platform-native navigation and interaction patterns.

## APIs

1. **API versioning from day one** — URL-based (`/v1/`) or header-based. Breaking changes go in
   new versions. Old versions get a sunset timeline, not sudden death.

2. **Pagination on all list endpoints** — Cursor-based pagination for real-time data, offset-based
   for static. Always include `total`, `hasMore`, `nextCursor` in responses.

3. **Consistent error shapes** — Every error response has the same structure: `{ error: { code,
   message, details } }`. HTTP status codes are semantic (400 for client errors, 500 for server).

4. **Idempotency keys** — All write operations accept an idempotency key. Retrying a request
   with the same key produces the same result. Essential for payment and booking systems.

5. **Rate limiting with headers** — Return `X-RateLimit-Limit`, `X-RateLimit-Remaining`,
   `X-RateLimit-Reset` headers. Clients can adapt their behaviour.

6. **Request/response logging** — Log every request (minus sensitive fields) with timing, status,
   and user context. Essential for debugging and audit trails.

## E-Commerce

1. **PCI DSS compliance** — Never store raw card numbers. Use tokenised payment processors
   (Stripe, Adyen). Minimise the cardholder data environment.

2. **Inventory management** — Use optimistic locking or reservation patterns to prevent overselling.
   Show real-time stock levels. Handle concurrent purchases gracefully.

3. **Payment security** — Webhook signature verification, idempotent payment processing, proper
   refund handling. Never rely on client-side price calculations.

4. **Cart abandonment recovery** — Persist cart state server-side (not just localStorage). Enable
   email recovery flows. Track abandonment reasons.

5. **Tax calculation** — Use a tax service (TaxJar, Avalara) for accurate rates. Tax rules vary
   by jurisdiction and product category.

6. **Image optimisation** — Product images in multiple sizes (thumbnail, medium, full). WebP with
   JPEG fallback. Lazy loading. CDN delivery.

## SaaS

1. **Multi-tenancy strategy** — Decide early: shared database with tenant column, schema-per-tenant,
   or database-per-tenant. Each has different isolation, cost, and complexity trade-offs.

2. **Subscription management** — Handle upgrades, downgrades, prorations, cancellations, and
   grace periods. Integrate with Stripe Billing or equivalent.

3. **Feature flags** — Control feature rollout independent of deployment. Essential for A/B
   testing, gradual rollouts, and enterprise customisation.

4. **Audit logging** — Record who did what, when, and from where. Essential for enterprise
   customers, compliance, and debugging.

5. **Tenant data isolation** — Ensure one tenant can never access another's data. Test this
   explicitly. Row-level security in PostgreSQL is your friend.

6. **Usage metering** — Track and rate-limit by usage tier. Bill based on consumption where
   appropriate. Alert when approaching limits.

## Real-Time Systems

1. **WebSocket connection management** — Handle reconnection with exponential backoff. Detect
   stale connections with heartbeats. Authenticate on connect, not per message.

2. **Message ordering guarantees** — Decide if ordering matters for your use case. If yes,
   use sequence numbers and handle out-of-order delivery.

3. **Offline queue** — When disconnected, queue outgoing messages locally. Replay on reconnect
   with conflict resolution.

4. **Presence detection** — Track online/offline status with heartbeats and grace periods.
   Don't show users as offline just because of a momentary network blip.

5. **Scalability** — WebSocket connections are stateful. Plan for horizontal scaling with
   sticky sessions or a pub/sub backbone (Redis, NATS).
