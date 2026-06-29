import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Globe,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  Smartphone,
  User,
  UserPlus,
} from 'lucide-react'
import SEO from '../../components/SEO'
import {
  register,
  type Nationality,
  type PreferredChannel,
  type PreferredLanguage,
  type ResidenceStatus,
} from '../../lib/customerAuth'

const STEPS = ['계정', '프로필', '체류 정보', '연락 및 동의'] as const

const inputCls =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    nationality: '' as Nationality | '',
    residenceStatus: '' as ResidenceStatus | '',
    visaType: '',
    preferredChannel: '' as PreferredChannel | '',
    preferredLanguage: 'ko' as PreferredLanguage,
    marketingConsent: false,
    termsAgree: false,
    privacyAgree: false,
  })

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  const validateStep = (currentStep: number): string | null => {
    switch (currentStep) {
      case 0:
        if (!form.email.includes('@')) return '올바른 이메일을 입력해 주세요.'
        if (form.password.length < 6) return '비밀번호는 6자 이상이어야 합니다.'
        if (form.password !== form.passwordConfirm) return '비밀번호가 일치하지 않습니다.'
        return null
      case 1:
        if (!form.name.trim()) return '이름을 입력해 주세요.'
        if (!/^010-\d{4}-\d{4}$/.test(form.phone)) {
          return '전화번호 형식은 010-1234-5678 이어야 합니다.'
        }
        return null
      case 2:
        if (!form.nationality) return '국적을 선택해 주세요.'
        if (!form.residenceStatus) return '체류 상태를 선택해 주세요.'
        if (
          form.nationality !== 'kr' &&
          form.residenceStatus !== 'tourist' &&
          !form.visaType.trim()
        ) {
          return '외국인 장기/단기 체류자는 비자 종류를 입력해야 합니다.'
        }
        return null
      case 3:
        if (!form.preferredChannel) return '선호 연락 채널을 선택해 주세요.'
        if (!form.termsAgree) return '이용약관에 동의해 주세요.'
        if (!form.privacyAgree) return '개인정보 수집 및 이용에 동의해 주세요.'
        return null
      default:
        return null
    }
  }

  const next = () => {
    const validationError = validateStep(step)
    setError(validationError)
    if (!validationError) {
      setStep((current) => Math.min(current + 1, STEPS.length - 1))
    }
  }

  const prev = () => {
    setError(null)
    setStep((current) => Math.max(current - 1, 0))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading) return

    const validationError = validateStep(step)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setLoading(true)

    try {
      await register({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        nationality: form.nationality as Nationality,
        preferredLanguage: form.preferredLanguage,
        residenceStatus: form.residenceStatus as ResidenceStatus,
        visaType: form.visaType || undefined,
        preferredChannel: form.preferredChannel as PreferredChannel,
        marketingConsent: form.marketingConsent,
      })
      navigate('/my')
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="회원가입" path="/register" noIndex />
      <section className="bg-slate-50/60 py-12 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-xl">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm font-semibold text-ink-muted transition hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              홈으로
            </Link>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
                  회원가입
                </p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
                  고객 계정을 만듭니다
                </h1>
                <p className="mt-1 text-sm text-ink-soft">
                  상담 내역 확인과 맞춤 서비스 연결을 위해 기본 정보를 받습니다.
                </p>

                <ol className="mt-5 flex items-center">
                  {STEPS.map((label, index) => {
                    const done = index < step
                    const active = index === step

                    return (
                      <li key={label} className="flex flex-1 items-center last:flex-none">
                        <button
                          type="button"
                          onClick={() => index < step && setStep(index)}
                          disabled={index >= step}
                          className={[
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition',
                            done
                              ? 'bg-mint-500 text-white'
                              : active
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-100 text-ink-muted',
                          ].join(' ')}
                        >
                          {done ? <Check className="h-4 w-4" /> : index + 1}
                        </button>
                        <span
                          className={[
                            'ml-2 hidden text-xs font-bold sm:inline',
                            done || active ? 'text-ink' : 'text-ink-muted',
                          ].join(' ')}
                        >
                          {label}
                        </span>
                        {index < STEPS.length - 1 && (
                          <div
                            className={[
                              'mx-2 h-0.5 flex-1 rounded-full transition',
                              index < step ? 'bg-mint-500' : 'bg-slate-100',
                            ].join(' ')}
                          />
                        )}
                      </li>
                    )
                  })}
                </ol>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                {step === 0 && (
                  <div className="space-y-4">
                    <Field label="이메일" icon={Mail} required>
                      <input
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(event) => update('email', event.target.value)}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="비밀번호" icon={Lock} required hint="6자 이상">
                        <input
                          type="password"
                          value={form.password}
                          onChange={(event) => update('password', event.target.value)}
                          placeholder="비밀번호"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="비밀번호 확인" icon={Lock} required>
                        <input
                          type="password"
                          value={form.passwordConfirm}
                          onChange={(event) => update('passwordConfirm', event.target.value)}
                          placeholder="한 번 더 입력"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <Field label="이름" icon={User} required hint="실명 권장">
                      <input
                        type="text"
                        value={form.name}
                        onChange={(event) => update('name', event.target.value)}
                        placeholder="홍길동 / Zhang Wen"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="휴대전화" icon={Phone} required hint="010-1234-5678">
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={(event) => update('phone', formatPhone(event.target.value))}
                        placeholder="010-1234-5678"
                        className={inputCls}
                      />
                    </Field>
                    <p className="rounded-2xl bg-brand-50 px-4 py-3 text-xs text-brand-800">
                      <AlertCircle className="mr-1 inline h-3 w-3" />
                      전화번호는 본인 확인과 상담 연락에만 사용합니다.
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-bold text-ink">
                        국적 <span className="ml-0.5 text-rose-500">*</span>
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { value: 'kr', label: '한국' },
                          { value: 'cn', label: '중국' },
                          { value: 'other', label: '기타' },
                        ] as const).map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              update('nationality', option.value)
                              update('preferredLanguage', option.value === 'cn' ? 'zh' : 'ko')
                              update('residenceStatus', option.value === 'kr' ? 'citizen' : '')
                              if (option.value === 'kr') {
                                update('visaType', '')
                              }
                            }}
                            className={[
                              'rounded-2xl border-2 px-3 py-3 text-center transition',
                              form.nationality === option.value
                                ? 'border-brand-500 bg-brand-50'
                                : 'border-slate-200 hover:border-slate-300',
                            ].join(' ')}
                          >
                            <span className="block text-xs font-bold text-ink">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.nationality !== 'kr' && form.nationality !== '' && (
                      <div>
                        <p className="mb-2 text-sm font-bold text-ink">
                          체류 상태 <span className="ml-0.5 text-rose-500">*</span>
                        </p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {([
                            { value: 'long_term', label: '장기 체류' },
                            { value: 'short_term', label: '단기 체류' },
                            { value: 'tourist', label: '관광' },
                          ] as const).map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => update('residenceStatus', option.value)}
                              className={[
                                'rounded-2xl border-2 px-3 py-2.5 text-xs font-bold transition',
                                form.residenceStatus === option.value
                                  ? 'border-brand-500 bg-brand-50 text-brand-800'
                                  : 'border-slate-200 text-ink-soft hover:border-slate-300',
                              ].join(' ')}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {form.nationality !== 'kr' &&
                      form.nationality !== '' &&
                      form.residenceStatus !== 'tourist' &&
                      form.residenceStatus !== '' && (
                        <Field label="비자 종류" icon={Globe} required>
                          <select
                            value={form.visaType}
                            onChange={(event) => update('visaType', event.target.value)}
                            className={inputCls}
                          >
                            <option value="">선택해 주세요</option>
                            <optgroup label="유학">
                              <option value="D-2">D-2</option>
                              <option value="D-4">D-4</option>
                            </optgroup>
                            <optgroup label="취업 / 사업">
                              <option value="D-7">D-7</option>
                              <option value="D-8">D-8</option>
                              <option value="D-9">D-9</option>
                              <option value="E-7">E-7</option>
                            </optgroup>
                            <optgroup label="가족 / 기타">
                              <option value="F-2">F-2</option>
                              <option value="F-4">F-4</option>
                              <option value="F-6">F-6</option>
                              <option value="H-1">H-1</option>
                            </optgroup>
                          </select>
                        </Field>
                      )}

                    <Field label="선호 언어" icon={Globe}>
                      <select
                        value={form.preferredLanguage}
                        onChange={(event) =>
                          update('preferredLanguage', event.target.value as PreferredLanguage)
                        }
                        className={inputCls}
                      >
                        <option value="ko">한국어</option>
                        <option value="zh">中文</option>
                        <option value="en">English</option>
                      </select>
                    </Field>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-bold text-ink">
                        선호 연락 채널 <span className="ml-0.5 text-rose-500">*</span>
                      </p>
                      <p className="mb-3 text-xs text-ink-muted">
                        상담 담당자가 가장 먼저 연락할 채널입니다.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          {
                            value: 'kakao',
                            label: '카카오톡',
                            icon: MessageCircle,
                            cls: 'bg-[#FEE500] text-[#191919]',
                          },
                          {
                            value: 'wechat',
                            label: 'WeChat',
                            icon: Smartphone,
                            cls: 'bg-[#07C160] text-white',
                          },
                          {
                            value: 'phone',
                            label: '전화',
                            icon: PhoneCall,
                            cls: 'bg-brand-600 text-white',
                          },
                          {
                            value: 'email',
                            label: '이메일',
                            icon: Mail,
                            cls: 'bg-ink text-white',
                          },
                        ] as const).map((option) => {
                          const Icon = option.icon
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => update('preferredChannel', option.value)}
                              className={[
                                'flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition',
                                form.preferredChannel === option.value
                                  ? 'border-brand-500 bg-brand-50'
                                  : 'border-slate-200 hover:border-slate-300',
                              ].join(' ')}
                            >
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-full ${option.cls}`}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="flex-1 text-sm font-bold text-ink">
                                {option.label}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={form.termsAgree}
                          onChange={(event) => update('termsAgree', event.target.checked)}
                          className="mt-0.5 h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="flex-1 text-xs text-ink-soft">
                          <strong className="text-ink">
                            <Link to="/terms" className="font-bold text-brand-700 underline">
                              이용약관
                            </Link>{' '}
                            동의 <span className="text-rose-500">*</span>
                          </strong>
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={form.privacyAgree}
                          onChange={(event) => update('privacyAgree', event.target.checked)}
                          className="mt-0.5 h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="flex-1 text-xs text-ink-soft">
                          <strong className="text-ink">
                            <Link to="/privacy" className="font-bold text-brand-700 underline">
                              개인정보 수집 및 이용
                            </Link>{' '}
                            동의 <span className="text-rose-500">*</span>
                          </strong>
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={form.marketingConsent}
                          onChange={(event) => update('marketingConsent', event.target.checked)}
                          className="mt-0.5 h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="flex-1 text-xs text-ink-soft">
                          <strong className="text-ink">마케팅 정보 수신 동의 (선택)</strong>
                          <br />
                          프로모션과 이벤트 소식을 이메일, 문자, 메신저로 받을 수 있습니다.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={prev}
                      className="btn-secondary px-5 py-3 text-sm"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      이전
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={next}
                      className="btn-primary flex-1 py-3 text-base"
                    >
                      다음
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 py-3 text-base disabled:cursor-wait"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          가입 중
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          가입 완료
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>

              <p className="mt-5 text-center text-xs text-ink-muted">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                  로그인
                </Link>
              </p>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1 text-xs text-ink-muted">
              <ChevronRight className="h-3 w-3" />
              데모 계정으로 둘러보려면{' '}
              <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                로그인 페이지로 이동
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function Field({
  label,
  icon: Icon,
  required,
  hint,
  children,
}: {
  label: string
  icon?: typeof Mail
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
          {Icon && <Icon className="h-3.5 w-3.5 text-ink-muted" />}
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </span>
        {hint && <span className="text-xs text-ink-muted">{hint}</span>}
      </span>
      {children}
    </label>
  )
}
