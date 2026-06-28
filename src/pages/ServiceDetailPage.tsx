import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Scale,
  Search,
  Route,
  LifeBuoy,
} from 'lucide-react'
import { getServiceDetail, type FAQItem } from '../data/servicePlans'
import { accents } from '../lib/accents'
import { SectionHeader } from '../components/ServiceCards'
import ConsultationForm from '../components/ConsultationForm'
import Breadcrumbs from '../components/Breadcrumbs'
import NotFoundPage from './NotFoundPage'
import SEO, { faqJsonLd } from '../components/SEO'

/**
 * 서비스 카테고리 상세 페이지 (/services/:id).
 * serviceDetails 데이터 기반으로 6개 카테고리를 동일 템플릿으로 렌더링.
 */
const benefitIconMap: Record<string, typeof Scale> = {
  scale: Scale,
  search: Search,
  route: Route,
  'life-buoy': LifeBuoy,
}

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const detail = serviceId ? getServiceDetail(serviceId) : undefined

  // 페이지 진입 시 스크롤 최상단
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [serviceId])

  if (!detail) return <NotFoundPage />

  const Icon = detail.icon
  const a = accents[detail.accent]

  return (
    <>
      <SEO
        title={`${detail.heroEyebrow} 비교`}
        description={detail.heroDescription}
        path={`/services/${detail.id}`}
        jsonLd={faqJsonLd(detail.faqs)}
      />
      {/* Hero */}
      <section className="relative overflow-hidden cn-warm-bg">
        <div className="container-page pt-8 pb-4 sm:pt-10">
          <Breadcrumbs
            items={[
              { label: '홈', to: '/' },
              { label: '서비스', to: '/#services' },
              { label: detail.heroEyebrow },
            ]}
          />
        </div>
        <div className="container-page pb-16 pt-6 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${a.softBg} ${a.softText}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {detail.heroEyebrow}
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {detail.heroTitle}
            </h1>
            <p className={`mt-3 text-lg font-bold ${a.softText}`}>{detail.heroSubtitle}</p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
              {detail.heroDescription}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#consult" className="btn-primary text-base">
                무료 견적받기
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#comparison" className="btn-secondary text-base">
                비교표 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="왜 라이플인가요"
            align="center"
            title={
              <>
                복잡한 조건은 줄이고,
                <span className={`text-${detail.accent}-700`}> 더 큰 혜택만</span> 남길게요.
              </>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {detail.benefits.map((b) => {
              const BIcon = benefitIconMap[b.icon] ?? Scale
              return (
                <article
                  key={b.title}
                  className={`rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${a.iconWrap}`}
                  >
                    <BIcon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-base font-extrabold tracking-tight text-ink">{b.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="section bg-slate-50/80">
        <div className="container-page">
          <SectionHeader
            eyebrow="가격 비교"
            align="center"
            title={
              <>
                한눈에 비교하는
                <span className={`text-${detail.accent}-700`}> 요금·견적표</span>
              </>
            }
            description="동일한 기준으로 정리했어요. 샘플이며, 실제 계약 시점에 따라 달라질 수 있어요."
          />

          <div className="mx-auto mt-10 max-w-5xl">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
              <ComparisonTable detail={detail} />
            </div>
            {detail.comparisonCaption && (
              <p className="mt-3 text-center text-xs text-ink-muted">{detail.comparisonCaption}</p>
            )}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="section">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <div>
              <SectionHeader
                eyebrow="준비"
                title={
                  <>
                    {detail.checklistTitle}
                  </>
                }
                description="모르면 손해보는 항목들. 폼 작성 전에 미리 체크해 보세요."
              />
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {detail.checklist.map((item, i) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${a.softBg} ${a.softText}`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-ink">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-slate-50/80">
        <div className="container-page">
          <SectionHeader
            eyebrow="자주 묻는 질문"
            align="center"
            title={
              <>
                미리 알아두면
                <span className={`text-${detail.accent}-700`}> 더 쉬워요</span>
              </>
            }
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {detail.faqs.map((faq) => (
              <FAQAccordion key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="section">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-4xl bg-ink px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, rgb(178 41 26 / 0.5), transparent 60%), radial-gradient(circle at 50% 100%, rgb(214 162 63 / 0.25), transparent 60%)',
              }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-300">
                <Sparkles className="h-3 w-3" />
                Free Consultation
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl">
                {detail.ctaTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
                {detail.ctaDescription}
              </p>
              <a href="#consult" className="btn-primary mt-7 text-base">
                무료 견적받기
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation form */}
      <ConsultationForm />
    </>
  )
}

function ComparisonTable({
  detail,
}: {
  detail: NonNullable<ReturnType<typeof getServiceDetail>>
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-ink-muted">
          <tr>
            <th className="px-5 py-4">파트너사 / 상품</th>
            {detail.comparison.columns.map((c) => (
              <th key={c.value} className="px-4 py-4">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {detail.comparison.rows.map((row) => (
            <tr
              key={row.id}
              className={[
                'transition hover:bg-slate-50/60',
                row.highlight ? 'bg-brand-50/40' : '',
              ].join(' ')}
            >
              <td className="px-5 py-5 align-top">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-ink">{row.partner}</span>
                  {row.badge && (
                    <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold leading-none text-white">
                      {row.badge}
                    </span>
                  )}
                </div>
                {row.note && <p className="mt-1 text-xs text-ink-muted">{row.note}</p>}
              </td>
              {row.features.map((f, idx) => (
                <td key={idx} className="px-4 py-5 align-top text-ink-soft">
                  <span className="flex items-start gap-1.5">
                    <Check
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${row.highlight ? 'text-brand-600' : 'text-mint-600'}`}
                    />
                    <span className="font-medium">{f}</span>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FAQAccordion({ faq }: { faq: FAQItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={[
        'overflow-hidden rounded-2xl border bg-white transition',
        open ? 'border-brand-200 shadow-soft' : 'border-slate-200',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-sm font-bold text-ink">{faq.question}</span>
        <ChevronDown
          className={[
            'h-4 w-4 shrink-0 text-ink-muted transition-transform',
            open ? 'rotate-180 text-brand-600' : '',
          ].join(' ')}
        />
      </button>
      <div
        className={[
          'grid transition-all duration-200',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
        </div>
      </div>
    </div>
  )
}
