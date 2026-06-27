import { Check } from 'lucide-react'
import { settlementSteps, type SettlementStep } from '../data/settlementSteps'
import { t, type Locale } from '../data/i18n'
import { SectionHeader } from './ServiceCards'

/**
 * 한국 정착 타임라인.
 * - 좌측 레일(수직선) + 노드(아이콘 원) 구조. 모바일/데스크탑 동일 축.
 * - period 칩은 골드, 노드는 레드 계열 — 정착 페이지 톤 유지.
 */
export function Timeline({
  steps = settlementSteps,
  locale = 'ko',
}: {
  steps?: SettlementStep[]
  locale?: Locale
}) {
  return (
    <ol className="relative">
      {/* 수직 레일 */}
      <span
        aria-hidden
        className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-200 via-brand-300 to-gold-200 sm:left-[31px]"
      />
      {steps.map((step) => {
        const Icon = step.icon
        return (
          <li
            key={step.id}
            className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7"
          >
            {/* 노드 */}
            <div className="relative z-10 shrink-0">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-600 shadow-card sm:h-16 sm:w-16">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-black text-white sm:h-7 sm:w-7">
                {step.step}
              </span>
            </div>

            {/* 본문 카드 */}
            <div className="flex-1 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-2.5 py-1 text-[11px] font-bold text-gold-700 ring-1 ring-inset ring-gold-200">
                {t(step.period, locale)}
              </span>
              <h3 className="mt-2.5 text-lg font-extrabold tracking-tight text-ink sm:text-xl">
                {t(step.title, locale)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
                {t(step.description, locale)}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {step.tasks.map((task) => (
                  <li
                    key={task.ko}
                    className="flex items-start gap-2 rounded-2xl border border-slate-200/70 bg-white px-3 py-2.5 text-sm font-medium text-ink-soft"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" />
                    <span>{t(task, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function TimelineSection({
  steps,
  locale,
  title,
}: {
  steps?: SettlementStep[]
  locale?: Locale
  title: React.ReactNode
}) {
  return (
    <section className="section cn-warm-bg">
      <div className="container-page">
        <SectionHeader eyebrow="한국 정착 플로우" align="center" title={title} />
        <div className="mx-auto mt-12 max-w-3xl">
          <Timeline steps={steps} locale={locale} />
        </div>
      </div>
    </section>
  )
}
