import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, UserPlus, AlertCircle } from 'lucide-react'
import { register } from '../../lib/adminAuth'
import SEO from '../../components/SEO'

/**
 * 관리자/직원 회원가입 페이지.
 *
 * ⚠️ 목업 모드에서는 가입한 계정이 localStorage에 저장됩니다.
 *    브라우저를 바꾸거나 localStorage를 비우면 사라집니다.
 *    역할은 항상 'staff'로 가입 — 'admin' 승격은 별도 루트 필요.
 */
export default function AdminRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (key: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [key]: value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="관리자 회원가입" path="/admin/register" noIndex />
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <span className="text-lg font-black">라</span>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-ink">라이플 관리자</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-5">
            <h1 className="text-xl font-extrabold tracking-tight text-ink">회원가입</h1>
            <p className="mt-1 text-sm text-ink-soft">
              가입 시 staff 권한으로 시작합니다. admin 승격은 별도 승인이 필요합니다.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-ink">
                이름
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="담당자 이름"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink">
                이메일
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@lifful.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-ink">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="6자 이상"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="passwordConfirm"
                  className="mb-1.5 block text-sm font-bold text-ink"
                >
                  비밀번호 확인
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(e) => update('passwordConfirm', e.target.value)}
                  placeholder="다시 입력"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                  required
                />
              </div>
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
                  가입 중…
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  회원가입
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-ink-muted">
            이미 계정이 있으신가요?{' '}
            <Link to="/admin/login" className="font-semibold text-brand-700 hover:text-brand-800">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
