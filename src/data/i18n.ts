/**
 * 다국어(i18n) 기반 구조.
 *
 * - 모든 UI 문자열이 `LocalString` 형태({ ko, zh?, en? })로 존재할 수 있도록 권장.
 * - 현재는 한국어(ko)가 기본이며, 중국인 정착 페이지 핵심 문구는 중국어(zh)를 함께 제공.
 * - 나중에 LocaleContext를 만들어 useLocale()로 현재 언어를 내려주면,
 *   컴포넌트는 `t(content, locale)`만 호출하면 됨.
 *
 * 확장 가이드:
 *   1. data/*.ts의 LocalString 필드에 zh/en 값을 추가.
 *   2. LocaleProvider + useLocale 훅 추가 (이 파일 아래에 stub으로 제공).
 *   3. 컴포넌트에서 t(content) 대신 t(content, locale) 사용.
 */

export type Locale = 'ko' | 'zh' | 'en'

export const LOCALES: Locale[] = ['ko', 'zh', 'en']

export const LOCALE_LABEL: Record<Locale, string> = {
  ko: '한국어',
  zh: '中文',
  en: 'English',
}

/** 다국어 문자열. ko는 필수, zh/en은 선택. */
export type LocalString = {
  ko: string
  zh?: string
  en?: string
}

/** 현재 locale에 맞는 문자열을 반환. 없으면 ko → en → zh 순 폴백. */
export function t(ls: LocalString, locale: Locale = 'ko'): string {
  return ls[locale] ?? ls.ko ?? ls.en ?? ls.zh ?? ''
}

/** 바이링얼 표시용: ko와 (있으면) zh를 함께 반환 — 정착 페이지에서 활용. */
export function bilingual(ls: LocalString, locale: Locale = 'ko'): {
  primary: string
  secondary?: string
} {
  const primary = t(ls, locale)
  // 중국인 페이지에서는 ko/zh를 함께 보여주는 것이 목적
  const secondary = ls.zh && ls.zh !== primary ? ls.zh : ls.en !== primary ? ls.en : undefined
  return { primary, secondary }
}

/** 실사용 훅 stub. LocaleContext를 붙이기 전까지는 ko로 동작. */
export function useLocale(): Locale {
  return 'ko'
}
