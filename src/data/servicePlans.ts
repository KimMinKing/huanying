import {
  Wifi,
  Smartphone,
  Refrigerator,
  Truck,
  Sparkles,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import type { ServiceAccent } from './services'

/**
 * 서비스 카테고리별 상세 데이터.
 * 각 카테고리 페이지(/services/:id)는 이 데이터를 기반으로 렌더링.
 *
 * ⚠️ 요금제·옵션은 샘플(데모). 실제 계약 파트너사 요금과 다를 수 있음.
 *    정확한 요금은 상담 시 확정. DATA.md → "요금제 / 상품 데이터"에서 교체.
 */

export interface PlanOption {
  label: string
  value: string
  highlight?: boolean
}

export interface PlanRow {
  id: string
  partner: string
  badge?: string
  monthly: number
  note?: string
  installment?: string
  features: string[]
  highlight?: boolean
}

export interface PlanComparisonTable {
  columns: PlanOption[]
  rows: PlanRow[]
}

export interface ChecklistItem {
  id: string
  text: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface ServiceDetail {
  id: string
  icon: LucideIcon
  accent: ServiceAccent
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string

  /** 메릿 섹션 */
  benefits: { icon: string; title: string; description: string }[]

  /** 비교표 — 각 카테고리별로 컬럼/행 구조가 다름 */
  comparison: PlanComparisonTable
  comparisonCaption?: string

  /** 절약 팁 / 체크리스트 */
  checklistTitle: string
  checklist: ChecklistItem[]

  /** 자주 묻는 질문 */
  faqs: FAQItem[]

  /** 마지막 CTA 문구 */
  ctaTitle: string
  ctaDescription: string
}

export const serviceDetails: Record<string, ServiceDetail> = {
  internet: {
    id: 'internet',
    icon: Wifi,
    accent: 'brand',
    heroEyebrow: '인터넷 / IPTV',
    heroTitle: '인터넷 요금제, 3사를 한 번에 비교',
    heroSubtitle: 'SK브로드밴드 · KT · LG유플러스',
    heroDescription:
      '속도, 결합할인, 설치비, 사은품까지. 복잡한 약정 조건을 한눈에 비교하고 가장 유리한 통신사로 안내드려요.',
    benefits: [
      { icon: 'scale', title: '동일 조건 비교', description: '속도·약정·결합을 동일 기준으로 정리해서 헷갈리지 않게 비교해 드려요.' },
      { icon: 'search', title: '숨은 비용 발견', description: '설치비, 위약금, 부가세 등 견적에 빠지기 쉬운 항목까지 미리 짚어드립니다.' },
      { icon: 'route', title: '결합 할인 매칭', description: '휴대폰, IPTV, 인터넷을 같이 쓰면 추가 할인. 매니저가 최적 조합을 찾아요.' },
      { icon: 'life-buoy', title: '설치 후 사후관리', description: '장애 접수, 회선 변경도 같은 매니저가 챙깁니다.' },
    ],
    comparison: {
      columns: [
        { label: '속도', value: 'speed' },
        { label: '월 요금', value: 'monthly' },
        { label: '설치비', value: 'install' },
        { label: '약정', value: 'term' },
        { label: '3년 총비용', value: 'total' },
        { label: '사은품', value: 'gift' },
      ],
      rows: [
        {
          id: 'a',
          partner: 'A사 (SK 계열)',
          badge: '추천',
          monthly: 33600,
          note: '1Gbps · 결합 시 추가 할인',
          installment: '무료',
          features: ['1Gbps', '33,600원', '무료', '3년', '1,209,600원', '최대 5만 원 포인트 + 기프티콘'],
          highlight: true,
        },
        {
          id: 'b',
          partner: 'B사 (KT 계열)',
          monthly: 37400,
          note: 'IPTV 결합 시 월 5,500원 추가 할인',
          installment: '무료 (3년 약정 시)',
          features: ['1Gbps', '37,400원', '무료 (3년 약정)', '3년', '1,346,400원', '스마트 TV 65인치'],
        },
        {
          id: 'c',
          partner: 'C사 (LG U+ 계열)',
          monthly: 41800,
          note: '500Mbps도 가능 — 속도 낮춰 절약',
          installment: '11,000원',
          features: ['500Mbps', '41,800원', '11,000원', '3년', '1,504,800원', '테스코 멤버십 1년 + 백화점권 5만 원'],
        },
      ],
    },
    comparisonCaption: '※ 위 요금은 2026년 샘플 기준이며, 실제 계약 시점·프로모션에 따라 달라집니다.',
    checklistTitle: '신청 전 체크리스트',
    checklist: [
      { id: 'i1', text: '현재 사용 중인 통신사와 약정 종료일 확인' },
      { id: 'i2', text: '휴대폰 결합 가능 여부 (같은 통신사 그룹이어야 함)' },
      { id: 'i3', text: '거주지 지원 속도 (구축 세대별 상이)' },
      { id: 'i4', text: 'IPTV 추가 필요 여부' },
      { id: 'i5', text: 'Wi-Fi 공유기 임대 vs 자가 구매' },
      { id: 'i6', text: '설치 희망일 (이사일과 맞출지)' },
    ],
    faqs: [
      { id: 'f1', question: '위약금은 누가 부담하나요?', answer: '기존 약정이 남아있는 경우, 신규 통신사에서 위약금 지원 프로모션을 진행 중인지 먼저 확인합니다. 지원이 있는 경우에만 안전하게 번호이동/해지하세요.' },
      { id: 'f2', question: '속도가 너무 빠르면 비싸던데, 꼭 1Gbps가 필요한가요?', answer: '일반 가정 2~3인 인터넷 사용·넷플릭스 4K 시청에는 500Mbps로 충분합니다. 파일 업로드나 4K 게임 등 특수 목적이 아니면 절약형이 더 유리합니다.' },
      { id: 'f3', question: '외국인도 가입할 수 있나요?', answer: '여권과 부동산 계약서가 있으면 가능합니다. 외국인등록증이 발급된 이후에는 정식 통신사 번호 가입도 가능합니다.' },
    ],
    ctaTitle: '지금 쓰는 통신사, 더 저렴할 수 있어요',
    ctaDescription: '현재 요금제 알려주시면 3사 비교 견적을 보내드립니다.',
  },

  mobile: {
    id: 'mobile',
    icon: Smartphone,
    accent: 'gold',
    heroEyebrow: '휴대폰 / 알뜰폰',
    heroTitle: '휴대폰 요금, 30% 절약 가능',
    heroSubtitle: '통신사 + 알뜰폰 통합 비교',
    heroDescription:
      '데이터 사용량과 통화 패턴에 맞춰 SKT·KT·LG U+ 정식 요금제와 알뜰폰(MNO)을 비교. 가족 결합, 약정까지 고려해 월 3~5만 원 절약 사례 많아요.',
    benefits: [
      { icon: 'scale', title: '정식 vs 알뜰폰 비교', description: '같은 데이터 용량으로 정식 통신사와 알뜰폰의 월 요금 차이를 한눈에.' },
      { icon: 'search', title: '숨은 할인 찾기', description: '가족 결합, 장기 약정, 청년 할인 등 놓치기 쉬운 혜택을 매니저가 점검합니다.' },
      { icon: 'route', title: '번호이동 가능 여부', description: '통신사 변경 시 유의사항을 사전 안내. 안전하게 번호이성 지원.' },
      { icon: 'life-buoy', title: '개통 후 사후관리', description: '요금 이상, 명의 변경, 분실 시 대응까지 함께 합니다.' },
    ],
    comparison: {
      columns: [
        { label: '통신사', value: 'carrier' },
        { label: '데이터', value: 'data' },
        { label: '월 요금', value: 'monthly' },
        { label: '통화', value: 'voice' },
        { label: '결합 할인', value: 'bundle' },
        { label: '비고', value: 'note' },
      ],
      rows: [
        {
          id: 'a',
          partner: '정식 통신사 (예: SKT)',
          badge: '안정',
          monthly: 65000,
          note: '본인인증·결제 모두 가능',
          features: ['SKT', '무제한', '65,000원', '무제한', '가족 결합 -15%', '5G 프리미엄'],
          highlight: true,
        },
        {
          id: 'b',
          partner: '준법 알뜰폰',
          badge: '추천',
          monthly: 33000,
          note: '일반 사용자 절약형',
          features: ['알뜰폰(SK망)', '무제한', '33,000원', '집·이동전화 무제한', '없음', '본인인증 가능'],
        },
        {
          id: 'c',
          partner: '데이터 중심 알뜰폰',
          monthly: 11900,
          note: '단기/외국인 추천',
          features: ['알뜰폰(KT망)', '10GB+무제한', '11,900원', '100분', '없음', '월 1만 원대 절약'],
        },
      ],
    },
    comparisonCaption: '※ 알뜰폰은 본인인증 가능 여부가 요금제마다 다릅니다. 결제·은행 앱 사용 시 매니저에게 문의.',
    checklistTitle: '신청 전 체크리스트',
    checklist: [
      { id: 'm1', text: '월 데이터 사용량 (SKT/KT/LG U+ 앱에서 확인)' },
      { id: 'm2', text: '월 평균 통화 시간' },
      { id: 'm3', text: '현재 통신사와 약정 종료일' },
      { id: 'm4', text: '가족 결합 가능 여부 (동일 통신사 필요)' },
      { id: 'm5', text: '외국인등록증 소지 여부 (외국인 전용 요금제)' },
      { id: 'm6', text: 'eSIM 지원 단말인지 (아이폰/갤럭시 플래그십)' },
    ],
    faqs: [
      { id: 'f1', question: '알뜰폰은 본인인증이 안 된다면서요?', answer: '최근에는 본인인증이 가능한 알뜰폰 요금제가 대부분입니다. 단, 일부 (특히 저가형)는 제한이 있으므로 매니저가 확인 후 추천드립니다.' },
      { id: 'f2', question: '속도가 느려지지 않나요?', answer: '같은 통신사망(SKT/KT/LG U+)을 빌려 쓰기 때문에 기본 속도는 동일합니다. 다만 일일 데이터 초과 시 속도 제한이 있을 수 있어 사용량에 맞춰 선택해야 합니다.' },
      { id: 'f3', question: '외국인도 알뜰폰 가입 가능한가요?', answer: '외국인등록증이 있으면 가능합니다. 단기 체류(D-2 이하)는 eSIM 데이터 전용 요금제가 더 빠르고 효율적입니다.' },
    ],
    ctaTitle: '월 3만 원에서 5만 원, 다시 확인해 보세요',
    ctaDescription: '현재 통신사·월 평균 데이터 알려주시면 최적 요금제를 찾아드려요.',
  },

  rental: {
    id: 'rental',
    icon: Refrigerator,
    accent: 'mint',
    heroEyebrow: '가전 렌탈',
    heroTitle: '정수기·비데·공기청정기, 꼭 필요한 것만',
    heroSubtitle: '총비용 비교로 과소비 방지',
    heroDescription:
      '약정 기간별 총비용과 사은품을 비교. 정말 필요한 항목인지, 구매가 더 싼지까지 매니저가 먼저 점검해 드려요.',
    benefits: [
      { icon: 'scale', title: '렌탈 vs 구매 비교', description: '렌탈이 항상 이득은 아닙니다. 사용 기간·유지비를 비교해 더 싼 쪽을 안내합니다.' },
      { icon: 'search', title: '약정 총비용 비교', description: '3년·5년 약정 총비용과 사은품 가치까지 비교.' },
      { icon: 'route', title: '중도해지 위약금 안내', description: '이사·변심 시 발생할 수 있는 위약금을 사전에 안내합니다.' },
      { icon: 'life-buoy', title: '무상 AS 조건 확인', description: '필터 교체 주기, 출장 서비스 비용 등 AS 조건을 명확히.' },
    ],
    comparison: {
      columns: [
        { label: '상품', value: 'product' },
        { label: '월 렌탈료', value: 'monthly' },
        { label: '약정 기간', value: 'term' },
        { label: '총비용', value: 'total' },
        { label: '사은품', value: 'gift' },
        { label: '비고', value: 'note' },
      ],
      rows: [
        {
          id: 'a',
          partner: '정수기 (직수형)',
          badge: '추천',
          monthly: 39000,
          note: '필터 1년 4회 무상',
          features: ['직수형 정수기', '39,000원', '3년', '1,404,000원', '다이슨 청소기 렌탈 1년'],
          highlight: true,
        },
        {
          id: 'b',
          partner: '공기청정기 + 비데 번들',
          monthly: 49000,
          note: '방 2개 이상 거주 추천',
          features: ['공기청정기+비데', '49,000원', '3년', '1,764,000원', '스타벅스 기프티콘 5만 원'],
        },
        {
          id: 'c',
          partner: '안마의자 (프리미엄)',
          monthly: 89000,
          note: '장기 사용자용',
          features: ['안마의자', '89,000원', '5년', '5,340,000원', '바디프렌드 1주 체험'],
        },
      ],
    },
    comparisonCaption: '※ 총비용은 약정 종료 시까지의 렌탈료 합계. 위약금·이자 미포함.',
    checklistTitle: '신청 전 체크리스트',
    checklist: [
      { id: 'r1', text: '정말 매일 사용할 상품인지 (구매 vs 렌탈 비교)' },
      { id: 'r2', text: '설치 공간 크기 (정수기: 싱크대 옆 등)' },
      { id: 'r3', text: '3년 이상 거주 예정인지 (이사 시 이전비 발생)' },
      { id: 'r4', text: '필터·소모품 교체 주기' },
      { id: 'r5', text: '사은품보다 월 렌탈료가 더 중요한지' },
      { id: 'r6', text: '중도해지 위약금 계산식 사전 확인' },
    ],
    faqs: [
      { id: 'f1', question: '렌탈이 구매보다 비싼 거 아닌가요?', answer: '렌탈은 월 요금이 작지만 3년 이상 쓰면 구매보다 비싸지는 경우가 많습니다. 단, 무상 AS, 필터 교체 포함, 사은품 등의 혜택을 종합적으로 비교해야 합니다. 매니저가 먼저 계산해 드려요.' },
      { id: 'f2', question: '이사할 때 이전 가능한가요?', answer: '대부분 가능하지만 제품에 따라 이전비(2~5만 원)가 발생합니다. 장기 거주가 확실치 않으면 단기 약정이 더 안전합니다.' },
      { id: 'f3', question: '외국인도 가입 가능한가요?', answer: '외국인등록증이 있으면 가능합니다. 체크카드 결제를 원할 경우 은행 계좌 개설 상태에서 진행합니다.' },
    ],
    ctaTitle: '정말 필요한지, 먼저 점검해 드릴게요',
    ctaDescription: '현재 생각 중인 상품 알려주시면 총비용 비교를 보내드립니다.',
  },

  moving: {
    id: 'moving',
    icon: Truck,
    accent: 'amber',
    heroEyebrow: '이사',
    heroTitle: '이사 견적, 3곳 한 번에 받아보세요',
    heroSubtitle: '일반·포장·입주이사 통합 비교',
    heroDescription:
      '부피 기준 견적과 옵션(에어컨, 벽시, 사다리차) 비용까지 투명하게 안내. 중간에 비용이 불어나는 일이 없도록요.',
    benefits: [
      { icon: 'scale', title: '3곳 견적 비교', description: '한 번의 폼 제출로 여러 업체 견적을 한번에. 일일이 전화할 필요 없어요.' },
      { icon: 'search', title: '옵션 비용 명시', description: '에어컨 탈부착, 벽시 철거, 사다리차, 폐기물 처리 — 처음부터 모든 항목 표기.' },
      { icon: 'route', title: '부피 기준 정확 견적', description: '평수와 짐의 양을 기준으로. 방문 견적 없이도 대략 비용 안내 가능.' },
      { icon: 'life-buoy', title: '파손 보장 확인', description: '이사 중 파손 시 보상 기준을 미리 확인. 보험 가입 업체 우선 매칭.' },
    ],
    comparison: {
      columns: [
        { label: '업체 유형', value: 'type' },
        { label: '예상 견적', value: 'price' },
        { label: '적용 평수', value: 'size' },
        { label: '옵션 포함', value: 'options' },
        { label: '소요 시간', value: 'duration' },
        { label: '비고', value: 'note' },
      ],
      rows: [
        {
          id: 'a',
          partner: '일반 이사',
          badge: '절약',
          monthly: 250000,
          note: '짐이 적은 분 추천',
          features: ['일반 이사', '25만 원~', '원룸·투룸', '적재만', '반나절', '직접 포장 필요'],
        },
        {
          id: 'b',
          partner: '포장이사',
          badge: '추천',
          monthly: 600000,
          note: '가장 일반적인 선택',
          features: ['포장이사', '60만 원~', '쓰리룸·20평대', '포장+운반+정리', '반나절~1일', '에어컨 별도'],
          highlight: true,
        },
        {
          id: 'c',
          partner: '입주 이사 (프리미엄)',
          monthly: 1500000,
          note: '30평 이상 추천',
          features: ['입주 이사', '150만 원~', '30평 이상', '풀옵션 포장', '1일', '에어컨+벽시+사다리차 포함'],
        },
      ],
    },
    comparisonCaption: '※ 견적은 샘플이며, 실제 부피·거리·날짜에 따라 변동됩니다.',
    checklistTitle: '이사 전 체크리스트',
    checklist: [
      { id: 'mv1', text: '이사 예정일 (주말·월말은 할증 가능)' },
      { id: 'mv2', text: '현재 집 평수와 짐의 양 (가구·가전 개수)' },
      { id: 'mv3', text: '에어컨 설치/철거 필요 여부' },
      { id: 'mv4', text: '벽시걸이 TV, 샹들리에 등 철거 필요 여부' },
      { id: 'mv5', text: '출발지·도착지 층수와 엘리베이터 유무' },
      { id: 'mv6', text: '사다리차 진입 가능 여부 (골목 너비 등)' },
      { id: 'mv7', text: '폐기물 처리 필요 여부' },
    ],
    faqs: [
      { id: 'f1', question: '방문 견적은 필수인가요?', answer: '정확한 견적을 위해서는 방문 견적이 필요하지만, 사진·영상을 통한 비대면 견적도 가능합니다. 복잡한 짐(피아노, 금고 등)이 없다면 비대면으로 충분합니다.' },
      { id: 'f2', question: '이사 당일 파손이 발생하면 어떡하나요?', answer: '보험 가입 업체를 우선 매칭하며, 작업 전 사진 촬영을 권장합니다. 파손 시 업체 보험으로 보상 처리됩니다.' },
      { id: 'f3', question: '주말·월말은 비싸진다면서요?', answer: '네, 할증 10~30%가 적용됩니다. 평일 이사가 가능하면 10% 이상 절약할 수 있습니다. 매니저가 일정 최적화를 도와드려요.' },
    ],
    ctaTitle: '이사 날짜 정해졌다면, 지금 견적 받아보세요',
    ctaDescription: '평수와 짐 양을 알려주시면 3곳 비교 견적을 보내드립니다.',
  },

  cleaning: {
    id: 'cleaning',
    icon: Sparkles,
    accent: 'violet',
    heroEyebrow: '입주 청소',
    heroTitle: '입주·이사·준공 청소, 믿을 수 있는 업체',
    heroSubtitle: '평수별 공임·옵션 비교',
    heroDescription:
      '싸게 맡겼다가 재청소로 더 비싸진 경험이 없도록. 작업 범위, 추가 비용 발생 조건, 사후 보장 기준을 미리 확인해 드려요.',
    benefits: [
      { icon: 'scale', title: '평수별 공임 비교', description: '같은 평수라도 작업 범위에 따라 2배 차이. 비교 기준을 명확히 합니다.' },
      { icon: 'search', title: '옵션 비용 명시', description: '보일러 청소, 에어컨 분해 청소, 욕실 실리콘 교체 등 추가 항목 비용을 미리 표기.' },
      { icon: 'route', title: '사후 보장 확인', description: '작업 후 미흡 부분 재작업 여부, 보장 기간을 미리 계약서에 명시.' },
      { icon: 'life-buoy', title: '전·후 사진 촬영', description: '작업 전후 사진을 남겨 분쟁 시 증빙으로 활용.' },
    ],
    comparison: {
      columns: [
        { label: '유형', value: 'type' },
        { label: '평수 기준', value: 'size' },
        { label: '공임', value: 'price' },
        { label: '작업 시간', value: 'duration' },
        { label: '포함 항목', value: 'includes' },
        { label: '옵션', value: 'options' },
      ],
      rows: [
        {
          id: 'a',
          partner: '입주 청소 (기본)',
          badge: '추천',
          monthly: 200000,
          note: '신규 입주 추천',
          features: ['입주 청소', '20평대', '20만 원~', '반나절', '주방·욕실·창호', '보일러 +5만 원'],
          highlight: true,
        },
        {
          id: 'b',
          partner: '이사 청소',
          monthly: 150000,
          note: '기존 거주지 정리',
          features: ['이사 청소', '20평대', '15만 원~', '반나절', '바닥·가구 표면', '에어컨 +3만 원'],
        },
        {
          id: 'c',
          partner: '준공 청소 (신축)',
          monthly: 400000,
          note: '공사 잔재물 제거',
          features: ['준공 청소', '20평대', '40만 원~', '1일', '전 영역 + 접착제 제거', '광택 작업 별도'],
        },
      ],
    },
    comparisonCaption: '※ 평수·오염도에 따라 변동. 보일러/에어컨/베란다 등 옵션 별도.',
    checklistTitle: '청소 전 체크리스트',
    checklist: [
      { id: 'c1', text: '입주일과 청소일 순서 (청소 후 입추)' },
      { id: 'c2', text: '현재 집 상태 (오염도, 곰팡이 여부)' },
      { id: 'c3', text: '보일러 순환청소 필요 여부 (3년 이상 사용 시 권장)' },
      { id: 'c4', text: '에어컨 분해 청소 필요 여부' },
      { id: 'c5', text: '베란다, 다용도실 등 추가 영역' },
      { id: 'c6', text: '욕실 실리콘 교체 필요 여부' },
      { id: 'c7', text: '주차장 사용 가능 여부 (업체 차량)' },
    ],
    faqs: [
      { id: 'f1', question: '저렴한 곳이 제일 좋지 않나요?', answer: '싼 견적은 보일러·에어컨·창틀 등을 빼거나, 작업자 경험이 부족한 경우가 많습니다. 결국 재청소로 더 비싸지는 경우가 많아요. 작업 범위를 명확히 비교하는 게 핵심입니다.' },
      { id: 'f2', question: '언제 예약해야 하나요?', answer: '이사일 확정 즉시 예약하세요. 월말·이사 성수기(봄·가을)는 2~3주 전 예약이 필요할 수 있습니다.' },
      { id: 'f3', question: '외국인 거주자도 신청할 수 있나요?', answer: '네 가능합니다. 다만 안내는 한국어가 기본이므로, 통역이 필요하면 미리 알려주세요.' },
    ],
    ctaTitle: '싸게 맡기고 재청소하는 일 없도록',
    ctaDescription: '평수와 현재 상태 알려주시면 정확한 견적을 안내드려요.',
  },

  insurance: {
    id: 'insurance',
    icon: ShieldCheck,
    accent: 'rose',
    heroEyebrow: '보험 / 카드',
    heroTitle: '자동차보험·신용카드, 꼭 필요한 것만',
    heroSubtitle: '준비 중 — 사전 알림 신청 가능',
    heroDescription:
      '과잉 설계가 아니라 실제 필요한 담보만. 갱신형 자동차보험 요율 비교와 일상 혜택 카드 추천을 준비 중입니다.',
    benefits: [
      { icon: 'scale', title: '갱신 요율 비교', description: '자동차보험 갱신 시 타사 요율과 비교해 절약.' },
      { icon: 'search', title: '혜택 카드 매칭', description: '월별 지출 패턴을 분석해 가장 큰 혜택 카드 추천.' },
      { icon: 'route', title: '과잉 설계 방지', description: '꼭 필요한 담보만 설계하고 중복 담보는 정리.' },
      { icon: 'life-buoy', title: '무료 해지 보장', description: '특정 카드는 발급 후 무료 해지 보장 상품으로.' },
    ],
    comparison: {
      columns: [
        { label: '상품', value: 'product' },
        { label: '월 예상 보험료/연회비', value: 'price' },
        { label: '주요 혜택', value: 'benefit' },
        { label: '비고', value: 'note' },
      ],
      rows: [
        {
          id: 'a',
          partner: '자동차보험 (갱신형)',
          monthly: 150000,
          note: '운전자 추천',
          features: ['자동차종합보험', '약 15만 원/월', '대인·대물·자기차량', '갱신 1개월 전 비교 권장'],
          highlight: true,
        },
        {
          id: 'b',
          partner: '신용카드 (생활 혜택형)',
          monthly: 10000,
          note: '선택',
          features: ['생활 혜택 카드', '연회비 1.2만 원', '대중교통·통신 5% 할인', '월 30만 원 이상 사용 시'],
        },
        {
          id: 'c',
          partner: '여행 보험 (단기)',
          monthly: 30000,
          note: '해외여행 시',
          features: ['여행보험', '건당 3만 원~', '상해·질병·배상책', '여행 빈도에 따라'],
        },
      ],
    },
    comparisonCaption: '※ 보험 상품은 준비 중이며, 정확한 견적은 영업자 매칭 후 안내드립니다.',
    checklistTitle: '신청 전 체크리스트',
    checklist: [
      { id: 'ins1', text: '현재 가입 중인 보험·카드 목록' },
      { id: 'ins2', text: '월 평균 지출 항목 (대중교통, 통신, 외식 등)' },
      { id: 'ins3', text: '운전 여부와 차량 정보 (자차 보험용)' },
      { id: 'ins4', text: '가족 구성과 부양 여부 (종신보험 설계용)' },
      { id: 'ins5', text: '기존 질병·수술 이력 (건강보험 가입 시)' },
    ],
    faqs: [
      { id: 'f1', question: '준비 중인데 언제 가능한가요?', answer: '현재 보험/카드 부문은 파트너사 매칭 중입니다. 폼을 남겨주시면 서비스 오픈 시 가장 먼저 안내드립니다.' },
      { id: 'f2', question: '기존 보험을 바꾸는 게 유리한가요?', answer: '갱신 시점에 타사 요율을 비교하면 10~20% 절약이 가능한 경우가 많습니다. 단, 무해지 환급금 등 기존 조건을 잃을 수 있어 매니저가 종합 검토합니다.' },
      { id: 'f3', question: '외국인도 가입 가능한가요?', answer: '외국인등록증과 국내 소득이 있으면 가능합니다. 다만 일부 상품은 제한이 있을 수 있습니다.' },
    ],
    ctaTitle: '보험·카드 부문, 곧 오픈됩니다',
    ctaDescription: '미리 알림을 받아보시면 서비스 오픈 시 가장 먼저 안내드려요.',
  },
}

export function getServiceDetail(id: string): ServiceDetail | undefined {
  return serviceDetails[id]
}
