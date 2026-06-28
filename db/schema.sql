-- 라이플(Lifful) 초기 스키마
-- PostgreSQL 16 이상
--
-- 적용 방법 (둘 중 하나):
--   1) docker compose up -d  (처음 실행 시 자동 적용 — 볼륨이 비어 있을 때만)
--   2) 수동: docker exec -i lifful-postgres psql -U lifful -d lifful < db/schema.sql
--
-- 확장: pgcrypto (UUID 생성용)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 사용자(고객)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  nationality  TEXT,        -- 'kr', 'cn', 'us' ... (필요시 enum으로)
  language     TEXT DEFAULT 'ko',  -- 'ko' | 'zh' | 'en'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- ============================================================================
-- 직원(상담 매니저 + 관리자)
-- ============================================================================
-- 비밀번호는 bcrypt 해시로 저장. 초기 admin 해시는 'admin123' 기준.
-- (아래 INSERT에 미리 해시값을 넣어둠. 변경 시 node -e "require('bcryptjs').hash('새비번',10)" 등으로 생성)
CREATE TABLE IF NOT EXISTS staff (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  password_hash TEXT NOT NULL,    -- bcrypt
  role         TEXT NOT NULL DEFAULT 'staff',  -- 'admin' | 'staff'
  language     TEXT DEFAULT 'ko',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 서비스 카테고리
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_categories (
  id           TEXT PRIMARY KEY,           -- 'internet', 'mobile' 등 slug
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 상담 신청 (consultations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS consultations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE SET NULL,
  -- 비회원 신청 허용: user_id가 NULL이면 아래 정보를 직접 사용
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  service_type      TEXT,                 -- service_categories.id 참조 (FK는 느슐하게)
  status            TEXT NOT NULL DEFAULT 'new',
    -- 'new' | 'contacted' | 'in_progress' | 'done' | 'cancelled'
  message           TEXT,
  assigned_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  preferred_channel TEXT,                 -- 'kakao' | 'wechat' | 'phone' | 'email'
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations (status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_assigned ON consultations (assigned_staff_id);

-- ============================================================================
-- 서비스 요청 (service_requests)
-- ============================================================================
-- 신청 세부 정보는 JSONB로 유연하게 저장.
-- 예시 (중국인 휴대폰):
--   {"visaType":"D-2","stayPeriod":"1년","hasArc":false,"needsEsim":true}
-- 예시 (인터넷):
--   {"address":"서울시 ...","currentCarrier":"KT","needsTv":true,"contractPeriod":"3년"}
CREATE TABLE IF NOT EXISTS service_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id     TEXT REFERENCES service_categories(id) ON DELETE SET NULL,
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  request_data    JSONB NOT NULL DEFAULT '{}'::jsonb,
  status          TEXT NOT NULL DEFAULT 'pending',
    -- 'pending' | 'submitted' | 'in_review' | 'completed' | 'cancelled'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_requests_user ON service_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_category ON service_requests (category_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_consultation ON service_requests (consultation_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests (status);
-- JSONB 키 검색용 GIN 인덱스 (필요 시)
CREATE INDEX IF NOT EXISTS idx_service_requests_data ON service_requests USING gin (request_data);

-- ============================================================================
-- 상담 기록 (consultation_notes) — 상담 직원이 남기는 메모
-- ============================================================================
CREATE TABLE IF NOT EXISTS consultation_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  staff_id        UUID REFERENCES staff(id) ON DELETE SET NULL,
  note            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultation_notes_consultation ON consultation_notes (consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_notes_staff ON consultation_notes (staff_id);

-- ============================================================================
-- updated_at 자동 갱신 트리거
-- ============================================================================
CREATE OR REPLACE FUNCTION trg_set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON consultations;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- ============================================================================
-- 시드 데이터
-- ============================================================================

-- 서비스 카테고리 6개
INSERT INTO service_categories (id, name, slug, description, sort_order) VALUES
  ('internet',           '인터넷 / IPTV',      'internet',           'SK/KT/LG 유플러스 인터넷·IPTV 비교 신청', 1),
  ('mobile',             '휴대폰 / 알뜰폰',    'mobile',             '통신사·알뜰폰 요금제 비교 및 개통 대행', 2),
  ('rental',             '가전 렌탈',           'rental',             '정수기·비데·공기청정기 등 렌탈 총비용 비교', 3),
  ('moving',             '이사',                'moving',             '일반/포장/입주 이사 견적 비교', 4),
  ('cleaning',           '입주 청소',           'cleaning',           '입주·이사·준공 청소 견적', 5),
  ('chinese_settlement', '외국인 정착 패키지',  'chinese-settlement', '중국인 대상 휴대폰·은행·집·인터넷 통합 정착', 6)
ON CONFLICT (id) DO NOTHING;

-- 초기 관리자 계정
-- 이메일: admin@lifful.com
-- 비밀번호: admin123  (아래 bcrypt 해시는 이 평문 기준)
--   hash는 cost=10으로 생성한 값. 변경 방법은 DATA.md 참고.
INSERT INTO staff (email, name, password_hash, role, language) VALUES
  (
    'admin@lifful.com',
    '라이플 관리자',
    '$2b$10$MV9KoTqhvDxTpYLeYY26pu/rhPNQKYcnrrnM0PjKipNHzcIphSGHG',  -- 'admin123'
    'admin',
    'ko'
  )
ON CONFLICT (email) DO NOTHING;
