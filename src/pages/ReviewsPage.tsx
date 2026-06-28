import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Search, Filter, MessageSquare, ArrowRight, BadgeCheck } from 'lucide-react'
import { reviews, foreignerReviews } from '../data/reviews'
import { Stars } from '../components/ReviewCards'
import SEO from '../components/SEO'
import Breadcrumbs from '../components/Breadcrumbs'
import ConsultationForm from '../components/ConsultationForm'
import { SectionHeader } from '../components/ServiceCards'

/**
 * 고객후기 전용 페이지 (/reviews).
 * - 평점 요약 (평균 / 분포)
 * - 필터: 서비스 / 국적(한국인/외국인)
 * - 정렬: 최신순 / 평점순
 * - 검색
 */
type SortKey = 'latest' | 'rating'
type Group = 'all' | 'korean' | 'foreigner'

interface UnifiedReview {
  id: string
  name: string
  region: string
  service: string
  rating: number
  date: string
  content: string
  verified: boolean
  group: 'korean' | 'foreigner'
  persona?: string
}

export default function ReviewsPage() {
  const [query, setQuery] = useState('')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [groupFilter, setGroupFilter] = useState<Group>('all')
  const [sort, setSort] = useState<SortKey>('latest')

  // 한국 + 외국인 후기 통합
  const allReviews = useMemo<UnifiedReview[]>(() => {
    const ko: UnifiedReview[] = reviews.map((r) => ({
      id: `ko-${r.id}`,
      name: r.name,
      region: r.region,
      service: r.service,
      rating: r.rating,
      date: r.date,
      content: r.content,
      verified: r.verified,
      group: 'korean',
    }))
    const fo: UnifiedReview[] = foreignerReviews.map((r) => ({
      id: `fo-${r.id}`,
      name: `${r.name.ko}`,
      region: r.origin.ko,
      service: r.service.ko,
      rating: r.rating,
      date: r.date,
      content: r.content.ko,
      verified: r.verified,
      group: 'foreigner',
      persona: r.persona.ko,
    }))
    return [...ko, ...fo]
  }, [])

  // 통계
  const stats = useMemo(() => {
    const total = allReviews.length
    const avg =
      total > 0
        ? allReviews.reduce((s, r) => s + r.rating, 0) / total
        : 0
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: allReviews.filter((r) => Math.floor(r.rating) === star).length,
    }))
    const verified = allReviews.filter((r) => r.verified).length
    return { total, avg, distribution, verified }
  }, [allReviews])

  // 서비스 목록
  const services = useMemo(() => {
    const set = new Set(allReviews.map((r) => r.service))
    return Array.from(set).sort()
  }, [allReviews])

  // 필터링
  const filtered = useMemo(() => {
    let list = allReviews
    if (groupFilter !== 'all') list = list.filter((r) => r.group === groupFilter)
    if (serviceFilter !== 'all') list = list.filter((r) => r.service === serviceFilter)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (r) =>
          r.content.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.service.toLowerCase().includes(q),
      )
    }
    list = [...list].sort((a, b) =>
      sort === 'latest'
        ? b.date.localeCompare(a.date)
        : b.rating - a.rating,
    )
    return list
  }, [allReviews, groupFilter, serviceFilter, query, sort])

  return (
    <>
      <SEO
        title="고객후기"
        description="라이플 고객 후기 모음 — 인터넷·휴대폰·렌탈·이사·청소·외국인 정착 서비스를 이용한 고객들의 실제 후기입니다."
        path="/reviews"
      />

      {/* Hero / 요약 */}
      <section className="relative overflow-hidden cn-warm-bg">
        <div className="container-page pt-8 pb-4 sm:pt-10">
          <Breadcrumbs
            items={[{ label: '홈', to: '/' }, { label: '고객후기' }]}
          />
        </div>
        <div className="container-page pb-16 pt-6 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">
              <Star className="h-3.5 w-3.5" />
              고객후기
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              먼저 써본 분들의
              <span className="text-brand-600"> 솔직한 이야기</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
              영업용 멘트가 아닌, 실제 상담·신청을 경험한 고객의 리얼 후기입니다.
              결정하기 전에 참고해 보세요.
            </p>

            {/* 평점 요약 카드 */}
            <div className="mx-auto mt-10 grid max-w-2xl gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
                <p className="text-5xl font-black tracking-tight text-ink">
                  {stats.avg.toFixed(1)}
                </p>
                <Stars rating={stats.avg} className="mt-1" />
                <p className="mt-1 text-xs text-ink-muted">
                  {stats.total}개 후기 · 검증 {stats.verified}건
                </p>
              </div>
              <div className="space-y-1.5 sm:pl-6">
                {stats.distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-2 text-xs">
                    <span className="flex w-12 items-center gap-0.5 font-semibold text-ink-soft">
                      {d.star}
                      <Star className="h-3 w-3 fill-current" />
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gold-500"
                        style={{
                          width: `${stats.total > 0 ? (d.count / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right font-bold text-ink-muted">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 필터 + 목록 */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow={`${filtered.length}개의 후기`}
            title="전체 후기"
            description="필터와 검색으로 원하는 후기를 찾아보세요."
          />

          {/* 필터 바 */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="이름, 내용, 서비스 검색"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <FilterSelect
                  icon={Filter}
                  value={groupFilter}
                  onChange={(v) => setGroupFilter(v as Group)}
                  options={[
                    { value: 'all', label: '전체 (한국+외국인)' },
                    { value: 'korean', label: '한국인 후기' },
                    { value: 'foreigner', label: '외국인 후기' },
                  ]}
                />
                <FilterSelect
                  icon={Filter}
                  value={serviceFilter}
                  onChange={setServiceFilter}
                  options={[
                    { value: 'all', label: '전체 서비스' },
                    ...services.map((s) => ({ value: s, label: s })),
                  ]}
                />
                <FilterSelect
                  icon={Filter}
                  value={sort}
                  onChange={(v) => setSort(v as SortKey)}
                  options={[
                    { value: 'latest', label: '최신순' },
                    { value: 'rating', label: '평점순' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* 후기 그리드 */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {filtered.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-200 p-12 text-center text-sm text-ink-muted">
                조건에 맞는 후기가 없습니다. 필터를 변경해 보세요.
              </div>
            ) : (
              filtered.map((r) => <ReviewCard key={r.id} review={r} />)
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-slate-50/80">
        <div className="container-page">
          <div className="mx-auto max-w-3xl rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-gold-50 p-6 text-center sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
              이제 님 차례
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              다음 후기는 고객님이 써주세요
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              무료 상담 신청 한 번이면, 다음은 고객님의 절약 사례가 될 수 있어요.
            </p>
            <Link to="/#consult" className="btn-primary mt-6">
              무료 상담 신청하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ConsultationForm />
    </>
  )
}

function FilterSelect({
  icon: Icon,
  value,
  onChange,
  options,
}: {
  icon: typeof Filter
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="relative inline-flex items-center">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-light" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-semibold text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ReviewCard({ review: r }: { review: UnifiedReview }) {
  const isForeigner = r.group === 'foreigner'
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className={[
              'flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black',
              isForeigner
                ? 'bg-mint-100 text-mint-800'
                : 'bg-brand-100 text-brand-800',
            ].join(' ')}
          >
            {r.name.slice(0, 1)}
          </span>
          <div>
            <p className="flex items-center gap-1.5 font-extrabold text-ink">
              {r.name}
              {r.verified && (
                <BadgeCheck className="h-4 w-4 text-brand-600" aria-label="검증된 후기" />
              )}
            </p>
            <p className="text-xs text-ink-muted">{r.region}</p>
          </div>
        </div>
        <Stars rating={r.rating} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-ink-soft">
          {r.service}
        </span>
        {r.persona && (
          <span className="rounded-full bg-mint-50 px-2.5 py-0.5 text-[11px] font-bold text-mint-700">
            {r.persona}
          </span>
        )}
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
        <MessageSquare className="mr-1 inline h-3.5 w-3.5 text-ink-light" />
        {r.content}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-ink-muted">
        <span>{formatDate(r.date)}</span>
        {isForeigner && (
          <span className="rounded-full bg-gold-50 px-2 py-0.5 font-bold text-gold-800">
            中文 가능
          </span>
        )}
      </div>
    </article>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
