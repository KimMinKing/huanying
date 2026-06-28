/**
 * 관리자 페이지용 목업 상담 데이터.
 *
 * 백엔드 도입 시 이 파일은 더 이상 사용되지 않음 —
 * /api/admin/consultations 응답으로 대체.
 *
 * 날짜는 "오늘 기준 며칠 전" 형태의 상대값으로 생성하여
 * 데모가 항상 최근 날짜를 보여주도록 함.
 */

export type ConsultationStatus =
  | 'new'
  | 'contacted'
  | 'in_progress'
  | 'done'
  | 'cancelled'

export type ServiceType =
  | 'internet'
  | 'mobile'
  | 'rental'
  | 'moving'
  | 'cleaning'
  | 'chinese_settlement'

export interface MockConsultation {
  id: string
  name: string
  phone: string
  email?: string
  serviceType: ServiceType
  status: ConsultationStatus
  message: string
  assignedStaff?: string
  preferredChannel?: 'kakao' | 'wechat' | 'phone' | 'email'
  createdAt: string // ISO
}

const serviceLabels: Record<ServiceType, string> = {
  internet: '인터넷 / IPTV',
  mobile: '휴대폰 / 알뜰폰',
  rental: '가전 렌탈',
  moving: '이사',
  cleaning: '입주 청소',
  chinese_settlement: '외국인 정착 패키지',
}

export function getServiceLabel(s: ServiceType): string {
  return serviceLabels[s]
}

const statusLabels: Record<ConsultationStatus, string> = {
  new: '신규',
  contacted: '연락 완료',
  in_progress: '상담 중',
  done: '완료',
  cancelled: '취소',
}

export function getStatusLabel(s: ConsultationStatus): string {
  return statusLabels[s]
}

/** 상태별 배지 색상 (Tailwind 풀클래스) */
export const statusBadgeCls: Record<ConsultationStatus, string> = {
  new: 'bg-brand-50 text-brand-700 border-brand-100',
  contacted: 'bg-amber-50 text-amber-700 border-amber-100',
  in_progress: 'bg-sky-50 text-sky-700 border-sky-100',
  done: 'bg-mint-50 text-mint-700 border-mint-100',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
}

// "오는로부터 n일 전" ISO 생성
function daysAgo(n: number, hour = 10, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

/** 데모용 상담 14건. 다양한 상태/서비스/채널 분포. */
export const mockConsultations: MockConsultation[] = [
  {
    id: 'c-001',
    name: '김지훈',
    phone: '010-1234-5678',
    email: 'kim.jihun@example.com',
    serviceType: 'internet',
    status: 'new',
    message: 'SK브로드밴드 1Gbps 쓰고 있는데 비교 견적 받아보고 싶어요.',
    preferredChannel: 'kakao',
    createdAt: daysAgo(0, 9, 32),
  },
  {
    id: 'c-002',
    name: '이서연',
    phone: '010-2345-6789',
    email: 'seoyeon.lee@example.com',
    serviceType: 'mobile',
    status: 'new',
    message: '알뜰폰으로 바꾸려는데 가족 4명 결합 가능한지 궁금해요.',
    preferredChannel: 'phone',
    createdAt: daysAgo(0, 11, 15),
  },
  {
    id: 'c-003',
    name: '张伟',
    phone: '010-3456-7890',
    email: 'zhang.wei@example.com',
    serviceType: 'chinese_settlement',
    status: 'new',
    message: 'D-2 비자로 휴대폰 개통과 은행 계좌 개설 도움 필요해요.',
    preferredChannel: 'wechat',
    createdAt: daysAgo(0, 14, 48),
  },
  {
    id: 'c-004',
    name: '박민준',
    phone: '010-4567-8901',
    serviceType: 'moving',
    status: 'contacted',
    message: '이사 견적 3곳 비교 요청. 강남→분당 이사 예정.',
    assignedStaff: '최매니저',
    preferredChannel: 'kakao',
    createdAt: daysAgo(1, 10, 22),
  },
  {
    id: 'c-005',
    name: 'Emily Chen',
    phone: '010-5678-9012',
    email: 'emily.chen@example.com',
    serviceType: 'chinese_settlement',
    status: 'contacted',
    message: '中英文咨询: 인터넷 설치 + 집 구하기 동시 진행 가능한지요?',
    assignedStaff: '王매니저',
    preferredChannel: 'wechat',
    createdAt: daysAgo(1, 16, 5),
  },
  {
    id: 'c-006',
    name: '정하린',
    phone: '010-6789-0123',
    serviceType: 'rental',
    status: 'in_progress',
    message: '정수기 + 공기청정기 렌탈 동시에. 3년 약정 총비용 비교 요청.',
    assignedStaff: '최매니저',
    preferredChannel: 'phone',
    createdAt: daysAgo(2, 9, 0),
  },
  {
    id: 'c-007',
    name: '황보겸',
    phone: '010-7890-1234',
    email: 'hwangbo@example.com',
    serviceType: 'cleaning',
    status: 'in_progress',
    message: '입주 청소 32평. 보일러/에어컨 옵션 포함 견적.',
    assignedStaff: '이매니저',
    preferredChannel: 'kakao',
    createdAt: daysAgo(2, 13, 41),
  },
  {
    id: 'c-008',
    name: '王芳',
    phone: '010-8901-2345',
    serviceType: 'mobile',
    status: 'done',
    message: '외국인등록증으로 번호 개통 — 완료 감사합니다.',
    assignedStaff: '王매니저',
    preferredChannel: 'wechat',
    createdAt: daysAgo(3, 11, 28),
  },
  {
    id: 'c-009',
    name: '강도윤',
    phone: '010-9012-3456',
    serviceType: 'internet',
    status: 'done',
    message: 'LG유플러스 1Gbps + IPTV 결합으로 가입 완료.',
    assignedStaff: '최매니저',
    preferredChannel: 'phone',
    createdAt: daysAgo(4, 10, 12),
  },
  {
    id: 'c-010',
    name: '신예진',
    phone: '010-0123-4567',
    email: 'shine@example.com',
    serviceType: 'rental',
    status: 'done',
    message: '안마의자 렌탈 — 사은품 조건 좋은 곳으로 가입.',
    assignedStaff: '이매니저',
    preferredChannel: 'kakao',
    createdAt: daysAgo(5, 15, 55),
  },
  {
    id: 'c-011',
    name: '李娜',
    phone: '010-1111-2222',
    serviceType: 'chinese_settlement',
    status: 'done',
    message: '정착 패키지 6개월 사후관리 감사드립니다.',
    assignedStaff: '王매니저',
    preferredChannel: 'wechat',
    createdAt: daysAgo(6, 9, 17),
  },
  {
    id: 'c-012',
    name: '오승민',
    phone: '010-2222-3333',
    serviceType: 'moving',
    status: 'cancelled',
    message: '일정 변경으로 보류. 한 달后再요청 예정.',
    assignedStaff: '최매니저',
    preferredChannel: 'phone',
    createdAt: daysAgo(7, 14, 30),
  },
  {
    id: 'c-013',
    name: '刘洋',
    phone: '010-3333-4444',
    email: 'liu.yang@example.com',
    serviceType: 'mobile',
    status: 'done',
    message: 'eSIM 데이터 요금제 — 단기 체류용. 빠른 개통 감사합니다.',
    assignedStaff: '王매니저',
    preferredChannel: 'wechat',
    createdAt: daysAgo(9, 11, 0),
  },
  {
    id: 'c-014',
    name: '윤채원',
    phone: '010-4444-5555',
    serviceType: 'cleaning',
    status: 'done',
    message: '준공 청소 54평. 작업 퀄리티 좋았어요.',
    assignedStaff: '이매니저',
    preferredChannel: 'kakao',
    createdAt: daysAgo(12, 10, 45),
  },
]

/** 통계 계산 헬퍼 — 대시보드용 */
export function getConsultationStats(consultations: MockConsultation[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const todayCount = consultations.filter((c) => new Date(c.createdAt) >= today).length
  const weekCount = consultations.filter((c) => new Date(c.createdAt) >= weekAgo).length
  const pendingCount = consultations.filter(
    (c) => c.status === 'new' || c.status === 'contacted',
  ).length
  const doneCount = consultations.filter((c) => c.status === 'done').length
  const conversionRate =
    consultations.length > 0
      ? Math.round((doneCount / consultations.length) * 100)
      : 0

  // 서비스별 분포
  const byService = new Map<ServiceType, number>()
  for (const c of consultations) {
    byService.set(c.serviceType, (byService.get(c.serviceType) ?? 0) + 1)
  }
  const serviceDistribution = Array.from(byService.entries())
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)

  return {
    todayCount,
    weekCount,
    pendingCount,
    doneCount,
    conversionRate,
    serviceDistribution,
    total: consultations.length,
  }
}
