-- 마이그레이션 001: users 테이블에 고객 인증 지원 컬럼 추가
--
-- 배경: 기존 users 테이블은 상담 신청자 기준이었고 password_hash가 없어
-- 고객이 직접 로그인할 수 없었음. 이 마이그레이션으로 고객 계정 기능 지원.
--
-- 적용:
--   docker exec -i lifful-postgres psql -U lifful -d lifful \
--     < db/migrations/001_users_auth_extension.sql
--
-- 롤백: 롤백을 원하면 각 ADD COLUMN에 대응하는 DROP COLUMN을 실행.
-- 단, email UNIQUE 제약조건은 데이터 중복 시 실패할 수 있으므로
-- 사전에 SELECT email, count(*) FROM users GROUP BY email HAVING count(*)>1 로 확인.

BEGIN;

-- 1) 고객 인증용 비밀번호 해시 (bcrypt)
--    백엔드 도입 전까지는 NULL이어도 OK (consultation 전용 가입자와 구분)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2) 마케팅 정보 수신 동의 (이메일/SMS/카톡 알림 등)
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;

-- 3) 선호 연락 채널 — kakao / wechat / phone / email
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_channel TEXT;

-- 4) 체류 상태 — 시민/장기체류/단기체류/관광 (외국인 정착 서비스 핵심)
ALTER TABLE users ADD COLUMN IF NOT EXISTS residence_status TEXT
  CHECK (residence_status IN ('citizen', 'long_term', 'short_term', 'tourist'));

-- 5) 비자 종류 — 한국인은 NULL, 외국인은 D-2/D-4/D-8/C-3 등
ALTER TABLE users ADD COLUMN IF NOT EXISTS visa_type TEXT;

-- 6) 계정 상태 — 비활성 사용자(탈퇴/휴면) 처리용
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- 7) 마지막 로그인 시간
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- 8) updated_at 자동 갱신용 트리거 (consultations와 동일 패턴)
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS set_updated_at_users ON users;
CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- 9) email UNIQUE 제약 — 고객 로그인 시 식별자 역할
--    기존 NULL/중복 email 데이터가 있으면 실패할 수 있으므로 부분 인덱스로 안전하게.
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique
  ON users (email)
  WHERE email IS NOT NULL;

-- 10) phone UNIQUE (선택) — 한국 휴대폰 인증 도입 시 활용
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_unique
  ON users (phone)
  WHERE phone IS NOT NULL;

COMMIT;
