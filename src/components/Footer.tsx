import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  Globe,
  ShieldCheck,
  BadgeCheck,
} from 'lucide-react'
import { siteConfig } from '../data/comparison'
import { services } from '../data/services'
import { partnerLogos } from '../data/partners'

export default function Footer() {
  return (
    <footer id="footer" className="relative">
      {/* CTA 밴드 */}
      <div className="container-page pt-4">
        <div className="relative overflow-hidden rounded-4xl bg-ink px-6 py-10 text-white sm:px-12 sm:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'radial-gradient(circle at 15% 20%, rgb(178 41 26 / 0.45), transparent 50%), radial-gradient(circle at 85% 70%, rgb(214 162 63 / 0.25), transparent 50%)',
            }}
          />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                아직 고민 중이신가요?
                <br />
                <span className="text-brand-400">견적만 받아봐도 괜찮아요.</span>
              </h2>
              <p className="mt-3 max-w-lg text-sm text-slate-300">
                무료이고 압박 없습니다. 폼 한 번이면 비교 견적을 받아볼 수 있어요.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link to="/#consult" className="btn bg-brand-600 px-6 py-3 text-white hover:bg-brand-500">
                무료 상담 신청
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/chinese-users"
                className="btn border border-white/20 bg-white/5 px-6 py-3 text-white hover:bg-white/10"
              >
                <Globe className="h-4 w-4" />
                외국인 정착 (中文)
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 파트너사 로고 띠 */}
      <div className="container-page pt-12">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-ink-muted">
            공식 파트너사
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 opacity-60">
            {partnerLogos.map((p) => (
              <span
                key={p.name}
                title={p.name}
                className="text-sm font-extrabold tracking-tight text-ink"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {p.shortName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 푸터 본문 */}
      <div className="container-page pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1.4fr]">
          {/* 브랜드 */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <span className="text-lg font-black tracking-tight">라</span>
              </span>
              <span className="text-lg font-extrabold tracking-tight text-ink">{siteConfig.brand}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              {siteConfig.description}. 복잡한 조건은 줄이고, 혜택은 더 선명하게.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-mint-50 px-2.5 py-1 text-[11px] font-bold text-mint-700 ring-1 ring-inset ring-mint-200">
                <ShieldCheck className="h-3 w-3" />
                개인정보 안심 채널
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700 ring-1 ring-inset ring-brand-100">
                <BadgeCheck className="h-3 w-3" />
                사업자등록 확인
              </span>
            </div>

            {/* 카카오톡 상담 */}
            <a
              href={siteConfig.kakao.url || '#footer'}
              target={siteConfig.kakao.url ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#FEE500] px-4 py-2.5 text-sm font-bold text-[#191919] shadow-soft transition hover:brightness-95"
            >
              <MessageCircle className="h-4 w-4" />
              {siteConfig.kakao.label} · {siteConfig.kakao.handle}
            </a>

            <Link
              to="/chinese-users"
              className="mt-3 flex w-fit items-center gap-2 rounded-2xl bg-mint-50 px-4 py-2.5 text-sm font-bold text-mint-700 ring-1 ring-inset ring-mint-200 transition hover:bg-mint-100"
            >
              <MessageCircle className="h-4 w-4" />
              WeChat 상담 · 中文
            </Link>
          </div>

          {/* 빠른 링크 */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-ink-muted">바로가기</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/services/${s.id}`}
                    className="text-sm font-medium text-ink-soft transition hover:text-brand-600"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-slate-100 pt-4">
              <li>
                <Link to="/reviews" className="text-sm font-medium text-ink-soft transition hover:text-brand-600">
                  고객후기
                </Link>
              </li>
              <li>
                <Link to="/#consult" className="text-sm font-medium text-ink-soft transition hover:text-brand-600">
                  무료 상담
                </Link>
              </li>
              <li>
                <Link to="/chinese-users" className="text-sm font-bold text-brand-700 transition hover:text-brand-800">
                  외국인 정착
                </Link>
              </li>
              <li>
                <Link to="/chinese-users/settlement" className="text-sm font-medium text-ink-soft transition hover:text-brand-600">
                  정착 체크리스트
                </Link>
              </li>
              <li>
                <Link to="/my" className="text-sm font-medium text-ink-soft transition hover:text-brand-600">
                  마이페이지
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm font-medium text-ink-muted transition hover:text-brand-600">
                  관리자
                </Link>
              </li>
            </ul>
          </div>

          {/* 회사 정보 / 고객센터 */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-ink-muted">고객센터</p>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                <div>
                  <p className="font-bold text-ink">{siteConfig.company.phone}</p>
                  <p className="text-xs">{siteConfig.company.csHours}</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                <a href={`mailto:${siteConfig.company.email}`} className="hover:text-brand-600">
                  {siteConfig.company.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                <span>{siteConfig.company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="mt-10 rounded-2xl bg-slate-50 p-5 text-xs leading-relaxed text-ink-muted">
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <span className="font-bold text-ink-soft">상호</span> {siteConfig.company.name}
            </span>
            <span>
              <span className="font-bold text-ink-soft">대표</span> {siteConfig.company.ceo}
            </span>
            <span>
              <span className="font-bold text-ink-soft">사업자등록번호</span>{' '}
              {siteConfig.company.businessNumber}
            </span>
            <span>
              <span className="font-bold text-ink-soft">통신판매업신고</span>{' '}
              {siteConfig.company.mailOrderNumber}
            </span>
          </p>
          <p className="mt-1.5 text-ink-light">
            * 표시된 사업자 정보는 예시이며, 실제 서비스 오픈 전 교체 필요합니다.
          </p>
        </div>

        {/* 바닥 바 */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-slate-200 py-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} {siteConfig.company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/terms" className="text-xs font-semibold text-ink-soft hover:text-brand-600">
              이용약관
            </Link>
            <Link to="/privacy" className="text-xs font-semibold text-ink-soft hover:text-brand-600">
              개인정보처리방침
            </Link>
            <a
              href="https://www.ftc.go.kr/www/bizCommView.do?key=232"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-ink-soft hover:text-brand-600"
            >
              사업자 정보 확인
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
