import { Star, BadgeCheck, Quote } from 'lucide-react'
import type { ReviewItem, ForeignerReview } from '../data/reviews'
import type { Locale, LocalString } from '../data/i18n'
import { t } from '../data/i18n'

/** 별점 렌더링 (0.5 단위 지원) */
export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating}점 만점`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)))
        return (
          <span key={i} className="relative inline-block h-4 w-4">
            <Star className="absolute inset-0 h-4 w-4 text-slate-200" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </span>
          </span>
        )
      })}
    </div>
  )
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

/** 한국인 후기 카드 */
export function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <article className="relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition duration-300 hover:shadow-cardHover sm:p-7">
      <Quote className="absolute right-6 top-6 h-8 w-8 text-slate-100" />
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <span className="text-xs font-medium text-ink-muted">{formatDate(review.date)}</span>
      </div>
      <p className="relative mt-4 text-[15px] leading-relaxed text-ink-soft">{review.content}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-extrabold text-brand-700">
            {review.name.charAt(0)}
          </span>
          <div>
            <p className="flex items-center gap-1 text-sm font-bold text-ink">
              {review.name}
              {review.verified && <BadgeCheck className="h-4 w-4 text-brand-500" />}
            </p>
            <p className="text-xs text-ink-muted">{review.region}</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-ink-soft">
          {review.service}
        </span>
      </div>
    </article>
  )
}

/** 외국인 후기 카드 (바이링얼 지원) */
export function ForeignerReviewCard({
  review,
  locale = 'ko',
}: {
  review: ForeignerReview
  locale?: Locale
}) {
  const name = t(review.name, locale)
  const origin = t(review.origin, locale)
  const persona = t(review.persona, locale)
  const service = t(review.service, locale)
  const content = t(review.content, locale)
  const secondaryContent = review.content.zh && locale === 'ko' ? review.content.zh : undefined

  return (
    <article className="relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition duration-300 hover:shadow-cardHover sm:p-7">
      <Quote className="absolute right-6 top-6 h-8 w-8 text-brand-50" />

      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
          {persona}
        </span>
      </div>

      <p className="relative mt-4 text-[15px] leading-relaxed text-ink-soft">{content}</p>
      {secondaryContent && (
        <p className="mt-3 border-l-2 border-brand-200 pl-3 text-[13px] leading-relaxed text-ink-muted">
          {secondaryContent}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-extrabold text-white">
            {name.charAt(0)}
          </span>
          <div>
            <p className="flex items-center gap-1 text-sm font-bold text-ink">
              {name}
              {review.verified && <BadgeCheck className="h-4 w-4 text-brand-500" />}
            </p>
            <p className="text-xs text-ink-muted">{origin}</p>
          </div>
        </div>
        <span className="max-w-[45%] truncate rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-ink-soft">
          {service}
        </span>
      </div>
    </article>
  )
}

/** 후기 그리드 재사용 컨테이너 */
export function ReviewGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-12 grid gap-5 sm:grid-cols-2">{children}</div>
}

/** LocalString 헬퍼를 쓰는 텍스트 블록 (바이링얼 표시용) */
export function Bilingual({
  ls,
  locale = 'ko',
  className = '',
}: {
  ls: LocalString
  locale?: Locale
  className?: string
}) {
  const primary = t(ls, locale)
  const secondary = ls.zh && locale === 'ko' ? ls.zh : undefined
  if (!secondary) return <span className={className}>{primary}</span>
  return (
    <span className={className}>
      {primary} <span className="text-ink-muted">{secondary}</span>
    </span>
  )
}
