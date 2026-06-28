import { useState, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLocale, LOCALES, LOCALE_LABEL, type Locale } from '../lib/i18n'

/**
 * 언어 스위처.
 * 클릭 시 드롭다운으로 KR / 中文 / EN 선택.
 * - 선택한 언어는 localStorage에 저장되어 새로고침해도 유지
 * - 번역이 안 된 페이지는 <TranslationFallbackNotice/>로 안내
 */
export default function LanguageSwitcher({
  variant = 'compact',
}: {
  variant?: 'compact' | 'full'
}) {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="언어 선택"
        className={[
          'inline-flex items-center gap-1.5 rounded-full border text-xs font-bold transition',
          variant === 'compact'
            ? 'border-slate-200 bg-white px-3 py-2 text-ink-soft hover:border-brand-200 hover:text-brand-700'
            : 'border-slate-200 bg-white px-4 py-2.5 text-sm text-ink hover:border-brand-300',
        ].join(' ')}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="font-mono uppercase">{locale}</span>
        <ChevronDown
          className={[
            'h-3 w-3 transition-transform',
            open ? 'rotate-180 text-brand-600' : '',
          ].join(' ')}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1.5 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-cardHover"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => {
                  setLocale(l)
                  setOpen(false)
                }}
                className={[
                  'flex w-full items-center justify-between px-3 py-2 text-sm font-semibold transition',
                  l === locale
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-soft hover:bg-slate-50 hover:text-ink',
                ].join(' ')}
              >
                <span className="flex items-center gap-2">
                  <LangFlag locale={l} />
                  {LOCALE_LABEL[l]}
                </span>
                {l === locale && <Check className="h-3.5 w-3.5 text-brand-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function LangFlag({ locale }: { locale: Locale }) {
  const emoji: Record<Locale, string> = {
    ko: '🇰🇷',
    zh: '🇨🇳',
    en: '🇺🇸',
  }
  return <span aria-hidden>{emoji[locale]}</span>
}
