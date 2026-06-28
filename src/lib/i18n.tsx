import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { LOCALES, LOCALE_LABEL, t as translate, type Locale, type LocalString } from '../data/i18n'

/**
 * LocaleContext — 전역 언어 상태.
 *
 * 사용법:
 *   - 최상위에 <LocaleProvider> 감싸기 (App.tsx)
 *   - 컴포넌트에서 useLocale() 호출
 *   - 문자열은 t(localString) 또는 data/i18n.ts의 t(ls, locale) 사용
 *
 * 동작:
 *   - localStorage('lifful_locale')에 저장
 *   - html lang 속성 동기화
 *   - 기본값 'ko'
 */

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  /** LocalString에서 현재 언어 추출. locale 인수 생략 시 context 값 사용. */
  t: (ls: LocalString, l?: Locale) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const STORAGE_KEY = 'lifful_locale'

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'ko'
  // 1) localStorage
  const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null
  if (saved && LOCALES.includes(saved)) return saved
  // 2) navigator.language
  const navLang = window.navigator.language.toLowerCase()
  if (navLang.startsWith('zh')) return 'zh'
  if (navLang.startsWith('en')) return 'en'
  return 'ko'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko')

  // 마운트 후 실제 locale 결정
  useEffect(() => {
    setLocaleState(detectInitialLocale())
  }, [])

  // html lang 속성 동기화
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale
    }
  }, [locale])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, l)
    }
  }

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (ls, l) => translate(ls, l ?? locale),
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}

export { LOCALES, LOCALE_LABEL }
export type { Locale, LocalString }
