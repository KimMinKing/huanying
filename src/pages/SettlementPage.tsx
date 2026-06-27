import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, ListChecks, Route as RouteIcon } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'
import { TimelineSection } from '../components/Timeline'
import { ChecklistSection } from '../components/Checklist'
import { CTASection } from '../components/CTASection'

export default function SettlementPage() {
  return (
    <>
      {/* 히어로 */}
      <section className="relative overflow-hidden cn-warm-bg">
        <div className="container-page pt-8 pb-4 sm:pt-10">
          <Breadcrumbs
            items={[
              { label: '홈', to: '/' },
              { label: '외국인 정착', to: '/chinese-users' },
              { label: '한국 정착 체크리스트' },
            ]}
          />
        </div>
        <div className="container-page pb-14 pt-4 sm:pb-20">
          <div className="max-w-3xl">
            <span className="eyebrow">
              <ListChecks className="h-3.5 w-3.5" />
              한국 정착 체크리스트 · 定居清单
            </span>
            <h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.16] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              입국부터 정착까지,
              <br />
              <span className="text-brand-600">빠진 것 없이</span> 챙겨드려요.
            </h1>
            <p className="mt-2 text-lg font-bold text-brand-700">从入境到定居,一项不落。</p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              어떤 순서로 무엇을 해야 하는지, 지금은 어느 단계인지 한눈에 볼 수
              있어요. 체크리스트는 브라우저에 저장되어 다시 와도 이어서 할 수
              있습니다.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#cn-consult" className="btn-primary">
                정착 패키지 상담받기
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/chinese-users" className="btn-secondary">
                <ArrowLeft className="h-4 w-4" />
                정착 서비스로
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6단계 타임라인 */}
      <TimelineSection
        title={
          <>
            <RouteIcon className="mb-1 mr-2 inline h-7 w-7 text-brand-600" />
            입국 전부터 6개월 후까지,
            <span className="text-brand-600"> 6단계</span> 로 정리했어요.
          </>
        }
      />

      {/* 인터랙티브 체크리스트 */}
      <ChecklistSection
        title={
          <>
            항목별 체크리스트,
            <br className="sm:hidden" />
            <span className="text-brand-600"> 직접 체크하며</span> 진행해 보세요.
          </>
        }
      />

      {/* CTA */}
      <CTASection />
    </>
  )
}
