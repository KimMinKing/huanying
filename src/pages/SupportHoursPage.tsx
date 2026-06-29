import { Clock3, MessageSquareMore } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'
import SEO from '../components/SEO'
import { SectionHeader } from '../components/ServiceCards'
import { supportChannels } from '../data/guides'

export default function SupportHoursPage() {
  return (
    <>
      <SEO
        title="상담 가능 시간"
        description="전화, 카카오톡, WeChat 기준 상담 가능 시간과 채널별 적합한 문의 유형을 안내합니다."
        path="/support-hours"
      />

      <section className="bg-slate-50/70 py-10 sm:py-14">
        <div className="container-page">
          <Breadcrumbs items={[{ label: '홈', to: '/' }, { label: '상담 가능 시간' }]} />
          <div className="mt-6 max-w-3xl">
            <span className="eyebrow">
              <Clock3 className="h-3.5 w-3.5" />
              Support
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              상담 채널별 운영 시간을 먼저 확인하세요
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              긴 설명이 필요한 문의와 서류 전달이 필요한 문의는 채널이 다릅니다. 응답 속도와 처리
              방식이 달라서, 먼저 맞는 채널을 고르는 편이 효율적입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Hours"
            title="운영 시간 안내"
            description="채널별 운영 시간은 다를 수 있으며, 주말과 공휴일 문의는 다음 영업일에 순차 처리합니다."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {supportChannels.map((channel) => (
              <article
                key={channel.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-ink">{channel.label}</h2>
                    <p className="mt-2 text-sm font-semibold text-brand-700">{channel.hours}</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <MessageSquareMore className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{channel.notes}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-6 text-sm leading-relaxed text-ink-soft">
            급한 설치 일정이나 위약금 확인처럼 판단이 필요한 건 전화가 빠르고, 서류 전달과 비교표
            확인은 메신저 채널이 효율적입니다.
          </div>
        </div>
      </section>
    </>
  )
}
