import { useState, type FormEvent } from 'react'
import { CheckCircle2, RotateCcw, Save, ShieldAlert, Smartphone } from 'lucide-react'
import { getSession } from '../../lib/adminAuth'
import {
  getMobilePricingSettings,
  resetMobilePricingSettings,
  saveMobilePricingSettings,
  type MobilePricingSettings,
} from '../../lib/mobilePlans'

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15'

export default function AdminMobilePricing() {
  const session = getSession()
  const canEdit = session?.role === 'super_admin'
  const [settings, setSettings] = useState<MobilePricingSettings>(getMobilePricingSettings())
  const [saved, setSaved] = useState(false)

  const updateCarrier = (
    id: MobilePricingSettings['carriers'][number]['id'],
    patch: Partial<MobilePricingSettings['carriers'][number]>,
  ) => {
    setSettings((current) => ({
      ...current,
      carriers: current.carriers.map((carrier) =>
        carrier.id === id ? { ...carrier, ...patch } : carrier,
      ),
    }))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canEdit) return

    await saveMobilePricingSettings(settings)
    setSettings(getMobilePricingSettings())
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  const onReset = () => {
    if (!canEdit) return
    resetMobilePricingSettings()
    setSettings(getMobilePricingSettings())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">휴대폰 요금 관리</h1>
          <p className="mt-1 text-sm text-ink-soft">
            서비스 상세 페이지의 휴대폰 예상 월 요금 계산에 사용되는 기준값입니다.
          </p>
        </div>
        <a href="/services/mobile" target="_blank" className="btn-secondary text-sm">
          서비스 화면 확인
        </a>
      </div>

      {!canEdit ? (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>일반 관리자는 조회만 가능합니다. 수정은 최상위 관리자만 할 수 있습니다.</span>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
              <Smartphone className="h-4 w-4 text-brand-600" />
              통신사 기본 월 요금
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-5 py-3">통신사</th>
                  <th className="px-5 py-3">표시 이름</th>
                  <th className="px-5 py-3">기본가</th>
                  <th className="px-5 py-3">사용 여부</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {settings.carriers.map((carrier) => (
                  <tr key={carrier.id}>
                    <td className="px-5 py-3 font-bold text-ink">{carrier.id.toUpperCase()}</td>
                    <td className="px-5 py-3">
                      <input
                        value={carrier.name}
                        disabled={!canEdit}
                        onChange={(event) => updateCarrier(carrier.id, { name: event.target.value })}
                        className={inputCls}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={carrier.basePrice}
                        disabled={!canEdit}
                        onChange={(event) =>
                          updateCarrier(carrier.id, { basePrice: Number(event.target.value) })
                        }
                        className={inputCls}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
                        <input
                          type="checkbox"
                          checked={carrier.isActive}
                          disabled={!canEdit}
                          onChange={(event) =>
                            updateCarrier(carrier.id, { isActive: event.target.checked })
                          }
                          className="h-4 w-4 accent-brand-600"
                        />
                        활성
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <PricingGroup title="요금제 성향 배율">
            <NumberField
              label="알뜰하게"
              value={settings.planMultipliers.budget}
              disabled={!canEdit}
              step={0.1}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  planMultipliers: { ...current.planMultipliers, budget: value },
                }))
              }
            />
            <NumberField
              label="정식 통신사 중심"
              value={settings.planMultipliers.major}
              disabled={!canEdit}
              step={0.1}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  planMultipliers: { ...current.planMultipliers, major: value },
                }))
              }
            />
          </PricingGroup>

          <PricingGroup title="데이터 사용량 추가금">
            <NumberField
              label="가볍게"
              value={settings.dataExtras.light}
              disabled={!canEdit}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  dataExtras: { ...current.dataExtras, light: value },
                }))
              }
            />
            <NumberField
              label="보통"
              value={settings.dataExtras.standard}
              disabled={!canEdit}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  dataExtras: { ...current.dataExtras, standard: value },
                }))
              }
            />
            <NumberField
              label="많이 씀"
              value={settings.dataExtras.heavy}
              disabled={!canEdit}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  dataExtras: { ...current.dataExtras, heavy: value },
                }))
              }
            />
          </PricingGroup>

          <PricingGroup title="추가 조건 금액">
            <NumberField
              label="없음"
              value={settings.optionExtras.none}
              disabled={!canEdit}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  optionExtras: { ...current.optionExtras, none: value },
                }))
              }
            />
            <NumberField
              label="가족 결합 가능"
              value={settings.optionExtras.family}
              disabled={!canEdit}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  optionExtras: { ...current.optionExtras, family: value },
                }))
              }
            />
            <NumberField
              label="eSIM 필요"
              value={settings.optionExtras.esim}
              disabled={!canEdit}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  optionExtras: { ...current.optionExtras, esim: value },
                }))
              }
            />
          </PricingGroup>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {saved ? (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-mint-700">
              <CheckCircle2 className="h-4 w-4" />
              저장되었습니다.
            </span>
          ) : null}
          <button type="button" onClick={onReset} disabled={!canEdit} className="btn-secondary text-sm">
            <RotateCcw className="h-4 w-4" />
            기본값 복원
          </button>
          <button type="submit" disabled={!canEdit} className="btn-primary text-sm">
            <Save className="h-4 w-4" />
            저장
          </button>
        </div>
      </form>
    </div>
  )
}

function PricingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  )
}

function NumberField({
  label,
  value,
  disabled,
  step = 100,
  onChange,
}: {
  label: string
  value: number
  disabled: boolean
  step?: number
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-ink-soft">{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className={inputCls}
      />
    </label>
  )
}
