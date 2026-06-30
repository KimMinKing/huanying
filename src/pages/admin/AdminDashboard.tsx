import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, CheckCircle2, Clock, Inbox, Smartphone, TrendingUp } from 'lucide-react'
import {
  mockConsultations,
  statusBadgeCls,
  type ConsultationStatus,
  type ServiceType,
} from '../../data/mockConsultations'
import { listServiceRequests } from '../../lib/serviceRequests'

interface DashboardRow {
  id: string
  name: string
  phone: string
  serviceType: ServiceType
  status: ConsultationStatus
  createdAt: string
  source: 'mock' | 'request'
}

const serviceLabels: Record<ServiceType, string> = {
  internet: '인터넷 / IPTV',
  mobile: '휴대폰 / 알뜰폰',
  rental: '가전 렌탈',
  moving: '이사',
  cleaning: '입주 청소',
  chinese_settlement: '외국인 정착',
}

const statusLabels: Record<ConsultationStatus, string> = {
  new: '신규',
  contacted: '연락 완료',
  in_progress: '상담 중',
  done: '완료',
  cancelled: '취소',
}

export default function AdminDashboard() {
  const [requestsVersion, setRequestsVersion] = useState(0)

  useEffect(() => {
    const refresh = () => setRequestsVersion((value) => value + 1)
    window.addEventListener('lifful-service-requests-changed', refresh)
    return () => window.removeEventListener('lifful-service-requests-changed', refresh)
  }, [])

  const rows = useMemo(() => {
    void requestsVersion
    const requestRows: DashboardRow[] = listServiceRequests().map((request) => ({
      id: request.id,
      name: request.userName,
      phone: request.userPhone,
      serviceType: request.serviceType,
      status: request.status,
      createdAt: request.createdAt,
      source: 'request',
    }))

    const mockRows: DashboardRow[] = mockConsultations.map((item) => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      serviceType: item.serviceType,
      status: item.status,
      createdAt: item.createdAt,
      source: 'mock',
    }))

    return [...requestRows, ...mockRows].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [requestsVersion])

  const stats = useMemo(() => getStats(rows), [rows])
  const recent = rows.slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">대시보드</h1>
        <p className="mt-1 text-sm text-ink-soft">
          고객 신청과 상담 요청 현황을 확인합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="오늘 신청" value={stats.todayCount} unit="건" />
        <StatCard icon={Inbox} label="이번 주 신청" value={stats.weekCount} unit="건" />
        <StatCard icon={Clock} label="미처리" value={stats.pendingCount} unit="건" />
        <StatCard icon={TrendingUp} label="완료율" value={stats.conversionRate} unit="%" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-bold text-ink">서비스별 요청 분포</h2>
          <ul className="mt-4 space-y-3">
            {stats.serviceDistribution.map(({ service, count }) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <li key={service}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink-soft">{serviceLabels[service]}</span>
                    <span className="font-bold text-ink">{count}건</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">최근 상담 요청</h2>
            <Link
              to="/admin/consultations"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
            >
              전체 보기
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
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
                {recent.map((row) => (
                  <tr key={`${row.source}-${row.id}`} className="hover:bg-slate-50/60">
                    <td className="px-3 py-3">
                      <p className="font-bold text-ink">{row.name}</p>
                      <p className="text-xs text-ink-muted">{row.phone}</p>
                      {row.source === 'request' ? (
                        <p className="mt-1 text-[11px] font-bold text-brand-700">고객 신청</p>
                      ) : null}
                    </td>
                    <td className="hidden px-3 py-3 align-middle text-ink-soft sm:table-cell">
                      {serviceLabels[row.serviceType]}
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusBadgeCls[row.status]}`}
                      >
                        {statusLabels[row.status]}
                      </span>
                    </td>
                    <td className="hidden px-3 py-3 text-right align-middle text-xs text-ink-muted sm:table-cell">
                      {formatRelative(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-mint-100 bg-mint-50 px-5 py-4 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-mint-700" />
        <p className="text-mint-800">
          전체 <strong className="font-extrabold">{stats.total}건</strong> 중 완료{' '}
          <strong className="font-extrabold">{stats.doneCount}건</strong>입니다.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 px-5 py-4 text-sm">
        <Smartphone className="h-5 w-5 shrink-0 text-brand-700" />
        <p className="text-brand-800">
          휴대폰 신청은 서비스 페이지에서 접수되며, 상담 요청 메뉴에서 상태를 변경할 수 있습니다.
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
}: {
  icon: typeof Inbox
  label: string
  value: number
  unit?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-ink">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight text-ink">
        {value}
        {unit ? <span className="ml-0.5 text-base font-bold text-ink-muted">{unit}</span> : null}
      </p>
    </div>
  )
}

function getStats(rows: DashboardRow[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const todayCount = rows.filter((row) => new Date(row.createdAt) >= today).length
  const weekCount = rows.filter((row) => new Date(row.createdAt) >= weekAgo).length
  const pendingCount = rows.filter((row) => row.status === 'new' || row.status === 'contacted').length
  const doneCount = rows.filter((row) => row.status === 'done').length
  const conversionRate = rows.length > 0 ? Math.round((doneCount / rows.length) * 100) : 0

  const byService = new Map<ServiceType, number>()
  for (const row of rows) {
    byService.set(row.serviceType, (byService.get(row.serviceType) ?? 0) + 1)
  }

  const serviceDistribution = Array.from(byService.entries())
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)

  return {
    todayCount,
    weekCount,
    pendingCount,
    doneCount,
    conversionRate,
    serviceDistribution,
    total: rows.length,
  }
}

function formatRelative(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 60) return `${Math.max(diffMin, 0)}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}
