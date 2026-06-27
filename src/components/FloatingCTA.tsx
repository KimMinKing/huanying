import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Headset, MessageCircle, X } from 'lucide-react'

/**
 * 모바일 전용 하단 고정 CTA.
 * - 히어로를 벗어난 뒤 나타나고, 사용자가 닫으면 세션 동안 숨김.
 * - 현재 페이지의 상담 영역(#consult 또는 #cn-consult)에 닿으면 자동 숨김.
 * - chinese-users 계열 페이지에서는 중국어 상담(#cn-consult)을 우선 타겟.
 */
export default function FloatingCTA() {
  const [show, setShow] = useState(false)
  const [closed, setClosed] = useState(false)
  const location = useLocation()

  const isCnPage = location.pathname.startsWith('/chinese-users')
  const targetId = isCnPage ? 'cn-consult' : 'consult'

  useEffect(() => {
    if (closed) return
    const onScroll = () => {
      const y = window.scrollY
      const el = document.getElementById(targetId) ?? document.getElementById('consult') ?? document.getElementById('cn-consult')
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
