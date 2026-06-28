import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocaleProvider } from './lib/i18n'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'
import ScrollToHash from './components/ScrollToHash'
import TranslationFallbackNotice from './components/TranslationFallbackNotice'
import CookieBanner from './components/CookieBanner'
import HomePage from './pages/HomePage'
import ChineseUsersPage from './pages/ChineseUsersPage'
import ChineseMobilePage from './pages/ChineseMobilePage'
import SettlementPage from './pages/SettlementPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import ReviewsPage from './pages/ReviewsPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/customer/LoginPage'
import RegisterPage from './pages/customer/RegisterPage'
import MyPage from './pages/customer/MyPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminRegister from './pages/admin/AdminRegister'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminConsultations from './pages/admin/AdminConsultations'
import AdminSettings from './pages/admin/AdminSettings'

/**
 * 라우팅 구조.
 *   /                          메인 랜딩 (한국 생활 서비스 비교)
 *   /chinese-users             외국인/중국인 정착 허브
 *   /chinese-users/mobile      중국인 휴대폰 개통 상세
 *   /chinese-users/settlement  한국 정착 체크리스트
 *   /admin/login               관리자 로그인 (목업)
 *   /admin/register            관리자 회원가입 (목업)
 *   /admin                     관리자 대시보드 (목업)
 *   /admin/consultations       상담 신청 목록 (목업)
 *   /admin/settings            사이트 설정 (목업)
 *
 * 일반 페이지는 Header/Footer/FloatingCTA를 공유.
 * /admin/* 페이지는 별도 레이아웃(AdminLayout)을 사용하며 공용 헤더/푸터 없음.
 * ScrollToHash는 일반 라우트/해시 변경 시 스크롤 위치를 보정.
 */
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TranslationFallbackNotice />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chinese-users" element={<ChineseUsersPage />} />
          <Route path="/chinese-users/mobile" element={<ChineseMobilePage />} />
          <Route path="/chinese-users/settlement" element={<SettlementPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          {/* 매칭되지 않은 일반 경로는 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <FloatingCTA />
      <CookieBanner />
    </div>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
        {/* 관리자 라우트 (공용 헤더/푸터 없음) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="consultations" element={<AdminConsultations />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 공용 라우트 (헤더/푸터/FAB 공유) */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
      </BrowserRouter>
    </LocaleProvider>
  )
}
