# Field Service & Job Management — PRD

## 1. Customer problem
Write the specific Kenyan business pain being solved, with evidence from interviews, support tickets, competitor reviews and observed workflows. Avoid generic statements like "businesses need digitalization."

## 2. Ideal customer profile
- Primary: choose one narrow, reachable segment first.
- Buyer: owner / operations lead / finance lead / practice manager depending on segment.
- User: staff who execute the workflow.
- Trigger event: the operational pain that causes the purchase.
- Existing workaround: spreadsheet, WhatsApp, paper, generic foreign SaaS, or manual reconciliation.

## 3. MVP
The MVP must complete one valuable workflow from start to finish. It must not attempt to reproduce the full feature set of the global reference product.

## 4. Functional requirements
- Organizations / tenants
- Users / roles / permissions
- Core domain records
- Search / filtering
- Approval states
- Activity / audit history
- Notifications
- Billing / plan entitlements
- Export/import
- API/webhooks where required
- Admin/support controls

## 5. Non-functional requirements
- Tenant isolation
- Encryption in transit; encrypted secrets at rest
- Idempotent integration handlers
- Structured logs
- Metrics + traces
- Rate limits
- Backups and restore verification
- Data retention/deletion workflows
- Accessibility and mobile-first UI
- API versioning

## 6. Acceptance tests
Create Given/When/Then tests for every money-moving, customer-facing and compliance-relevant workflow.

## 7. Deferred scope
Explicitly list anything that would delay launch without proving demand.
