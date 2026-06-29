import { loadCollection, saveCollection, wait } from './mockStorage'

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

export interface MobilePricingSettings {
  carriers: MobileCarrierRate[]
  planMultipliers: Record<MobilePlanType, number>
  dataExtras: Record<MobileDataUsage, number>
  optionExtras: Record<MobileExtraOption, number>
  updatedAt: string
}

export interface MobileEstimateInput {
  carrier: MobileCarrierId
  planType: MobilePlanType
  dataUsage: MobileDataUsage
  extraOption: MobileExtraOption
}

const STORAGE_KEY = 'lifful_mobile_pricing_settings'

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
  }
}

export async function saveMobilePricingSettings(settings: MobilePricingSettings) {
  await wait(250)
  saveCollection<MobilePricingSettings>(STORAGE_KEY, [
    {
      ...settings,
      updatedAt: new Date().toISOString(),
    },
  ])
  window.dispatchEvent(new Event('lifful-mobile-pricing-changed'))
}

export function resetMobilePricingSettings() {
  saveCollection<MobilePricingSettings>(STORAGE_KEY, [
    {
      ...DEFAULT_MOBILE_PRICING,
      updatedAt: new Date().toISOString(),
    },
  ])
  window.dispatchEvent(new Event('lifful-mobile-pricing-changed'))
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
