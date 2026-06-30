import { loadCollection, saveCollection, wait } from './mockStorage'
import type { AdminUser } from './adminAuth'

export type MobileCarrierId = 'skt' | 'kt' | 'lgu'
export type MobilePlanType = 'budget' | 'major'
export type MobileDataUsage = 'light' | 'standard' | 'heavy'
export type MobileExtraOption = 'none' | 'family' | 'esim'

export interface MobileCarrierRate {
  id: MobileCarrierId
  name: string
  basePrice: number
  isActive: boolean
}

export interface MobilePlanCard {
  id: string
  carrier: MobileCarrierId
  name: string
  monthlyPrice: number
  dataLabel: string
  callTextLabel: string
  promotionText: string
  isRecommended: boolean
  isVisible: boolean
  sortOrder: number
}

export interface MobilePricingSettings {
  carriers: MobileCarrierRate[]
  planMultipliers: Record<MobilePlanType, number>
  dataExtras: Record<MobileDataUsage, number>
  optionExtras: Record<MobileExtraOption, number>
  planCards: MobilePlanCard[]
  updatedAt: string
}

export interface MobilePricingAuditLog {
  id: string
  actorName: string
  actorEmail: string
  action: string
  createdAt: string
}

export interface MobileEstimateInput {
  carrier: MobileCarrierId
  planType: MobilePlanType
  dataUsage: MobileDataUsage
  extraOption: MobileExtraOption
}

const STORAGE_KEY = 'lifful_mobile_pricing_settings'
const AUDIT_STORAGE_KEY = 'lifful_mobile_pricing_audit_logs'

export const DEFAULT_MOBILE_PRICING: MobilePricingSettings = {
  carriers: [
    { id: 'skt', name: 'SKT', basePrice: 34000, isActive: true },
    { id: 'kt', name: 'KT', basePrice: 32000, isActive: true },
    { id: 'lgu', name: 'LG U+', basePrice: 33000, isActive: true },
  ],
  planMultipliers: {
    budget: 1,
    major: 1.9,
  },
  dataExtras: {
    light: 0,
    standard: 7000,
    heavy: 18000,
  },
  optionExtras: {
    none: 0,
    family: -5000,
    esim: 3000,
  },
  planCards: [
    {
      id: 'plan-skt-5g-standard',
      carrier: 'skt',
      name: '5G 스탠다드',
      monthlyPrice: 55000,
      dataLabel: '월 110GB',
      callTextLabel: '통화/문자 기본 제공',
      promotionText: '가족 결합 상담 가능',
      isRecommended: true,
      isVisible: true,
      sortOrder: 1,
    },
    {
      id: 'plan-kt-budget-data',
      carrier: 'kt',
      name: '알뜰 데이터 15GB',
      monthlyPrice: 27500,
      dataLabel: '월 15GB',
      callTextLabel: '통화 100분',
      promotionText: '가성비 추천',
      isRecommended: true,
      isVisible: true,
      sortOrder: 2,
    },
    {
      id: 'plan-lgu-esim',
      carrier: 'lgu',
      name: 'eSIM 라이트',
      monthlyPrice: 19800,
      dataLabel: '월 7GB',
      callTextLabel: '통화/문자 기본',
      promotionText: '외국인 단기 체류 상담 가능',
      isRecommended: false,
      isVisible: true,
      sortOrder: 3,
    },
  ],
  updatedAt: new Date().toISOString(),
}

export function getMobilePricingSettings(): MobilePricingSettings {
  const [settings] = loadCollection<MobilePricingSettings>(STORAGE_KEY, [DEFAULT_MOBILE_PRICING])
  return {
    ...DEFAULT_MOBILE_PRICING,
    ...settings,
    carriers: settings?.carriers?.length ? settings.carriers : DEFAULT_MOBILE_PRICING.carriers,
    planMultipliers: {
      ...DEFAULT_MOBILE_PRICING.planMultipliers,
      ...settings?.planMultipliers,
    },
    dataExtras: {
      ...DEFAULT_MOBILE_PRICING.dataExtras,
      ...settings?.dataExtras,
    },
    optionExtras: {
      ...DEFAULT_MOBILE_PRICING.optionExtras,
      ...settings?.optionExtras,
    },
    planCards: settings?.planCards?.length ? settings.planCards : DEFAULT_MOBILE_PRICING.planCards,
  }
}

export async function saveMobilePricingSettings(settings: MobilePricingSettings, actor?: AdminUser | null) {
  await wait(250)
  saveSettings(settings)
  addMobilePricingAuditLog(actor, '휴대폰 요금 기준을 저장했습니다.')
}

export function resetMobilePricingSettings(actor?: AdminUser | null) {
  saveSettings(DEFAULT_MOBILE_PRICING)
  addMobilePricingAuditLog(actor, '휴대폰 요금 기준을 기본값으로 복원했습니다.')
}

export function listMobilePricingAuditLogs(): MobilePricingAuditLog[] {
  return loadCollection<MobilePricingAuditLog>(AUDIT_STORAGE_KEY, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function estimateMobilePrice(settings: MobilePricingSettings, input: MobileEstimateInput) {
  const carrier = settings.carriers.find((item) => item.id === input.carrier)
  const basePrice = carrier?.basePrice ?? DEFAULT_MOBILE_PRICING.carriers[0].basePrice
  const monthly = Math.max(
    9900,
    Math.round(
      (basePrice * settings.planMultipliers[input.planType] +
        settings.dataExtras[input.dataUsage] +
        settings.optionExtras[input.extraOption]) /
        100,
    ) * 100,
  )

  return {
    monthly,
    carrierName: carrier?.name ?? input.carrier.toUpperCase(),
  }
}

function saveSettings(settings: MobilePricingSettings) {
  saveCollection<MobilePricingSettings>(STORAGE_KEY, [
    {
      ...settings,
      updatedAt: new Date().toISOString(),
    },
  ])
  window.dispatchEvent(new Event('lifful-mobile-pricing-changed'))
}

function addMobilePricingAuditLog(actor: AdminUser | null | undefined, action: string) {
  const log: MobilePricingAuditLog = {
    id: `audit-${Date.now()}`,
    actorName: actor?.name ?? '알 수 없음',
    actorEmail: actor?.email ?? '-',
    action,
    createdAt: new Date().toISOString(),
  }
  saveCollection(AUDIT_STORAGE_KEY, [log, ...listMobilePricingAuditLogs()])
}
