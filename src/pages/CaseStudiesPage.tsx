import { ArrowRight, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import SEO from '../components/SEO'
import { SectionHeader } from '../components/ServiceCards'
import { caseStudies } from '../data/guides'

export default function CaseStudiesPage() {
  return (
    <>
      <SEO
        title="실제 진행 사례"
        description="유학생 개통, 가족 결합, 단기 체류 조합 등 실제 상담 흐름을 사례 중심으로 정리했습니다."
        path="/case-studies"
      />

      <section className="bg-slate-50/70 py-10 sm:py-14">
        <div className="container-page">
          <Breadcrumbs items={[{ label: '홈', to: '/' }, { label: '실제 진행 사례' }]} />
          <div className="mt-6 max-w-3xl">
            <span className="eyebrow">
              <BadgeCheck className="h-3.5 w-3.5" />
              Case Studies
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              실제로 어떤 방식으로 진행되는지 먼저 봅니다
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              처음 문의하는 고객이 가장 많이 묻는 건 서비스 이름보다 “나와 비슷한 경우가 어떻게
              진행됐는지”입니다. 자주 반복되는 케이스를 기준으로 정리했습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow={`${caseStudies.length} cases`}
            title="대표 진행 사례"
            description="실제 상담에서 반복적으로 나오는 상황을 기준으로 의사결정 포인트를 적었습니다."
          />

          <div className="mt-10 space-y-5">
            {caseStudies.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm font-semibold text-ink-muted">{item.customer}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{item.summary}</p>

                <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    진행 포인트
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                    {item.steps.map((step) => (
                      <li key={step} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-5 text-sm font-medium text-ink">
                  결과: <span className="text-ink-soft">{item.outcome}</span>
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-gold-50 p-6 text-center">
            <p className="text-sm text-ink-soft">
              본인 상황이 위 사례와 비슷하면 상담 속도가 훨씬 빨라집니다.
            </p>
            <Link to="/#consult" className="btn-primary mt-5">
              무료 상담 요청
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
