import { ArrowRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import SEO from '../components/SEO'
import { SectionHeader } from '../components/ServiceCards'
import { documentChecklist } from '../data/guides'

export default function ForeignerDocumentsPage() {
  return (
    <>
      <SEO
        title="외국인/유학생 준비 서류 체크리스트"
        description="개통과 상담 전에 미리 준비하면 좋은 본인 확인, 거주, 결제 관련 항목을 정리했습니다."
        path="/foreigner-documents"
      />

      <section className="bg-slate-50/70 py-10 sm:py-14">
        <div className="container-page">
          <Breadcrumbs
            items={[{ label: '홈', to: '/' }, { label: '외국인/유학생 준비 서류 체크리스트' }]}
          />
          <div className="mt-6 max-w-3xl">
            <span className="eyebrow">
              <FileText className="h-3.5 w-3.5" />
              Documents
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              외국인/유학생 고객이 먼저 준비하면 좋은 항목
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              개통 가능 여부는 요금보다 서류 조건에서 먼저 갈리는 경우가 많습니다. 상담 전에 아래
              항목을 정리해 두면 속도가 크게 빨라집니다.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Checklist"
            title="준비 서류와 확인 항목"
            description="반드시 모든 항목이 필요한 것은 아니지만, 아래를 먼저 정리해 두면 진행이 훨씬 수월합니다."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {documentChecklist.map((group) => (
              <section
                key={group.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <h2 className="text-xl font-extrabold tracking-tight text-ink">{group.title}</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-6">
            <p className="text-sm leading-relaxed text-ink-soft">
              특히 ARC 발급 전후, 단기 체류, 본인 명의 개통 불가 여부는 상품 추천보다 먼저 확인해야
              합니다. 이 정보가 빠지면 비교표가 정확해지지 않습니다.
            </p>
            <Link to="/#consult" className="btn-primary mt-5">
              준비 항목 확인받기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
