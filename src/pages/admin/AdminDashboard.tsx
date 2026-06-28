import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Inbox,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Calendar,
} from 'lucide-react'
import {
  mockConsultations,
  getConsultationStats,
  getServiceLabel,
  getStatusLabel,
  statusBadgeCls,
} from '../../data/mockConsultations'

/**
 * 관리자 대시보드.
 * 통계 카드 + 서비스 분포 + 최근 상담 표.
 */
export default function AdminDashboard() {
  const stats = useMemo(() => getConsultationStats(mockConsultations), [])
  const recent = mockConsultations.slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">대시보드</h1>
        <p className="mt-1 text-sm text-ink-soft">
          오늘을 기준으로 한 상담 신청 현황입니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="오늘 신청"
          value={stats.todayCount}
          unit="건"
          accent="brand"
        />
        <StatCard
          icon={Inbox}
          label="이번 주 신청"
          value={stats.weekCount}
          unit="건"
          accent="amber"
        />
        <StatCard
          icon={Clock}
          label="미회신"
          value={stats.pendingCount}
          unit="건"
          accent="rose"
        />
        <StatCard
          icon={TrendingUp}
          label="전환율"
          value={stats.conversionRate}
          unit="%"
          accent="mint"
          subLabel={`완료 ${stats.doneCount} / 전체 ${stats.total}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 서비스 분포 */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-1">
          <h2 className="text-sm font-bold text-ink">서비스별 신청 분포</h2>
          <ul className="mt-4 space-y-3">
            {stats.serviceDistribution.map(({ service, count }) => {
              const pct = Math.round((count / stats.total) * 100)
              return (
                <li key={service}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink-soft">
                      {getServiceLabel(service)}
                    </span>
                    <span className="font-bold text-ink">{count}건</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* 최근 상담 */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">최근 상담 신청</h2>
            <Link
              to="/admin/consultations"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
            >
              전체 보기
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-3 py-2.5">이름</th>
                  <th className="hidden px-3 py-2.5 sm:table-cell">서비스</th>
                  <th className="px-3 py-2.5">상태</th>
                  <th className="hidden px-3 py-2.5 text-right sm:table-cell">신청일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-3">
                      <p className="font-bold text-ink">{c.name}</p>
                      <p className="text-xs text-ink-muted">{c.phone}</p>
                    </td>
                    <td className="hidden px-3 py-3 align-middle text-ink-soft sm:table-cell">
                      {getServiceLabel(c.serviceType)}
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusBadgeCls[c.status]}`}
                      >
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
                    <td className="hidden px-3 py-3 text-right align-middle text-xs text-ink-muted sm:table-cell">
                      {formatRelative(c.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 완료 건수 요약 */}
      <div className="flex items-center gap-3 rounded-3xl border border-mint-100 bg-mint-50 px-5 py-4 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-mint-700" />
        <p className="text-mint-800">
          최근 한 달간 <strong className="font-extrabold">{stats.doneCount}건</strong>의 상담이
          완료되었습니다.
        </p>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  accent,
  subLabel,
}: {
  icon: typeof Inbox
  label: string
  value: number
  unit?: string
  accent: 'brand' | 'amber' | 'rose' | 'mint'
  subLabel?: string
}) {
  const cls: Record<typeof accent, string> = {
    brand: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    mint: 'bg-mint-50 text-mint-700',
  }
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          {label}
        </span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${cls[accent]}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight text-ink">
        {value}
        {unit && <span className="ml-0.5 text-base font-bold text-ink-muted">{unit}</span>}
      </p>
      {subLabel && <p className="mt-1 text-xs text-ink-muted">{subLabel}</p>}
    </div>
  )
}

/** "3시간 전", "2일 전" 같은 상대 시간 포맷 */
function formatRelative(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}
