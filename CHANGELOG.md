# Changelog

프로젝트의 주요 변경 사항 기록. 최신 순으로 정렬.

형식 참고: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)

---

## [0.2.0] — 2026-06-28

### Added — 서비스 고도화 (2차 작업)

#### 법적/운영 인프라
- **이용약관 페이지** (`/terms`) — 한국 표준 약관 템플릿 기반 (목차·조문 구조)
- **개인정보처리방침** (`/privacy`) — 개인정보보호법 기준 표·세부 항목 포함
- **404 페이지** — 디자인 통일, 추천 페이지 카드 제공
- **Footer 강화** — 공식 파트너사 로고 띠, 사업자 진위확인 링크, 마이페이지·관리자 링크
- **쿠키 동의 배너** (`components/CookieBanner.tsx`) — 모두 동의 / 필수만 / 거부 옵션

#### 고객 계정 시스템
- `/login`, `/register`, `/my` 라우트 추가
- `lib/customerAuth.ts` — localStorage 기반 mock 인증
- 마이페이지: 진행 중/완료/전체 통계, 내 상담 신청 내역
- 데모 계정: `demo@lifful.com` / `demo123`

#### 서비스 카테고리 상세 페이지 6종
- `/services/internet|mobile|rental|moving|cleaning|insurance`
- 공통 템플릿: Hero → benefits → 가격 비교표 → 체크리스트 → FAQ 아코디언 → CTA → 상담 폼
- `data/servicePlans.ts` — 카테고리별 요금제/체크리스트/FAQ 데이터
- 홈 서비스 카드 전체가 상세 페이지로 클릭 연결

#### 다국어 인프라
- `lib/i18n.tsx` — `LocaleProvider` + `useLocale()` Context API
- 헤더 언어 스위처 (KR / 中文 / EN, 국기 emoji 포함)
- `TranslationFallbackNotice` — 번역 미지원 페이지 알림 배너
- localStorage 저장 + navigator.language 자동 감지

#### SEO/공유 메타 인프라
- `react-helmet-async` 도입
- `components/SEO.tsx` — 페이지별 title/description/OG/Twitter/JSON-LD 주입
- LocalBusiness, FAQ JSON-LD 스키마 헬퍼
- `public/robots.txt` — /admin, /my 제외
- `public/sitemap.xml` — 12개 URL
- `public/site.webmanifest`, `public/favicon.svg` (PWA 지원)
- 모든 페이지에 SEO 적용 (관리자·고객 인증 페이지는 noindex)

#### 멀티채널 FAB
- **데스크탑**: 우하단 헤드셋 FAB → 호버/클릭 시 채널 메뉴 확장 (카톡/WeChat/전화/폼)
- **모바일**: 기존 하단 바 유지
- `/chinese-users` 영역에서는 WeChat이 첫 번째 채널
- 채널 URL은 `siteConfig`에서 읽음 (미설정 시 #consult로 폴백)

#### 파트너 데이터
- `data/partners.ts` — 12개 파트너사 (SK/KT/LG, 헬로, CJ, 웅진, 롯데, KB, 신한 등)
- Footer에 공식 파트너사 섹션 표시
- ⚠️ `status: 'planned'` — 실제 계약 전이라 과장 광고 주의

### Changed — 1차 작업에서 변경된 점
- **브랜드 컬러 어둡게**: `brand-600` `#cf3324` → `#b2291a` (와인/딥 레드 톤)
- **cyan 액센트 제거**: `gold` 액센트로 교체. 휴대폰 카드, 외국인 인터넷 카드 적용
- **Footer 채널 버튼** — 단순 placeholder 링크에서 실제 URL 연동형으로
- **ServiceCards** — 단순 링크 텍스트에서 `<Link>` 컴포넌트로 (전체 카드 클릭 가능)
- **FloatingCTA** — 단일 버튼에서 멀티채널 FAB로 확장
- **index.html** — theme-color를 파란색에서 새 브랜드 색으로, OG/Twitter 기본 메타 추가
- **Header** — LanguageSwitcher 추가

### Documentation
- `CLAUDE.md` — Claude용 기술 컨텍스트 (라우팅, 컨벤션, mock 영역 명시)
- `PROJECT.md` — 비즈니스/운영용 (타겟, 차별점, 로드맵)
- `DATA.md` — 사용자가 채워넣을 데이터 + P0~P4 기능 백로그
- `CHANGELOG.md` — 본 파일

---

## [0.1.0] — 2026-06-28

### Added — 초기 작업

#### 디자인 시스템
- 딥 레드/와인 메인 컬러 (`brand-*`)
- 프리미엄 골드 보조 (`gold-*`)
- 제이드 민트 성공색 (`mint-*`)
- 잉크 블랙 텍스트 톤 (`ink-*`)
- 서비스 카드 액센트 시스템 (`lib/accents.ts` + safelist)

#### 프론트엔드 페이지
- 홈 (`/`) — Hero, ServiceCards, WhyUs, ComparisonExample, ForeignerEntry, Reviews, ConsultationForm
- 외국인 정착 허브 (`/chinese-users`) — 바이링얼 카드, 타임라인, AIRecommendation, 후기
- 중국인 휴대폰 개통 상세 (`/chinese-users/mobile`)
- 한국 정착 체크리스트 (`/chinese-users/settlement`)

#### AI 맞춤 추천
- 클라이언트 규칙 기반 추천 엔진 (`recommend()` 함수)
- 4단계 AI 분석 애니메이션 (체류 조건 분석 → 통신사 매칭 → 예산 최적화 → 결과 생성)
- 진행 바, 단계별 체크/스피너
- 결과 카드: 그라데이션 보더, 글로우, "AI 생성 결과" 뱃지, "참고용" 안내

#### 관리자 페이지 (목업)
- `/admin/login`, `/admin/register` — localStorage 기반 mock 인증
- `/admin` 대시보드 — 통계 카드, 서비스 분포 막대그래프, 최근 상담
- `/admin/consultations` — 검색 + 서비스 필터 + 상태 필터
- `/admin/settings` — 사이트 설정 (현재 읽기 전용)
- `data/mockConsultations.ts` — 14건 목업 상담 데이터
- 데모 계정: `admin@lifful.com` / `admin123`

#### PostgreSQL 인프라
- `docker-compose.yml` — postgres:16-alpine, 호스트 포트 5434 (기존 mevwatch 5433과 분리)
- `db/schema.sql` — 6 테이블 + 6개 카테고리 시드 + admin 1행 (bcrypt)
  - users, staff, service_categories, consultations, service_requests (JSONB), consultation_notes
- `.env.example` — DATABASE_URL 및 POSTGRES_* 템플릿
- `db/README.md` — DB 실행/접속/마이그레이션 가이드

#### 기타
- `App.tsx` — 라우팅 (공용 레이아웃 + 관리자 라우트 분리)
- `.gitignore` — `.env`, `*.tsbuildinfo` 추가
- `vite.config.ts`, `tsconfig.json` (기존)

### Technical Notes
- Vite 5 + React 18 + TypeScript 5 + Tailwind CSS 3 + React Router 7
- lucide-react 아이콘
- 백엔드 없음 — 모든 데이터는 mock / 시뮬레이션
- DB 컨테이너: `lifful-postgres` (Docker)

---

## 컨벤션

- **버전 번호**: [major.minor.patch] — 기능 추가 시 minor, 수정 시 patch
- **날짜**: YYYY-MM-DD (변경일 기준)
- **변경 유형**: Added / Changed / Deprecated / Removed / Fixed / Security / Documentation
- 커밋 메시지는 본 파일의 내용과 일치시키기
