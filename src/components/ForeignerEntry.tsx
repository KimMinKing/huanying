import { Link } from 'react-router-dom'
import { ArrowRight, Globe, MessageCircle, Plane, Check } from 'lucide-react'
import { chineseHero } from '../data/chineseServices'

/**
 * 홈페이지 내 "외국인 정착 서비스" 진입 섹션.
 * - 메인 사이트와 /chinese-users 를 잇는 다리 역할.
 * - 바이링얼 카피를 살짝 노출해 중국어 서비스임을 직관적으로 전달.
 */
export default function ForeignerEntry() {
  return (
    <section className="section relative overflow-hidden cn-warm-bg">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* 좌측 카피 */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-sm font-semibold text-brand-700 shadow-soft">
              <Globe className="h-3.5 w-3.5" />
              For Chinese Users · 中文服务
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              {chineseHero.title.ko}
            </h2>
            <p className="mt-2 text-lg font-semibold text-brand-700">
              {chineseHero.title.zh}
              <span className="ml-2 align-middle text-xs font-medium text-ink-muted">
                (중국어)
              </span>
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
              {chineseHero.description.ko}
            </p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                '휴대폰 개통 (유심/eSIM/정식 번호)',
                '외국인등록증 · 은행 계좌 안내',
                '인터넷 설치 · 집 구하기 통역',
                'WeChat · 카카오톡 중국어 상담',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                  <Check className="h-4 w-4 shrink-0 text-mint-600" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/chinese-users" className="btn-primary text-base">
                외국인 정착 서비스 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/chinese-users/settlement"
                className="btn-secondary text-base"
              >
                정착 체크리스트
              </Link>
            </div>
          </div>

          {/* 우측: 정착 스텝 미리보기 카드 */}
          <div className="relative">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-cardHover sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                    <Plane className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">한국 정착 6단계</p>
                    <p className="text-xs text-ink-muted">입국부터 사후관리까지</p>
                  </div>
                </div>
                <span className="rounded-full bg-gold-50 px-2.5 py-1 text-[11px] font-bold text-gold-700">
                  평균 14일
                </span>
              </div>

              <ol className="mt-5 space-y-2.5">
                {[
                  { n: 1, t: '입국 전 상담', z: '入境前咨询' },
                  { n: 2, t: '공항 유심/eSIM', z: '机场USIM/eSIM' },
                  { n: 3, t: '외국인등록증(ARC)', z: '外国人登录证' },
                  { n: 4, t: '본인인증 번호 개통', z: '实名号码开通' },
                  { n: 5, t: '은행 · 집 · 인터넷', z: '银行·房·宽带' },
                  { n: 6, t: '사후관리', z: '后续管理' },
                ].map((s) => (
                  <li
                    key={s.n}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-3.5 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-black text-white">
                      {s.n}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink">{s.t}</p>
                      <p className="text-[11px] text-ink-muted">{s.z}</p>
                    </div>
                    <Check className="h-4 w-4 text-mint-600" />
                  </li>
                ))}
              </ol>

              <Link
                to="/chinese-users/settlement"
                className="mt-5 flex items-center justify-center gap-1.5 rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-ink-soft"
              >
                <MessageCircle className="h-4 w-4 text-gold-300" />
                단계별로 자세히 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
