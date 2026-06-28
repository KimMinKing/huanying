import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'

/**
 * 쿠키 동의 배너.
 *
 * 한국(개인정보보호법·정보통신법) 기준:
 *   - 필수 쿠키(세션·인증·CSRF)는 동의 없이도 사용 가능
 *   - 분석/마케팅 쿠키(GA4, Meta Pixel 등)는 사전 동의 필요
 *
 * 현재는 단순 동의 UI만 — 백엔드/쿠키 처리는 도입 후 연동.
 * 동의 상태는 localStorage에 저장.
 */
const STORAGE_KEY = 'lifful_cookie_consent'

type ConsentState = 'accepted' | 'rejected' | 'essential_only' | null

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ConsentState
    if (saved) {
      setDismissed(true)
    }
  }, [])

  const save = (s: Exclude<ConsentState, null>) => {
    window.localStorage.setItem(STORAGE_KEY, s)
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2 lg:bottom-6">
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-cardHover backdrop-blur lg:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold-50 text-gold-700">
            <Cookie className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-ink">쿠키 사용 안내</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              라이플은 서비스 품질 향상과 맞춤형 경험을 위해 쿠키를 사용합니다. 필수
              쿠키는 항상 활성화되며, 분석·마케팅 쿠키는 동의 시에만 사용됩니다.
              자세한 내용은{' '}
              <Link to="/privacy" className="font-bold text-brand-700 underline underline-offset-2">
                개인정보처리방침
              </Link>
              을 참고하세요.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => save('accepted')}
                className="btn-primary px-4 py-2 text-xs"
              >
                모두 동의
              </button>
              <button
                type="button"
                onClick={() => save('essential_only')}
                className="btn-secondary px-4 py-2 text-xs"
              >
                필수만 허용
              </button>
              <button
                type="button"
                onClick={() => save('rejected')}
                aria-label="거부"
                className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-slate-100 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 현재 동의 상태 조회 — 분석 스크립트 로드 여부 결정용.
 * 백엔드 도입 시 GA4/Pixel 등은 이 값이 'accepted'일 때만 로드.
 */
export function getCookieConsent(): ConsentState {
  if (typeof window === 'undefined') return null
  return (window.localStorage.getItem(STORAGE_KEY) as ConsentState) ?? null
}
