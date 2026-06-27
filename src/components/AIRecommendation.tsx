import { useMemo, useState } from 'react'
import { Sparkles, Wand2, Smartphone, Wifi, PackageCheck, RefreshCw, Check } from 'lucide-react'
import { SectionHeader } from './ServiceCards'

/**
 * AI 맞춤 추천 위젯 (MVP).
 * - 규칙 기반 매핑으로, 체류기간/비자/지역/예산 입력에 따라
 *   휴대폰·인터넷·정착패키지 추천과 예상 월 비용을 보여줌.
 * - 실제 AI 연동 시 이 컴포넌트의 recommend()만 API 호출로 교체하면 됨.
 */

type Duration = 'short' | 'mid' | 'long'
type Visa = 'tourist' | 'short' | 'student' | 'worker' | 'investor'
type Region = 'seoul' | 'busan' | 'other'
type Budget = 'low' | 'mid' | 'high'

interface Inputs {
  duration: Duration | ''
  visa: Visa | ''
  region: Region | ''
  budget: Budget | ''
}

interface Recommendation {
  phone: string
  internet: string
  package: string
  monthlyMin: number
  monthlyMax: number
  reasons: string[]
}

function recommend(i: Inputs): Recommendation {
  const long = i.duration === 'long'
  const short = i.duration === 'short'
  const lowBudget = i.budget === 'low'
  const highBudget = i.budget === 'high'

  const phone = short
    ? 'eSIM 데이터 중심 선불요금제 (10일/30일권)'
    : long && !lowBudget
      ? '정식 통신사 번호 (본인인증 가능, 후불)'
      : '알뜰폰 데이터+통화 요금제 (월 1~3만 원대)'

  const internet = short
    ? '포켓 WiFi 또는 공공/카페 WiFi 중심 (장기 설치 불필요)'
    : '통신사 3사 1Gbps 비교 (여권·계약서로 가입 가능)'

  const pkg =
    i.visa === 'investor'
      ? '투자자 프리미엄 패키지 (부동산 통역 + 사후관리 1년)'
      : i.visa === 'student'
        ? '유학생 정착 패키지 (휴대폰 + 교통카드 + 은행 동행)'
        : '스탠다드 정착 패키지 (휴대폰 + 인터넷 + 은행/집 안내)'

  const base =
    (short ? 20000 : long && !lowBudget ? 60000 : 25000) +
    (i.region === 'seoul' ? 0 : -3000) +
    (highBudget ? 15000 : 0)
  const monthlyMin = Math.max(15000, base)
  const monthlyMax = Math.round(monthlyMin * 1.5)

  const reasons = [
    long
      ? '장기 체류이므로 본인인증이 가능한 정식 번호가 실생활(은행·배달)에 유리합니다.'
      : '단기 체류에는 즉시 사용 가능한 데이터 위주 요금제가 가장 효율적입니다.',
    lowBudget
      ? '예산을 고려해 알뜰폰을 우선 추천합니다. 월 2~3만 원대로도 충분합니다.'
      : '예산 여유가 있어 본인인증·결합할인 혜택이 큰 정식 요금제를 추천합니다.',
    i.visa === 'student'
      ? '유학생 비자(D-2)는 등록증 발급 후 본인인증이 가능해 알뜰폰도 자유롭습니다.'
      : i.visa === 'investor'
        ? '투자(D-8) 비자는 부동산·계약 통역이 정착의 핵심이므로 프리미엄 패키지를 권합니다.'
        : '비자 종류에 따라 개통 가능한 통신사가 다릅니다. 매니저가 1순위로 확인합니다.',
  ]

  return { phone, internet, package: pkg, monthlyMin, monthlyMax, reasons }
}

const DURATIONS: { value: Duration; label: string }[] = [
  { value: 'short', label: '90일 미만 (단기)' },
  { value: 'mid', label: '3~6개월' },
  { value: 'long', label: '6개월 이상 (장기)' },
]
const VISAS: { value: Visa; label: string }[] = [
  { value: 'tourist', label: '관광 / 무비자 (B-1·B-2)' },
  { value: 'short', label: '단기체류 (C-3·C-4)' },
  { value: 'student', label: '유학 (D-2·D-4)' },
  { value: 'worker', label: '취업 (E-7)' },
  { value: 'investor', label: '투자·경영 (D-8·D-9)' },
]
const REGIONS: { value: Region; label: string }[] = [
  { value: 'seoul', label: '서울 / 수도권' },
  { value: 'busan', label: '부산 / 기타 광역시' },
  { value: 'other', label: '기타 지역' },
]
const BUDGETS: { value: Budget; label: string }[] = [
  { value: 'low', label: '월 5만 원 미만 (절약형)' },
  { value: 'mid', label: '월 5~15만 원' },
  { value: 'high', label: '월 15만 원 이상' },
]

export default function AIRecommendation() {
  const [inputs, setInputs] = useState<Inputs>({
    duration: '',
    visa: '',
    region: '',
    budget: '',
  })
  const [result, setResult] = useState<Recommendation | null>(null)

  const ready = useMemo(
    () => inputs.duration && inputs.visa && inputs.region && inputs.budget,
    [inputs],
  )

  const submit = () => {
    if (!ready) return
    setResult(recommend(inputs as Required<Inputs>))
  }
  const reset = () => {
    setInputs({ duration: '', visa: '', region: '', budget: '' })
    setResult(null)
  }

  return (
    <section className="section cn-warm-bg">
      <div className="container-page">
        <SectionHeader
          eyebrow="AI 맞춤 추천"
          align="center"
          title={
            <>
              나에게 맞는 시작,
              <span className="text-brand-600"> 30초면 찾아드려요.</span>
            </>
          }
          description="4가지만 고르면 체류 조건에 맞춘 휴대폰·인터넷·정착 패키지를 바로 보여드려요. (MVP 시연)"
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-cardHover sm:p-8">
            {!result ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="체류 기간"
                    value={inputs.duration}
                    onChange={(v) => setInputs((p) => ({ ...p, duration: v as Duration }))}
                    options={DURATIONS}
                  />
                  <Select
                    label="비자 종류"
                    value={inputs.visa}
                    onChange={(v) => setInputs((p) => ({ ...p, visa: v as Visa }))}
                    options={VISAS}
                  />
                  <Select
                    label="거주 지역"
                    value={inputs.region}
                    onChange={(v) => setInputs((p) => ({ ...p, region: v as Region }))}
                    options={REGIONS}
                  />
                  <Select
                    label="월 예산"
                    value={inputs.budget}
                    onChange={(v) => setInputs((p) => ({ ...p, budget: v as Budget }))}
                    options={BUDGETS}
                  />
                </div>
                <button
                  type="button"
                  disabled={!ready}
                  onClick={submit}
                  className="btn-primary mt-6 w-full text-base"
                >
                  <Wand2 className="h-4 w-4" />
                  맞춤 추천받기
                </button>
                {!ready && (
                  <p className="mt-2 text-center text-xs text-ink-muted">
                    모든 항목을 선택하면 추천이 시작됩니다.
                  </p>
                )}
              </>
            ) : (
              <ResultCard r={result} onReset={reset} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-ink">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
      >
        <option value="" disabled>
          선택하세요
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ResultCard({ r, onReset }: { r: Recommendation; onReset: () => void }) {
  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-brand-700">추천 결과</p>
          <p className="text-lg font-extrabold tracking-tight text-ink">
            회원님을 위한 조합을 정리했어요
          </p>
        </div>
      </div>

      {/* 예상 비용 */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 rounded-3xl bg-ink px-5 py-4 text-white">
        <div>
          <p className="text-xs font-semibold text-slate-300">예상 월 생활통신비</p>
          <p className="text-2xl font-black tracking-tight">
            {r.monthlyMin.toLocaleString()} ~ {r.monthlyMax.toLocaleString()}원
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-gold-300">
          절약형 조합
        </span>
      </div>

      {/* 추천 항목 */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <RecItem icon={Smartphone} title="휴대폰" desc={r.phone} />
        <RecItem icon={Wifi} title="인터넷" desc={r.internet} />
        <RecItem icon={PackageCheck} title="정착 패키지" desc={r.package} />
      </div>

      {/* 이유 */}
      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
        <p className="text-sm font-bold text-ink">왜 이 조합인가요?</p>
        <ul className="mt-3 space-y-2">
          {r.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-ink-soft">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <a href="/#consult" className="btn-primary flex-1">
          이 조합으로 상담받기
        </a>
        <button onClick={onReset} className="btn-secondary">
          <RefreshCw className="h-4 w-4" />
          다시 추천받기
        </button>
      </div>
    </div>
  )
}

function RecItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Smartphone
  title: string
  desc: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-muted">{title}</p>
      <p className="mt-1 text-sm font-semibold leading-snug text-ink">{desc}</p>
    </div>
  )
}
