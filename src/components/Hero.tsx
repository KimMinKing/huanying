import { ArrowRight, Sparkles, Check, BadgeCheck, TrendingDown } from 'lucide-react'
import { heroStats } from '../data/comparison'
import { formatWon } from '../lib/format'

// 히어로 우측 미리보기 카드용 mock 데이터 (실제 데이터와 분리)
const previewPlans = [
  { company: 'A사', monthly: 33600, note: '추천', highlight: true },
  { company: 'B사', monthly: 37400, note: 'TV 사은품' },
  { company: 'C사', monthly: 41800, note: '500Mbps' },
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* 배경: 그라데이션 + 도트 그리드 패턴 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div
          className="absolute inset-x-0 top-0 h-[480px] opacity-[0.6]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(37 73 235 / 0.12) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage:
              'linear-gradient(to bottom, black 0%, transparent 80%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, transparent 80%)',
          }}
        />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-mint-200/30 blur-3xl" />
      </div>

      <div className="container-page section pt-10 sm:pt-14 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* 좌측 카피 */}
          <div className="animate-fade-up">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" />
              무료 상담 진행 중 · 평균 24시간 내 연락
            </span>

            <h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.18] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              생활 서비스, 이제 한 곳에서
              <br className="hidden sm:block" />
              <span className="text-brand-600"> 비교하고 신청</span>하세요
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              인터넷, 휴대폰, 렌탈, 이사까지 복잡한 조건을 쉽게 비교하고
              <br className="hidden sm:block" />
              나에게 맞는 혜택을 찾아드립니다. 가입 이후에도 같은 매니저가
              책임지고 관리해요.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#consult" className="btn-primary text-base">
                무료 상담 신청
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#comparison" className="btn-secondary text-base">
                혜택 비교하기
              </a>
            </div>

            {/* 통계 */}
            <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white/60 py-4">
              {heroStats.map((s) => (
                <div key={s.label} className="px-3 text-center sm:px-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                    {s.value}
                  </dd>
                  <p className="mt-0.5 text-xs font-medium text-ink-muted sm:text-sm">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          {/* 우측 비교 화면 미리보기 */}
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <HeroPreview />
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroPreview() {
  return (
    <div className="relative mx-auto max-w-md">
      {/* 뒤에 깔리는 보조 카드 (깊이감) */}
      <div className="absolute -right-4 -top-5 hidden h-full w-full rotate-3 rounded-4xl border border-slate-200 bg-slate-50 sm:block" />

      <div className="relative rounded-4xl border border-slate-200 bg-white p-5 shadow-cardHover sm:p-6">
        {/* 카드 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <TrendingDown className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">인터넷 요금제 비교</p>
              <p className="text-xs text-ink-muted">1Gbps 기준 · 3년 약정</p>
            </div>
          </div>
          <span className="rounded-full bg-mint-50 px-2.5 py-1 text-[11px] font-bold text-mint-700">
            실시간
          </span>
        </div>

        {/* 비교 행 */}
        <ul className="mt-5 space-y-2.5">
          {previewPlans.map((plan) => (
            <li
              key={plan.company}
              className={[
                'flex items-center justify-between rounded-2xl border p-3.5 transition',
                plan.highlight
                  ? 'border-brand-200 bg-brand-50/70 ring-2 ring-brand-500/15'
                  : 'border-slate-200 bg-white',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold',
                    plan.highlight
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-ink-soft',
                  ].join(' ')}
                >
                  {plan.company.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{plan.company}</p>
                  <p className="text-[11px] text-ink-muted">{plan.note}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-ink">
                  {formatWon(plan.monthly)}
                  <span className="text-[11px] font-semibold text-ink-muted">
                    원/월
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* 절약 요약 */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-mint-300" />
            <span className="text-xs font-semibold text-slate-200">
              월 예상 절약액
            </span>
          </div>
          <p className="text-base font-extrabold">
            약 8,200원
            <span className="ml-1 text-[11px] font-medium text-slate-300">
              / 3년간 29만 원
            </span>
          </p>
        </div>

        {/* 체크리스트 */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {['설치비 무료', '3년 약정', '최대 5만 원 포인트', '결합 할인'].map(
            (t) => (
              <div
                key={t}
                className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft"
              >
                <Check className="h-3.5 w-3.5 text-mint-600" />
                {t}
              </div>
            ),
          )}
        </div>
      </div>

      {/* 플로팅 카드: 상담 신청 */}
      <div className="absolute -bottom-6 -left-4 hidden w-48 rotate-[-3deg] rounded-2xl border border-slate-200 bg-white p-3 shadow-cardHover sm:block">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint-100 text-mint-700">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-[11px] font-bold text-ink">상담 신청 완료</p>
            <p className="text-[10px] text-ink-muted">방금 전 · 서울</p>
          </div>
        </div>
      </div>
    </div>
  )
}
