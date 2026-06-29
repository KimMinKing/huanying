# Changelog

프로젝트의 주요 변경 사항 기록. 최신 순으로 정렬.

형식 참고: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)

---

## [0.4.0] — 2026-06-29

### Added — 고객 계정 시스템 + 가이드 허브

#### 고객 인증 라우트 컴포넌트
- `components/AuthRoutes.tsx` — `RequireCustomerAuth`, `RedirectCustomerAuth`, `RequireAdminAuth`, `RedirectAdminAuth`
  - `<Outlet/>` 기반 라우트 가드. 미인증 시 로그인으로 리다이렉트
  - `App.tsx` 전체 라우팅 구조를 중첩 Route로 재작성

#### Mock 저장소 추상화
- `lib/mockStorage.ts` — `loadCollection`, `saveCollection`, `readSession`, `writeSession`, `clearSession`, `wait`
- `adminAuth.ts`, `customerAuth.ts` 가 이 모듈을 사용하도록 리팩터링
  - 중복 코드 제거, 일관된 에러 처리

#### users 테이블 확장 (고객 인증 지원)
- 마이그레이션: `db/migrations/001_users_auth_extension.sql`
- 추가 컬럼: `password_hash`, `preferred_channel`, `residence_status` (CHECK 제약), `visa_type`, `marketing_consent`, `is_active`, `last_login_at`, `updated_at`
- email/phone UNIQUE 인덱스 (고객 로그인 식별자)
- `set_updated_at_users` 트리거 추가
- `schema.sql`에도 동기화 (신규 설치 시 자동 적용)

#### 회원가입 다단계 폼 (RegisterPage 재설계)
- 4단계: 계정 → 프로필 → 체류 정보 → 연락·동의
- 단계별 진행 바 (완료/현재/미래 시각화)
- 국적 선택(한국/중국/기타)에 따른 조건부 필드:
  - 한국인 → citizen 자동 설정
  - 외국인 → 체류 상태(장기/단기/관광) + 비자 종류(D-2/D-4/D-8/F-계열 등 optgroup)
  - 관광은 비자 면제
- 선호 채널: 카카오톡/WeChat/전화/이메일 (브랜드 색 버튼)
- 동의 3종: 이용약관(필수), 개인정보(필수), 마케팅(선택)
- 단계별 검증 + 이전 단계로 이동 가능

#### 로그인 페이지 소셜 UI
- Kakao/Naver/WeChat 소셜 로그인 버튼 (현재 disabled, 백엔드 연동 후 활성화)
- "OR" 구분선

#### 마이페이지 확장 프로필
- 국적, 체류 상태, 선호 채널, 언어, 비자, 마케팅 동의, 가입일, 계정 상태
- 4열 그리드 ProfileItem 컴포넌트

#### 가이드 허브 (4개 신규 페이지)
- `pages/CaseStudiesPage.tsx` — 실제 진행 사례 (유학생/직장인/투자자 케이스)
- `pages/ForeignerDocumentsPage.tsx` — 외국인 필수 서류 체크리스트
- `pages/PricingGuidePage.tsx` — 요금 비교 기준 (총비용 기준 설명)
- `pages/SupportHoursPage.tsx` — 채널별 상담 가능 시간
- `data/guides.ts` — 가이드용 데이터
- `components/GuideHighlights.tsx` — 홈에 들어갈 가이드 하이라이트 섹션
- Header "가이드" 드롭다운 메뉴 추가

### Changed
- `App.tsx` — `<Outlet/>` 기반 중첩 라우트 구조로 재작성
- `lib/adminAuth.ts`, `lib/customerAuth.ts` — mockStorage 사용
- 데모 고객 2명 (한국인 김데모 + 중국인 Zhang Wen) — 국적별 마이페이지 화면 테스트용

### Files
- 신규: `src/components/AuthRoutes.tsx`, `src/lib/mockStorage.ts`, `src/components/GuideHighlights.tsx`, `src/data/guides.ts`
- 신규: `src/pages/{CaseStudiesPage,ForeignerDocumentsPage,PricingGuidePage,SupportHoursPage}.tsx`
- 신규: `db/migrations/001_users_auth_extension.sql`
- 수정: `src/App.tsx`, `src/components/Header.tsx`, `src/data/comparison.ts`
- 수정: `src/lib/adminAuth.ts`, `src/lib/customerAuth.ts`
- 수정: `src/pages/customer/{LoginPage,RegisterPage,MyPage}.tsx`
- 수정: `src/pages/admin/AdminLayout.tsx`, `src/pages/HomePage.tsx`, `src/components/FAQ.tsx`
- 수정: `db/schema.sql`, `README.md`

---

## [0.3.0] — 2026-06-28

### Added — 페이지 독립화/차별화

#### 고객후기 전용 페이지 (`/reviews`)
- 평점 요약 카드 (평균 / 분포 / 검증 건수)
- 필터: 한국인/외국인, 서비스 카테고리, 검색
- 정렬: 최신순 / 평점순
- 후기 데이터 8건 추가 (총 16건 — 한국 12 + 외국인 4)
- ReviewCard 컴포넌트 (검증 배지, persona 태그)
- 페이지 하단 상담 CTA + ConsultationForm

#### 서비스별 차별화 인터랙티브 섹션
- `components/ServiceInteractiveSection.tsx` — 카테고리별 위젯
- **인터넷**: 사용 패턴 + 기기 수 기반 속도 추천 (`500Mbps` ~ `2.5Gbps+`)
- **휴대폰**: 데이터 사용량 계산기 — 정식 통신사 vs 알뜰폰 연간 절약액
- **렌탈**: 렌탈 vs 구매 총비용 비교기 — 자동 추천
- **이사**: 평수·유형별 견적 시뮬레이터 (범위 출력)
- **청소**: 평수 + 옵션 토글 견적표 (보일러/에어컨/베란다/실리콘)
- 보험은 준비 중이라 생략

### Changed — 네비게이션 UX 개선
- **Header 드롭다운 메뉴** — "서비스" 호버 시 6개 카테고리 노출
  - 기존 `/#services` 앵커에서 실제 `/services/:id` 라우트로 연결
  - 모바일 드로어에서도 2열 그리드로 카테고리 표시
- **Footer** — "고객후기" 링크를 `/#reviews`에서 `/reviews` 페이지로
- **sitemap.xml** — `/reviews` URL 추가
- **navItems 데이터** — `type: 'dropdown'` 추가 (하위 메뉴 지원)

### Files
- 신규: `src/pages/ReviewsPage.tsx`, `src/components/ServiceInteractiveSection.tsx`
- 수정: `src/data/reviews.ts` (+8건), `src/data/comparison.ts` (navItems 재구성)
- 수정: `src/components/Header.tsx` (DropdownMenu 추가), `src/components/Footer.tsx`
- 수정: `src/pages/ServiceDetailPage.tsx` (인터랙티브 섹션 끼워넣기)
- 수정: `src/App.tsx` (/reviews 라우트), `public/sitemap.xml`

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
