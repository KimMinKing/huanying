import Hero from '../components/Hero'
import ServiceCards from '../components/ServiceCards'
import WhyUs from '../components/WhyUs'
import ComparisonExample from '../components/ComparisonExample'
import ForeignerEntry from '../components/ForeignerEntry'
import Reviews from '../components/Reviews'
import ConsultationForm from '../components/ConsultationForm'

/**
 * 메인 랜딩 페이지.
 * 흐름: 후킹 → 서비스 → 차별점 → 비교 증명
 *       → (확장) 외국인 정착 → 사회증명 → 행동유도(폼)
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceCards />
      <WhyUs />
      <ComparisonExample />
      <ForeignerEntry />
      <Reviews />
      <ConsultationForm />
    </>
  )
}
