-- Admin role and mobile pricing management foundation.
-- PostgreSQL 16+

ALTER TABLE staff
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE staff
  DROP CONSTRAINT IF EXISTS staff_role_check;

ALTER TABLE staff
  ADD CONSTRAINT staff_role_check
  CHECK (role IN ('super_admin', 'admin'));

UPDATE staff
SET role = 'super_admin'
WHERE email = 'admin@lifful.com';

CREATE TABLE IF NOT EXISTS mobile_pricing_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier         TEXT NOT NULL CHECK (carrier IN ('skt', 'kt', 'lgu')),
  carrier_name    TEXT NOT NULL,
  base_price      INTEGER NOT NULL CHECK (base_price >= 0),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (carrier)
);

CREATE TABLE IF NOT EXISTS mobile_pricing_rules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_group  TEXT NOT NULL CHECK (rule_group IN ('plan_type', 'data_usage', 'extra_option')),
  rule_key    TEXT NOT NULL,
  label       TEXT NOT NULL,
  amount      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  value_type  TEXT NOT NULL DEFAULT 'amount' CHECK (value_type IN ('amount', 'multiplier')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rule_group, rule_key)
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id       UUID REFERENCES staff(id) ON DELETE SET NULL,
  action         TEXT NOT NULL,
  target_type    TEXT NOT NULL,
  target_id      TEXT,
  before_data    JSONB,
  after_data     JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mobile_pricing_settings_carrier
  ON mobile_pricing_settings (carrier);

CREATE INDEX IF NOT EXISTS idx_mobile_pricing_rules_group
  ON mobile_pricing_rules (rule_group, sort_order);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_staff
  ON admin_audit_logs (staff_id, created_at DESC);

INSERT INTO mobile_pricing_settings (carrier, carrier_name, base_price, sort_order) VALUES
  ('skt', 'SKT', 34000, 1),
  ('kt', 'KT', 32000, 2),
  ('lgu', 'LG U+', 33000, 3)
ON CONFLICT (carrier) DO NOTHING;

INSERT INTO mobile_pricing_rules (rule_group, rule_key, label, amount, value_type, sort_order) VALUES
  ('plan_type', 'budget', '알뜰하게', 1.0, 'multiplier', 1),
  ('plan_type', 'major', '정식 통신사 중심', 1.9, 'multiplier', 2),
  ('data_usage', 'light', '가볍게', 0, 'amount', 1),
  ('data_usage', 'standard', '보통', 7000, 'amount', 2),
  ('data_usage', 'heavy', '많이 씀', 18000, 'amount', 3),
  ('extra_option', 'none', '없음', 0, 'amount', 1),
  ('extra_option', 'family', '가족 결합 가능', -5000, 'amount', 2),
  ('extra_option', 'esim', 'eSIM 필요', 3000, 'amount', 3)
ON CONFLICT (rule_group, rule_key) DO NOTHING;

DROP TRIGGER IF EXISTS set_updated_at_staff ON staff;
CREATE TRIGGER set_updated_at_staff BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_mobile_pricing_settings ON mobile_pricing_settings;
CREATE TRIGGER set_updated_at_mobile_pricing_settings BEFORE UPDATE ON mobile_pricing_settings
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_mobile_pricing_rules ON mobile_pricing_rules;
CREATE TRIGGER set_updated_at_mobile_pricing_rules BEFORE UPDATE ON mobile_pricing_rules
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();
