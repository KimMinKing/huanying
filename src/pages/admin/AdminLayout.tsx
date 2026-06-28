import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react'
import { getSession, logout, type AdminUser } from '../../lib/adminAuth'

/**
 * 관리자 페이지 공통 레이아웃.
 * - 좌측 사이드바 + 상단 헤더 + 상단 목업 배너
 * - 인증 안 된 사용자는 /admin/login으로 리다이렉트
 */
export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [checked, setChecked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      navigate('/admin/login', { replace: true, state: { from: location.pathname } })
      return
    }
    setUser(session)
    setChecked(true)
  }, [navigate, location.pathname])

  // 모바일 드로어: 라우트 변경 시 닫기
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  if (!checked || !user) return null

  const navItems = [
    { to: '/admin', label: '대시보드', icon: LayoutDashboard, end: true },
    { to: '/admin/consultations', label: '상담 신청', icon: Inbox, end: false },
    { to: '/admin/settings', label: '사이트 설정', icon: Settings, end: false },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 목업 모드 경고 배너 */}
      <div className="flex items-center justify-center gap-2 bg-gold-100 px-4 py-2 text-center text-xs font-semibold text-gold-800">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        <span>
          목업 모드 — DB 연동 전. 표시되는 데이터는 데모용이며 인증은 localStorage 기반입니다.
        </span>
      </div>

      {/* 모바일 헤더 */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="메뉴 열기"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-ink"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white">
              <span className="text-sm font-black">라</span>
            </span>
            <span className="font-extrabold text-ink">라이플 관리자</span>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 (데스크탑 고정 / 모바일 드로어) */}
        <aside
          className={[
            'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
        >
          <div className="flex h-full flex-col">
            <div className="hidden items-center gap-2 border-b border-slate-200 px-5 py-4 lg:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <span className="font-black">라</span>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-extrabold text-ink">라이플 관리자</span>
                <span className="text-[10px] uppercase tracking-widest text-ink-light">
                  Lifful Admin
                </span>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                        isActive
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                          : 'text-ink-soft hover:bg-slate-100 hover:text-ink',
                      ].join(' ')
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className="space-y-2 border-t border-slate-200 px-3 py-4">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-ink-muted hover:bg-slate-100 hover:text-ink"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                사이트 바로가기
              </Link>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {user.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-ink">{user.name}</p>
                  <p className="truncate text-[11px] text-ink-muted">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="로그아웃"
                  className="text-ink-muted transition hover:text-brand-700"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* 모바일 드로어 오버레이 */}
        {sidebarOpen && (
          <div
            aria-hidden
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          />
        )}

        {/* 메인 콘텐츠 */}
        <main className="min-w-0 flex-1">
          <div className="container-page py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
