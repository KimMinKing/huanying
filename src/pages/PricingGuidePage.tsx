import { Calculator, CircleDollarSign } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'
import SEO from '../components/SEO'
import { SectionHeader } from '../components/ServiceCards'
import { pricingRules } from '../data/guides'

export default function PricingGuidePage() {
  return (
    <>
      <SEO
        title="요금 비교 기준 설명"
        description="월 요금만이 아니라 설치비, 사은 혜택, 약정, 위약금 가능성까지 묶어서 비교하는 기준을 설명합니다."
        path="/pricing-guide"
      />

      <section className="bg-slate-50/70 py-10 sm:py-14">
        <div className="container-page">
          <Breadcrumbs items={[{ label: '홈', to: '/' }, { label: '요금 비교 기준 설명' }]} />
          <div className="mt-6 max-w-3xl">
            <span className="eyebrow">
              <Calculator className="h-3.5 w-3.5" />
              Pricing
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              요금은 숫자 하나로 비교하지 않습니다
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              같은 월 요금처럼 보여도 실제 총비용은 다를 수 있습니다. 비교 기준을 미리 공개해 두면
              왜 어떤 안을 추천했는지 설명하기 쉬워집니다.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Rules"
            title="비교할 때 보는 기준"
            description="단순 최저가보다, 실제 사용 조건에서 손해가 적은 구성을 우선합니다."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {pricingRules.map((rule) => (
              <article
                key={rule.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-50 text-gold-700">
                  <CircleDollarSign className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-xl font-extrabold tracking-tight text-ink">{rule.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{rule.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-gold-50 px-6 py-6">
            <p className="text-sm leading-relaxed text-ink-soft">
              결국 비교 기준은 “가장 싸 보이는 안”이 아니라 “나중에 조건을 다시 봐도 설명이 되는
              안”이어야 합니다. 이 기준이 있어야 추천이 흔들리지 않습니다.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
