# Data Model

## Shared entities
- organizations
- organization_settings
- users
- memberships
- roles
- permissions
- invitations
- plans
- subscriptions
- usage_records
- audit_events
- api_keys
- webhooks
- integration_connections
- notification_messages
- files
- tags
- notes

## Domain entities
Document the project-specific entities here. Prefer normalized relational storage, immutable financial/audit events, and explicit state machines.

## Data lifecycle
- Retention period per record class.
- Export endpoint or operator workflow.
- Deletion/anonymization workflow.
- Legal hold mechanism where applicable.
- Backup and restore test schedule.

## Database rules
- UUIDs or secure opaque IDs for public identifiers.
- Unique constraints for idempotency.
- Foreign keys for business integrity.
- Soft-delete only where justified; never use it as a replacement for a retention policy.
