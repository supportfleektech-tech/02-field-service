# Field Service & Job Management

**Portfolio lane:** FAST  
**Target time to first paid deployment:** 4–8 weeks to paid MVP; 10–12 weeks to production

> Build a real, production-capable commercial product. Do not create demo-only flows, fake integrations, hard-coded records, placeholder APIs, or screenshot-level UI that cannot execute the underlying workflow.

## Mission
Dispatch, work orders, job cards, technician assignment, quotations, parts used, service reports, customer signatures, GPS/geotagged visit evidence, collections and repeat-service reminders.

## Commercial model
KSh 2,500–15,000/month per company + per-technician tiers; onboarding; branded customer portal.

## Dependencies / external gates
Maps provider; SMS/WhatsApp; optional M-Pesa collections; offline/PWA sync.

## Portfolio role
Very practical for plumbers, electricians, installers, solar companies, ICT support, appliance repair, security firms and maintenance contractors.


## Definition of done
- Multi-tenant isolation is enforced server-side.
- Authentication, authorization, audit logging, rate limiting and error handling are production-grade.
- Primary customer workflow works end-to-end against real integrations or a documented partner sandbox.
- Data migrations are repeatable.
- Automated tests cover critical paths and failure cases.
- Observability, backups, rollback and incident procedures exist.
- Billing can charge a real customer.
- Production deployment is reproducible from a clean environment.
- Documentation is sufficient for a second engineer to operate the system.

## Build order
1. Validation and narrow ICP.
2. Domain model and tenant/security kernel.
3. Critical workflow.
4. Real integrations.
5. Billing + audit + notifications.
6. Hardening + observability.
7. Pilot with paid design partners.
8. General availability.

## Do not build yet
List non-essential features in `PRD.md` and explicitly defer them.
