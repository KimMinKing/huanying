/**
 * 혜택 비교 예시 데이터
 * - 실제 회사명 대신 A/B/C로 표기 (요청사항)
 * - highlight: 추천 카드 강조 여부 (true면 포인트 처리)
 *
 * UI는 같은 데이터로 표(catalog)와 카드 두 형태로 렌더링합니다.
 */
export interface ComparisonPlan {
  id: string
  company: string
  badge?: string
  monthly: number // 월 요금 (원)
  gift: string // 사은품
  installFee: string // 설치비 (문자열, "무료" 등 포함)
  total3y: number // 3년 총비용 (원)
  highlight?: boolean
  speed?: string // 속도 (인터넷 등)
}

export const comparisonPlans: ComparisonPlan[] = [
  {
    id: 'a',
    company: 'A사',
    badge: '추천',
    monthly: 33600,
    gift: '최대 5만 원 포인트 + 핫케이크 기프티콘',
    installFee: '무료',
    total3y: 1209600,
    speed: '1Gbps',
    highlight: true,
  },
  {
    id: 'b',
    company: 'B사',
    monthly: 37400,
    gift: '스마트 TV 사은품 (65인치)',
    installFee: '무료 (3년 약정 시)',
    total3y: 1346400,
    speed: '1Gbps',
  },
  {
    id: 'c',
    company: 'C사',
    monthly: 41800,
    gift: '테스코 멤버십 1년 + 백화점 5만 원권',
    installFee: '11,000원',
    total3y: 1504800,
    speed: '500Mbps',
  },
]

/** whyUs 데이터 - 카드형으로 렌더링 */
export interface WhyUsItem {
  id: string
  title: string
  description: string
  icon: string // lucide 아이콘 이름 (UI에서 매핑)
}

export const whyUs: WhyUsItem[] = [
  {
    id: 'compare',
    title: '복잡한 조건을 쉽게 비교',
    description:
      '통신사별로 다른 약정, 결합, 사은품을 동일한 기준으로 정리해서 한눈에 비교해요. 영업마다 다른 혜택 헷갈릴 필요 없습니다.',
    icon: 'scale',
  },
  {
    id: 'hidden-cost',
    title: '숨은 비용까지 확인',
    description:
      '설치비, 위약금, 부가세, 옵션 보장 등 견적에 잘 안 적히는 항목까지 미리 짚어드려요. 가입하고 나서 깜짝 놀랄 일이 없도록요.',
    icon: 'search',
  },
  {
    id: 'one-flow',
    title: '상담부터 신청까지 한 번에',
    description:
      '전화 한 통, 혹은 폼 한 번이면 돼요. 여러 업체를 직접 연락하거나 매장까지 갈 필요 없이 한 곳에서 끝납니다.',
    icon: 'route',
  },
  {
    id: 'aftercare',
    title: '가입 후 사후관리',
    description:
      '청구 이상, 변경, 해지까지 신청 이후에도 같은 매니저가 책임집니다. 약정 끝나는 시점에 알림도 챙겨드려요.',
    icon: 'life-buoy',
  },
]

/** Hero 통계 숫자 */
export const heroStats = [
  { value: '12만+', label: '누적 상담' },
  { value: '38억 원+', label: '고객 절약액' },
  { value: '4.8 / 5.0', label: '만족도 평균' },
]

/** 헤더 네비게이션.
 * - type 'anchor': 같은 페이지 내 섹션(#...) — 홈에서만 동작, 다른 페이지에서는 홈으로 이동 후 스크롤.
 * - type 'route' : 라우터 경로(/...).
 * - highlight    : 외국인 서비스 등 강조 표시.
 */
export type NavItem = {
  id: string
  label: string
  type: 'anchor' | 'route'
  href: string
  highlight?: boolean
  badge?: string
}

export const navItems: NavItem[] = [
  { id: 'internet', label: '인터넷', type: 'anchor', href: '/#services' },
  { id: 'mobile', label: '휴대폰', type: 'anchor', href: '/#services' },
  { id: 'rental', label: '렌탈', type: 'anchor', href: '/#services' },
  { id: 'move', label: '이사', type: 'anchor', href: '/#services' },
  { id: 'cleaning', label: '청소', type: 'anchor', href: '/#services' },
  { id: 'reviews', label: '고객후기', type: 'anchor', href: '/#reviews' },
  {
    id: 'chinese',
    label: '외국인 정착',
    type: 'route',
    href: '/chinese-users',
    highlight: true,
    badge: '中文',
  },
]

/** 회사 정보 - Footer에 사용 */
export const siteConfig = {
  brand: '라이플',
  brandEn: 'Lifful',
  description: '생활 서비스 비교 & 신청 플랫폼',
  // 실제 사업자 정보로 교체 필요
  company: {
    name: '라이플 주식회사',
    ceo: '홍길동',
    businessNumber: '000-00-00000',
    mailOrderNumber: '2026-서울강남-0000',
    address: '서울특별시 강남구 테헤란로 000, 0층',
    email: 'hello@lifful.example',
    phone: '1533-0000',
    csHours: '평일 10:00 - 19:00 (주말/공휴일 휴무)',
  },
  kakao: {
    label: '카카오톡 상담',
    placeholder: '@라이플',
    // ⚠️ 실제 채널 URL로 교체 필요 (DATA.md → 메신저 상담 채널 섹션 참고)
    // 발급: https://biz.kakao.com/ 채널 생성 후 '채널 URL' 복사
    url: '',
    handle: '@라이플',
  },
  wechat: {
    label: 'WeChat 상담',
    // ⚠️ 실제 WeChat ID 입력. 중국어 사용자용.
    handle: 'lifful_kr',
    // QR 이미지 URL (png/jpg). 직접 업로드 또는 CDN 링크.
    qrUrl: '',
  },
}
