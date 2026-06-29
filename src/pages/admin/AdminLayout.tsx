import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Smartphone,
  Users,
  X,
} from 'lucide-react'
import { getSession, logout } from '../../lib/adminAuth'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  if (!user) return null

  const navItems = [
    { to: '/admin', label: '대시보드', icon: LayoutDashboard, end: true },
    { to: '/admin/consultations', label: '상담 요청', icon: Inbox, end: false },
    { to: '/admin/pricing/mobile', label: '휴대폰 요금 관리', icon: Smartphone, end: false },
    { to: '/admin/users', label: '관리자 관리', icon: Users, end: false, superOnly: true },
    { to: '/admin/settings', label: '사이트 설정', icon: Settings, end: false },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center justify-center gap-2 bg-gold-100 px-4 py-2 text-center text-xs font-semibold text-gold-800">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        <span>목업 관리자입니다. 변경값은 현재 브라우저의 localStorage에 저장됩니다.</span>
      </div>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="메뉴 열기"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-ink"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/admin" className="font-extrabold text-ink">
            Lifful Admin
          </Link>
        </div>
      </header>

      <div className="flex">
        <aside
          className={[
            'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
        >
          <div className="flex h-full flex-col">
            <div className="hidden items-center gap-2 border-b border-slate-200 px-5 py-4 lg:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 font-black text-white">
                L
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-extrabold text-ink">Lifful Admin</span>
                <span className="text-[10px] uppercase tracking-widest text-ink-light">
                  Control Panel
                </span>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems
                .filter((item) => !item.superOnly || user.role === 'super_admin')
                .map((item) => {
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
                            ? 'bg-slate-900 text-white'
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
                사이트 열기
              </Link>

              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <div className="flex items-center gap-3">
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
                <p className="mt-2 text-[11px] font-semibold text-ink-muted">
                  {user.role === 'super_admin' ? '최상위 관리자' : '일반 관리자'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            aria-hidden
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          />
        )}

        <main className="min-w-0 flex-1">
          <div className="container-page py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
