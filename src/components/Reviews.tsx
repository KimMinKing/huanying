import { reviews } from '../data/reviews'
import { SectionHeader } from './ServiceCards'
import { ReviewCard, ReviewGrid, Stars } from './ReviewCards'

export default function Reviews() {
  return (
    <section id="reviews" className="section">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="고객 후기"
            title={
              <>
                가입한 분들이
                <span className="text-brand-600"> 직접 말해주는 이야기</span>
              </>
            }
          />
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-soft">
            <span className="text-3xl font-black tracking-tight text-ink">4.8</span>
            <div>
              <Stars rating={4.8} />
              <p className="mt-0.5 text-xs text-ink-muted">최근 6개월 · 후기 2,400+</p>
            </div>
          </div>
        </div>

        <ReviewGrid>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ReviewGrid>
      </div>
    </section>
  )
}
