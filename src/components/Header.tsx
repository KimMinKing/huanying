import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Globe, LogOut, Menu, UserCircle, X } from 'lucide-react'
import { navItems, siteConfig, type NavItem } from '../data/comparison'
import { getSession, logout } from '../lib/customerAuth'
import LanguageSwitcher from './LanguageSwitcher'
import NotificationCenter from './NotificationCenter'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [customerSession, setCustomerSession] = useState(getSession())
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const syncSession = () => setCustomerSession(getSession())
    window.addEventListener('lifful-auth-changed', syncSession)
    return () => window.removeEventListener('lifful-auth-changed', syncSession)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isHome = location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50">
      <div
        className={[
          'transition-all duration-300',
          scrolled || !isHome
            ? 'border-b border-slate-200/70 bg-white/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-white/0',
        ].join(' ')}
      >
        <div className="container-page flex h-[var(--header-h)] items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/25">
              <span className="text-lg font-black tracking-tight">L</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-ink">{siteConfig.brand}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-light">
                {siteConfig.brandEn}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map((item) => {
              const active =
                item.type === 'route'
                  ? location.pathname.startsWith(item.href)
                  : item.type === 'dropdown'
                    ? item.id === 'services'
                      ? location.pathname.startsWith('/services')
                      : item.children?.some((child) => location.pathname.startsWith(child.href)) ?? false
                    : false

              if (item.type === 'dropdown' && item.children) {
                return <DropdownMenu key={item.id} item={item} active={active} />
              }

              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={[
                    'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition',
                    item.highlight
                      ? 'text-brand-700 hover:bg-brand-50'
                      : 'text-ink-soft hover:bg-slate-100 hover:text-ink',
                    active ? 'bg-brand-50 text-brand-700' : '',
                  ].join(' ')}
                >
                  {item.label}
                  {item.badge && (
                    <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="compact" />
            <Link
              to="/chinese-users"
              className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-ink-soft transition hover:border-brand-200 hover:text-brand-700 lg:inline-flex"
            >
              <Globe className="h-3.5 w-3.5" />
              中文
            </Link>
            <NotificationCenter />

            {customerSession ? (
              <>
                <Link
                  to="/my"
                  className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-ink-soft transition hover:border-brand-200 hover:text-brand-700 sm:inline-flex"
                >
                  <UserCircle className="h-3.5 w-3.5" />
                  마이페이지
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-ink-soft transition hover:border-brand-200 hover:text-brand-700 sm:inline-flex"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-ink-soft transition hover:border-brand-200 hover:text-brand-700 sm:inline-flex"
              >
                로그인 / 회원가입
              </Link>
            )}

            <button
              type="button"
              aria-label="메뉴 열기"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-ink md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="header-divider h-px w-full" />

      <div
        className={[
          'fixed inset-x-0 top-[calc(var(--header-h)+1px)] z-40 origin-top transition duration-200 md:hidden',
          open
            ? 'pointer-events-auto scale-y-100 opacity-100'
            : 'pointer-events-none scale-y-95 opacity-0',
        ].join(' ')}
      >
        <div className="border-b border-slate-200 bg-white shadow-card">
          <nav className="container-page flex flex-col py-3">
            {navItems.map((item) => {
              if (item.type === 'dropdown' && item.children) {
                return (
                  <div key={item.id} className="border-b border-slate-100 pb-2">
                    <p className="px-4 pt-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
                      {item.label}
                    </p>
                    <div className="mt-1 grid grid-cols-2 gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.href}
                          className="rounded-2xl px-3 py-2.5 transition hover:bg-slate-50"
                        >
                          <p className="text-sm font-bold text-ink">{child.label}</p>
                          {child.description && (
                            <p className="text-[11px] text-ink-muted">{child.description}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={[
                    'flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-semibold transition hover:bg-slate-50',
                    item.highlight ? 'text-brand-700' : 'text-ink',
                  ].join(' ')}
                >
                  {item.label}
                  {item.badge && (
                    <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}

            {customerSession ? (
              <>
                <Link to="/my" className="btn-primary mt-3 w-full">
                  마이페이지
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-bold text-ink-soft"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary mt-3 w-full">
                로그인 / 회원가입
              </Link>
            )}
            <Link
              to="/chinese-users"
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 py-3 text-sm font-bold text-ink-soft"
            >
              <Globe className="h-4 w-4" />
              외국인 정착 가이드
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

function DropdownMenu({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    if (!open) return

    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={[
          'flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition',
          active || open
            ? 'bg-brand-50 text-brand-700'
            : 'text-ink-soft hover:bg-slate-100 hover:text-ink',
        ].join(' ')}
      >
        {item.label}
        <ChevronDown
          className={[
            'h-3.5 w-3.5 transition-transform',
            open ? 'rotate-180 text-brand-600' : '',
          ].join(' ')}
        />
      </button>

      {open && item.children && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div className="w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-cardHover">
            <ul className="p-2">
              {item.children.map((child) => (
                <li key={child.id}>
                  <Link
                    to={child.href}
                    onClick={() => setOpen(false)}
                    className={[
                      'block rounded-xl px-3 py-2.5 transition hover:bg-brand-50',
                      location.pathname === child.href ? 'bg-brand-50' : '',
                    ].join(' ')}
                  >
                    <p className="text-sm font-bold text-ink">{child.label}</p>
                    {child.description && (
                      <p className="mt-0.5 text-xs text-ink-muted">{child.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
