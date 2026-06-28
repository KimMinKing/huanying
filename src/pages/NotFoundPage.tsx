import { Link } from 'react-router-dom'
import { Home, Search, ArrowRight, Compass } from 'lucide-react'
import SEO from '../components/SEO'

/**
 * 404 페이지. 사용자 친화적 카톡/홈/상담 CTA 제공.
 */
export default function NotFoundPage() {
  return (
    <>
      <SEO title="페이지를 찾을 수 없어요" path="/404" noIndex />
      <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(178 41 26 / 0.08) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
        }}
      />
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <div className="relative inline-block">
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-redGlow">
              <Compass className="h-10 w-10" />
            </span>
          </div>

          <p className="mt-8 text-[7rem] font-black leading-none tracking-tight text-brand-600 sm:text-[10rem]">
            404
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            페이지를 찾을 수 없어요
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            주소가 잘못 입력되었거나, 변경·삭제된 페이지일 수 있습니다.
            <br />
            아래에서 필요한 곳으로 바로 이동해 보세요.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-primary text-base">
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Link>
            <Link to="/#services" className="btn-secondary text-base">
              <Search className="h-4 w-4" />
              서비스 둘러보기
            </Link>
            <Link to="/#consult" className="btn-ghost text-base">
              무료 상담 신청
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              추천 페이지
            </p>
            <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-ink-soft transition hover:bg-slate-50"
                >
                  인터넷·휴대폰 비교
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  to="/chinese-users"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-ink-soft transition hover:bg-slate-50"
                >
                  외국인 정착 서비스 (中文)
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  to="/services/internet"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-ink-soft transition hover:bg-slate-50"
                >
                  인터넷 요금제 비교
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  to="/services/mobile"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-ink-soft transition hover:bg-slate-50"
                >
                  휴대폰 요금제 비교
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </section>
    </>
  )
}
