/**
 * 공식 파트너사 데이터.
 * - Footer 상단 로고 띠에 표시
 * - 실제 로고 이미지는 저작권 이슈로 텍스트 shortName으로 표현
 *   (나중에 공식 승인 후 SVG로 교체)
 *
 * ⚠️ 실제 파트너십 계약 전에는 표기가 자칫 과장 광고로 보일 수 있음.
 *    공식 계약된 파트너만 남기고, 그 외에는 "파트너사 모집 중" 등으로 회피.
 */
export interface PartnerLogo {
  id: string
  name: string
  shortName: string // Footer 노출용 짧은 이름
  category: 'internet' | 'mobile' | 'rental' | 'moving' | 'cleaning' | 'insurance' | 'financial' | 'settlement'
  status: 'confirmed' | 'planned' // confirmed: 실계약, planned: 예정
}

export const partnerLogos: PartnerLogo[] = [
  // 인터넷
  { id: 'skb', name: 'SK브로드밴드', shortName: 'SK 브로드밴드', category: 'internet', status: 'planned' },
  { id: 'kt', name: 'KT', shortName: 'KT', category: 'internet', status: 'planned' },
  { id: 'lgu', name: 'LG유플러스', shortName: 'LG U+', category: 'internet', status: 'planned' },

  // 휴대폰
  { id: 'skt', name: 'SK텔레콤', shortName: 'SKT', category: 'mobile', status: 'planned' },
  { id: 'ktm', name: 'KT M 모바일', shortName: 'KT M', category: 'mobile', status: 'planned' },
  { id: 'hello', name: '헬로모바일', shortName: 'HELLO', category: 'mobile', status: 'planned' },

  // 렌탈
  { id: 'cj', name: 'CJ대한통운 렌탈', shortName: 'CJ 렌탈', category: 'rental', status: 'planned' },
  { id: 'coway', name: '웅진코웨이', shortName: 'COWAY', category: 'rental', status: 'planned' },
  { id: 'lotte', name: '롯데렌탈', shortName: 'LOTTE', category: 'rental', status: 'planned' },

  // 정산/금융
  { id: 'kb', name: 'KB국민은행', shortName: 'KB국민', category: 'financial', status: 'planned' },
  { id: 'shinhan', name: '신한은행', shortName: 'SHINHAN', category: 'financial', status: 'planned' },
]

/**
 * 카테고리별 파트너사 매핑 (서비스 상세 페이지에서 사용).
 */
export function getPartnersByCategory(category: PartnerLogo['category']): PartnerLogo[] {
  return partnerLogos.filter((p) => p.category === category)
}
