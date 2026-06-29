export interface CaseStudy {
  id: string
  title: string
  customer: string
  summary: string
  outcome: string
  tags: string[]
  steps: string[]
}

export interface ChecklistGroup {
  id: string
  title: string
  items: string[]
}

export interface SupportChannel {
  id: string
  label: string
  hours: string
  notes: string
}

export interface PricingRule {
  id: string
  title: string
  description: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'student-mobile-internet',
    title: '유학생 입주 첫 주 통신 개통',
    customer: '서울 거주 중국인 유학생',
    summary: '휴대폰 개통과 원룸 인터넷 설치를 같은 주에 처리한 사례입니다.',
    outcome: '번호 개통 1건, 1Gbps 인터넷 설치 1건, 첫 달 비용과 사은 혜택 조건을 함께 정리했습니다.',
    tags: ['D-2 비자', '원룸', '인터넷', '휴대폰'],
    steps: [
      'ARC 수령 일정과 여권 기준으로 개통 가능 통신사를 먼저 분류',
      '기숙사 퇴실일과 새 주소 입주일 사이에 맞춰 설치 날짜 조정',
      '학생 예산에 맞는 월 요금 상한선을 기준으로 결합안 비교',
    ],
  },
  {
    id: 'family-bundle-move',
    title: '가족 결합 재구성 + 이사 동시 진행',
    customer: '4인 가족, 서울 강서구 아파트 이사',
    summary: '기존 휴대폰 회선을 유지하면서 인터넷과 IPTV를 재설계한 사례입니다.',
    outcome: '기존 대비 월 요금 절감, 이전 설치비와 신규 혜택 조건을 함께 비교해 의사결정을 도왔습니다.',
    tags: ['가족결합', '이사', 'IPTV'],
    steps: [
      '기존 약정 잔여 기간과 위약금 발생 여부 확인',
      '이사 주소 기준 망 품질과 설치 가능 속도 재확인',
      '이전 설치와 신규 가입 중 총비용이 낮은 쪽으로 선택',
    ],
  },
  {
    id: 'short-term-visitor-plan',
    title: '단기 체류자용 최소 계약 조합',
    customer: '90일 이내 체류 예정 방문자',
    summary: '짧은 체류 기간에 맞춰 과한 약정 없이 필요한 회선만 구성한 사례입니다.',
    outcome: '단기 사용에 맞는 선불/저비용 조합으로 초기 비용을 줄이고 불필요한 장기 약정을 피했습니다.',
    tags: ['단기체류', '선불', '최소비용'],
    steps: [
      '체류 기간과 본인 인증 가능 서류 범위 먼저 확인',
      '장기 약정 상품은 제외하고 단기 사용 가능 옵션만 비교',
      '해지 비용과 기기 반납 조건까지 포함해 안내',
    ],
  },
]

export const documentChecklist: ChecklistGroup[] = [
  {
    id: 'identity',
    title: '본인 확인 서류',
    items: [
      '여권 원본 또는 촬영본',
      '외국인등록증(ARC) 또는 발급 예정 사실 확인 정보',
      '국내 연락 가능한 휴대전화 번호 또는 메신저 계정',
    ],
  },
  {
    id: 'residence',
    title: '거주 확인 정보',
    items: [
      '입주 주소 전체 표기',
      '임대차계약서 또는 기숙사 배정 확인서',
      '설치 희망일과 입주 가능 시간대',
    ],
  },
  {
    id: 'payment',
    title: '결제 및 계약 관련',
    items: [
      '국내 계좌 또는 결제 수단 정보',
      '자동이체 가능 여부',
      '학생/직장인/가족 결합 등 할인 적용에 필요한 추가 정보',
    ],
  },
  {
    id: 'before-apply',
    title: '신청 전에 확인할 것',
    items: [
      '체류 기간이 3개월 미만인지 여부',
      '본인 명의 개통이 가능한지 여부',
      '와이파이만 필요한지, IPTV/번호이동까지 필요한지 범위 정리',
    ],
  },
]

export const supportChannels: SupportChannel[] = [
  {
    id: 'call',
    label: '전화 상담',
    hours: '평일 10:00 - 19:00',
    notes: '복잡한 결합 상담, 위약금 확인, 주소별 설치 가능 여부 확인에 적합합니다.',
  },
  {
    id: 'kakao',
    label: '카카오톡 상담',
    hours: '평일 10:00 - 20:00',
    notes: '서류 사진 전달, 요금 비교표 확인, 간단한 후속 질문 처리에 적합합니다.',
  },
  {
    id: 'wechat',
    label: 'WeChat 상담',
    hours: '평일 11:00 - 20:00',
    notes: '중국어 응대가 필요한 고객용 채널입니다.',
  },
  {
    id: 'weekend',
    label: '주말/공휴일',
    hours: '정기 상담 운영 없음',
    notes: '남겨주신 문의는 다음 영업일 순서대로 확인합니다.',
  },
]

export const pricingRules: PricingRule[] = [
  {
    id: 'same-condition',
    title: '같은 조건으로 비교합니다',
    description:
      '통신사별 제안이 다르더라도 약정 기간, 속도, 결합 여부, 설치비 포함 여부를 같은 기준으로 맞춰 비교합니다.',
  },
  {
    id: 'total-cost',
    title: '월 요금만 보지 않습니다',
    description:
      '설치비, 사은 혜택, 위약금 가능성, 첫 달 청구 방식까지 포함해 총비용 기준으로 봅니다.',
  },
  {
    id: 'household-fit',
    title: '사용 패턴을 함께 봅니다',
    description:
      '1인 가구인지, 가족 결합이 가능한지, 데이터 사용량이 많은지에 따라 추천안이 달라집니다.',
  },
  {
    id: 'foreigners-docs',
    title: '외국인 고객은 개통 가능 조건을 먼저 봅니다',
    description:
      '요금이 낮아도 서류 조건이 맞지 않으면 진행할 수 없어서, 체류 상태와 본인 인증 가능 여부를 먼저 확인합니다.',
  },
]
