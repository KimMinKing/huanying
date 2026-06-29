import Hero from '../components/Hero'
import ServiceCards from '../components/ServiceCards'
import WhyUs from '../components/WhyUs'
import ComparisonExample from '../components/ComparisonExample'
import ForeignerEntry from '../components/ForeignerEntry'
import GuideHighlights from '../components/GuideHighlights'
import Reviews from '../components/Reviews'
import ConsultationForm from '../components/ConsultationForm'
import SEO, { localBusinessJsonLd } from '../components/SEO'

/**
 * 메인 랜딩 페이지.
 * 흐름: 후킹 → 서비스 → 차별점 → 비교 증명
 *       → (확장) 외국인 정착 → 사회증명 → 행동유도(폼)
 */
export default function HomePage() {
  return (
    <>
      <SEO
        title="라이플"
        description="인터넷, 휴대폰, 렌탈, 이사, 청소까지. 한 곳에서 비교하고 나에게 맞는 혜택을 찾아보세요. 외국인 정착 패키지·AI 맞춤 추천 제공."
        path="/"
        jsonLd={localBusinessJsonLd()}
      />
      <Hero />
      <ServiceCards />
      <WhyUs />
      <ComparisonExample />
      <ForeignerEntry />
      <GuideHighlights />
      <Reviews />
      <ConsultationForm />
    </>
  )
}
