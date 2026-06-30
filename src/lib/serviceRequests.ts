import { loadCollection, saveCollection, wait } from './mockStorage'
import type { CustomerUser } from './customerAuth'
import type {
  MobileCarrierId,
  MobileDataUsage,
  MobileExtraOption,
  MobilePlanType,
} from './mobilePlans'

export type ServiceRequestStatus = 'new' | 'contacted' | 'in_progress' | 'done' | 'cancelled'
export type ServiceRequestType = 'mobile'

export interface MobileRequestDetails {
  carrier: MobileCarrierId
  carrierName: string
  planType: MobilePlanType
  dataUsage: MobileDataUsage
  extraOption: MobileExtraOption
  estimatedMonthlyPrice: number
}

export interface RequestTimelineItem {
  id: string
  at: string
  label: string
  description: string
}

export interface RequestMemo {
  id: string
  author: string
  body: string
  createdAt: string
}

export interface ServiceRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  serviceType: ServiceRequestType
  serviceName: string
  status: ServiceRequestStatus
  message: string
  preferredChannel?: 'kakao' | 'wechat' | 'phone' | 'email'
  assignedStaff?: string
  createdAt: string
  updatedAt: string
  details: MobileRequestDetails
  timeline: RequestTimelineItem[]
  memos: RequestMemo[]
}

export interface CreateMobileRequestInput {
  user: CustomerUser
  details: MobileRequestDetails
}

const STORAGE_KEY = 'lifful_service_requests'

const statusLabels: Record<ServiceRequestStatus, string> = {
  new: '신규',
  contacted: '연락 완료',
  in_progress: '상담 중',
  done: '완료',
  cancelled: '취소',
}

const planTypeLabels: Record<MobilePlanType, string> = {
  budget: '알뜰하게',
  major: '정식 통신사 중심',
}

const dataUsageLabels: Record<MobileDataUsage, string> = {
  light: '가볍게',
  standard: '보통',
  heavy: '많이 씀',
}

const extraOptionLabels: Record<MobileExtraOption, string> = {
  none: '없음',
  family: '가족 결합 가능',
  esim: 'eSIM 필요',
}

export function getServiceRequestStatusLabel(status: ServiceRequestStatus) {
  return statusLabels[status]
}

export function getMobileRequestSummary(details: MobileRequestDetails) {
  return [
    `통신사 ${details.carrierName}`,
    `요금 성향 ${planTypeLabels[details.planType]}`,
    `데이터 ${dataUsageLabels[details.dataUsage]}`,
    `추가 조건 ${extraOptionLabels[details.extraOption]}`,
    `예상 월 ${details.estimatedMonthlyPrice.toLocaleString()}원대`,
  ].join(' · ')
}

export function getMobileRequestDetailRows(details: MobileRequestDetails) {
  return [
    ['통신사', details.carrierName],
    ['요금 성향', planTypeLabels[details.planType]],
    ['데이터 사용량', dataUsageLabels[details.dataUsage]],
    ['추가 조건', extraOptionLabels[details.extraOption]],
    ['예상 월 요금', `${details.estimatedMonthlyPrice.toLocaleString()}원대`],
  ] as const
}

export function listServiceRequests(): ServiceRequest[] {
  return loadCollection<ServiceRequest>(STORAGE_KEY, []).map(normalizeRequest).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getServiceRequest(id: string): ServiceRequest | null {
  return listServiceRequests().find((request) => request.id === id) ?? null
}

export function listServiceRequestsByUser(userId: string): ServiceRequest[] {
  return listServiceRequests().filter((request) => request.userId === userId)
}

export async function createMobileServiceRequest(input: CreateMobileRequestInput) {
  await wait(300)

  const now = new Date().toISOString()
  const request: ServiceRequest = {
    id: `sr-${Date.now()}`,
    userId: input.user.id,
    userName: input.user.name,
    userEmail: input.user.email,
    userPhone: input.user.phone,
    serviceType: 'mobile',
    serviceName: '휴대폰 요금 신청',
    status: 'new',
    message: getMobileRequestSummary(input.details),
    preferredChannel: input.user.preferredChannel,
    createdAt: now,
    updatedAt: now,
    details: input.details,
    timeline: [
      {
        id: `tl-${Date.now()}`,
        at: now,
        label: '신청 접수',
        description: '고객이 휴대폰 요금 신청을 접수했습니다.',
      },
    ],
    memos: [],
  }

  saveRequests([request, ...listServiceRequests()])
  return request
}

export async function updateServiceRequestStatus(
  id: string,
  status: ServiceRequestStatus,
  actor = '관리자',
) {
  await wait(200)

  const requests = listServiceRequests()
  const now = new Date().toISOString()
  const nextRequests = requests.map((request) => {
    if (request.id !== id) return request
    if (request.status === status) return request

    return {
      ...request,
      status,
      updatedAt: now,
      timeline: [
        ...request.timeline,
        {
          id: `tl-${Date.now()}`,
          at: now,
          label: `상태 변경: ${statusLabels[status]}`,
          description: `${actor}가 신청 상태를 ${statusLabels[status]}(으)로 변경했습니다.`,
        },
      ],
    }
  })

  saveRequests(nextRequests)
}

export async function assignServiceRequest(id: string, staffName: string, actor = '관리자') {
  await wait(200)

  const now = new Date().toISOString()
  const nextRequests = listServiceRequests().map((request) =>
    request.id === id
      ? {
          ...request,
          assignedStaff: staffName || undefined,
          updatedAt: now,
          timeline: [
            ...request.timeline,
            {
              id: `tl-${Date.now()}`,
              at: now,
              label: '담당자 배정',
              description: staffName
                ? `${actor}가 담당자를 ${staffName}(으)로 배정했습니다.`
                : `${actor}가 담당자 배정을 해제했습니다.`,
            },
          ],
        }
      : request,
  )

  saveRequests(nextRequests)
}

export async function addServiceRequestMemo(id: string, author: string, body: string) {
  await wait(200)
  const trimmed = body.trim()
  if (!trimmed) return

  const now = new Date().toISOString()
  const nextRequests = listServiceRequests().map((request) =>
    request.id === id
      ? {
          ...request,
          updatedAt: now,
          memos: [
            {
              id: `memo-${Date.now()}`,
              author,
              body: trimmed,
              createdAt: now,
            },
            ...request.memos,
          ],
          timeline: [
            ...request.timeline,
            {
              id: `tl-${Date.now()}`,
              at: now,
              label: '관리자 메모 추가',
              description: `${author}가 내부 메모를 남겼습니다.`,
            },
          ],
        }
      : request,
  )

  saveRequests(nextRequests)
}

export async function cancelServiceRequestByCustomer(id: string) {
  await updateServiceRequestStatus(id, 'cancelled', '고객')
}

function saveRequests(requests: ServiceRequest[]) {
  saveCollection(STORAGE_KEY, requests)
  dispatchServiceRequestChange()
}

function normalizeRequest(request: ServiceRequest): ServiceRequest {
  return {
    ...request,
    timeline: request.timeline ?? [
      {
        id: `${request.id}-created`,
        at: request.createdAt,
        label: '신청 접수',
        description: '고객 신청이 접수되었습니다.',
      },
    ],
    memos: request.memos ?? [],
  }
}

function dispatchServiceRequestChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('lifful-service-requests-changed'))
}
