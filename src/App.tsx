import { Suspense, lazy } from 'react'
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

const AdminConsultations = lazy(() => import('./pages/admin/AdminConsultations'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminMobilePricing = lazy(() => import('./pages/admin/AdminMobilePricing'))
const AdminRegister = lazy(() => import('./pages/admin/AdminRegister'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'))
const ChineseMobilePage = lazy(() => import('./pages/ChineseMobilePage'))
const ChineseUsersPage = lazy(() => import('./pages/ChineseUsersPage'))
const ForeignerDocumentsPage = lazy(() => import('./pages/ForeignerDocumentsPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/customer/LoginPage'))
const MyPage = lazy(() => import('./pages/customer/MyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PricingGuidePage = lazy(() => import('./pages/PricingGuidePage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const RegisterPage = lazy(() => import('./pages/customer/RegisterPage'))
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const SettlementPage = lazy(() => import('./pages/SettlementPage'))
const SupportHoursPage = lazy(() => import('./pages/SupportHoursPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))

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

function RouteFallback() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center bg-slate-50 text-sm font-semibold text-ink-muted">
      페이지를 불러오는 중입니다.
    </div>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <ScrollToHash />
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </LocaleProvider>
  )
}
