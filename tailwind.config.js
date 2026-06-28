/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // 동적 클래스명 트리셔이킹 방지용 safelist:
  // - 서비스 카드 accent와 ReviewCard accent를 사용하는 모든 색 조합 보존
  safelist: [
    {
      pattern:
        /(bg|text|border|ring|shadow)-(brand|mint|gold|amber|violet|rose)-(50|100|200|300|400|500|600|700|800)/,
    },
    'group-hover:shadow-brand-600/10',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Noto Sans KR',
          'sans-serif',
        ],
      },
      colors: {
        // 메인 컬러: 딥 레드/와인 톤 (기존보다 약 10% 어둡게, 살짝 더 깊은 붉은색)
        // scarlet(#cf3324) → wine/crimson 계열로 변경. brand-* 클래스 그대로 적용.
        brand: {
          50: '#fdf4f3',
          100: '#fae6e2',
          200: '#f5cdc6',
          300: '#ee9e92',
          400: '#de6755',
          500: '#c8392a',
          600: '#b2291a', // 메인 (was #cf3324)
          700: '#931f14',
          800: '#781a11',
          900: '#641810',
          950: '#380c08',
        },
        // 프리미엄 포인트 골드 (중국 정착 섹션 강조, 구분선 등에 소극 사용)
        gold: {
          50: '#fbf6ec',
          100: '#f5e9cd',
          200: '#ecd195',
          300: '#e0b65c',
          400: '#d6a23f',
          500: '#c0872a',
          600: '#a36a20',
          700: '#84531e',
          800: '#6f451e',
          900: '#5f3b1c',
        },
        // 제이드 민트 - 성공/신선함 표시용 (레드와 정반대 보색으로 절제 사용)
        mint: {
          50: '#edfcf6',
          100: '#d4fabe',
          200: '#aef399',
          300: '#75e76b',
          400: '#3ece4c',
          500: '#19b235',
          600: '#0f9029',
          700: '#107223',
          800: '#115a1f',
          900: '#104a1d',
        },
        // 잉크 블랙 - 레드와 함께 메인 톤
        ink: {
          DEFAULT: '#171717', // 약간 더 깊은 블랙
          soft: '#404040',
          muted: '#737373',
          light: '#a3a3a3',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(23 23 23 / 0.05), 0 4px 16px -4px rgb(23 23 23 / 0.07)',
        cardHover:
          '0 4px 8px -2px rgb(23 23 23 / 0.09), 0 12px 32px -6px rgb(23 23 23 / 0.13)',
        soft: '0 2px 8px -2px rgb(23 23 23 / 0.06)',
        ring: '0 0 0 4px rgb(178 41 26 / 0.14)',
        redGlow: '0 8px 30px -6px rgb(178 41 26 / 0.35)',
      },
      maxWidth: {
        container: '1200px',
      },
      backgroundImage: {
        'header-stripe':
          'linear-gradient(90deg, #b2291a 0%, #d6a23f 50%, #b2291a 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
