import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Loader2,
  LogOut,
  UserCircle,
  Inbox,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import {
  getSession,
  logout,
  getMyConsultations,
  type CustomerUser,
  type MyConsultation,
} from '../../lib/customerAuth'
import SEO from '../../components/SEO'

/**
 * 고객 마이페이지.
 * - 인증 안 된 사용자는 /login으로 리다이렉트
 * - 내 상담 신청 목록 + 간단 프로필
 */
export default function MyPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [consultations, setConsultations] = useState<MyConsultation[]>([])
  const [loading, setLoading] = useState(true)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      navigate('/login', { replace: true })
      return
    }
    setUser(session)
    setChecked(true)

    getMyConsultations()
      .then(setConsultations)
      .finally(() => setLoading(false))
  }, [navigate])

  if (!checked || !user) return null

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const ongoing = consultations.filter(
    (c) => c.status === 'new' || c.status === 'contacted' || c.status === 'in_progress',
  )
  const done = consultations.filter((c) => c.status === 'done')

  return (
    <>
      <SEO title="마이페이지" path="/my" noIndex />
      <section className="bg-slate-50/60 py-12 sm:py-16">
      <div className="container-page">
        {/* 헤더 카드 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <span className="text-xl font-black">{user.name.slice(0, 1)}</span>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
                  마이페이지
                </p>
                <p className="text-2xl font-extrabold tracking-tight text-ink">{user.name} 님</p>
                <p className="text-sm text-ink-muted">{user.email} · {user.phone}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-ink-soft transition hover:border-brand-200 hover:text-brand-700"
            >
              <LogOut className="h-3.5 w-3.5" />
              로그아웃
            </button>
          </div>

          {/* 통계 */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <StatBox icon={Clock} label="진행 중" value={ongoing.length} accent="brand" />
            <StatBox icon={CheckCircle2} label="완료" value={done.length} accent="mint" />
            <StatBox icon={Inbox} label="전체" value={consultations.length} accent="ink" />
          </div>
        </div>

        {/* 내 상담 신청 */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-ink">내 상담 신청</h2>
            <Link
              to="/#consult"
              className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800"
            >
              새 상담 신청
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-4 flex items-center justify-center rounded-3xl border border-slate-200 bg-white py-12 text-sm text-ink-muted">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              불러오는 중…
            </div>
          ) : consultations.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <UserCircle className="mx-auto h-10 w-10 text-ink-light" />
              <p className="mt-3 text-sm font-bold text-ink">아직 상담 신청 내역이 없어요.</p>
              <p className="mt-1 text-xs text-ink-muted">
                첫 상담을 신청하고 더 나은 요금제·서비스를 찾아보세요.
              </p>
              <Link to="/#consult" className="btn-primary mt-5 text-sm">
                무료 상담 신청하기
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {consultations.map((c) => (
                <ConsultationItem key={c.id} consultation={c} />
              ))}
            </ul>
          )}
        </div>

        {/* AI 추천 다시 보기 */}
        <div className="mt-8">
          <Link
            to="/chinese-users"
            className="group flex items-center justify-between gap-4 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-gold-50 p-5 transition hover:shadow-soft"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-ink">AI 맞춤 추천 다시 받기</p>
                <p className="text-xs text-ink-muted">
                  체류 조건이 바뀌었다면 더 정확한 조합을 받아보세요.
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-brand-700 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-ink-light">
          계정이나 데이터 문제가 있으면{' '}
          <a
            href="mailto:hello@lifful.example"
            className="font-semibold text-brand-700 hover:underline"
          >
            hello@lifful.example
          </a>
          으로 문의해 주세요.
        </p>
      </div>
    </section>
    </>
  )
}

function StatBox({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Clock
  label: string
  value: number
  accent: 'brand' | 'mint' | 'ink'
}) {
  const cls: Record<typeof accent, string> = {
    brand: 'bg-brand-50 text-brand-700',
    mint: 'bg-mint-50 text-mint-700',
    ink: 'bg-slate-100 text-ink',
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center">
      <span
        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-xl ${cls[accent]}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="mt-2 text-xl font-black tracking-tight text-ink">{value}</p>
      <p className="text-[11px] font-bold text-ink-muted">{label}</p>
    </div>
  )
}

const statusStyleMap: Record<MyConsultation['status'], { cls: string; dot: string }> = {
  new: { cls: 'bg-brand-50 text-brand-700 border-brand-100', dot: 'bg-brand-500' },
  contacted: {
    cls: 'bg-amber-50 text-amber-700 border-amber-100',
    dot: 'bg-amber-500',
  },
  in_progress: { cls: 'bg-sky-50 text-sky-700 border-sky-100', dot: 'bg-sky-500' },
  done: { cls: 'bg-mint-50 text-mint-700 border-mint-100', dot: 'bg-mint-500' },
  cancelled: { cls: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
}

function ConsultationItem({ consultation: c }: { consultation: MyConsultation }) {
  const style = statusStyleMap[c.status]
  return (
    <li className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            {c.serviceName}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c.message}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${style.cls}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {c.statusLabel}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span>
          신청:{' '}
          {new Date(c.createdAt).toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        {c.assignedStaff && <span>담당: {c.assignedStaff}</span>}
      </div>
    </li>
  )
}
