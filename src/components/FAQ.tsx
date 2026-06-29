import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '../data/faqs'
import { t, type Locale } from '../data/i18n'
import { SectionHeader } from './ServiceCards'

/**
 * FAQ 아코디언.
 * - 한 번에 여러 개 펼침 가능(멀티 오픈).
 * - grid-rows 0fr/1fr 트릭으로 부드러운 높이 전환 (JS 측정 없음).
 * - 접근성: button aria-expanded/aria-controls, 영역 role="region".
 */
export function FAQAccordion({
  items,
  locale = 'ko',
}: {
  items: FaqItem[]
  locale?: Locale
}) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      {items.map((item) => {
        const isOpen = open.has(item.id)
        const panelId = `faq-panel-${item.id}`
        const btnId = `faq-btn-${item.id}`
        return (
          <div key={item.id}>
            <button
              id={btnId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className="flex w-full items-start gap-4 px-5 py-5 text-left transition hover:bg-slate-50 sm:px-6"
            >
              <span className="mt-0.5 flex h-7 shrink-0 items-center rounded-full bg-brand-50 px-2.5 text-[11px] font-bold text-brand-700">
                Q
              </span>
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-light">
                  {t(item.category, locale)}
                </p>
                <p className="mt-1 text-[15px] font-bold leading-snug text-ink sm:text-base">
                  {t(item.question, locale)}
                </p>
              </div>
              <ChevronDown
                className={`mt-1 h-5 w-5 shrink-0 text-ink-muted transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-brand-600' : ''
                }`}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex gap-4 px-5 pb-5 sm:px-6">
                  <span className="mt-0.5 flex h-7 shrink-0 items-center rounded-full bg-mint-50 px-2.5 text-[11px] font-bold text-mint-700">
                    A
                  </span>
                  <p className="text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                    {t(item.answer, locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** FAQ 섹션 (헤더 + 아코디언) 통째로 */
export function FAQSection({
  items,
  locale,
  eyebrow = '자주 묻는 질문',
  title,
}: {
  items: FaqItem[]
  locale?: Locale
  eyebrow?: string
  title: React.ReactNode
}) {
  return (
    <section className="section">
      <div className="container-page">
        <SectionHeader eyebrow={eyebrow} align="center" title={title} />
        <div className="mx-auto mt-10 max-w-3xl">
          <FAQAccordion items={items} locale={locale} />
        </div>
      </div>
    </section>
  )
}
