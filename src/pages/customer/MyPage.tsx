import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Inbox,
  Loader2,
  LogOut,
  MapPin,
  MessageSquareMore,
  Phone,
  Settings,
  UserCircle2,
  type LucideIcon,
} from 'lucide-react'
import SEO from '../../components/SEO'
import { addSiteNotification } from '../../components/NotificationCenter'
import {
  getMyConsultations,
  getMyReservations,
  getSession,
  logout,
  type MyConsultation,
  type MyReservation,
  type Nationality,
  type PreferredChannel,
  type ResidenceStatus,
} from '../../lib/customerAuth'
import { cancelServiceRequestByCustomer } from '../../lib/serviceRequests'

type TabId = 'overview' | 'reservations' | 'consultations' | 'account'

const menuItems: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: 'overview', label: '마이페이지 홈', icon: Inbox },
  { id: 'reservations', label: '내 예약', icon: CalendarClock },
  { id: 'consultations', label: '상담 내역', icon: MessageSquareMore },
  { id: 'account', label: '계정 정보', icon: Settings },
]

const nationalityLabel: Record<Nationality, string> = {
  kr: '한국',
  cn: '중국',
  other: '기타',
}

const residenceStatusLabel: Record<ResidenceStatus, string> = {
  citizen: '내국인',
  long_term: '장기 체류',
  short_term: '단기 체류',
  tourist: '관광',
}

const preferredChannelLabel: Record<PreferredChannel, string> = {
  kakao: '카카오톡',
  wechat: 'WeChat',
  phone: '전화',
  email: '이메일',
}

const consultationStatusClass: Record<MyConsultation['status'], string> = {
  new: 'border-brand-200 bg-brand-50 text-brand-700',
  contacted: 'border-amber-200 bg-amber-50 text-amber-700',
  in_progress: 'border-sky-200 bg-sky-50 text-sky-700',
  done: 'border-mint-200 bg-mint-50 text-mint-700',
  cancelled: 'border-slate-200 bg-slate-100 text-slate-500',
}

const reservationStatusClass: Record<MyReservation['status'], string> = {
  confirmed: 'border-mint-200 bg-mint-50 text-mint-700',
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  completed: 'border-sky-200 bg-sky-50 text-sky-700',
  reschedule_needed: 'border-rose-200 bg-rose-50 text-rose-700',
}

export default function MyPage() {
  const navigate = useNavigate()
  const user = getSession()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [consultations, setConsultations] = useState<MyConsultation[]>([])
  const [reservations, setReservations] = useState<MyReservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    Promise.all([getMyConsultations(), getMyReservations()])
      .then(([consultationItems, reservationItems]) => {
        if (!mounted) return
        setConsultations(consultationItems)
        setReservations(reservationItems)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const refresh = () => {
      getMyConsultations().then(setConsultations)
    }
    window.addEventListener('lifful-service-requests-changed', refresh)
    return () => window.removeEventListener('lifful-service-requests-changed', refresh)
  }, [])

  const ongoingConsultations = useMemo(
    () => consultations.filter((item) => ['new', 'contacted', 'in_progress'].includes(item.status)),
    [consultations],
  )
  const completedConsultations = useMemo(
    () => consultations.filter((item) => item.status === 'done'),
    [consultations],
  )
  const upcomingReservations = useMemo(
    () =>
      reservations.filter((item) =>
        ['confirmed', 'pending', 'reschedule_needed'].includes(item.status),
      ),
    [reservations],
  )

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <SEO title="마이페이지" path="/my" noIndex />
      <section className="bg-slate-50 py-10 sm:py-12">
        <div className="container-page">
          <div className="mb-6">
            <p className="text-sm font-semibold text-brand-700">내 계정</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              마이페이지
            </h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="h-fit rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {user.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-muted">{user.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                {menuItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={[
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition',
                      activeTab === id
                        ? 'bg-slate-900 text-white'
                        : 'text-ink-soft hover:bg-slate-100 hover:text-ink',
                    ].join(' ')}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>

              <div className="border-t border-slate-200 p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ink-soft transition hover:bg-slate-100 hover:text-ink"
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </button>
              </div>
            </aside>

            <main className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
              <PageHeader activeTab={activeTab} />

              <div className="p-5 sm:p-6">
                {loading ? (
                  <LoadingState />
                ) : (
                  <>
                    {activeTab === 'overview' && (
                      <OverviewTab
                        consultations={consultations}
                        reservations={reservations}
                        ongoingCount={ongoingConsultations.length}
                        completedCount={completedConsultations.length}
                        upcomingCount={upcomingReservations.length}
                        onMove={setActiveTab}
                      />
                    )}

                    {activeTab === 'reservations' && (
                      <ReservationsTab reservations={reservations} />
                    )}

                    {activeTab === 'consultations' && (
                      <ConsultationsTab consultations={consultations} />
                    )}

                    {activeTab === 'account' && (
                      <AccountTab
                        user={{
                          name: user.name,
                          email: user.email,
                          phone: user.phone,
                          nationality: nationalityLabel[user.nationality],
                          residenceStatus: residenceStatusLabel[user.residenceStatus],
                          preferredLanguage: getPreferredLanguageLabel(user.preferredLanguage),
                          preferredChannel: preferredChannelLabel[user.preferredChannel],
                          visaType: user.visaType ?? '해당 없음',
                          marketingConsent: user.marketingConsent ? '동의' : '미동의',
                          createdAt: new Date(user.createdAt).toLocaleDateString('ko-KR'),
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  )
}

function PageHeader({ activeTab }: { activeTab: TabId }) {
  const titleMap: Record<TabId, string> = {
    overview: '마이페이지 홈',
    reservations: '내 예약',
    consultations: '상담 내역',
    account: '계정 정보',
  }

  const descriptionMap: Record<TabId, string> = {
    overview: '예약, 상담, 계정 정보를 한 곳에서 확인합니다.',
    reservations: '설치 일정, 전화 상담, 온라인 안내 예약을 확인합니다.',
    consultations: '신청한 상담의 진행 상태와 담당자를 확인합니다.',
    account: '연락처, 체류 정보, 선호 상담 채널을 확인합니다.',
  }

  return (
    <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
      <h2 className="text-xl font-extrabold tracking-tight text-ink">{titleMap[activeTab]}</h2>
      <p className="mt-1 text-sm text-ink-muted">{descriptionMap[activeTab]}</p>
    </div>
  )
}

function OverviewTab({
  consultations,
  reservations,
  ongoingCount,
  completedCount,
  upcomingCount,
  onMove,
}: {
  consultations: MyConsultation[]
  reservations: MyReservation[]
  ongoingCount: number
  completedCount: number
  upcomingCount: number
  onMove: (tab: TabId) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Clock3} label="진행 중 상담" value={ongoingCount} />
        <SummaryCard icon={CalendarClock} label="다가오는 예약" value={upcomingCount} />
        <SummaryCard icon={CheckCircle2} label="완료된 상담" value={completedCount} />
        <SummaryCard icon={Inbox} label="전체 기록" value={consultations.length + reservations.length} />
      </div>

      <SectionBlock
        title="다가오는 예약"
        action={<button type="button" onClick={() => onMove('reservations')} className="link-button">전체 보기</button>}
      >
        {reservations.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {reservations.slice(0, 2).map((reservation) => (
              <ReservationRow key={reservation.id} reservation={reservation} />
            ))}
          </div>
        ) : (
          <EmptyState title="예약된 일정이 없습니다." />
        )}
      </SectionBlock>

      <SectionBlock
        title="최근 상담"
        action={<button type="button" onClick={() => onMove('consultations')} className="link-button">전체 보기</button>}
      >
        {consultations.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {consultations.slice(0, 2).map((consultation) => (
              <ConsultationRow key={consultation.id} consultation={consultation} />
            ))}
          </div>
        ) : (
          <EmptyState title="상담 내역이 없습니다." />
        )}
      </SectionBlock>

      <div className="flex flex-wrap gap-2">
        <Link to="/#consult" className="btn-primary text-sm">
          새 상담 신청
        </Link>
        <Link to="/services/mobile" className="btn-secondary text-sm">
          휴대폰 요금 보기
        </Link>
      </div>
    </div>
  )
}

function ReservationsTab({ reservations }: { reservations: MyReservation[] }) {
  if (reservations.length === 0) {
    return <EmptyState title="예약된 일정이 없습니다." />
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="divide-y divide-slate-200">
        {reservations.map((reservation) => (
          <ReservationRow key={reservation.id} reservation={reservation} detailed />
        ))}
      </div>
    </div>
  )
}

function ConsultationsTab({ consultations }: { consultations: MyConsultation[] }) {
  if (consultations.length === 0) {
    return <EmptyState title="상담 요청 내역이 없습니다." />
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="divide-y divide-slate-200">
        {consultations.map((consultation) => (
          <ConsultationRow key={consultation.id} consultation={consultation} detailed />
        ))}
      </div>
    </div>
  )
}

function AccountTab({
  user,
}: {
  user: Record<
    | 'name'
    | 'email'
    | 'phone'
    | 'nationality'
    | 'residenceStatus'
    | 'preferredLanguage'
    | 'preferredChannel'
    | 'visaType'
    | 'marketingConsent'
    | 'createdAt',
    string
  >
}) {
  const rows = [
    ['이름', user.name],
    ['이메일', user.email],
    ['전화번호', user.phone],
    ['국적', user.nationality],
    ['체류 상태', user.residenceStatus],
    ['선호 언어', user.preferredLanguage],
    ['선호 연락 채널', user.preferredChannel],
    ['비자 종류', user.visaType],
    ['마케팅 수신', user.marketingConsent],
    ['가입일', user.createdAt],
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <dl className="divide-y divide-slate-200">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-4 py-4 sm:grid-cols-[160px_minmax(0,1fr)]">
            <dt className="text-sm font-semibold text-ink-muted">{label}</dt>
            <dd className="break-words text-sm font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function SectionBlock({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function SummaryCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-muted">{label}</p>
        <Icon className="h-4 w-4 text-ink-light" />
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{value}</p>
    </div>
  )
}

function ReservationRow({
  reservation,
  detailed = false,
}: {
  reservation: MyReservation
  detailed?: boolean
}) {
  return (
    <article className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-ink">{reservation.serviceName}</h4>
            <StatusBadge label={reservation.statusLabel} className={reservationStatusClass[reservation.status]} />
          </div>
          <p className="mt-1 text-sm text-ink-muted">{formatDateTime(reservation.scheduleAt)}</p>
          {detailed ? <p className="mt-2 text-sm leading-relaxed text-ink-soft">{reservation.note}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 text-xs text-ink-muted sm:justify-end">
          <InlineInfo icon={Phone} value={reservation.visitTypeLabel} />
          {reservation.assignedStaff ? <InlineInfo icon={UserCircle2} value={reservation.assignedStaff} /> : null}
        </div>
      </div>
      {detailed && reservation.address ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-ink-soft">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-light" />
          <span>{reservation.address}</span>
        </div>
      ) : null}
    </article>
  )
}

function ConsultationRow({
  consultation,
  detailed = false,
}: {
  consultation: MyConsultation
  detailed?: boolean
}) {
  const handleCancel = async () => {
    if (!consultation.canCancel) return
    await cancelServiceRequestByCustomer(consultation.id)
    addSiteNotification('신청 취소', `${consultation.serviceName} 신청이 취소되었습니다.`)
  }

  return (
    <article className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-ink">{consultation.serviceName}</h4>
            <StatusBadge
              label={consultation.statusLabel}
              className={consultationStatusClass[consultation.status]}
            />
          </div>
          <p className="mt-1 text-sm text-ink-muted">요청일 {formatDateTime(consultation.createdAt)}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{consultation.message}</p>
        </div>
        {consultation.assignedStaff ? (
          <div className="shrink-0 text-xs text-ink-muted">
            <InlineInfo icon={UserCircle2} value={`담당자 ${consultation.assignedStaff}`} />
          </div>
        ) : null}
      </div>
      {detailed ? (
        <div className="mt-3 space-y-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-ink-muted">
            현재 상태가 변경되면 알림 센터와 이 페이지에서 확인할 수 있습니다.
          </div>
          {consultation.timeline?.length ? (
            <div className="rounded-lg border border-slate-200 px-3 py-3">
              <p className="text-xs font-bold text-ink-muted">진행 이력</p>
              <ol className="mt-2 space-y-2">
                {consultation.timeline
                  .slice()
                  .reverse()
                  .map((item) => (
                    <li key={item.id} className="text-xs">
                      <p className="font-bold text-ink">{item.label}</p>
                      <p className="mt-0.5 text-ink-muted">{item.description}</p>
                      <p className="mt-0.5 text-ink-light">
                        {new Date(item.at).toLocaleString('ko-KR')}
                      </p>
                    </li>
                  ))}
              </ol>
            </div>
          ) : null}
          {consultation.canCancel ? (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-ink-soft transition hover:border-brand-200 hover:text-brand-700"
            >
              신청 취소
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

function StatusBadge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${className}`}>
      {label}
    </span>
  )
}

function InlineInfo({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="h-3.5 w-3.5" />
      {value}
    </span>
  )
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="px-4 py-12 text-center">
      <Inbox className="mx-auto h-8 w-8 text-ink-light" />
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">새로운 내역이 생기면 이곳에 표시됩니다.</p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-ink-muted">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      마이페이지 정보를 불러오는 중입니다.
    </div>
  )
}

function getPreferredLanguageLabel(language: 'ko' | 'zh' | 'en') {
  if (language === 'ko') return '한국어'
  if (language === 'zh') return '중국어'
  return 'English'
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
