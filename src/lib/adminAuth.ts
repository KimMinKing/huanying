/**
 * 관리자 인증 (목업)
 *
 * ⚠️ MOCK 구현 — 백엔드 없이 UI만 보여주기 위한 localStorage 기반 가짜 인증.
 * 실제 서비스 도입 시 이 모듈 전체를 API 호출 기반 구현으로 교체해야 함.
 *
 * 현재 동작:
 *   - 데모 계정(아래 MOCK_USERS)으로 로그인 가능
 *   - 회원가입 시 localStorage에 추가 (휘발성 — 브라우저 닫거나 초기화 시 사라짐)
 *   - 'token'은 단순 base64 인코딩 (보안 목적 아님)
 *
 * 백엔드 도입 후 교체 포인트:
 *   - login() → POST /api/admin/login
 *   - register() → POST /api/admin/register
 *   - getSession() → GET /api/admin/me (JWT 쿠키/헤더)
 *   - logout() → POST /api/admin/logout (또는 단순 토큰 폐기)
 */

export interface AdminUser {
  email: string
  name: string
  role: 'admin' | 'staff'
}

interface StoredUser extends AdminUser {
  password: string
}

const STORAGE_KEY_USERS = 'lifful_mock_users'
const STORAGE_KEY_SESSION = 'lifful_mock_session'

/** 기본 데모 계정 — DATA.md와 일치 */
const DEFAULT_USERS: StoredUser[] = [
  {
    email: 'admin@lifful.com',
    name: '라이플 관리자',
    role: 'admin',
    password: 'admin123',
  },
]

function loadUsers(): StoredUser[] {
  if (typeof window === 'undefined') return DEFAULT_USERS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_USERS)
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_USERS))
      return DEFAULT_USERS
    }
    return JSON.parse(raw) as StoredUser[]
  } catch {
    return DEFAULT_USERS
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users))
}

/**
 * 로그인. 성공 시 사용자 정보 반환, 실패 시 Error throw.
 * 백엔드 도입 시 이 함수 본문을 fetch() 호출로 교체.
 */
export async function login(email: string, password: string): Promise<AdminUser> {
  // 가짜 네트워크 지연 (UX 테스트용)
  await new Promise((r) => setTimeout(r, 500))

  const users = loadUsers()
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
  if (!found) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  const session: AdminUser = { email: found.email, name: found.name, role: found.role }
  // base64 인코딩 — 암호화 아님. 단순 토큰 흉내.
  const token = btoa(JSON.stringify(session))
  window.localStorage.setItem(STORAGE_KEY_SESSION, token)
  return session
}

export async function register(input: {
  email: string
  name: string
  password: string
}): Promise<AdminUser> {
  await new Promise((r) => setTimeout(r, 600))

  if (input.password.length < 6) {
    throw new Error('비밀번호는 6자 이상이어야 합니다.')
  }
  const users = loadUsers()
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('이미 가입된 이메일입니다.')
  }

  // 가입은 'staff' 역할로만. admin 승격은 별도 작업 필요.
  const newUser: StoredUser = {
    email: input.email,
    name: input.name,
    password: input.password,
    role: 'staff',
  }
  saveUsers([...users, newUser])

  // 자동 로그인
  return login(input.email, input.password)
}

export function getSession(): AdminUser | null {
  if (typeof window === 'undefined') return null
  const token = window.localStorage.getItem(STORAGE_KEY_SESSION)
  if (!token) return null
  try {
    return JSON.parse(atob(token)) as AdminUser
  } catch {
    return null
  }
}

export function logout() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY_SESSION)
}
