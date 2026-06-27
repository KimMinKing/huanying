import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Headset, Globe } from 'lucide-react'
import { navItems, siteConfig } from '../data/comparison'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 라우트 변경 시 모바일 메뉴 닫기 + 최상단으로(필요시)
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isHome = location.pathname === '/'

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
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/25">
              <span className="text-lg font-black tracking-tight">라</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-ink">
                {siteConfig.brand}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-light">
                {siteConfig.brandEn}
              </span>
            </span>
          </Link>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map((item) => {
              const active =
                item.type === 'route'
                  ? location.pathname.startsWith(item.href)
                  : false
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

          {/* 우측 CTA */}
          <div className="flex items-center gap-2">
            <Link
              to="/chinese-users"
              className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-ink-soft transition hover:border-brand-200 hover:text-brand-700 lg:inline-flex"
            >
              <Globe className="h-3.5 w-3.5" />
              中文
            </Link>
            <Link to="/#consult" className="btn-primary hidden sm:inline-flex">
              <Headset className="h-4 w-4" />
              무료 상담 신청
            </Link>
            <button
              type="button"
              aria-label="메뉴 열기"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-ink md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 헤더 하단 구분선 — 레드→골드 헤어라인 */}
      <div className="header-divider h-px w-full" />

      {/* 모바일 드로어 */}
      <div
        className={[
          'md:hidden',
          'fixed inset-x-0 top-[calc(var(--header-h)+1px)] z-40 origin-top transition duration-200',
          open
            ? 'pointer-events-auto opacity-100 scale-y-100'
            : 'pointer-events-none opacity-0 scale-y-95',
        ].join(' ')}
      >
        <div className="border-b border-slate-200 bg-white shadow-card">
          <nav className="container-page flex flex-col py-3">
            {navItems.map((item) => (
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
            ))}
            <Link to="/#consult" className="btn-primary mt-3 w-full">
              무료 상담 신청
            </Link>
            <Link
              to="/chinese-users"
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 py-3 text-sm font-bold text-ink-soft"
            >
              <Globe className="h-4 w-4" />
              외국인 정착 서비스 (中文)
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
