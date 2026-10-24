/**
 * pgcrypto + Postgres RLS helpers (call from a migration). Adapter-throw style:
 * these SQL helpers do nothing unless enabled; each table needs a policy.
 */
export const ORG_RLS_SQL = `
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION current_org() RETURNS text
LANGUAGE sql STABLE AS $$ SELECT current_setting('app.current_org', true) $$;

CREATE POLICY org_isolation_organizations ON organizations
  USING (id::text = current_org());
CREATE POLICY org_isolation_users ON users
  USING (id::text IN (SELECT user_id::text FROM memberships WHERE organization_id::text = current_org()));
CREATE POLICY org_isolation_memberships ON memberships
  USING (organization_id::text = current_org());
CREATE POLICY org_isolation_customers ON customers
  USING (organization_id::text = current_org());
CREATE POLICY org_isolation_quotes ON quotes
  USING (organization_id::text = current_org());
CREATE POLICY org_isolation_invoices ON invoices
  USING (organization_id::text = current_org());
CREATE POLICY org_isolation_payments ON payments
  USING (organization_id::text = current_org());
CREATE POLICY org_isolation_expenses ON expenses
  USING (organization_id::text = current_org());
CREATE POLICY org_isolation_audit_events ON audit_events
  USING (organization_id::text = current_org());
CREATE POLICY org_isolation_api_keys ON api_keys
  USING (organization_id::text = current_org());
`;
