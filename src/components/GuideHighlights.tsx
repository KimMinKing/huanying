import { ArrowUpRight, BadgeCheck, Clock3, FileText, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeader } from './ServiceCards'

const guideCards = [
  {
    to: '/case-studies',
    title: '실제 진행 사례',
    description: '유학생 개통, 가족 결합, 단기 체류 조합처럼 자주 나오는 케이스를 정리했습니다.',
    icon: BadgeCheck,
  },
  {
    to: '/foreigner-documents',
    title: '외국인/유학생 서류 체크리스트',
    description: '개통 전에 미리 준비해야 할 본인 확인, 주소, 결제 관련 항목을 모았습니다.',
    icon: FileText,
  },
  {
    to: '/support-hours',
    title: '상담 가능 시간',
    description: '전화, 카카오톡, WeChat 채널별 운영 시간과 응대 범위를 한눈에 확인합니다.',
    icon: Clock3,
  },
  {
    to: '/pricing-guide',
    title: '요금 비교 기준',
    description: '월 요금만이 아니라 설치비, 사은 혜택, 위약금 가능성까지 묶어서 비교하는 기준입니다.',
    icon: WalletCards,
  },
] as const

export default function GuideHighlights() {
  return (
    <section className="section bg-slate-50/70">
      <div className="container-page">
        <SectionHeader
          eyebrow="Guide"
          title="서비스 바깥의 판단 기준도 같이 봅니다"
          description="상담 전에 확인하면 결정이 빨라지는 정보성 콘텐츠를 따로 정리했습니다."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {guideCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.to}
                to={card.to}
                className="group flex min-h-56 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-ink">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{card.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-700">
                  자세히 보기
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
