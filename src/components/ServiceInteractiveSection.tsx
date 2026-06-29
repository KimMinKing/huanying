import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Calculator, Zap, AlertCircle, TrendingDown, ArrowRight, Loader2, X } from 'lucide-react'
import { getSession, login } from '../lib/customerAuth'
import {
  estimateMobilePrice,
  getMobilePricingSettings,
  type MobileCarrierId,
  type MobileDataUsage,
  type MobileExtraOption,
  type MobilePlanType,
} from '../lib/mobilePlans'

/**
 * 서비스 카테고리별 인터랙티브 섹션.
 *
 * ServiceDetailPage에서 detail.id에 따라 알맞은 컴포넌트를 노출.
 * 공통 템플릿에 카테고리 특화 "체험" 위젯을 끼워넣어 페이지들이 서로 달라 보이게 함.
 */
export default function ServiceInteractiveSection({ serviceId }: { serviceId: string }) {
  switch (serviceId) {
    case 'internet':
      return <InternetSpeedFinder />
    case 'mobile':
      return <MobileDataCalculator />
    case 'rental':
      return <RentalVsBuyCalculator />
    case 'moving':
      return <MovingQuoteEstimator />
    case 'cleaning':
      return <CleaningOptionsBuilder />
    case 'insurance':
      return null // insurance는 준비 중이므로 생략
    default:
      return null
  }
}

// ============================================================================
// 인터넷 — 속도 추천기
// ============================================================================
function InternetSpeedFinder() {
  const [usage, setUsage] = useState<'light' | 'family' | 'work' | 'gaming' | ''>('')
  const [devices, setDevices] = useState<number>(3)

  const recommendation = useMemo(() => {
    if (!usage) return null
    const profiles = {
      light: { speed: '500Mbps', carrier: 'B사 (KT 계열)', reason: '혼자 쓰는 인터넷·유튜브용으로 충분' },
      family: { speed: '1Gbps', carrier: 'A사 (SK 계열)', reason: '가족 3~4명 동시 시청·게임에 안정적' },
      work: { speed: '1Gbps', carrier: 'A사 (SK 계열)', reason: '화상 회의·대용량 파일 업로드에 유리' },
      gaming: { speed: '2.5Gbps+', carrier: 'C사 (LG U+ 계열)', reason: '저지연 게이머용 — 4K 스트리밍 병행 가능' },
    } as const
    const r = profiles[usage]
    // 기기 5개 이상이면 한 단계 위 추천
    const boosted = devices >= 7 && usage === 'light' ? '1Gbps' : r.speed
    return { ...r, speed: boosted }
  }, [usage, devices])

  const options: { value: typeof usage; label: string; emoji: string }[] = [
    { value: 'light', label: '혼자 쓰는 가벼운 인터넷', emoji: '👤' },
    { value: 'family', label: '가족 함께 쓰는 집', emoji: '👨‍👩‍👧' },
    { value: 'work', label: '재택근무·화상 회의', emoji: '💼' },
    { value: 'gaming', label: '게임·4K 스트리밍', emoji: '🎮' },
  ]

  return (
    <InteractiveSection
      eyebrow="맞춤 속도 찾기"
      title="내게 딱 맞는 속도, 알아볼까요?"
      description="사용 패턴과 기기 수만 알려주시면 추천 속도와 통신사를 안내드려요."
      icon={Zap}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setUsage(o.value)}
            className={[
              'flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition',
              usage === o.value
                ? 'border-brand-500 bg-brand-50'
                : 'border-slate-200 hover:border-slate-300',
            ].join(' ')}
          >
            <span className="text-2xl">{o.emoji}</span>
            <span className="flex-1 text-sm font-bold text-ink">{o.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-bold text-ink">
          집에 연결된 기기 수: <span className="text-brand-700">{devices}대</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={devices}
          onChange={(e) => setDevices(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-[10px] text-ink-muted">
          <span>1대</span>
          <span>10대+</span>
        </div>
      </div>

      {recommendation && (
        <div className="mt-6 animate-fade-up rounded-2xl bg-gradient-to-br from-brand-50 to-gold-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
            AI 맞춤 추천
          </p>
          <p className="mt-1 text-2xl font-black tracking-tight text-ink">
            {recommendation.speed} <span className="text-brand-600">· {recommendation.carrier}</span>
          </p>
          <p className="mt-2 text-sm text-ink-soft">{recommendation.reason}</p>
          <a href="#consult" className="btn-primary mt-4 text-sm">
            이 속도로 견적받기
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </InteractiveSection>
  )
}

// ============================================================================
// 휴대폰 — 데이터 절약 계산기
// ============================================================================
function MobileDataCalculator() {
  const [gb, setGb] = useState(10)
  const [calls, setCalls] = useState<'light' | 'normal' | 'heavy'>('normal')
  const [pricingSettings, setPricingSettings] = useState(getMobilePricingSettings())

  useEffect(() => {
    const syncPricing = () => setPricingSettings(getMobilePricingSettings())
    window.addEventListener('lifful-mobile-pricing-changed', syncPricing)
    return () => window.removeEventListener('lifful-mobile-pricing-changed', syncPricing)
  }, [])

  const result = useMemo(() => {
    const activeCarrier = pricingSettings.carriers.find((carrier) => carrier.isActive)
    const carrier = activeCarrier?.id ?? 'skt'
    const dataUsage = gb <= 5 ? 'light' : gb <= 30 ? 'standard' : 'heavy'
    const extraOption = calls === 'heavy' ? 'esim' : 'none'
    const majorPlan = estimateMobilePrice(pricingSettings, {
      carrier,
      planType: 'major',
      dataUsage,
      extraOption,
    }).monthly
    const budgetPlan = estimateMobilePrice(pricingSettings, {
      carrier,
      planType: 'budget',
      dataUsage,
      extraOption,
    }).monthly
    const monthlySaving = majorPlan - budgetPlan
    const yearlySaving = monthlySaving * 12
    return { majorPlan, budgetPlan, monthlySaving, yearlySaving }
  }, [calls, gb, pricingSettings])

  return (
    <InteractiveSection
      eyebrow="절약 시뮬레이터"
      title="얼마나 절약할 수 있을까요?"
      description="월 데이터 사용량을 기준으로 정식 통신사와 알뜰폰의 요금 차이를 추정해 드려요."
      icon={Calculator}
    >
      <div>
        <label className="mb-2 block text-sm font-bold text-ink">
          월 데이터 사용량: <span className="text-brand-700">{gb}GB</span>
        </label>
        <input
          type="range"
          min={1}
          max={50}
          value={gb}
          onChange={(e) => setGb(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-[10px] text-ink-muted">
          <span>1GB</span>
          <span>50GB+ (사실상 무제한)</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-bold text-ink">통화 패턴</p>
        <div className="grid grid-cols-3 gap-2">
          {([
            { v: 'light', label: '짧게만' },
            { v: 'normal', label: '보통' },
            { v: 'heavy', label: '업무용 많이' },
          ] as const).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setCalls(o.v)}
              className={[
                'rounded-2xl border-2 px-3 py-2.5 text-sm font-bold transition',
                calls === o.v
                  ? 'border-brand-500 bg-brand-50 text-brand-800'
                  : 'border-slate-200 text-ink-soft hover:border-slate-300',
              ].join(' ')}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            정식 통신사 예상
          </p>
          <p className="mt-1 text-2xl font-black text-ink">
            {result.majorPlan.toLocaleString()}원
          </p>
          <p className="text-xs text-ink-muted">월 요금 (추정)</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-mint-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
            알뜰폰 절약형
          </p>
          <p className="mt-1 text-2xl font-black text-brand-700">
            {result.budgetPlan.toLocaleString()}원
          </p>
          <p className="text-xs text-ink-muted">월 요금 (추정)</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-white">
        <TrendingDown className="h-6 w-6 text-mint-400" />
        <div>
          <p className="text-xs text-slate-300">연간 예상 절약액</p>
          <p className="text-2xl font-black tracking-tight">
            최대 {result.yearlySaving.toLocaleString()}원
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-muted">
        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
        위 수치는 샘플 요금 기준 추정치이며, 실제 요금제·약정에 따라 달라집니다.
      </p>
      <MobilePlanStarter />
    </InteractiveSection>
  )
}

function MobilePlanStarter() {
  const [session, setSession] = useState(getSession())
  const [pricingSettings, setPricingSettings] = useState(getMobilePricingSettings())
  const [carrier, setCarrier] = useState<MobileCarrierId>('skt')
  const [planType, setPlanType] = useState<MobilePlanType>('budget')
  const [dataUsage, setDataUsage] = useState<MobileDataUsage>('standard')
  const [extraOption, setExtraOption] = useState<MobileExtraOption>('none')
  const [applied, setApplied] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    const syncSession = () => setSession(getSession())
    window.addEventListener('lifful-auth-changed', syncSession)
    return () => window.removeEventListener('lifful-auth-changed', syncSession)
  }, [])

  useEffect(() => {
    const syncPricing = () => setPricingSettings(getMobilePricingSettings())
    window.addEventListener('lifful-mobile-pricing-changed', syncPricing)
    return () => window.removeEventListener('lifful-mobile-pricing-changed', syncPricing)
  }, [])

  const estimate = useMemo(() => {
    return estimateMobilePrice(pricingSettings, {
      carrier,
      planType,
      dataUsage,
      extraOption,
    })
  }, [carrier, dataUsage, extraOption, planType, pricingSettings])

  const handleApply = () => {
    if (!session) {
      setLoginOpen(true)
      return
    }

    setApplied(true)
  }

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Quick Start</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
            휴대폰 신청 조건 먼저 고르기
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            통신사와 사용 패턴을 먼저 선택하면 대략적인 월 요금 기준을 바로 볼 수 있습니다.
          </p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          신청 전 선택
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <OptionGroup
          title="1. 통신사"
          value={carrier}
          onChange={(value) => setCarrier(value as typeof carrier)}
          options={pricingSettings.carriers
            .filter((item) => item.isActive)
            .map((item) => ({ value: item.id, label: item.name }))}
        />
        <OptionGroup
          title="2. 요금 성향"
          value={planType}
          onChange={(value) => setPlanType(value as typeof planType)}
          options={[
            { value: 'budget', label: '알뜰하게' },
            { value: 'major', label: '정식 통신사 중심' },
          ]}
        />
        <OptionGroup
          title="3. 데이터 사용량"
          value={dataUsage}
          onChange={(value) => setDataUsage(value as typeof dataUsage)}
          options={[
            { value: 'light', label: '가볍게' },
            { value: 'standard', label: '보통' },
            { value: 'heavy', label: '많이 씀' },
          ]}
        />
        <OptionGroup
          title="4. 추가 조건"
          value={extraOption}
          onChange={(value) => setExtraOption(value as typeof extraOption)}
          options={[
            { value: 'none', label: '없음' },
            { value: 'family', label: '가족 결합 가능' },
            { value: 'esim', label: 'eSIM 필요' },
          ]}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-gold-50 to-brand-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700">예상 기준</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-soft">{estimate.carrierName}</p>
            <p className="text-3xl font-black tracking-tight text-ink">
              월 {estimate.monthly.toLocaleString()}원대
            </p>
          </div>
          <p className="text-xs text-ink-muted">
            실제 신청 저장 기능은 아직 없고, 현재는 버튼 반응만 연결되어 있습니다.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-muted">
          {session
            ? '로그인 상태입니다. 지금은 신청 버튼 동작만 확인할 수 있습니다.'
            : '신청하려면 로그인해야 합니다.'}
        </p>
        <button type="button" onClick={handleApply} className="btn-primary text-sm">
          {session ? '신청 버튼 눌러보기' : '로그인 후 신청'}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {applied && (
        <div className="mt-4 rounded-2xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm font-medium text-mint-800">
          버튼 동작만 연결된 상태입니다. 실제 신청 저장 기능은 아직 구현하지 않았습니다.
        </div>
      )}

      {loginOpen && (
        <QuickLoginModal
          onClose={() => setLoginOpen(false)}
          onSuccess={() => {
            setSession(getSession())
            setLoginOpen(false)
          }}
        />
      )}
    </div>
  )
}

// ============================================================================
// 렌탈 — 렌탈 vs 구매 비교
// ============================================================================
function RentalVsBuyCalculator() {
  const [monthly, setMonthly] = useState(39000)
  const [term, setTerm] = useState(36)
  const [buyPrice, setBuyPrice] = useState(800000)

  const result = useMemo(() => {
    const rentalTotal = monthly * term
    const diff = rentalTotal - buyPrice
    return {
      rentalTotal,
      buyPrice,
      diff, // 양수면 렌탈이 비쌈, 음수면 렌탈이 쌈
      recommendation:
        Math.abs(diff) < buyPrice * 0.05
          ? ('비슷함' as const)
          : diff > 0
            ? ('구매 유리' as const)
            : ('렌탈 유리' as const),
    }
  }, [monthly, term, buyPrice])

  return (
    <InteractiveSection
      eyebrow="총비용 비교"
      title="렌탈이 좋을까요, 구매가 좋을까요?"
      description="같은 제품을 렌탈할 때와 구매했을 때의 총비용을 비교해 드려요."
      icon={Calculator}
    >
      <div className="space-y-4">
        <NumberField
          label="월 렌탈료"
          unit="원"
          value={monthly}
          onChange={setMonthly}
          step={1000}
          min={5000}
        />
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">
            약정 기간: <span className="text-brand-700">{term}개월</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: 24, label: '2년' },
              { v: 36, label: '3년' },
              { v: 60, label: '5년' },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => setTerm(o.v)}
                className={[
                  'rounded-2xl border-2 py-2.5 text-sm font-bold transition',
                  term === o.v
                    ? 'border-brand-500 bg-brand-50 text-brand-800'
                    : 'border-slate-200 text-ink-soft hover:border-slate-300',
                ].join(' ')}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <NumberField
          label="같은 제품 구매가"
          unit="원"
          value={buyPrice}
          onChange={setBuyPrice}
          step={50000}
          min={100000}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-brand-50 to-gold-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
          {term / 12}년 총비용 비교 결과
        </p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-ink-muted">렌탈 총비용</p>
            <p className="text-xl font-black text-ink">
              {result.rentalTotal.toLocaleString()}원
            </p>
          </div>
          <div className="text-center text-2xl text-ink-muted">vs</div>
          <div className="text-right">
            <p className="text-xs text-ink-muted">즉시 구매</p>
            <p className="text-xl font-black text-ink">
              {result.buyPrice.toLocaleString()}원
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            추천
          </p>
          <p className="text-2xl font-black text-brand-700">{result.recommendation}</p>
          <p className="mt-1 text-xs text-ink-soft">
            {result.recommendation === '비슷함'
              ? '두 선택의 비용 차이가 크지 않아요. 편의(AS·필터 교체)를 기준으로 선택하세요.'
              : result.diff > 0
                ? `렌탈이 구매보다 약 ${Math.abs(result.diff).toLocaleString()}원 더 비싸요.`
                : `렌탈이 구매보다 약 ${Math.abs(result.diff).toLocaleString()}원 더 싸요.`}
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-muted">
        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
        렌탈의 무상 AS·필터 교체 혜택 가치와 이사 시 이전비는 계산에서 제외됨.
      </p>
    </InteractiveSection>
  )
}

// ============================================================================
// 이사 — 평수별 견적 추정
// ============================================================================
function MovingQuoteEstimator() {
  const [pyeong, setPyeong] = useState(24)
  const [type, setType] = useState<'general' | 'packing' | 'premium'>('packing')

  const estimate = useMemo(() => {
    // 평수와 이사 유형 기반 샘플 견적
    const basePrice = {
      general: pyeong * 8000 + 100000,
      packing: pyeong * 18000 + 200000,
      premium: pyeong * 35000 + 500000,
    } as const
    const price = basePrice[type]
    return { price, range: [Math.round(price * 0.85), Math.round(price * 1.2)] as const }
  }, [pyeong, type])

  return (
    <InteractiveSection
      eyebrow="견적 시뮬레이터"
      title="평수와 이사 유형으로 예산 확인"
      description="어림짐 견적을 미리 확인하고 예산 계획에 활용하세요."
      icon={Calculator}
    >
      <div>
        <label className="mb-2 block text-sm font-bold text-ink">
          현재 집 평수: <span className="text-brand-700">{pyeong}평</span>
        </label>
        <input
          type="range"
          min={5}
          max={50}
          value={pyeong}
          onChange={(e) => setPyeong(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-[10px] text-ink-muted">
          <span>5평 (원룸)</span>
          <span>50평 (대형)</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-bold text-ink">이사 유형</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {([
            { v: 'general', label: '일반 이사', desc: '직접 포장' },
            { v: 'packing', label: '포장이사', desc: '포장+운반+정리' },
            { v: 'premium', label: '입주이사', desc: '풀옵션' },
          ] as const).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setType(o.v)}
              className={[
                'rounded-2xl border-2 p-3 text-left transition',
                type === o.v
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 hover:border-slate-300',
              ].join(' ')}
            >
              <p className="text-sm font-extrabold text-ink">{o.label}</p>
              <p className="mt-0.5 text-[11px] text-ink-muted">{o.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-50 to-brand-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
          예상 견적 범위
        </p>
        <p className="mt-1 text-3xl font-black tracking-tight text-ink">
          {estimate.range[0].toLocaleString()} ~ {estimate.range[1].toLocaleString()}원
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          평균 {estimate.price.toLocaleString()}원 기준. 거리·층수·옵션에 따라 변동.
        </p>
        <a href="#consult" className="btn-primary mt-4 text-sm">
          정확한 견적 받아보기
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-muted">
        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
        견적은 샘플이며, 사다리차/에어컨/벽시 등 옵션은 별도입니다. 정확한 금액은 방문 견적 필요.
      </p>
    </InteractiveSection>
  )
}

// ============================================================================
// 청소 — 옵션 견적표
// ============================================================================
function CleaningOptionsBuilder() {
  const [pyeong, setPyeong] = useState(24)
  const [options, setOptions] = useState<Record<string, boolean>>({
    boiler: false,
    ac: false,
    balcony: false,
    silicone: false,
  })

  const basePrice = pyeong * 8000 + 60000
  const optionPrices: Record<keyof typeof options, number> = {
    boiler: 50000,
    ac: 30000,
    balcony: 40000,
    silicone: 60000,
  }

  const optionLabels: Record<keyof typeof options, string> = {
    boiler: '보일러 순환청소',
    ac: '에어컨 분해청소',
    balcony: '베란다 + 다용도실',
    silicone: '욕실 실리콘 교체',
  }

  const total =
    basePrice +
    Object.entries(options).reduce(
      (sum, [key, on]) => sum + (on ? optionPrices[key as keyof typeof optionPrices] : 0),
      0,
    )

  return (
    <InteractiveSection
      eyebrow="옵션 견적표"
      title="필요한 옵션만 골라 예산 확인"
      description="평수 기본 공임에 원하는 옵션을 추가해 보세요. 숨은 비용이 없게 미리 알려드려요."
      icon={Calculator}
    >
      <div>
        <label className="mb-2 block text-sm font-bold text-ink">
          평수: <span className="text-brand-700">{pyeong}평</span>
        </label>
        <input
          type="range"
          min={10}
          max={60}
          value={pyeong}
          onChange={(e) => setPyeong(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {Object.keys(options).map((key) => {
          const k = key as keyof typeof options
          return (
            <button
              key={k}
              type="button"
              onClick={() => setOptions((p) => ({ ...p, [k]: !p[k] }))}
              className={[
                'flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition',
                options[k]
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 hover:border-slate-300',
              ].join(' ')}
            >
              <div>
                <p className="text-sm font-bold text-ink">{optionLabels[k]}</p>
                <p className="text-xs text-ink-muted">+{optionPrices[k].toLocaleString()}원</p>
              </div>
              <span
                className={[
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  options[k] ? 'bg-brand-600 text-white' : 'bg-slate-100 text-ink-light',
                ].join(' ')}
              >
                {options[k] ? '✓' : '+'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-50 to-brand-50 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-ink-soft">기본 공임 ({pyeong}평)</span>
          <span className="text-sm font-bold text-ink">{basePrice.toLocaleString()}원</span>
        </div>
        {Object.entries(options).map(([key, on]) => {
          if (!on) return null
          const k = key as keyof typeof options
          return (
            <div key={k} className="mt-1.5 flex items-baseline justify-between">
              <span className="text-xs text-ink-muted">+ {optionLabels[k]}</span>
              <span className="text-xs font-bold text-ink">
                {optionPrices[k].toLocaleString()}원
              </span>
            </div>
          )
        })}
        <div className="mt-3 border-t border-slate-200 pt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-extrabold text-ink">예상 총액</span>
            <span className="text-2xl font-black text-brand-700">
              {total.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-muted">
        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
        금액은 샘플이며, 오염도·작업 난이도에 따라 변동될 수 있어요.
      </p>
    </InteractiveSection>
  )
}

// ============================================================================
// 공통 래퍼
// ============================================================================
function InteractiveSection({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  icon: typeof Calculator
  children: React.ReactNode
}) {
  return (
    <section className="section bg-slate-50/80">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
              <Icon className="h-3.5 w-3.5" />
              {eyebrow}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">{description}</p>

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OptionGroup({
  title,
  value,
  onChange,
  options,
}: {
  title: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-ink">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              'rounded-2xl border-2 px-3 py-3 text-sm font-bold transition',
              value === option.value
                ? 'border-brand-500 bg-brand-50 text-brand-800'
                : 'border-slate-200 text-ink-soft hover:border-slate-300',
            ].join(' ')}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function QuickLoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [email, setEmail] = useState('demo@lifful.com')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading) return

    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-cardHover sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Login Required
            </p>
            <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
              신청 전에 로그인해 주세요
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              지금 화면을 벗어나지 않고 바로 로그인할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-ink-soft transition hover:border-slate-300 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="quick-login-email" className="mb-1.5 block text-sm font-bold text-ink">
              이메일
            </label>
            <input
              id="quick-login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              required
            />
          </div>

          <div>
            <label
              htmlFor="quick-login-password"
              className="mb-1.5 block text-sm font-bold text-ink"
            >
              비밀번호
            </label>
            <input
              id="quick-login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
              {error}
            </div>
          )}

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-ink-soft">
            데모 계정: <span className="font-bold text-ink">demo@lifful.com / demo123</span>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm">
              닫기
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 text-sm">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  로그인 중
                </>
              ) : (
                '로그인'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function NumberField({
  label,
  unit,
  value,
  onChange,
  step,
  min,
}: {
  label: string
  unit: string
  value: number
  onChange: (v: number) => void
  step: number
  min: number
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-ink">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
        />
        <span className="text-sm font-bold text-ink-muted">{unit}</span>
      </div>
    </label>
  )
}
