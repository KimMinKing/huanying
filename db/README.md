# DB (PostgreSQL)

## 실행

```bash
# 1) 환경 변수 복사 (기본값 그대로 써도 됨)
cp .env.example .env

# 2) 컨테이너 실행 (처음이면 schema.sql도 자동 적용)
docker compose up -d

# 3) 상태 확인
docker ps
docker logs lifful-postgres --tail 20
```

## 접속

```bash
# 컨테이너 안에서 psql
docker exec -it lifful-postgres psql -U lifful -d lifful

# 테이블 목록 확인
\dt

# 종료
\q
```

## 스키마 재적용 (이미 데이터가 있을 때)

> 주의: 기존 데이터가 날아갈 수 있음. 개발 초기에만 사용.

```bash
# 1) 볼륨까지 완전 초기화
docker compose down -v

# 2) 다시 실행 (schema.sql 자동 적용)
docker compose up -d
```

## 백엔드 도입 시 연결

백엔드(Express/Nest/Fastify 등)를 만들면 `DATABASE_URL` 환경 변수로 접속.

- 백엔드를 **호스트에서** 실행: `postgresql://lifful:lifful_pass@localhost:5434/lifful`
- 백엔드를 **같은 compose 안에서** 실행: `postgresql://lifful:lifful_pass@postgres:5432/lifful`
  (이때는 docker-compose.yml의 백엔드 서비스가 `depends_on: postgres` 여야 함)

## 테이블 구조 요약

| 테이블 | 용도 |
|---|---|
| `users` | 고객 기본 정보 |
| `staff` | 관리자/상담 매니저 (이메일 + bcrypt 비밀번호) |
| `service_categories` | 서비스 카테고리 (internet, mobile, ...) |
| `consultations` | 상담 신청 내역 (status: new → contacted → in_progress → done) |
| `service_requests` | 카테고리별 상세 요청 (JSONB `request_data`) |
| `consultation_notes` | 상담 직원이 남긴 메모 |

자세한 스키마는 `schema.sql` 참고.

## 관리자 기본 계정

- 이메일: `admin@lifful.com`
- 비밀번호: `admin123`

변경은 `staff` 테이블 UPDATE 또는 schema.sql의 INSERT 문 수정 후 재적용.
비밀번호 해시는 bcrypt cost=10.

```bash
# 새 해시 생성 예시
node -e "console.log(require('bcryptjs').hash('내비밀번호', 10))"
```
