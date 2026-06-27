import { useState, type FormEvent } from 'react'
import {
  Headset,
  ShieldCheck,
  Clock,
  MessageCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { serviceOptions } from '../data/services'

type Status = 'idle' | 'loading' | 'done'

interface FormState {
  name: string
  phone: string
  service: string
  current: string
  message: string
  agree: boolean
}

const initialState: FormState = {
  name: '',
  phone: '',
  service: '',
  current: '',
  message: '',
  agree: false,
}

/** 한국 휴대폰 번호 포맷 (010-1234-5678) */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const trustPoints = [
  {
    icon: Clock,
    title: '평균 24시간 내 회신',
    desc: '영업일 기준, 접수 순서대로 매니저가 연락드립니다.',
  },
  {
    icon: ShieldCheck,
    title: '연락처는 상담에만 사용',
    desc: '제3자 제공 없음. 상담 외 목적으로 연락하지 않습니다.',
  },
  {
    icon: MessageCircle,
    title: '강요 없는 상담',
    desc: '비교 견적만 받아보셔도 괜찮습니다. 가입 압박 없어요.',
  },
]

export default function ConsultationForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  )

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = '이름을 입력해 주세요.'
    if (form.phone.replace(/\D/g, '').length < 10)
      next.phone = '올바른 연락처를 입력해 주세요.'
    if (!form.service) next.service = '관심 서비스를 선택해 주세요.'
    if (!form.agree) next.agree = '개인정보 수집·이용에 동의해 주세요.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    // 실제 백엔드가 없으므로 성공 시뮬레이션
    setTimeout(() => setStatus('done'), 900)
  }

  return (
    <section id="consult" className="section bg-slate-50/80">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* 좌측: 신뢰 카피 */}
          <div>
            <span className="eyebrow">
              <Headset className="h-3.5 w-3.5" />
              무료 상담 신청
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              먼저 견적 받아보세요.
              <br />
              <span className="text-brand-600">결정은 그다음이에도</span> 충분합니다.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              폼을 채워주시면 전담 매니저가 회신드려요. 현재 쓰는 요금제/서비스를
              알려주시면 더 정확한 비교를 도와드릴게요.
            </p>

            <ul className="mt-8 space-y-4">
              {trustPoints.map((tp) => {
                const Icon = tp.icon
                return (
                  <li key={tp.title} className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold text-ink">{tp.title}</p>
                      <p className="text-sm text-ink-soft">{tp.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* 우측: 폼 카드 */}
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-cardHover sm:p-8">
            {status === 'done' ? (
              <SuccessState
                onReset={() => {
                  setForm(initialState)
                  setStatus('idle')
                }}
              />
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="이름"
                    required
                    error={errors.name}
                    htmlFor="name"
                  >
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="홍길동"
                      className={inputCls(errors.name)}
                    />
                  </Field>
                  <Field
                    label="연락처"
                    required
                    error={errors.phone}
                    htmlFor="phone"
                  >
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) => update('phone', formatPhone(e.target.value))}
                      placeholder="010-1234-5678"
                      className={inputCls(errors.phone)}
                    />
                  </Field>
                </div>

                <Field
                  label="관심 서비스"
                  required
                  error={errors.service}
                  htmlFor="service"
                >
                  <select
                    id="service"
                    value={form.service}
                    onChange={(e) => update('service', e.target.value)}
                    className={inputCls(errors.service)}
                  >
                    <option value="" disabled>
                      서비스를 선택해 주세요
                    </option>
                    {serviceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                    <option value="multi">여러 서비스 묶어서</option>
                    <option value="foreigner-settlement">
                      외국인 정착 패키지 (휴대폰·인터넷·은행·집)
                    </option>
                  </select>
                </Field>

                <Field
                  label="현재 사용 중인 통신사 / 서비스"
                  htmlFor="current"
                  hint="비교를 더 정확하게 도와드릴게요."
                >
                  <input
                    id="current"
                    type="text"
                    value={form.current}
                    onChange={(e) => update('current', e.target.value)}
                    placeholder="예) SK브로드밴드 1Gbps / 알뜰폰 MNO"
                    className={inputCls()}
                  />
                </Field>

                <Field label="문의 내용" htmlFor="message">
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="원하시는 조건, 예산, 문의 사항을 자유롭게 적어주세요. (선택)"
                    className={`${inputCls()} resize-none`}
                  />
                </Field>

                {/* 동의 */}
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => update('agree', e.target.checked)}
                    className="mt-0.5 h-5 w-5 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-ink-soft">
                    <span className="font-bold text-ink">
                      개인정보 수집·이용에 동의합니다.{' '}
                      <span className="text-rose-500">*</span>
                    </span>
                    <br />
                    수집 항목: 이름, 연락처, 문의 내용. 목적: 상담 및 견적 안내.
                    보유 기간: 상담 완료 후 6개월.
                  </span>
                </label>
                {errors.agree && (
                  <p className="-mt-2 text-xs font-medium text-rose-500">
                    {errors.agree}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full text-base disabled:cursor-wait"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      접수 중…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      무료로 상담 신청하기
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-ink-muted">
                  제출 즉시 상담이 접수되며, 매니저가 직접 연락드립니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function inputCls(error?: string) {
  return [
    'w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-ink placeholder:text-ink-light/70 transition',
    'focus:outline-none focus:ring-4 focus:ring-brand-500/15',
    error
      ? 'border-rose-300 focus:border-rose-400'
      : 'border-slate-200 focus:border-brand-400',
  ].join(' ')
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label
          htmlFor={htmlFor}
          className="text-sm font-bold text-ink"
        >
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
        {hint && <span className="text-xs text-ink-muted">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>
      )}
    </div>
  )
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mint-100 text-mint-700">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
        상담 신청이 완료되었어요!
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
        입력해주신 연락처로 평균 24시간 이내 전담 매니저가 연락드릴게요.
        <br />
        영업일 기준이며, 급한 경우 카카오톡 채널로도 문의 가능합니다.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button onClick={onReset} className="btn-secondary">
          추가로 신청하기
        </button>
        <a href="#top" className="btn-ghost">
          맨 위로
        </a>
      </div>
    </div>
  )
}
