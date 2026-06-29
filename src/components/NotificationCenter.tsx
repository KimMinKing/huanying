import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, BellRing, CheckCheck, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getSession } from '../lib/customerAuth'

interface SiteNotification {
  id: string
  title: string
  body: string
  unread: boolean
}

const STORAGE_KEY_ENABLED = 'lifful_site_notifications_enabled'
const STORAGE_KEY_ITEMS = 'lifful_site_notifications'

function buildDefaultNotifications(): SiteNotification[] {
  const customer = getSession()

  return [
    {
      id: 'consult-follow-up',
      title: '상담 진행 알림',
      body: customer
        ? `${customer.name}님, 상담 진행 상태가 바뀌면 이곳에서 바로 확인할 수 있습니다.`
        : '로그인하면 상담 진행 상태 변경 알림을 이곳에서 확인할 수 있습니다.',
      unread: true,
    },
    {
      id: 'guide-update',
      title: '가이드 업데이트',
      body: '외국인/유학생 준비 서류 체크리스트와 요금 비교 기준 페이지가 추가되었습니다.',
      unread: true,
    },
  ]
}

function loadNotifications() {
  if (typeof window === 'undefined') return buildDefaultNotifications()

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_ITEMS)
    if (!raw) {
      const fallback = buildDefaultNotifications()
      window.localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(raw) as SiteNotification[]
  } catch {
    return buildDefaultNotifications()
  }
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<SiteNotification[]>(loadNotifications)
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(STORAGE_KEY_ENABLED) === 'true'
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled))
  }, [enabled])

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

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  )

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false })),
    )
  }

  const handleToggleEnabled = async () => {
    if (typeof window === 'undefined') return

    if (!enabled && 'Notification' in window) {
      const permission = await window.Notification.requestPermission()
      if (permission !== 'granted') {
        setEnabled(false)
        return
      }
    }

    setEnabled((current) => !current)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="알림 열기"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-soft transition hover:border-brand-200 hover:text-brand-700"
      >
        {enabled ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5 rounded-full bg-brand-600" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-cardHover">
          <div className="border-b border-slate-100 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-ink">알림</p>
                <p className="mt-1 text-xs text-ink-muted">
                  사이트 안에서 진행 상태와 주요 업데이트를 확인합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                모두 읽음
              </button>
            </div>

            <label className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
              <span className="text-xs font-semibold text-ink">브라우저 알림 받기</span>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                onClick={handleToggleEnabled}
                className={[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition',
                  enabled ? 'bg-brand-600' : 'bg-slate-300',
                ].join(' ')}
              >
                <span
                  className={[
                    'inline-block h-4 w-4 rounded-full bg-white transition',
                    enabled ? 'translate-x-6' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </label>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={[
                  'border-b border-slate-100 px-4 py-4 last:border-b-0',
                  notification.unread ? 'bg-brand-50/40' : 'bg-white',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={[
                      'mt-1 h-2 w-2 rounded-full',
                      notification.unread ? 'bg-brand-600' : 'bg-slate-300',
                    ].join(' ')}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink">{notification.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{notification.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 px-4 py-3">
            <Link
              to="/support-hours"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700"
            >
              알림 관련 안내 보기
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
