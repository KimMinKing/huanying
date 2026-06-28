import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Headset, Loader2, LogIn, AlertCircle, UserCircle } from 'lucide-react'
import { login } from '../../lib/adminAuth'
import SEO from '../../components/SEO'

/**
 * 관리자 로그인 페이지.
 * 백엔드 도입 시 login() 함수 본문을 API 호출로 교체.
 */
export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="관리자 로그인" path="/admin/login" noIndex />
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* 로고 / 헤더 */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <span className="text-lg font-black">라</span>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-ink">라이플 관리자</span>
          </Link>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink-light">
            Lifful Admin Console
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-5">
            <h1 className="text-xl font-extrabold tracking-tight text-ink">로그인</h1>
            <p className="mt-1 text-sm text-ink-soft">관리자 계정으로 로그인하세요.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink">
                이메일
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lifful.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-ink">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  로그인 중…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  로그인
                </>
              )}
            </button>
          </form>

          {/* 데모 계정 힌트 */}
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs">
            <p className="flex items-center gap-1.5 font-bold text-ink">
              <UserCircle className="h-3.5 w-3.5 text-brand-600" />
              데모 계정
            </p>
            <p className="mt-1.5 text-ink-soft">
              이메일: <code className="rounded bg-white px-1 py-0.5 font-mono text-brand-700">admin@lifful.com</code>
            </p>
            <p className="mt-0.5 text-ink-soft">
              비밀번호: <code className="rounded bg-white px-1 py-0.5 font-mono text-brand-700">admin123</code>
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between text-xs text-ink-muted">
            <Link to="/admin/register" className="font-semibold text-brand-700 hover:text-brand-800">
              회원가입
            </Link>
            <Link to="/" className="font-semibold hover:text-ink">
              <Headset className="mr-1 inline h-3 w-3" />
              사이트로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
