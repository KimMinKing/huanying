import type { ServiceAccent } from '../data/services'

/**
 * Tailwind는 JIT에서 동적 클래스명을 안전하게 트리셰이킹하지 못하므로,
 * 접두사 결합이 아닌 전체 클래스 문자열을 매핑으로 둡니다.
 * 새 accent를 추가할 때는 이 매핑에도 항목을 추가해야 UI가 적용됩니다.
 */
export interface AccentTokens {
  iconWrap: string // 아이콘 배경 + 글자
  softBg: string
  softText: string
  border: string
  glow: string // hover 시 ring/glow
  dot: string
}

export const accents: Record<ServiceAccent, AccentTokens> = {
  brand: {
    iconWrap: 'bg-brand-100 text-brand-700',
    softBg: 'bg-brand-50',
    softText: 'text-brand-700',
    border: 'border-brand-100',
    glow: 'group-hover:shadow-brand-600/10',
    dot: 'bg-brand-500',
  },
  mint: {
    iconWrap: 'bg-mint-100 text-mint-700',
    softBg: 'bg-mint-50',
    softText: 'text-mint-700',
    border: 'border-mint-100',
    glow: 'group-hover:shadow-mint-500/10',
    dot: 'bg-mint-500',
  },
  gold: {
    iconWrap: 'bg-gold-100 text-gold-700',
    softBg: 'bg-gold-50',
    softText: 'text-gold-700',
    border: 'border-gold-100',
    glow: 'group-hover:shadow-gold-500/10',
    dot: 'bg-gold-500',
  },
  amber: {
    iconWrap: 'bg-amber-100 text-amber-700',
    softBg: 'bg-amber-50',
    softText: 'text-amber-700',
    border: 'border-amber-100',
    glow: 'group-hover:shadow-amber-500/10',
    dot: 'bg-amber-500',
  },
  violet: {
    iconWrap: 'bg-violet-100 text-violet-700',
    softBg: 'bg-violet-50',
    softText: 'text-violet-700',
    border: 'border-violet-100',
    glow: 'group-hover:shadow-violet-500/10',
    dot: 'bg-violet-500',
  },
  rose: {
    iconWrap: 'bg-rose-100 text-rose-700',
    softBg: 'bg-rose-50',
    softText: 'text-rose-700',
    border: 'border-rose-100',
    glow: 'group-hover:shadow-rose-500/10',
    dot: 'bg-rose-500',
  },
}
