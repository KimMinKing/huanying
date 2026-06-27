import {
  Scale,
  Search,
  Route,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react'
import { whyUs } from '../data/comparison'
import { SectionHeader } from './ServiceCards'

const iconMap: Record<string, LucideIcon> = {
  scale: Scale,
  search: Search,
  route: Route,
  'life-buoy': LifeBuoy,
}

export default function WhyUs() {
  return (
    <section id="why" className="section bg-slate-50/80">
      <div className="container-page">
        <SectionHeader
          eyebrow="왜 라이플인가요"
          align="center"
          title={
            <>
              비교만 하는 곳은 많습니다.
              <br className="hidden sm:block" />
              <span className="text-brand-600">끝까지 책임지는 곳</span>은 드물어요.
            </>
          }
          description="견적을 받아주는 데 그치지 않고, 가입 이후의 불편함까지 줄여요."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item, idx) => {
            const Icon = iconMap[item.icon] ?? Scale
            return (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-cardHover"
              >
                {/* 큰 번호 워터마크 */}
                <span className="pointer-events-none absolute right-4 top-2 text-6xl font-black text-slate-100 transition group-hover:text-brand-50">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>

                <h3 className="relative mt-5 text-lg font-extrabold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
