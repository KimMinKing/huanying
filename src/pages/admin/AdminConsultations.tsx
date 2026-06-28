import { useMemo, useState } from 'react'
import { Search, Filter, MessageSquare, Phone, Mail, Globe } from 'lucide-react'
import {
  mockConsultations,
  type ConsultationStatus,
  type ServiceType,
  getServiceLabel,
  getStatusLabel,
  statusBadgeCls,
} from '../../data/mockConsultations'

/**
 * 상담 신청 목록 페이지.
 * 검색 + 서비스 필터 + 상태 필터 (UI만 — 백엔드 연동 전).
 */
export default function AdminConsultations() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'all'>('all')
  const [serviceFilter, setServiceFilter] = useState<ServiceType | 'all'>('all')

  const filtered = useMemo(() => {
    return mockConsultations.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (serviceFilter !== 'all' && c.serviceType !== serviceFilter) return false
      if (query) {
        const q = query.toLowerCase()
        const hay = `${c.name} ${c.phone} ${c.email ?? ''} ${c.message}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [query, statusFilter, serviceFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">상담 신청</h1>
        <p className="mt-1 text-sm text-ink-soft">
          전체 {mockConsultations.length}건 · 필터 결과 {filtered.length}건
        </p>
      </div>

      {/* 필터 바 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름, 연락처, 내용 검색"
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              icon={Filter}
              value={serviceFilter}
              onChange={(v) => setServiceFilter(v as ServiceType | 'all')}
              options={[
                { value: 'all', label: '전체 서비스' },
                { value: 'internet', label: '인터넷 / IPTV' },
                { value: 'mobile', label: '휴대폰 / 알뜰폰' },
                { value: 'rental', label: '가전 렌탈' },
                { value: 'moving', label: '이사' },
                { value: 'cleaning', label: '입주 청소' },
                { value: 'chinese_settlement', label: '외국인 정착' },
              ]}
            />
            <FilterSelect
              icon={Filter}
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as ConsultationStatus | 'all')}
              options={[
                { value: 'all', label: '전체 상태' },
                { value: 'new', label: '신규' },
                { value: 'contacted', label: '연락 완료' },
                { value: 'in_progress', label: '상담 중' },
                { value: 'done', label: '완료' },
                { value: 'cancelled', label: '취소' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 표 */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-4 py-3">신청자</th>
                <th className="px-4 py-3">서비스</th>
                <th className="px-4 py-3">메시지</th>
                <th className="px-4 py-3">채널</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3 text-right">신청일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-ink-muted">
                    조건에 맞는 상담 신청이 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="align-top hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <p className="font-bold text-ink">{c.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                        <Phone className="h-3 w-3" />
                        {c.phone}
                      </p>
                      {c.email && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                          <Mail className="h-3 w-3" />
                          {c.email}
                        </p>
                      )}
                      {c.assignedStaff && (
                        <p className="mt-1 text-[11px] font-semibold text-brand-700">
                          담당: {c.assignedStaff}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {getServiceLabel(c.serviceType)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="flex max-w-xs items-start gap-1.5 text-ink-soft">
                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-light" />
                        <span className="line-clamp-2 text-xs leading-relaxed">{c.message}</span>
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <ChannelBadge channel={c.preferredChannel} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusBadgeCls[c.status]}`}
                      >
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-ink-muted">
                      {new Date(c.createdAt).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({
  icon: Icon,
  value,
  onChange,
  options,
}: {
  icon: typeof Filter
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="relative inline-flex items-center">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-light" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-semibold text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ChannelBadge({ channel }: { channel?: string }) {
  if (!channel) return <span className="text-ink-light">-</span>
  const map: Record<string, { label: string; cls: string }> = {
    kakao: { label: 'KakaoTalk', cls: 'bg-yellow-50 text-yellow-800 border-yellow-100' },
    wechat: { label: 'WeChat', cls: 'bg-mint-50 text-mint-800 border-mint-100' },
    phone: { label: '전화', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
    email: { label: '이메일', cls: 'bg-sky-50 text-sky-700 border-sky-100' },
  }
  const m = map[channel]
  if (!m) return <span className="text-ink-light">{channel}</span>
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${m.cls}`}
    >
      <Globe className="h-3 w-3" />
      {m.label}
    </span>
  )
}
