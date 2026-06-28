# CLAUDE.md — 라이플(Lifful) 프로젝트 가이드

이 파일은 Claude Code가 프로젝트를 이해하는 데 필요한 핵심 컨텍스트입니다.
자세한 비즈니스/운영 정보는 `PROJECT.md`, 사용자가 채워넣을 데이터는 `DATA.md`를 참고하세요.

## 프로젝트 한 줄 소개

한국 생활 서비스(인터넷, 휴대폰, 렌탈, 이사, 청소) 비교·신청 플랫폼 + 중국인/외국인 정착 패키지.
AI 맞춤 추천(규칙 기반, 향후 LLM 연동 예정)으로 차별화.

## 기술 스택

- **프론트엔드**: Vite 5 + React 18 + TypeScript 5 + Tailwind CSS 3 + React Router 7
- **아이콘**: lucide-react
- **DB**: PostgreSQL 16 (Docker 컨테이너, 호스트 포트 5434)
- **백엔드**: ❌ 현재 없음 — 프론트엔드 목업 인증 + 시뮬레이션. 향후 도입 예정.
- **SEO**: react-helmet-async + OG 메타 + JSON-LD + sitemap/robots

## 디렉토리 구조

```
noop/
├── src/
│   ├── components/         # 재사용 컴포넌트
│   │   ├── Header, Footer, FloatingCTA     # 전역 UI (FloatingCTA는 멀티채널 FAB)
│   │   ├── LanguageSwitcher, TranslationFallbackNotice  # i18n UI
│   │   ├── CookieBanner    # 쿠키 동의 배너
│   │   ├── SEO             # 페이지별 메타 + JSON-LD
│   │   ├── ServiceCards, Hero, Reviews, ConsultationForm, AIRecommendation, ...
│   ├── pages/              # 라우트 페이지
│   │   ├── HomePage.tsx, NotFoundPage.tsx
│   │   ├── ChineseUsersPage.tsx, ChineseMobilePage.tsx, SettlementPage.tsx
│   │   ├── ServiceDetailPage.tsx    # /services/:serviceId (6 카테고리 공통)
│   │   ├── TermsPage.tsx, PrivacyPage.tsx (Legal.tsx 공통 레이아웃)
│   │   ├── customer/      # /login, /register, /my (고객 mock 인증)
│   │   └── admin/         # /admin/* (관리자 mock 인증)
│   ├── data/               # 정적 데이터
│   │   ├── comparison.ts          # siteConfig (회사, 카톡/WeChat 채널)
│   │   ├── services.ts            # 메인 6 서비스
│   │   ├── servicePlans.ts        # 서비스별 요금제/체크리스트/FAQ 데이터
│   │   ├── partners.ts            # 공식 파트너사 (Footer 로고)
│   │   ├── chineseServices.ts, reviews.ts, faqs.ts, settlementSteps.ts
│   │   ├── i18n.ts                # ko/zh/en 문자열 유틸
│   │   └── mockConsultations.ts   # 관리자 페이지용 목업 데이터
│   ├── lib/
│   │   ├── accents.ts             # 서비스 카드 컬러 토큰 매핑
│   │   ├── format.ts
│   │   ├── i18n.tsx               # LocaleProvider + useLocale (Context)
│   │   ├── adminAuth.ts           # 관리자 mock 인증 (localStorage)
│   │   └── customerAuth.ts        # 고객 mock 인증 (localStorage)
│   ├── App.tsx, main.tsx
│   └── index.css
├── db/
│   ├── schema.sql          # PostgreSQL 초기 스키마 + 시드
│   └── README.md           # DB 실행/접속 가이드
├── public/                 # 정적 파일
│   ├── favicon.svg, site.webmanifest
│   ├── robots.txt          # 크롤러 허용 범위 (/admin, /my 제외)
│   └── sitemap.xml         # URL 목록 (운영 도메인으로 교체 필요)
├── docker-compose.yml      # postgres 16-alpine, 포트 5434
├── .env.example
├── tailwind.config.js      # brand 컬러 팔레트, safelist, 그라데이션 등
├── DATA.md                 # ⭐ 사용자가 채워넣을 데이터와 기능 백로그
└── PROJECT.md              # 비즈니스/운영용 프로젝트 문서
```

## 개발 명령어

```bash
npm install              # 패키지 설치
npm run dev              # 개발 서버 (Vite, 기본 http://localhost:5173)
npm run build            # 타입체크 + 프로덕션 빌드 (dist/)
npm run preview          # 빌드 결과 미리보기
```

## DB 실행

```bash
cp .env.example .env             # 한 번만
docker compose up -d             # PostgreSQL 컨테이너 실행 + schema.sql 자동 적용
docker exec -it lifful-postgres psql -U lifful -d lifful   # 접속
docker compose down -v           # 완전 초기화 (데이터 삭제)
```

자세한 건 `db/README.md` 참고.

## 핵심 컨벤션

### 브랜드 컬러 (`tailwind.config.js`)

- `brand-*` (딥 레드/와인): 메인. 600 = `#b2291a`. 버튼, 강조, 로고.
- `gold-*` (프리미엄 골드): 보조 포인트. 중국인 섹션 구분선, AI 뱃지.
- `mint-*` (제이드 민트): 성공/긍정. 보색이라 절제 사용.
- `ink-*` (블랙): 본문 텍스트. ink / ink-soft / ink-muted / ink-light.
- `amber`, `violet`, `rose`: 서비스 카드 액센트용. 다른 곳에 쓰지 말 것.
- **⚠️ `cyan` 액센트는 2026-06-28 제거됨** (사용자 요청: 파란색 느낌 제거).

### 서비스 카드 액센트 시스템

`src/lib/accents.ts`의 토큰 매핑이 핵심.
- `data/services.ts`의 `accent` 필드로 카드 색 지정 (`'brand' | 'mint' | 'amber' | 'violet' | 'rose' | 'gold'`)
- 새 색 추가 시 `tailwind.config.js` safelist + `accents.ts` 토큰 **둘 다** 업데이트 필요
- (Tailwind JIT가 동적 클래스명을 트리셰이킹하지 못하기 때문)

### 버튼/카드 클래스 (`src/index.css`)

- `.btn-primary` — 메인 CTA (brand-600 배경)
- `.btn-secondary` — 보조 (흰 배경, 회색 보더)
- `.btn-ghost` — 텍스트 버튼
- `.card-base`, `.eyebrow`, `.cn-warm-bg` 등도 정의됨

### 사이트 데이터 위치

- 회사 정보, KakaoTalk/WeChat 채널: `src/data/comparison.ts`의 `siteConfig`
- 메뉴: 같은 파일의 `navItems`
- 서비스 카드: `src/data/services.ts`, `src/data/chineseServices.ts`
- 후기, FAQ, 정착 단계: 각각 `data/reviews.ts`, `data/faqs.ts`, `data/settlementSteps.ts`

이 데이터들의 "실제 값" 교체는 `DATA.md`에 정리해 둠.

## 백엔드 없는 상태 — 무엇이 목업인가

| 영역 | 상태 | 백엔드 도입 시 교체 포인트 |
|---|---|---|
| 상담 신청 폼 (`ConsultationForm.tsx`) | 시뮬레이션 (setTimeout) | 폼 제출 → `POST /api/consultations` |
| AI 맞춤 추천 (`AIRecommendation.tsx`) | 클라이언트 규칙 엔진 | `recommend()` 함수 → `POST /api/ai/recommend` |
| 관리자 인증 (`lib/adminAuth.ts`) | localStorage base64 | `login/register/getSession` → API 호출 |
| 관리자 페이지 데이터 (`data/mockConsultations.ts`) | 하드코딩 14건 | `GET /api/admin/consultations` |
| 사이트 설정 (`pages/admin/AdminSettings.tsx`) | 읽기 전용 (저장 안 됨) | `PUT /api/admin/settings` |

## 관리자 페이지 접근

- `/admin/login` — 목업 로그인 (데모 계정: `admin@lifful.com` / `admin123`)
- `/admin/register` — staff 권한 가입 (localStorage)
- `/admin` — 대시보드
- `/admin/consultations` — 상담 목록 (필터/검색 UI만)
- `/admin/settings` — 사이트 설정 (현재 읽기 전용)

## 고객 페이지 접근

- `/login`, `/register` — 고객 mock 인증 (데모: `demo@lifful.com` / `demo123`)
- `/my` — 마이페이지 (인증 필요, 없으면 /login으로 리다이렉트)
- `/services/:serviceId` — 서비스 상세 6종 (internet/mobile/rental/moving/cleaning/insurance)
- `/terms`, `/privacy` — 법적 페이지 (Legal.tsx 공통 레이아웃)
- `/chinese-users/*` — 중국인 정착 영역 (바이링얼)

## 자주 발생하는 실수

1. **동적 Tailwind 클래스** — `${prefix}-${shade}` 형태의 동적 클래스는 트리셰이킹됨.
   `lib/accents.ts` 패턴처럼 풀클래스 문자열 매핑 사용. (safelist 정규식이 일부 보호)
2. **라우트 밖의 Header/Footer** — `/admin/*`, `/login`, `/register`는 공용 헤더가 나오지 않도록
   `App.tsx`의 라우팅 구조 유지 (`PublicLayout` 패턴).
3. **`siteConfig` 중복** — `comparison.ts`와 `chineseServices.ts` 모두에 channel 정보가 있음.
   단일 진실 원천은 `comparison.ts`. `chineseServices.ts`는 ko/zh 바이링얼 확장만.
4. **i18n** — 한국어가 기본. zh는 `/chinese-users` 영역만. en은 거의 없음.
   다른 언어 선택 시 `TranslationFallbackNotice` 자동 표시.
5. **SEO 메타 중복 주의** — `index.html`의 기본 OG 메타와 `SEO` 컴포넌트의 메타가 겹침.
   페이지 단위 SEO가 있으면 override됨.

## 확장 로드맵 요약

(자세한 건 `DATA.md`의 "기능 백로그")

1. 백엔드 API 도입 (Express/Fastify + Prisma) — `db/schema.sql`과 맞춤
2. AI 추천 실제 LLM 연동
3. 파일 업로드 (외국인등록증, 여권)
4. 다국어(i18n) 전 페이지 확장 (현재 zh 일부만)
5. 알림(문자/이메일/KakaoTalk 알림톡)
6. 분석 스크립트 (GA4/Pixel) — `CookieBanner` 동의 후 로드
7. 본 운영 도메인으로 sitemap.xml/robots.txt/SITE_ORIGIN 교체
