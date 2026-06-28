import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../data/comparison'

interface SEOProps {
  title?: string
  description?: string
  /** 정식 URL — 라우트별 지정. 없으면 canonically 홈 */
  path?: string
  /** OG/Twitter 카드에 표시할 이미지 URL */
  image?: string
  /** 페이지 언어 — ko/zh/en */
  locale?: 'ko_KR' | 'zh_CN' | 'en_US'
  /** JSON-LD 구조화 데이터 객체 (배열도 가능) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  /** noindex (관리자 페이지 등) */
  noIndex?: boolean
}

const SITE_ORIGIN = 'https://lifful.example' // 실제 도메인으로 교체 필요

/**
 * 페이지별 SEO 메타 + OG/Twitter 카드 + JSON-LD 주입.
 * 페이지 컴포넌트 최상단에서 <SEO title="..." /> 한 번 호출.
 */
export default function SEO({
  title,
  description,
  path = '/',
  image,
  locale = 'ko_KR',
  jsonLd,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${siteConfig.brand}`
    : `${siteConfig.brand} | ${siteConfig.description}`
  const desc = description ?? siteConfig.description
  const canonical = `${SITE_ORIGIN}${path}`
  const ogImage = image ?? `${SITE_ORIGIN}/og-default.png`

  return (
    <Helmet>
      <html lang={locale.split('_')[0]} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.brand} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD 구조화 데이터 */}
      {jsonLd &&
        (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((obj, i) => (
          <script type="application/ld+json" key={i}>
            {JSON.stringify(obj)}
          </script>
        ))}
    </Helmet>
  )
}

/**
 * LocalBusiness JSON-LD 헬퍼.
 * Footer/전역에 한 번만 노출.
 */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.company.name,
    description: siteConfig.description,
    url: SITE_ORIGIN,
    telephone: siteConfig.company.phone,
    email: siteConfig.company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.company.address,
      addressLocality: '서울',
      addressCountry: 'KR',
    },
    openingHours: 'Mo-Fr 10:00-19:00',
  }
}

/**
 * FAQ 페이지용 JSON-LD 헬퍼.
 */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}
