import { Check, Star, Gift, Zap, CalendarClock, Info } from 'lucide-react'
import { comparisonPlans, type ComparisonPlan } from '../data/comparison'
import { formatWon, formatWonCompact } from '../lib/format'
import { SectionHeader } from './ServiceCards'

export default function ComparisonExample() {
  return (
    <section id="comparison" className="section">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="혜택 비교 예시"
            title={
              <>
                견적을 받아보면
                <span className="text-brand-600"> 어디가 진짜 저렴한지</span> 보여요.
              </>
            }
            description="인터넷 1Gbps, 3년 약정 기준 예시입니다. 실제 견적은 지역·약정에 따라 달라질 수 있어요."
          />
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-muted shadow-soft">
            <Info className="h-3.5 w-3.5" />
            실제 사명 대신 A/B/C로 표기
          </div>
        </div>

        {/* 카드형 비교 */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {comparisonPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* 표형 요약 (데스크탑) */}
        <div className="mt-10 hidden overflow-hidden rounded-3xl border border-slate-200 lg:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-ink-muted">
                <th className="px-6 py-4">항목</th>
                {comparisonPlans.map((p) => (
                  <th key={p.id} className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      {p.company}
                      {p.highlight && (
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                          추천
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <CompareRow
                icon={Zap}
                label="월 요금"
                plans={comparisonPlans}
                render={(p) => `${formatWon(p.monthly)} 원`}
                emphasize
              />
              <CompareRow
                icon={Gift}
                label="사은품"
                plans={comparisonPlans}
                render={(p) => p.gift}
              />
              <CompareRow
                icon={CalendarClock}
                label="설치비"
                plans={comparisonPlans}
                render={(p) => p.installFee}
              />
              <CompareRow
                icon={Star}
                label="3년 총비용"
                plans={comparisonPlans}
                render={(p) => formatWonCompact(p.total3y)}
                emphasize
              />
            </tbody>
          </table>
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs text-ink-muted">
          <Info className="h-3.5 w-3.5" />
          위 수치는 예시이며, 실제 견적은 상담 시 확인 가능합니다. 총비용에는 약정
          할인이 반영되어 있을 수 있어요.
        </p>
      </div>
    </section>
  )
}

function PlanCard({ plan }: { plan: ComparisonPlan }) {
  const isHighlight = plan.highlight
  return (
    <article
      className={[
        'relative flex flex-col rounded-4xl border p-6 transition duration-300 hover:-translate-y-1',
        isHighlight
          ? 'border-brand-300 bg-brand-50/40 shadow-cardHover ring-2 ring-brand-500/20 lg:-mt-3 lg:mb-3'
          : 'border-slate-200 bg-white shadow-card hover:shadow-cardHover',
      ].join(' ')}
    >
      {isHighlight && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-md shadow-brand-600/30">
          <Star className="h-3 w-3 fill-current" />
          {plan.badge ?? '추천'}
        </span>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={[
              'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold',
              isHighlight
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-ink-soft',
            ].join(' ')}
          >
            {plan.company.charAt(0)}
          </span>
          <div>
            <p className="text-base font-extrabold text-ink">{plan.company}</p>
            <p className="text-xs text-ink-muted">{plan.speed} 기준</p>
          </div>
        </div>
      </div>

      {/* 월 요금 - 가장 큰 시각적 포인트 */}
      <div className="mt-6">
        <p className="text-xs font-semibold text-ink-muted">월 요금</p>
        <p className="mt-1 flex items-baseline gap-1">
          <span
            className={[
              'text-4xl font-black tracking-tight',
              isHighlight ? 'text-brand-700' : 'text-ink',
            ].join(' ')}
          >
            {formatWon(plan.monthly)}
          </span>
          <span className="text-sm font-bold text-ink-muted">원 / 월</span>
        </p>
      </div>

      {/* 정보 행 */}
      <dl className="mt-5 space-y-3 border-t border-dashed border-slate-200 pt-5">
        <InfoLine icon={Gift} label="사은품" value={plan.gift} />
        <InfoLine
          icon={CalendarClock}
          label="설치비"
          value={plan.installFee}
        />
        <InfoLine
          icon={Star}
          label="3년 총비용"
          value={formatWonCompact(plan.total3y)}
          strong
        />
      </dl>

      <a
        href="#consult"
        className={[
          'mt-6 w-full',
          isHighlight ? 'btn-primary' : 'btn-secondary',
        ].join(' ')}
      >
        <Check className="h-4 w-4" />
        이 요금제 상담받기
      </a>
    </article>
  )
}

function InfoLine({
  icon: Icon,
  label,
  value,
  strong,
}: {
  icon: typeof Gift
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-ink-muted">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd
        className={[
          'text-right text-sm',
          strong ? 'font-extrabold text-ink' : 'font-medium text-ink-soft',
        ].join(' ')}
      >
        {value}
      </dd>
    </div>
  )
}

function CompareRow({
  icon: Icon,
  label,
  plans,
  render,
  emphasize,
}: {
  icon: typeof Gift
  label: string
  plans: ComparisonPlan[]
  render: (p: ComparisonPlan) => string
  emphasize?: boolean
}) {
  return (
    <tr>
      <th
        scope="row"
        className="bg-slate-50/60 px-6 py-4 text-left font-bold text-ink-soft"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-ink-muted" />
          {label}
        </span>
      </th>
      {plans.map((p) => (
        <td
          key={p.id}
          className={[
            'px-6 py-4',
            emphasize ? 'font-extrabold text-ink' : 'text-ink-soft',
            p.highlight ? 'bg-brand-50/40' : '',
          ].join(' ')}
        >
          {render(p)}
        </td>
      ))}
    </tr>
  )
}
