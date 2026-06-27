import type { LucideIcon } from 'lucide-react'
import {
  Wifi,
  Smartphone,
  Refrigerator,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

/**
 * 서비스 카테고리 데이터
 * - icon: lucide 아이콘 컴포넌트 (UI에서 렌더링)
 * - accent: 카드 포인트 컬러 (tailwind 클래스 접두사 매핑은 UI에서 처리)
 * - tag: 우측 상단 배지 (없으면 표시 안 함)
 *
 * 나중에 "외국인 전용 요금제" 같은 카테고리를 추가할 때도
 * 이 배열에 항목만 추가하면 자동으로 UI에 반영됩니다.
 */
export type ServiceAccent = 'brand' | 'mint' | 'amber' | 'violet' | 'rose' | 'cyan'

export interface ServiceItem {
  id: string
  title: string
  summary: string
  description: string
  icon: LucideIcon
  accent: ServiceAccent
  tag?: string
  features: string[]
}

export const services: ServiceItem[] = [
  {
    id: 'internet',
    title: '인터넷 / IPTV',
    summary: '가장 빠른 결정',
    description:
      'SK, KT, LG 유플러스 요금제와 결합 할인을 한눈에 비교하고, 설치비 면제 조건까지 확인해 드려요.',
    icon: Wifi,
    accent: 'brand',
    tag: '가장 인기',
    features: ['1Gbps ~ 10Gbps 비교', 'IPTV 결합 할인', '설치비 면제 조건'],
  },
  {
    id: 'mobile',
    title: '휴대폰 / 알뜰폰',
    summary: '월정액 30% 절약',
    description:
      '통신사 요금제와 알뜰폰 요금제를 데이터 사용량 기준으로 비교. 가족 결합과 약정 조건까지 고려해 드려요.',
    icon: Smartphone,
    accent: 'cyan',
    tag: '절약 BEST',
    features: ['무제한 / 쉐어링 비교', '알뜰폰 절약 시뮬레이션', '가족 결합 할인'],
  },
  {
    id: 'rental',
    title: '가전 렌탈',
    summary: '꼭 필요한 것만',
    description:
      '정수기, 비데, 공기청정기, 안마의자 등. 약정 기간별 총비용과 사은품까지 비교해 과소비를 막아요.',
    icon: Refrigerator,
    accent: 'mint',
    features: ['약정별 총비용 비교', '무상 AS 조건 확인', '중도해지 위약금 안내'],
  },
  {
    id: 'move',
    title: '이사',
    summary: '견적 투명하게',
    description:
      '일반 / 포장이사 / 입주이사 견적을 한 번에 받아보세요. 부피 기준 견적과 옵션 비용까지 투명하게 안내합니다.',
    icon: Truck,
    accent: 'amber',
    features: ['견적 3곳 비교', '에어컨/벽시 옵션 안내', '사다리차 비용 포함'],
  },
  {
    id: 'cleaning',
    title: '입주 청소',
    summary: '믿을 수 있는 업체',
    description:
      '입주/이사/준공 청소 전문 업체 견적 비교. 작업 범위와 추가 비용 발생 조건을 미리 확인해요.',
    icon: Sparkles,
    accent: 'violet',
    features: ['평수별 공임 안내', '보일러/에어컨 옵션', '작업 사전 점검'],
  },
  {
    id: 'insurance',
    title: '보험 / 카드',
    summary: '골라 담기',
    description:
      '자동보험료 계산과 혜택 좋은 신용카드 추천을 도와드려요. 과잉 설계가 아닌 꼭 필요한 것만 골라요.',
    icon: ShieldCheck,
    accent: 'rose',
    tag: '준비 중',
    features: ['갱신형 요율 비교', '혜택 카드 매칭', '무료 해지 보장 안내'],
  },
]

/** 폼 select 옵션용 단순 리스트 */
export const serviceOptions = services.map((s) => ({
  value: s.id,
  label: s.title,
}))
