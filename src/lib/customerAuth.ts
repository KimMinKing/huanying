/**
 * 고객용 인증 (목업).
 *
 * 관리자와 별개 — 일반 사용자용.
 *
 * ⚠️ MOCK 구현 — localStorage 기반.
 *    백엔드 도입 시 login/register/getSession을 API 호출로 교체.
 *
 * 현재 동작:
 *   - 회원가입 시 localStorage에 저장
 *   - 마이페이지에서 '내 상담 신청' 표시 (DB 미연동이라 mock)
 *   - 향후 백엔드 도입 시 이 모듈만 교체하면 됨
 */

export interface CustomerUser {
  id: string
  email: string
  name: string
  phone: string
  preferredLanguage: 'ko' | 'zh' | 'en'
  createdAt: string
}

interface StoredCustomer extends CustomerUser {
  password: string
}

const STORAGE_KEY_CUSTOMERS = 'lifful_mock_customers'
const STORAGE_KEY_SESSION = 'lifful_mock_customer_session'

/** 데모 고객 1명 — 마이페이지 화면 테스트용 */
const DEFAULT_CUSTOMERS: StoredCustomer[] = [
  {
    id: 'demo-cust-1',
    email: 'demo@lifful.com',
    name: '홍데모',
    phone: '010-1234-5678',
    preferredLanguage: 'ko',
    password: 'demo123',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
]

function loadCustomers(): StoredCustomer[] {
  if (typeof window === 'undefined') return DEFAULT_CUSTOMERS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CUSTOMERS)
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS))
      return DEFAULT_CUSTOMERS
    }
    return JSON.parse(raw) as StoredCustomer[]
  } catch {
    return DEFAULT_CUSTOMERS
  }
}

function saveCustomers(customers: StoredCustomer[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers))
}

export async function login(email: string, password: string): Promise<CustomerUser> {
  await new Promise((r) => setTimeout(r, 500))

  const customers = loadCustomers()
  const found = customers.find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password,
  )
  if (!found) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  const session: CustomerUser = {
    id: found.id,
    email: found.email,
    name: found.name,
    phone: found.phone,
    preferredLanguage: found.preferredLanguage,
    createdAt: found.createdAt,
  }
  const token = btoa(JSON.stringify(session))
  window.localStorage.setItem(STORAGE_KEY_SESSION, token)
  return session
}

export async function register(input: {
  email: string
  name: string
  password: string
  phone: string
}): Promise<CustomerUser> {
  await new Promise((r) => setTimeout(r, 600))

  if (input.password.length < 6) {
    throw new Error('비밀번호는 6자 이상이어야 합니다.')
  }
  if (!/^010-\d{4}-\d{4}$/.test(input.phone)) {
    throw new Error('전화번호 형식은 010-1234-5678 이어야 합니다.')
  }

  const customers = loadCustomers()
  if (customers.some((c) => c.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('이미 가입된 이메일입니다.')
  }

  const newCustomer: StoredCustomer = {
    id: `cust-${Date.now()}`,
    email: input.email,
    name: input.name,
    password: input.password,
    phone: input.phone,
    preferredLanguage: 'ko',
    createdAt: new Date().toISOString(),
  }
  saveCustomers([...customers, newCustomer])

  return login(input.email, input.password)
}

export function getSession(): CustomerUser | null {
  if (typeof window === 'undefined') return null
  const token = window.localStorage.getItem(STORAGE_KEY_SESSION)
  if (!token) return null
  try {
    return JSON.parse(atob(token)) as CustomerUser
  } catch {
    return null
  }
}

export function logout() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY_SESSION)
}

/**
 * 마이페이지용 '내 상담 신청' — 목업.
 *
 * 실제로는 현재 고객의 consultations를 DB에서 가져와야 함.
 * 지금은 mockConsultations 중 일부를 해당 고객 것으로 가정하고 반환.
 */
export async function getMyConsultations(): Promise<MyConsultation[]> {
  await new Promise((r) => setTimeout(r, 400))

  // 현재 로그인 고객 기준 — 데모 계정인 경우 3건, 신규 가입자는 0~1건
  const session = getSession()
  if (!session) return []

  // 백엔드 없이 "자연스러운" 화면을 위해 데모 고객에게는 미리 신청된 3건 표시
  if (session.email === 'demo@lifful.com') {
    return [
      {
        id: 'mc-001',
        serviceType: 'internet',
        serviceName: '인터넷 / IPTV',
        status: 'in_progress',
        statusLabel: '상담 중',
        message: 'SK브로드밴드 1Gbps 쓰고 있는데 비교 견적 받아보고 싶어요.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        assignedStaff: '최매니저',
      },
      {
        id: 'mc-002',
        serviceType: 'mobile',
        serviceName: '휴대폰 / 알뜰폰',
        status: 'done',
        statusLabel: '완료',
        message: '알뜰폰으로 번호이동. 가족 결합 할인 적용.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
        assignedStaff: '이매니저',
      },
      {
        id: 'mc-003',
        serviceType: 'rental',
        serviceName: '가전 렌탈',
        status: 'done',
        statusLabel: '완료',
        message: '정수기 렌탈 — 3년 약정, 사은품 협의.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        assignedStaff: '최매니저',
      },
    ]
  }

  return []
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
