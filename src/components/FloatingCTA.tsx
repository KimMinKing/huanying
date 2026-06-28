import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Headset,
  MessageCircle,
  X,
  Phone,
  MessageSquareText,
  type LucideIcon,
} from 'lucide-react'
import { siteConfig } from '../data/comparison'

/**
 * 플로팅 CTA (데스크탑 + 모바일).
 *
 * 두 가지 모드를 동시에 렌더:
 * 1. 모바일 하단 바 — 단일 CTA (페이지 #consult 또는 #cn-consult로 스크롤)
 * 2. 데스크탑 우하단 FAB — 클릭 시 채널 메뉴 확장 (카톡/WeChat/전화/폼)
 *
 * 채널 URL은 data/comparison.ts의 siteConfig에서 가져옴.
 * 빈 URL인 경우 폼(#consult)으로 폴백.
 */
export default function FloatingCTA() {
  const location = useLocation()
  const isCnPage = location.pathname.startsWith('/chinese-users')
  const targetId = isCnPage ? 'cn-consult' : 'consult'

  return (
    <>
      <MobileBottomBar isCnPage={isCnPage} targetId={targetId} />
      <DesktopChannelFab isCnPage={isCnPage} />
    </>
  )
}

/** 모바일 하단 고정 CTA 바 — 히어로 벗어난 후 노출, 닫기 가능 */
function MobileBottomBar({
  isCnPage,
  targetId,
}: {
  isCnPage: boolean
  targetId: string
}) {
  const [show, setShow] = useState(false)
  const [closed, setClosed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (closed) return
    const onScroll = () => {
      const y = window.scrollY
      const el =
        document.getElementById(targetId) ??
        document.getElementById('consult') ??
        document.getElementById('cn-consult')
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY
        const bottom = top + el.offsetHeight
        setShow(y > 600 && !(y + window.innerHeight > top && y < bottom))
      } else {
        setShow(y > 600)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [closed, targetId, location.pathname])

  if (closed) return null

  return (
    <div
      className={[
        'fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition duration-300 lg:hidden',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
      ].join(' ')}
    >
      <div className="relative flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 pl-4 shadow-cardHover backdrop-blur">
        <div className="flex-1">
          <p className="text-sm font-extrabold text-ink">
            {isCnPage ? '중국어 상담 진행 중' : '무료 상담 진행 중'}
          </p>
          <p className="text-[11px] text-ink-muted">
            {isCnPage ? 'WeChat · 카카오톡' : '24시간 내 매니저 회신'}
          </p>
        </div>
        <a
          href={`#${targetId}`}
          className={`btn px-4 py-2.5 text-sm text-white ${
            isCnPage ? 'bg-mint-600 hover:bg-mint-700' : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          {isCnPage ? <MessageCircle className="h-4 w-4" /> : <Headset className="h-4 w-4" />}
          {isCnPage ? '상담' : '신청'}
        </a>
        <button
          type="button"
          aria-label="닫기"
          onClick={() => setClosed(true)}
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-muted shadow-soft"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

/** 데스크탑 우하단 채널 FAB — 클릭 시 카톡/WeChat/전화/폼 메뉴 확장 */
function DesktopChannelFab({ isCnPage }: { isCnPage: boolean }) {
  const [open, setOpen] = useState(false)

  const channels: ChannelItem[] = isCnPage
    ? [
        {
          icon: MessageCircle,
          label: 'WeChat',
          sub: siteConfig.wechat.handle,
          href: siteConfig.wechat.qrUrl || `#cn-consult`,
          external: !!siteConfig.wechat.qrUrl,
          color: 'bg-[#07C160] text-white',
        },
        {
          icon: MessageCircle,
          label: '카카오톡',
          sub: siteConfig.kakao.handle,
          href: siteConfig.kakao.url || `#cn-consult`,
          external: !!siteConfig.kakao.url,
          color: 'bg-[#FEE500] text-[#191919]',
        },
        {
          icon: Phone,
          label: '전화 상담',
          sub: siteConfig.company.phone,
          href: `tel:${siteConfig.company.phone.replace(/[^0-9+]/g, '')}`,
          external: false,
          color: 'bg-brand-600 text-white',
        },
      ]
    : [
        {
          icon: MessageCircle,
          label: '카카오톡',
          sub: siteConfig.kakao.handle,
          href: siteConfig.kakao.url || '#consult',
          external: !!siteConfig.kakao.url,
          color: 'bg-[#FEE500] text-[#191919]',
        },
        {
          icon: Phone,
          label: '전화 상담',
          sub: siteConfig.company.phone,
          href: `tel:${siteConfig.company.phone.replace(/[^0-9+]/g, '')}`,
          external: false,
          color: 'bg-brand-600 text-white',
        },
        {
          icon: MessageSquareText,
          label: '상담 폼',
          sub: '무료 · 24시간 내 회신',
          href: '#consult',
          external: false,
          color: 'bg-ink text-white',
        },
      ]

  return (
    <div
      className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-2 lg:flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* 확장 메뉴 (위쪽으로) */}
      <div
        className={[
          'flex flex-col items-end gap-2 transition-all duration-200',
          open
            ? 'pointer-events-auto opacity-100 translate-y-0'
            : 'pointer-events-none opacity-0 translate-y-2',
        ].join(' ')}
      >
        {channels.map((ch) => (
          <ChannelButton key={ch.label} channel={ch} />
        ))}
      </div>

      {/* 메인 FAB 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="상담 채널 열기"
        aria-expanded={open}
        className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-redGlow transition hover:bg-brand-700"
      >
        {open ? <X className="h-6 w-6" /> : <Headset className="h-6 w-6" />}
        {!open && (
          <span className="absolute -left-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-gold-500" />
          </span>
        )}
      </button>
    </div>
  )
}

interface ChannelItem {
  icon: LucideIcon
  label: string
  sub: string
  href: string
  external: boolean
  color: string
}

function ChannelButton({ channel: ch }: { channel: ChannelItem }) {
  const Icon = ch.icon
  return (
    <a
      href={ch.href}
      target={ch.external ? '_blank' : undefined}
      rel={ch.external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-3 py-2 shadow-cardHover backdrop-blur transition hover:scale-105"
    >
      <span className="flex flex-col items-end leading-tight">
        <span className="text-xs font-bold text-ink">{ch.label}</span>
        <span className="text-[10px] text-ink-muted">{ch.sub}</span>
      </span>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${ch.color}`}
      >
        <Icon className="h-4 w-4" />
      </span>
    </a>
  )
}
