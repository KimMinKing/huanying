import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import {
  RedirectAdminAuth,
  RedirectCustomerAuth,
  RequireAdminAuth,
  RequireCustomerAuth,
} from './components/AuthRoutes'
import CookieBanner from './components/CookieBanner'
import FloatingCTA from './components/FloatingCTA'
import Footer from './components/Footer'
import Header from './components/Header'
import ScrollToHash from './components/ScrollToHash'
import TranslationFallbackNotice from './components/TranslationFallbackNotice'
import { LocaleProvider } from './lib/i18n'
import AdminConsultations from './pages/admin/AdminConsultations'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminMobilePricing from './pages/admin/AdminMobilePricing'
import AdminRegister from './pages/admin/AdminRegister'
import AdminSettings from './pages/admin/AdminSettings'
import AdminUsers from './pages/admin/AdminUsers'
import ChineseMobilePage from './pages/ChineseMobilePage'
import ChineseUsersPage from './pages/ChineseUsersPage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import ForeignerDocumentsPage from './pages/ForeignerDocumentsPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PricingGuidePage from './pages/PricingGuidePage'
import PrivacyPage from './pages/PrivacyPage'
import ReviewsPage from './pages/ReviewsPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import SettlementPage from './pages/SettlementPage'
import SupportHoursPage from './pages/SupportHoursPage'
import TermsPage from './pages/TermsPage'
import LoginPage from './pages/customer/LoginPage'
import MyPage from './pages/customer/MyPage'
import RegisterPage from './pages/customer/RegisterPage'

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TranslationFallbackNotice />
      <Header />
      <main className="flex-1">
        <Outlet />
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
          <Route element={<RedirectAdminAuth />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
          </Route>

          <Route element={<RequireAdminAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="consultations" element={<AdminConsultations />} />
              <Route path="pricing/mobile" element={<AdminMobilePricing />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="chinese-users" element={<ChineseUsersPage />} />
            <Route path="chinese-users/mobile" element={<ChineseMobilePage />} />
            <Route path="chinese-users/settlement" element={<SettlementPage />} />
            <Route path="case-studies" element={<CaseStudiesPage />} />
            <Route path="foreigner-documents" element={<ForeignerDocumentsPage />} />
            <Route path="support-hours" element={<SupportHoursPage />} />
            <Route path="pricing-guide" element={<PricingGuidePage />} />
            <Route path="services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="reviews" element={<ReviewsPage />} />

            <Route element={<RedirectCustomerAuth />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            <Route element={<RequireCustomerAuth />}>
              <Route path="my" element={<MyPage />} />
            </Route>

            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  )
}
