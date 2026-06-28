import { useState, type FormEvent } from 'react'
import { Save, Building2, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { siteConfig } from '../../data/comparison'
import { contactChannels } from '../../data/chineseServices'

/**
 * 사이트 설정 페이지.
 *
 * ⚠️ 읽기 전용 — 현재는 사이트 데이터가 하드코딩되어 있어서
 *    이 폼의 제출은 시각적으로 "저장됨" 처리만 하고 실제로는 저장하지 않습니다.
 *    백엔드/DB 연동 시 siteConfig + contactChannels를 DB에서 로드하고
 *    이 폼의 제출을 UPDATE API 호출로 교체하면 됩니다.
 */
export default function AdminSettings() {
  const [company, setCompany] = useState({
    name: siteConfig.company.name,
    ceo: siteConfig.company.ceo,
    businessNumber: siteConfig.company.businessNumber,
    mailOrderNumber: siteConfig.company.mailOrderNumber,
    address: siteConfig.company.address,
    email: siteConfig.company.email,
    phone: siteConfig.company.phone,
    csHours: siteConfig.company.csHours,
  })

  const [channels, setChannels] = useState<{
    kakaoHandle: string
    kakaoUrl: string
    wechatHandle: string
    wechatUrl: string
  }>({
    kakaoHandle: contactChannels.kakao.handle,
    kakaoUrl: '',
    wechatHandle: contactChannels.wechat.handle,
    wechatUrl: '',
  })

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    // ⚠️ MOCK: 실제 저장 안 함. 알림만 표시.
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">사이트 설정</h1>
        <p className="mt-1 text-sm text-ink-soft">
          회사 정보와 상담 채널을 관리합니다.
        </p>
      </div>

      {/* 알림 */}
      <div className="flex items-start gap-2 rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3 text-xs font-medium text-gold-800">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          이 폼은 현재 읽기 전용입니다. 실제 반영은 <code className="font-mono">src/data/comparison.ts</code>,{' '}
          <code className="font-mono">src/data/chineseServices.ts</code>를 직접 수정해야 합니다.
          백엔드 연동 후 저장 기능이 활성화됩니다.
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* 회사 정보 */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
            <Building2 className="h-4 w-4 text-brand-600" />
            회사 / 사업자 정보
          </h2>
          <p className="mt-1 text-xs text-ink-muted">Footer와 사업자 정보 표시에 사용</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="상호">
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="대표">
              <input
                type="text"
                value={company.ceo}
                onChange={(e) => setCompany({ ...company, ceo: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="사업자등록번호">
              <input
                type="text"
                value={company.businessNumber}
                onChange={(e) => setCompany({ ...company, businessNumber: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="통신판매업 신고번호">
              <input
                type="text"
                value={company.mailOrderNumber}
                onChange={(e) => setCompany({ ...company, mailOrderNumber: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="주소" full>
              <input
                type="text"
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="대표 이메일">
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="고객센터 전화">
              <input
                type="text"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="운영 시간" full>
              <input
                type="text"
                value={company.csHours}
                onChange={(e) => setCompany({ ...company, csHours: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* 상담 채널 */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
            <MessageCircle className="h-4 w-4 text-brand-600" />
            메신저 상담 채널
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            KakaoTalk 채널 URL, WeChat ID를 등록하세요. 자세한 입력 가이드는{' '}
            <code className="font-mono">DATA.md</code> 참고.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="KakaoTalk 채널 검색 ID">
              <input
                type="text"
                value={channels.kakaoHandle}
                onChange={(e) => setChannels({ ...channels, kakaoHandle: e.target.value })}
                className={inputCls}
                placeholder="@라이플"
              />
            </Field>
            <Field label="KakaoTalk 채널 URL">
              <input
                type="url"
                value={channels.kakaoUrl}
                onChange={(e) => setChannels({ ...channels, kakaoUrl: e.target.value })}
                className={inputCls}
                placeholder="https://pf.kakao.com/_..."
              />
            </Field>
            <Field label="WeChat ID">
              <input
                type="text"
                value={channels.wechatHandle}
                onChange={(e) => setChannels({ ...channels, wechatHandle: e.target.value })}
                className={inputCls}
                placeholder="lifful_kr"
              />
            </Field>
            <Field label="WeChat QR 이미지 URL">
              <input
                type="url"
                value={channels.wechatUrl}
                onChange={(e) => setChannels({ ...channels, wechatUrl: e.target.value })}
                className={inputCls}
                placeholder="https://.../wechat-qr.png"
              />
            </Field>
          </div>
        </section>

        {/* 하단 액션 */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {error && (
            <p className="flex items-center gap-1 text-sm font-medium text-brand-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
          {saved && (
            <p className="flex items-center gap-1 text-sm font-semibold text-mint-700">
              <CheckCircle2 className="h-4 w-4" />
              저장되었습니다 (목업 — 실제 반영 안 됨)
            </p>
          )}
          <button type="submit" className="btn-primary">
            <Save className="h-4 w-4" />
            저장
          </button>
        </div>
      </form>
    </div>
  )
}

const inputCls =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15'

function Field({
  label,
  full,
  children,
}: {
  label: string
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <label className={full ? 'block sm:col-span-2' : 'block'}>
      <span className="mb-1.5 block text-xs font-bold text-ink-soft">{label}</span>
      {children}
    </label>
  )
}
