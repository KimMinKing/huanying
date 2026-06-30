import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Filter, Globe, Mail, MessageSquare, Phone, Search, UserCircle2, X } from 'lucide-react'
import { addSiteNotification } from '../../components/NotificationCenter'
import {
  getServiceLabel,
  getStatusLabel,
  mockConsultations,
  statusBadgeCls,
  type ConsultationStatus,
  type MockConsultation,
  type ServiceType,
} from '../../data/mockConsultations'
import { getSession } from '../../lib/adminAuth'
import {
  addServiceRequestMemo,
  assignServiceRequest,
  getMobileRequestDetailRows,
  listServiceRequests,
  updateServiceRequestStatus,
  type ServiceRequest,
  type ServiceRequestStatus,
} from '../../lib/serviceRequests'

type AdminConsultationRow = MockConsultation & {
  source: 'mock' | 'request'
  request?: ServiceRequest
}

const serviceOptions: Array<{ value: ServiceType | 'all'; label: string }> = [
  { value: 'all', label: '전체 서비스' },
  { value: 'internet', label: '인터넷 / IPTV' },
  { value: 'mobile', label: '휴대폰 / 알뜰폰' },
  { value: 'rental', label: '가전 렌탈' },
  { value: 'moving', label: '이사' },
  { value: 'cleaning', label: '입주 청소' },
  { value: 'chinese_settlement', label: '외국인 정착' },
]

const statusOptions: Array<{ value: ConsultationStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체 상태' },
  { value: 'new', label: '신규' },
  { value: 'contacted', label: '연락 완료' },
  { value: 'in_progress', label: '상담 중' },
  { value: 'done', label: '완료' },
  { value: 'cancelled', label: '취소' },
]

export default function AdminConsultations() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'all'>('all')
  const [serviceFilter, setServiceFilter] = useState<ServiceType | 'all'>('all')
  const [requestsVersion, setRequestsVersion] = useState(0)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)

  useEffect(() => {
    const refresh = () => setRequestsVersion((value) => value + 1)
    window.addEventListener('lifful-service-requests-changed', refresh)
    return () => window.removeEventListener('lifful-service-requests-changed', refresh)
  }, [])

  const rows = useMemo(() => {
    void requestsVersion
    const serviceRequestRows: AdminConsultationRow[] = listServiceRequests().map((request) => ({
      id: request.id,
      source: 'request',
      request,
      name: request.userName,
      phone: request.userPhone,
      email: request.userEmail,
      serviceType: request.serviceType,
      status: request.status,
      message: request.message,
      assignedStaff: request.assignedStaff,
      preferredChannel: request.preferredChannel,
      createdAt: request.createdAt,
    }))

    const mockRows: AdminConsultationRow[] = mockConsultations.map((item) => ({
      ...item,
      source: 'mock',
    }))

    return [...serviceRequestRows, ...mockRows].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [requestsVersion])

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (serviceFilter !== 'all' && row.serviceType !== serviceFilter) return false
      if (query) {
        const q = query.toLowerCase()
        const hay = `${row.name} ${row.phone} ${row.email ?? ''} ${row.message}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [query, rows, serviceFilter, statusFilter])

  const selectedRequest = selectedRequestId
    ? listServiceRequests().find((request) => request.id === selectedRequestId) ?? null
    : null

  const handleStatusChange = async (request: ServiceRequest, status: ConsultationStatus) => {
    await updateServiceRequestStatus(request.id, status as ServiceRequestStatus, getSession()?.name)
    addSiteNotification(
      '상담 상태 변경',
      `${request.serviceName} 상태가 ${statusOptions.find((item) => item.value === status)?.label}(으)로 변경되었습니다.`,
    )
    setRequestsVersion((value) => value + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">상담 요청</h1>
        <p className="mt-1 text-sm text-ink-soft">
          전체 {rows.length}건 · 필터 결과 {filtered.length}건
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="이름, 연락처, 내용 검색"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              value={serviceFilter}
              onChange={(value) => setServiceFilter(value as ServiceType | 'all')}
              options={serviceOptions}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as ConsultationStatus | 'all')}
              options={statusOptions}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-4 py-3">신청자</th>
                <th className="px-4 py-3">서비스</th>
                <th className="px-4 py-3">내용</th>
                <th className="px-4 py-3">채널</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3 text-right">신청일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr
                  key={`${row.source}-${row.id}`}
                  className="cursor-pointer align-top hover:bg-slate-50/60"
                  onClick={() => {
                    if (row.request) setSelectedRequestId(row.request.id)
                  }}
                >
                  <td className="px-4 py-3">
                    <p className="font-bold text-ink">{row.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                      <Phone className="h-3 w-3" />
                      {row.phone}
                    </p>
                    {row.email ? (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                        <Mail className="h-3 w-3" />
                        {row.email}
                      </p>
                    ) : null}
                    {row.source === 'request' ? (
                      <p className="mt-1 text-[11px] font-bold text-brand-700">고객 신청</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{getServiceLabel(row.serviceType)}</td>
                  <td className="px-4 py-3">
                    <p className="flex max-w-sm items-start gap-1.5 text-ink-soft">
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-light" />
                      <span className="line-clamp-3 text-xs leading-relaxed">{row.message}</span>
                    </p>
                    {row.assignedStaff ? (
                      <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
                        <UserCircle2 className="h-3 w-3" />
                        담당 {row.assignedStaff}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <ChannelBadge channel={row.preferredChannel} />
                  </td>
                  <td className="px-4 py-3">
                    {row.request ? (
                      <select
                        value={row.status}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) =>
                          handleStatusChange(row.request!, event.target.value as ConsultationStatus)
                        }
                        className={`rounded-full border px-2 py-1 text-[11px] font-bold ${statusBadgeCls[row.status]}`}
                      >
                        {statusOptions
                          .filter((option) => option.value !== 'all')
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusBadgeCls[row.status]}`}
                      >
                        {getStatusLabel(row.status)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-ink-muted">
                    {new Date(row.createdAt).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-ink-muted">
                    조건에 맞는 상담 요청이 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest ? (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequestId(null)}
          onChanged={() => setRequestsVersion((value) => value + 1)}
        />
      ) : null}
    </div>
  )
}

function RequestDetailModal({
  request,
  onClose,
  onChanged,
}: {
  request: ServiceRequest
  onClose: () => void
  onChanged: () => void
}) {
  const admin = getSession()
  const [staffName, setStaffName] = useState(request.assignedStaff ?? '')
  const [memo, setMemo] = useState('')

  const saveAssignee = async () => {
    await assignServiceRequest(request.id, staffName, admin?.name)
    onChanged()
  }

  const addMemo = async (event: FormEvent) => {
    event.preventDefault()
    await addServiceRequestMemo(request.id, admin?.name ?? '관리자', memo)
    setMemo('')
    onChanged()
  }

  const fresh = listServiceRequests().find((item) => item.id === request.id) ?? request

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 px-4 py-8">
      <div className="max-h-full w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-cardHover">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">신청 상세</p>
            <h2 className="mt-1 text-xl font-extrabold text-ink">{fresh.serviceName}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              {fresh.userName} · {fresh.userPhone} · {fresh.userEmail}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 p-2">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid max-h-[75vh] gap-6 overflow-y-auto p-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-ink">신청 조건</h3>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {getMobileRequestDetailRows(fresh.details).map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-slate-50 px-3 py-2">
                    <dt className="text-xs font-bold text-ink-muted">{label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-ink">진행 이력</h3>
              <ol className="mt-4 space-y-3">
                {fresh.timeline
                  .slice()
                  .reverse()
                  .map((item) => (
                    <li key={item.id} className="rounded-lg bg-slate-50 px-3 py-3">
                      <p className="text-sm font-bold text-ink">{item.label}</p>
                      <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {new Date(item.at).toLocaleString('ko-KR')}
                      </p>
                    </li>
                  ))}
              </ol>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-ink">담당자 배정</h3>
              <div className="mt-3 flex gap-2">
                <input
                  value={staffName}
                  onChange={(event) => setStaffName(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="담당자명"
                />
                <button type="button" onClick={saveAssignee} className="btn-secondary px-4 py-2 text-sm">
                  저장
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-ink">관리자 메모</h3>
              <form onSubmit={addMemo} className="mt-3 space-y-2">
                <textarea
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                  className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="내부 메모를 입력하세요."
                />
                <button type="submit" className="btn-primary w-full py-2 text-sm">
                  메모 추가
                </button>
              </form>
              <div className="mt-4 space-y-2">
                {fresh.memos.length === 0 ? (
                  <p className="text-sm text-ink-muted">메모가 없습니다.</p>
                ) : (
                  fresh.memos.map((item) => (
                    <div key={item.id} className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-sm text-ink">{item.body}</p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {item.author} · {new Date(item.createdAt).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="relative inline-flex items-center">
      <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-light" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-semibold text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
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
  const item = map[channel]

  if (!item) return <span className="text-ink-light">{channel}</span>

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${item.cls}`}
    >
      <Globe className="h-3 w-3" />
      {item.label}
    </span>
  )
}
