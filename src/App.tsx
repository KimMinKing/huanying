import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'
import ScrollToHash from './components/ScrollToHash'
import HomePage from './pages/HomePage'
import ChineseUsersPage from './pages/ChineseUsersPage'
import ChineseMobilePage from './pages/ChineseMobilePage'
import SettlementPage from './pages/SettlementPage'

/**
 * 라우팅 구조.
 *   /                          메인 랜딩 (한국 생활 서비스 비교)
 *   /chinese-users             외국인/중국인 정착 허브
 *   /chinese-users/mobile      중국인 휴대폰 개통 상세
 *   /chinese-users/settlement  한국 정착 체크리스트
 *
 * 모든 페이지는 Header/Footer/FloatingCTA를 공유.
 * ScrollToHash는 라우트/해시 변경 시 스크롤 위치를 보정.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chinese-users" element={<ChineseUsersPage />} />
            <Route path="/chinese-users/mobile" element={<ChineseMobilePage />} />
            <Route path="/chinese-users/settlement" element={<SettlementPage />} />
            {/* 매칭되지 않은 경로는 홈으로 */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingCTA />
      </div>
    </BrowserRouter>
  )
}
