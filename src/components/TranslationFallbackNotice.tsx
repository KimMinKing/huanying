import { useLocale } from '../lib/i18n'
import { Languages } from 'lucide-react'

/**
 * 번역 미지원 페이지 알림 배너.
 *
 * 한국어가 아닌 언어를 선택했을 때, 해당 페이지의 번역이 없으면 표시.
 * - ko는 항상 전체 지원
 * - zh는 /chinese-users 영역과 일부 서비스 카드만 지원
 * - en은 향후 지원 예정
 *
 * 사용법: 페이지 상단에서 locale 확인 후 조건부 렌더.
 */
export default function TranslationFallbackNotice() {
  const { locale } = useLocale()

  if (locale === 'ko') return null

  const messages: Record<string, string> = {
    zh: '此页面尚未翻译成中文。如有需要，请联系我们的中文客服：',
    en: 'This page has not been translated yet. Please contact us:',
  }

  return (
    <div className="border-b border-gold-200 bg-gold-50">
      <div className="container-page flex flex-wrap items-center gap-2 py-2 text-xs font-medium text-gold-800">
        <Languages className="h-3.5 w-3.5 shrink-0" />
        <span>{messages[locale] ?? messages.en}</span>
        <a
          href="/chinese-users"
          className="font-bold text-brand-700 underline underline-offset-2"
        >
          {locale === 'zh' ? '中文页面 →' : '中文 Page →'}
        </a>
      </div>
    </div>
  )
}
