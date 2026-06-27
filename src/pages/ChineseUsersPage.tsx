import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Globe,
  MessageCircle,
  Check,
} from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'
import { Timeline } from '../components/Timeline'
import AIRecommendation from '../components/AIRecommendation'
import { CTASection } from '../components/CTASection'
import ConsultationForm from '../components/ConsultationForm'
import { ForeignerReviewCard, ReviewGrid, Stars } from '../components/ReviewCards'
import { chineseServices, chineseHero } from '../data/chineseServices'
import { settlementSteps } from '../data/settlementSteps'
import { foreignerReviews } from '../data/reviews'
import { accents } from '../lib/accents'
import { t, type Locale } from '../data/i18n'

export default function ChineseUsersPage() {
  const locale: Locale = 'ko'

  return (
    <>
      {/* 히어로 (바이링얼) */}
      <section className="relative overflow-hidden cn-warm-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(207 51 36 / 0.10) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 75%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 75%)',
          }}
        />
        <div className="container-page pt-8 pb-4 sm:pt-10">
          <Breadcrumbs
            items={[
              { label: '홈', to: '/' },
              { label: '외국인 정착 서비스' },
            ]}
          />
        </div>

        <div className="container-page pb-16 pt-6 sm:pb-20 lg:pt-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-sm font-semibold text-brand-700 shadow-soft">
              <Globe className="h-3.5 w-3.5" />
              {t(chineseHero.eyebrow, locale)}
            </span>

            <h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.18] tracking-tight text-ink sm:text-5xl lg:text-[3.2rem]">
              {t(chineseHero.title, locale)}
            </h1>
            <p className="mt-2 text-xl font-bold text-brand-700 sm:text-2xl">
              {chineseHero.title.zh}
            </p>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {t(chineseHero.description, locale)}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/chinese-users/mobile" className="btn-primary text-base">
                휴대폰 개통 도움 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/chinese-users/settlement" className="btn-secondary text-base">
                정착 체크리스트
              </Link>
              <a href="#cn-consult" className="btn-secondary text-base">
                <MessageCircle className="h-4 w-4" />
                중국어 상담
              </a>
            </div>

            {/* 통계 */}
            <dl className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white/70 py-4 backdrop-blur">
              {chineseHero.stats.map((s) => (
                <div key={s.label.ko} className="px-3 text-center sm:px-4">
                  <dt className="text-xl font-extrabold tracking-tight text-brand-700 sm:text-2xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-xs font-medium text-ink-muted">
                    {t(s.label, locale)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 서비스 카테고리 그리드 (바이링얼) */}
      <section id="cn-services" className="section">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <Check className="h-3.5 w-3.5" />
              정착 서비스 카테고리
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              한국 생활에 필요한 것,
              <span className="text-brand-600"> 한 자리에</span> 모여 있어요.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              각 카드를 눌러 자세히 알아보거나, 그대로 전체 패키지으로 신청하셔도 됩니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {chineseServices.map((service) => {
              const Icon = service.icon
              const a = accents[service.accent]
              const inner = (
                <>
                  <div className="flex items-start justify-between">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${a.iconWrap}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    {service.tag && (
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.softBg} ${a.softText}`}>
                        {t(service.tag, locale)}
                      </span>
                    )}
                  </div>
                  <div className="mt-5">
                    <p className={`text-xs font-bold uppercase tracking-wider ${a.softText}`}>
                      {t(service.summary, locale)}
                    </p>
                    <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
                      {t(service.title, locale)}
                    </h3>
                    {service.title.zh && (
                      <p className="mt-0.5 text-sm font-semibold text-ink-muted">
                        {service.title.zh}
                      </p>
                    )}
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                    {t(service.description, locale)}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {service.features.map((f) => (
                      <li
                        key={f.ko}
                        className="flex items-center gap-2 text-sm font-medium text-ink-soft"
                      >
                        <Check className={`h-4 w-4 ${a.softText}`} />
                        {t(f, locale)}
                      </li>
                    ))}
                  </ul>
                  {service.to && (
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-ink transition group-hover:text-brand-600">
                      자세히 보기
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  )}
                </>
              )
              const cls =
                'group relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-cardHover'
              return service.to ? (
                <Link key={service.id} to={service.to} className={cls}>
                  {inner}
                </Link>
              ) : (
                <article key={service.id} className={cls}>
                  {inner}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 정착 플로우 (타임라인 일부 + 전체 링크) */}
      <section className="section bg-slate-50/80">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow">한국 정착 플로우</span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
                입국부터 정착까지,
                <span className="text-brand-600"> 6단계로</span> 정리했어요.
              </h2>
            </div>
            <Link
              to="/chinese-users/settlement"
              className="btn-secondary shrink-0"
            >
              체크리스트로 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <Timeline steps={settlementSteps.slice(0, 4)} locale={locale} />
          </div>
          <div className="mt-8 text-center">
            <Link to="/chinese-users/settlement" className="btn-ghost">
              나머지 2단계와 체크리스트 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI 맞춤 추천 */}
      <AIRecommendation />

      {/* 외국인 후기 */}
      <section id="cn-reviews" className="section">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow">외국인 고객 후기</span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
                한국에 먼저 와 본
                <span className="text-brand-600"> 그들의 이야기</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-soft">
              <span className="text-3xl font-black tracking-tight text-ink">4.9</span>
              <div>
                <Stars rating={4.9} />
                <p className="mt-0.5 text-xs text-ink-muted">외국인 고객 만족도</p>
              </div>
            </div>
          </div>
          <ReviewGrid>
            {foreignerReviews.map((r) => (
              <ForeignerReviewCard key={r.id} review={r} locale={locale} />
            ))}
          </ReviewGrid>
        </div>
      </section>

      {/* 중국어 상담 CTA */}
      <CTASection locale={locale} />

      {/* 상담 폼 (ConsultationForm은 자체 section 포함) */}
      <ConsultationForm />
    </>
  )
}
