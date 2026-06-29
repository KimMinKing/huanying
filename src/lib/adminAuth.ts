import { clearSession, loadCollection, readSession, saveCollection, wait, writeSession } from './mockStorage'

export type AdminRole = 'super_admin' | 'admin'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  createdAt: string
  isActive: boolean
}

interface StoredAdminUser extends AdminUser {
  password: string
}

export interface CreateAdminInput {
  email: string
  name: string
  password: string
  role: AdminRole
}

const STORAGE_KEY_USERS = 'lifful_mock_admin_users'
const LEGACY_STORAGE_KEY_USERS = 'lifful_mock_users'
const STORAGE_KEY_SESSION = 'lifful_mock_session'

const DEFAULT_USERS: StoredAdminUser[] = [
  {
    id: 'admin-root-1',
    email: 'admin@lifful.com',
    name: '최상위 관리자',
    role: 'super_admin',
    password: 'admin123',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    isActive: true,
  },
]

function stripPassword(user: StoredAdminUser): AdminUser {
  const { password, ...rest } = user
  void password
  return rest
}

function normalizeLegacyUsers(users: Array<Partial<StoredAdminUser>>): StoredAdminUser[] {
  return users.map((user, index) => ({
    id: user.id ?? `admin-${index + 1}`,
    email: user.email ?? `admin${index + 1}@lifful.com`,
    name: user.name ?? '관리자',
    role:
      user.email?.toLowerCase() === 'admin@lifful.com'
        ? 'super_admin'
        : user.role === 'super_admin' || user.role === 'admin'
          ? user.role
          : 'admin',
    password: user.password ?? 'admin123',
    createdAt: user.createdAt ?? new Date().toISOString(),
    isActive: user.isActive ?? true,
  }))
}

export function listAdmins(): AdminUser[] {
  return loadAdminUsers().map(stripPassword)
}

function loadAdminUsers(): StoredAdminUser[] {
  const users = loadCollection<StoredAdminUser>(STORAGE_KEY_USERS, [])
  if (users.length > 0) return normalizeLegacyUsers(users)

  const legacyUsers = loadCollection<StoredAdminUser>(LEGACY_STORAGE_KEY_USERS, [])
  if (legacyUsers.length > 0) {
    const normalized = normalizeLegacyUsers(legacyUsers)
    saveAdminUsers(normalized)
    return normalized
  }

  return DEFAULT_USERS
}

function saveAdminUsers(users: StoredAdminUser[]) {
  saveCollection(STORAGE_KEY_USERS, users)
}

export async function login(email: string, password: string): Promise<AdminUser> {
  await wait(400)

  const found = loadAdminUsers().find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password &&
      user.isActive,
  )

  if (!found) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  const session = stripPassword(found)
  writeSession(STORAGE_KEY_SESSION, session)
  return session
}

export async function createAdmin(input: CreateAdminInput): Promise<AdminUser> {
  await wait(350)

  const session = getSession()
  if (session?.role !== 'super_admin') {
    throw new Error('최상위 관리자만 관리자를 추가할 수 있습니다.')
  }

  if (input.password.length < 6) {
    throw new Error('비밀번호는 6자 이상이어야 합니다.')
  }

  const users = loadAdminUsers()
  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('이미 등록된 관리자 이메일입니다.')
  }

  const nextUser: StoredAdminUser = {
    id: `admin-${Date.now()}`,
    email: input.email,
    name: input.name,
    password: input.password,
    role: input.role,
    createdAt: new Date().toISOString(),
    isActive: true,
  }

  saveAdminUsers([...users, nextUser])
  return stripPassword(nextUser)
}

export async function register(input: {
  email: string
  name: string
  password: string
}): Promise<AdminUser> {
  await wait(350)

  const users = loadAdminUsers()
  if (users.length > 0) {
    throw new Error('관리자 가입은 최상위 관리자 초대 방식으로만 가능합니다.')
  }

  const firstAdmin: StoredAdminUser = {
    id: `admin-${Date.now()}`,
    email: input.email,
    name: input.name,
    password: input.password,
    role: 'super_admin',
    createdAt: new Date().toISOString(),
    isActive: true,
  }

  saveAdminUsers([firstAdmin])
  return login(input.email, input.password)
}

export function getSession(): AdminUser | null {
  return readSession<AdminUser>(STORAGE_KEY_SESSION)
}

export function logout() {
  clearSession(STORAGE_KEY_SESSION)
}
