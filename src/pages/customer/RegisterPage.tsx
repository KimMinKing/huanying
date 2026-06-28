import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, UserPlus, AlertCircle, ArrowLeft } from 'lucide-react'
import { register } from '../../lib/customerAuth'
import SEO from '../../components/SEO'

/**
 * 고객용 회원가입 페이지.
 * 가입하면 자동 로그인 → 마이페이지로 이동.
 */
export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    agree: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((p) => ({ ...p, [key]: value }))

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

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
    if (!form.agree) {
      setError('개인정보 수집·이용에 동의해 주세요.')
      return
    }

    setLoading(true)
    try {
      await register({
        email: form.email,
        name: form.name,
        password: form.password,
        phone: form.phone,
      })
      navigate('/my')
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="회원가입" path="/register" noIndex />
      <section className="bg-slate-50/60 py-16 sm:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            홈으로
          </Link>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <div className="mb-5">
              <h1 className="text-2xl font-extrabold tracking-tight text-ink">회원가입</h1>
              <p className="mt-1 text-sm text-ink-soft">
                상담 내역과 진행 상태를 한곳에서 확인하세요.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <Field label="이름" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="홍길동"
                  className={inputCls}
                  required
                />
              </Field>

              <Field label="이메일" required>
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                  required
                />
              </Field>

              <Field label="휴대전화" required>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => update('phone', formatPhone(e.target.value))}
                  placeholder="010-1234-5678"
                  className={inputCls}
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="비밀번호" required>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="6자 이상"
                    className={inputCls}
                    required
                  />
                </Field>
                <Field label="비밀번호 확인" required>
                  <input
                    type="password"
                    value={form.passwordConfirm}
                    onChange={(e) => update('passwordConfirm', e.target.value)}
                    placeholder="다시 입력"
                    className={inputCls}
                    required
                  />
                </Field>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => update('agree', e.target.checked)}
                  className="mt-0.5 h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-xs text-ink-soft">
                  <span className="font-bold text-ink">개인정보 수집·이용에 동의합니다.</span>
                  <br />
                  수집 항목: 이름, 이메일, 전화번호. 목적: 회원 식별 및 상담 내역 관리.
                  보유: 회원 탈퇴 시까지. 자세한 내용은{' '}
                  <Link to="/privacy" className="font-bold text-brand-700 underline">
                    개인정보처리방침
                  </Link>
                  을 참고하세요.
                </span>
              </label>

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

            <p className="mt-5 text-center text-xs text-ink-muted">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

const inputCls =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-ink">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  )
}
