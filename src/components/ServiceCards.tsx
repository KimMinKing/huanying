import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { services } from '../data/services'
import { accents } from '../lib/accents'

export default function ServiceCards() {
  return (
    <section id="services" className="section">
      <div className="container-page">
        <SectionHeader
          eyebrow="서비스 카테고리"
          title={
            <>
              필요한 서비스를 골라보세요.
              <br className="hidden sm:block" />
              <span className="text-ink-muted"> 한 번에 비교하고 신청할 수 있어요.</span>
            </>
          }
          description="각 카테고리는 독립적으로 비교·신청 가능합니다. 여러 서비스를 묶어서 상담 받을 수도 있어요."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            const a = accents[service.accent]
            return (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="group relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-cardHover"
              >
                {/* 상단: 아이콘 + 태그 */}
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${a.iconWrap}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  {service.tag && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.softBg} ${a.softText}`}
                    >
                      {service.tag}
                    </span>
                  )}
                </div>

                {/* 제목 */}
                <div className="mt-5">
                  <p className={`text-xs font-bold uppercase tracking-wider ${a.softText}`}>
                    {service.summary}
                  </p>
                  <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
                    {service.title}
                  </h3>
                </div>

                {/* 설명 */}
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {service.description}
                </p>

                {/* 특징 리스트 */}
                <ul className="mt-5 space-y-2">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm font-medium text-ink-soft"
                    >
                      <Check className={`h-4 w-4 ${a.softText}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* 하단 링크 */}
                <span
                  className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-ink transition group-hover:text-brand-600"
                >
                  자세히 보기 · 상담 신청
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// 섹션 헤더 재사용 컴포넌트 (WhyUs 등에서도 사용)
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: React.ReactNode
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={[
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : '',
      ].join(' ')}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
