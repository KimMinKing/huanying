-- Service request workflow, notes, timeline, and mobile plan catalog.
-- PostgreSQL 16+

CREATE TABLE IF NOT EXISTS service_request_events (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  actor_staff_id     UUID REFERENCES staff(id) ON DELETE SET NULL,
  actor_user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type         TEXT NOT NULL,
  title              TEXT NOT NULL,
  description        TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_request_events_request
  ON service_request_events (service_request_id, created_at DESC);

CREATE TABLE IF NOT EXISTS service_request_memos (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  staff_id           UUID REFERENCES staff(id) ON DELETE SET NULL,
  memo               TEXT NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_request_memos_request
  ON service_request_memos (service_request_id, created_at DESC);

CREATE TABLE IF NOT EXISTS mobile_plan_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier         TEXT NOT NULL CHECK (carrier IN ('skt', 'kt', 'lgu')),
  name            TEXT NOT NULL,
  monthly_price   INTEGER NOT NULL CHECK (monthly_price >= 0),
  data_label      TEXT NOT NULL,
  call_text_label TEXT NOT NULL,
  promotion_text  TEXT,
  is_recommended  BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mobile_plan_cards_visible
  ON mobile_plan_cards (is_visible, sort_order);

DROP TRIGGER IF EXISTS set_updated_at_mobile_plan_cards ON mobile_plan_cards;
CREATE TRIGGER set_updated_at_mobile_plan_cards BEFORE UPDATE ON mobile_plan_cards
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

INSERT INTO mobile_plan_cards (
  carrier,
  name,
  monthly_price,
  data_label,
  call_text_label,
  promotion_text,
  is_recommended,
  sort_order
) VALUES
  ('skt', '5G 스탠다드', 55000, '월 110GB', '통화/문자 기본 제공', '가족 결합 상담 가능', TRUE, 1),
  ('kt', '알뜰 데이터 15GB', 27500, '월 15GB', '통화 100분', '가성비 추천', TRUE, 2),
  ('lgu', 'eSIM 라이트', 19800, '월 7GB', '통화/문자 기본', '외국인 단기 체류 상담 가능', FALSE, 3)
ON CONFLICT DO NOTHING;
