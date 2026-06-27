import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Plane,
  TrendingUp,
  Check,
  X,
  FileText,
  CreditCard,
  Wifi,
  Smartphone,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'
import { FAQSection } from '../components/FAQ'
import { CTASection } from '../components/CTASection'
import { SectionHeader } from '../components/ServiceCards'
import { mobileFaqs } from '../data/faqs'

const personas = [
  {
    icon: GraduationCap,
    title: '유학생 (D-2/D-4)',
    zh: '留学生',
    desc: '학교 등록 후 외국인등록증 발급이 가장 빠름. 알뜰폰이 월 2~3만 원대로 충분.',
  },
  {
    icon: Briefcase,
    title: '취업자 (E-7)',
    zh: '就业者',
    desc: '본인인증 가능 번호가 필수. 정식 통신사 후불 요금제 + 결합할인 추천.',
  },
  {
    icon: Plane,
    title: '장기 여행자 (C-3)',
    zh: '长期旅行者',
    desc: '90일 미만이라 데이터 중심 선불/eSIM이 가장 빠르고 저렴.',
  },
  {
    icon: TrendingUp,
    title: '투자·거주 (D-8)',
    zh: '投资·居住',
    desc: '부동산·은행 실명가능 번호 필요. 정식 번호 + 사후관리 패키지 권장.',
  },
]

const docsByVisa = [
  {
    type: '단기 체류 (90일 미만)',
    items: ['여권', '한국 내 체류 주소', '결제 수단 (카드/현금)'],
    note: '외국인등록증 불필요. 유심/eSIM 데이터 요금제 바로 개통 가능.',
  },
  {
    type: '장기 체류 (외국인등록증 발급 전)',
    items: ['여권', '외국인등록증 접수증(사본)', '한국 연락처(유심 번호)'],
    note: '등록증 발급 전에는 임시 번호. 발급 후 정식 번호로 전환.',
  },
  {
    type: '장기 체류 (외국인등록증 보유)',
    items: ['여권', '외국인등록증(ARC)', '한국 연락처', '일부 통신사 요구 서류'],
    note: '본인인증 가능 정식 번호 개통. 은행·공공 서비스 이용 가능.',
  },
]

const methods = [
  {
    icon: Wifi,
    title: '유심 (USIM)',
    tag: '10분 내',
    desc: '공항 또는 매장에서 실물 칩을 받아 장착. 가장 빠르고 호환성이 높습니다.',
    points: ['즉시 개통', '거의 모든 기기 호환', '중국 구매 기기 일부 확인 필요'],
    accent: 'bg-brand-50 text-brand-700',
  },
  {
    icon: CreditCard,
    title: 'eSIM',
    tag: '대기 없음',
    desc: '최신 기기에서 QR/앱으로 설치. 카운터 방문 없이 활성화됩니다.',
    points: ['대기 없는 설치', '단말기 이중 번호 가능', 'eSIM 지원 기기 필요'],
    accent: 'bg-mint-50 text-mint-700',
  },
  {
    icon: Smartphone,
    title: '정식 번호 (본인인증)',
    tag: 'ARC 후',
    desc: '외국인등록증으로 가입하는 정식 통신사/알뜰폰 번호. SMS 인증 가능.',
    points: ['SMS 본인인증 가능', '은행·배달·공공 앱 이용', 'MNP(번호이동) 지원'],
    accent: 'bg-gold-50 text-gold-700',
  },
]

const planComparison = [
  {
    name: '단기 데이터 요금제',
    zh: '短期流量套餐',
    period: '1~90일',
    cost: '5,000 ~ 30,000원',
    target: '관광·단기 출장·장기 여행',
    arc: false,
    verify: false,
    pros: ['도착 즉시 사용', '여권만으로 가입', '해지 부담 없음'],
    cons: ['본인인증 불가', '통화·SMS 제한'],
    recommend: '90일 미만 체류',
  },
  {
    name: '알뜰폰 (MVNO)',
    zh: '虚拟运营商',
    period: '월 단위 (1~24개월)',
    cost: '월 11,000 ~ 33,000원',
    target: '유학생·단기 거주',
    arc: true,
    verify: true,
    pros: ['월 저렴', '데이터 중심', '본인인증 가능(ARC)'],
    cons: ['일부 부가서비스 제한', '야간 속도 제한 있을 수 있음'],
    recommend: '6개월~1년 거주',
    highlight: true,
  },
  {
    name: '정식 통신사 후불',
    zh: '正式运营商后付费',
    period: '24~36개월 약정',
    cost: '월 50,000 ~ 80,000원',
    target: '취업·장기 거주·가족',
    arc: true,
    verify: true,
    pros: ['결합할인 큼', '속도·혜택 최상', '기기 할부 가능'],
    cons: ['약정 필요', '위약금 발생 가능'],
    recommend: '1년 이상 장기',
  },
]

const processSteps = [
  { n: 1, t: '상담 접수', d: '체류 기간·비자·기기 모델을 알려주세요.' },
  { n: 2, t: '방식 추천', d: '유심/eSIM/정식 번호 중 최적을 안내드려요.' },
  { n: 3, t: '서류 점검', d: '여권·ARC·한국 주소 등 필요 서류 확인.' },
  { n: 4, t: '개통 진행', d: '공항 픽업 또는 매장 동행으로 개통.' },
  { n: 5, t: '본인인증 연동', d: 'ARC 발급 후 PASS/토스 등 인증 연결.' },
  { n: 6, t: '사후관리', d: '요금제 점검·갱신·해지까지 책임집니다.' },
]

export default function ChineseMobilePage() {
  return (
    <>
      {/* 히어로 */}
      <section className="relative overflow-hidden cn-warm-bg">
        <div className="container-page pt-8 pb-4 sm:pt-10">
          <Breadcrumbs
            items={[
              { label: '홈', to: '/' },
              { label: '외국인 정착', to: '/chinese-users' },
              { label: '중국인 휴대폰 개통' },
            ]}
          />
        </div>
        <div className="container-page pb-14 pt-4 sm:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="eyebrow">
                <Smartphone className="h-3.5 w-3.5" />
                중국인 휴대폰 개통 · 手机开通
              </span>
              <h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.16] tracking-tight text-ink sm:text-4xl lg:text-5xl">
                한국에서의 첫 번째 연결,
                <br />
                <span className="text-brand-600">휴대폰부터</span> 시작합니다.
              </h1>
              <p className="mt-2 text-lg font-bold text-brand-700">
                韩国的第一次连接,从手机开始。
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                공항에 도착하자마자 데이터가 필요한 순간부터, 은행·배달 앱이 필요한
                정식 번호까지. 비자와 체류 기간에 맞춰 가장 빠르게 연결되는 길을
                안내해 드려요.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#cn-consult" className="btn-primary">
                  상담받기
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link to="/chinese-users" className="btn-secondary">
                  <ArrowLeft className="h-4 w-4" />
                  정착 서비스로
                </Link>
              </div>
            </div>

            {/* 우측: 빠른 비교 카드 */}
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-cardHover">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">빠른 비교</p>
                  <p className="text-xs text-ink-muted">방식별 개통 속도</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2.5">
                {[
                  { t: '유심 (USIM)', z: '공항 도착 직후', time: '≈ 10분', c: 'brand' },
                  { t: 'eSIM', z: '온라인 사전 신청', time: '≈ 5분', c: 'mint' },
                  { t: '정식 번호', z: 'ARC 발급 이후', time: '1~3 영업일', c: 'gold' },
                ].map((row) => (
                  <li
                    key={row.t}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 p-3.5"
                  >
                    <div>
                      <p className="text-sm font-bold text-ink">{row.t}</p>
                      <p className="text-[11px] text-ink-muted">{row.z}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        row.c === 'brand'
                          ? 'bg-brand-50 text-brand-700'
                          : row.c === 'mint'
                            ? 'bg-mint-50 text-mint-700'
                            : 'bg-gold-50 text-gold-700'
                      }`}
                    >
                      {row.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 누가 이용하면 좋은지 */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="이런 분들께"
            align="center"
            title={
              <>
                비자와 목적이 달라도,
                <span className="text-brand-600"> 시작은 비슷합니다.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {personas.map((p) => {
              const Icon = p.icon
              return (
                <article
                  key={p.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-sm font-bold text-ink-muted">{p.zh}</p>
                  <h3 className="mt-0.5 text-lg font-extrabold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 필요한 서류 */}
      <section className="section bg-slate-50/80">
        <div className="container-page">
          <SectionHeader
            eyebrow="필요한 서류"
            title={
              <>
                단계별로 필요한 서류,
                <span className="text-brand-600"> 미리 정리해 드려요.</span>
              </>
            }
            description="체류 상태에 따라 준비물이 달라요. 매니저가 상담 시 한 번 더 확인합니다."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {docsByVisa.map((doc, idx) => (
              <article
                key={doc.type}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-sm font-black text-white">
                    {idx + 1}
                  </span>
                  <FileText className="h-5 w-5 text-ink-light" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-ink">
                  {doc.type}
                </h3>
                <ul className="mt-4 space-y-2">
                  {doc.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                      <Check className="h-4 w-4 shrink-0 text-mint-600" />
                      {it}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs leading-relaxed text-ink-muted">
                  {doc.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 개통 방식 */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="개통 방식"
            align="center"
            title={
              <>
                세 가지 방식,
                <span className="text-brand-600"> 상황에 따라</span> 고릅니다.
              </>
            }
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {methods.map((m) => {
              const Icon = m.icon
              return (
                <article
                  key={m.title}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${m.accent}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${m.accent}`}>
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.desc}</p>
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                        <Check className="h-4 w-4 text-brand-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 단기 vs 장기 요금제 비교 */}
      <section className="section bg-slate-50/80">
        <div className="container-page">
          <SectionHeader
            eyebrow="단기 vs 장기 요금제"
            title={
              <>
                체류 기간이 요금제를
                <span className="text-brand-600"> 결정합니다.</span>
              </>
            }
            description="같은 '휴대폰'이어도, 단기 데이터와 정식 번호는 완전히 다른 상품입니다."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {planComparison.map((plan) => (
              <article
                key={plan.name}
                className={[
                  'relative flex flex-col rounded-4xl border p-6',
                  plan.highlight
                    ? 'border-brand-300 bg-white shadow-cardHover ring-2 ring-brand-500/20 lg:-mt-3 lg:mb-3'
                    : 'border-slate-200 bg-white shadow-card',
                ].join(' ')}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-md shadow-brand-600/30">
                    추천
                  </span>
                )}
                <p className="text-sm font-bold text-ink-muted">{plan.zh}</p>
                <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink">{plan.name}</h3>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink-light">
                  {plan.period}
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight text-ink">{plan.cost}</p>
                <p className="mt-3 text-sm text-ink-soft">{plan.target}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${plan.arc ? 'bg-mint-50 text-mint-700' : 'bg-slate-100 text-ink-muted'}`}>
                    <ShieldCheck className="h-3 w-3" />
                    ARC {plan.arc ? '필요' : '불필요'}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${plan.verify ? 'bg-mint-50 text-mint-700' : 'bg-slate-100 text-ink-muted'}`}>
                    {plan.verify ? '본인인증 가능' : '본인인증 불가'}
                  </span>
                </div>

                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  {plan.pros.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                      <Check className="h-4 w-4 shrink-0 text-mint-600" />
                      {p}
                    </li>
                  ))}
                  {plan.cons.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-sm font-medium text-ink-muted">
                      <X className="h-4 w-4 shrink-0 text-ink-light" />
                      {c}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 rounded-2xl bg-gold-50 px-3 py-2 text-xs font-bold text-gold-700">
                  이런 분께 추천: {plan.recommend}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 신청 절차 */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="신청 절차"
            align="center"
            title={
              <>
                여섯 걸음이면
                <span className="text-brand-600"> 연결 완료.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((s) => (
              <div
                key={s.n}
                className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-base font-black text-white">
                  {s.n}
                </span>
                <div>
                  <p className="font-extrabold tracking-tight text-ink">{s.t}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        items={mobileFaqs}
        eyebrow="자주 묻는 질문"
        title={
          <>
            궁금한 점,
            <span className="text-brand-600"> 미리 풀어드려요.</span>
          </>
        }
      />

      {/* CTA */}
      <CTASection />
    </>
  )
}
