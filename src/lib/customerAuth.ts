import { clearSession, loadCollection, readSession, saveCollection, wait, writeSession } from './mockStorage'

export type Nationality = 'kr' | 'cn' | 'other'
export type ResidenceStatus = 'citizen' | 'long_term' | 'short_term' | 'tourist'
export type PreferredChannel = 'kakao' | 'wechat' | 'phone' | 'email'
export type PreferredLanguage = 'ko' | 'zh' | 'en'

export interface CustomerUser {
  id: string
  email: string
  name: string
  phone: string
  nationality: Nationality
  preferredLanguage: PreferredLanguage
  residenceStatus: ResidenceStatus
  visaType?: string
  preferredChannel: PreferredChannel
  marketingConsent: boolean
  createdAt: string
}

interface StoredCustomer extends CustomerUser {
  password: string
}

export interface RegisterInput {
  email: string
  name: string
  password: string
  phone: string
  nationality: Nationality
  preferredLanguage: PreferredLanguage
  residenceStatus: ResidenceStatus
  visaType?: string
  preferredChannel: PreferredChannel
  marketingConsent: boolean
}

export interface MyConsultation {
  id: string
  serviceType: string
  serviceName: string
  status: 'new' | 'contacted' | 'in_progress' | 'done' | 'cancelled'
  statusLabel: string
  message: string
  createdAt: string
  assignedStaff?: string
}

export interface MyReservation {
  id: string
  serviceType: string
  serviceName: string
  scheduleAt: string
  visitType: 'visit' | 'call' | 'online'
  visitTypeLabel: string
  status: 'confirmed' | 'pending' | 'completed' | 'reschedule_needed'
  statusLabel: string
  address?: string
  note: string
  assignedStaff?: string
}

const STORAGE_KEY_CUSTOMERS = 'lifful_mock_customers'
const STORAGE_KEY_SESSION = 'lifful_mock_customer_session'

const DEFAULT_CUSTOMERS: StoredCustomer[] = [
  {
    id: 'demo-cust-1',
    email: 'demo@lifful.com',
    name: '김데모',
    phone: '010-1234-5678',
    password: 'demo123',
    nationality: 'kr',
    preferredLanguage: 'ko',
    residenceStatus: 'citizen',
    preferredChannel: 'kakao',
    marketingConsent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'demo-cust-2',
    email: 'zhang@lifful.com',
    name: 'Zhang Wen',
    phone: '010-3456-7890',
    password: 'demo123',
    nationality: 'cn',
    preferredLanguage: 'zh',
    residenceStatus: 'long_term',
    visaType: 'D-2',
    preferredChannel: 'wechat',
    marketingConsent: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
]

function stripPassword(customer: StoredCustomer): CustomerUser {
  const { password, ...rest } = customer
  void password
  return rest
}

function loadCustomers(): StoredCustomer[] {
  return loadCollection<StoredCustomer>(STORAGE_KEY_CUSTOMERS, DEFAULT_CUSTOMERS)
}

function saveCustomers(customers: StoredCustomer[]) {
  saveCollection(STORAGE_KEY_CUSTOMERS, customers)
}

export async function login(email: string, password: string): Promise<CustomerUser> {
  await wait(500)

  const customer = loadCustomers().find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
  )

  if (!customer) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  const session = stripPassword(customer)
  writeSession(STORAGE_KEY_SESSION, session)
  return session
}

export async function register(input: RegisterInput): Promise<CustomerUser> {
  await wait(700)

  if (input.password.length < 6) {
    throw new Error('비밀번호는 6자 이상이어야 합니다.')
  }

  if (!/^010-\d{4}-\d{4}$/.test(input.phone)) {
    throw new Error('전화번호 형식은 010-1234-5678 이어야 합니다.')
  }

  if (input.nationality !== 'kr' && input.residenceStatus !== 'tourist' && !input.visaType) {
    throw new Error('외국인의 장기 또는 단기 체류는 비자 종류를 입력해야 합니다.')
  }

  const customers = loadCustomers()

  if (customers.some((item) => item.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('이미 가입한 이메일입니다.')
  }

  if (customers.some((item) => item.phone === input.phone)) {
    throw new Error('이미 가입한 전화번호입니다.')
  }

  const nextCustomer: StoredCustomer = {
    id: `cust-${Date.now()}`,
    createdAt: new Date().toISOString(),
    password: input.password,
    email: input.email,
    name: input.name,
    phone: input.phone,
    nationality: input.nationality,
    preferredLanguage: input.preferredLanguage,
    residenceStatus: input.residenceStatus,
    visaType: input.visaType,
    preferredChannel: input.preferredChannel,
    marketingConsent: input.marketingConsent,
  }

  saveCustomers([...customers, nextCustomer])
  return login(input.email, input.password)
}

export function getSession(): CustomerUser | null {
  return readSession<CustomerUser>(STORAGE_KEY_SESSION)
}

export function logout() {
  clearSession(STORAGE_KEY_SESSION)
}

export async function getMyConsultations(): Promise<MyConsultation[]> {
  await wait(400)

  const session = getSession()
  if (!session) return []

  if (session.email === 'demo@lifful.com' || session.email === 'zhang@lifful.com') {
    return [
      {
        id: 'mc-001',
        serviceType: session.nationality === 'cn' ? 'chinese_settlement' : 'internet',
        serviceName: session.nationality === 'cn' ? '중국인 정착 패키지' : '인터넷 / IPTV',
        status: 'in_progress',
        statusLabel: '진행 중',
        message:
          session.nationality === 'cn'
            ? '비자 확인과 개통 가능 통신사 비교를 함께 진행하고 있습니다.'
            : '현재 주소 기준으로 1Gbps 인터넷과 IPTV 결합 견적을 비교 중입니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        assignedStaff: session.preferredChannel === 'wechat' ? 'Wendy' : '민지',
      },
      {
        id: 'mc-002',
        serviceType: 'mobile',
        serviceName: '모바일 / 번호이동',
        status: 'done',
        statusLabel: '완료',
        message: '번호이동과 결합 할인 적용이 완료되었습니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
        assignedStaff: '서진',
      },
    ]
  }

  return []
}

export async function getMyReservations(): Promise<MyReservation[]> {
  await wait(350)

  const session = getSession()
  if (!session) return []

  if (session.email === 'demo@lifful.com') {
    return [
      {
        id: 'mr-001',
        serviceType: 'internet',
        serviceName: '인터넷 설치 일정',
        scheduleAt: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3,
        ).toISOString(),
        visitType: 'visit',
        visitTypeLabel: '기사 방문',
        status: 'confirmed',
        statusLabel: '예약 확정',
        address: '서울 성동구 왕십리로 100',
        note: '설치 전 연락 예정입니다. 공유기 위치를 미리 정해 두면 진행이 빠릅니다.',
        assignedStaff: '민지',
      },
      {
        id: 'mr-002',
        serviceType: 'mobile',
        serviceName: '모바일 개통 확인 콜',
        scheduleAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
        visitType: 'call',
        visitTypeLabel: '전화 상담',
        status: 'pending',
        statusLabel: '일정 확인 중',
        note: '번호이동 가능 시간과 본인 인증 절차를 다시 확인합니다.',
        assignedStaff: '서진',
      },
    ]
  }

  if (session.email === 'zhang@lifful.com') {
    return [
      {
        id: 'mr-003',
        serviceType: 'chinese_settlement',
        serviceName: '정착 패키지 서류 확인',
        scheduleAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        visitType: 'online',
        visitTypeLabel: '온라인 안내',
        status: 'confirmed',
        statusLabel: '예약 확정',
        note: '비자, 외국인등록증, 거주지 증빙 서류를 함께 확인합니다.',
        assignedStaff: 'Wendy',
      },
    ]
  }

  return []
}
