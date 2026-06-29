import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Loader2, LogIn, MessageCircle, Smartphone } from 'lucide-react'
import SEO from '../../components/SEO'
import { login } from '../../lib/customerAuth'

function SocialButton({
  label,
  bgColor,
  textColor,
  icon,
}: {
  label: string
  bgColor: string
  textColor: string
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      disabled
      title="백엔드 연동 전까지는 준비 중입니다."
      className={`flex cursor-not-allowed items-center justify-center gap-1.5 rounded-2xl ${bgColor} ${textColor} px-3 py-2.5 text-xs font-bold opacity-70`}
    >
      {icon}
      {label}
    </button>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading) return

    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      navigate('/my')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="로그인" path="/login" noIndex />
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
                <h1 className="text-2xl font-extrabold tracking-tight text-ink">고객 로그인</h1>
                <p className="mt-1 text-sm text-ink-soft">
                  상담 요청 내역과 진행 상태를 확인할 수 있습니다.
                </p>
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
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
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
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="비밀번호를 입력하세요"
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
                      로그인 중
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      로그인
                    </>
                  )}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs font-bold uppercase tracking-widest text-ink-muted">
                      OR
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <SocialButton
                    label="Kakao"
                    bgColor="bg-[#FEE500]"
                    textColor="text-[#191919]"
                    icon={<MessageCircle className="h-4 w-4" />}
                  />
                  <SocialButton
                    label="Naver"
                    bgColor="bg-[#03C75A]"
                    textColor="text-white"
                    icon={<span className="text-sm font-black">N</span>}
                  />
                  <SocialButton
                    label="WeChat"
                    bgColor="bg-[#07C160]"
                    textColor="text-white"
                    icon={<Smartphone className="h-4 w-4" />}
                  />
                </div>
                <p className="mt-1 text-center text-[10px] text-ink-light">
                  소셜 로그인은 아직 연결되지 않았습니다.
                </p>
              </form>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs">
                <p className="font-bold text-ink">데모 계정</p>
                <p className="mt-1.5 text-ink-soft">
                  이메일{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-brand-700">
                    demo@lifful.com
                  </code>
                </p>
                <p className="mt-0.5 text-ink-soft">
                  비밀번호{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-brand-700">
                    demo123
                  </code>
                </p>
              </div>

              <p className="mt-5 text-center text-xs text-ink-muted">
                아직 계정이 없으신가요?{' '}
                <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
