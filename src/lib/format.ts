/**
 * 화면 단위의 작은 포맷팅 유틸.
 * 나중에 다국어(i18n)가 들어오면 Intl 포맷터로 교체하기 쉽게 함수로 캡슐화.
 */
export function formatWon(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value)
}

export function formatWonUnit(value: number, unit = '원'): string {
  return `${formatWon(value)}${unit}`
}

/** 만원 단위로 축약 표기 (예: 1,209,600 -> "약 120만 원") */
export function formatWonCompact(value: number): string {
  if (value >= 100_000_000) {
    return `약 ${(value / 100_000_000).toFixed(1).replace(/\.0$/, '')}억 원`
  }
  if (value >= 10_000) {
    return `약 ${Math.round(value / 10_000)}만 원`
  }
  return `${formatWon(value)}원`
}
