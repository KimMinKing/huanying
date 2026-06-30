import { useState, type FormEvent } from 'react'
import { CheckCircle2, Plus, RotateCcw, Save, ShieldAlert, Smartphone, Trash2 } from 'lucide-react'
import { getSession } from '../../lib/adminAuth'
import {
  getMobilePricingSettings,
  listMobilePricingAuditLogs,
  resetMobilePricingSettings,
  saveMobilePricingSettings,
  type MobileCarrierId,
  type MobilePlanCard,
  type MobilePricingSettings,
} from '../../lib/mobilePlans'

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:bg-slate-50'

export default function AdminMobilePricing() {
  const session = getSession()
  const canEdit = session?.role === 'super_admin'
  const [settings, setSettings] = useState<MobilePricingSettings>(getMobilePricingSettings())
  const [saved, setSaved] = useState(false)
  const [auditVersion, setAuditVersion] = useState(0)
  const auditLogs = listMobilePricingAuditLogs()
  void auditVersion

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

  const updatePlanCard = (id: string, patch: Partial<MobilePlanCard>) => {
    setSettings((current) => ({
      ...current,
      planCards: current.planCards.map((plan) => (plan.id === id ? { ...plan, ...patch } : plan)),
    }))
  }

  const addPlanCard = () => {
    setSettings((current) => ({
      ...current,
      planCards: [
        ...current.planCards,
        {
          id: `plan-${Date.now()}`,
          carrier: 'skt',
          name: '새 요금제',
          monthlyPrice: 30000,
          dataLabel: '월 10GB',
          callTextLabel: '통화/문자 기본',
          promotionText: '',
          isRecommended: false,
          isVisible: true,
          sortOrder: current.planCards.length + 1,
        },
      ],
    }))
  }

  const removePlanCard = (id: string) => {
    setSettings((current) => ({
      ...current,
      planCards: current.planCards.filter((plan) => plan.id !== id),
    }))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canEdit) return

    await saveMobilePricingSettings(settings, session)
    setSettings(getMobilePricingSettings())
    setAuditVersion((value) => value + 1)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  const onReset = () => {
    if (!canEdit) return
    resetMobilePricingSettings(session)
    setSettings(getMobilePricingSettings())
    setAuditVersion((value) => value + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">휴대폰 요금 관리</h1>
          <p className="mt-1 text-sm text-ink-soft">
            예상 요금 계산 기준과 실제 노출할 요금제 카드를 관리합니다.
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
            <NumberField label="알뜰하게" value={settings.planMultipliers.budget} disabled={!canEdit} step={0.1} onChange={(value) => setSettings((current) => ({ ...current, planMultipliers: { ...current.planMultipliers, budget: value } }))} />
            <NumberField label="정식 통신사 중심" value={settings.planMultipliers.major} disabled={!canEdit} step={0.1} onChange={(value) => setSettings((current) => ({ ...current, planMultipliers: { ...current.planMultipliers, major: value } }))} />
          </PricingGroup>

          <PricingGroup title="데이터 사용량 추가금">
            <NumberField label="가볍게" value={settings.dataExtras.light} disabled={!canEdit} onChange={(value) => setSettings((current) => ({ ...current, dataExtras: { ...current.dataExtras, light: value } }))} />
            <NumberField label="보통" value={settings.dataExtras.standard} disabled={!canEdit} onChange={(value) => setSettings((current) => ({ ...current, dataExtras: { ...current.dataExtras, standard: value } }))} />
            <NumberField label="많이 씀" value={settings.dataExtras.heavy} disabled={!canEdit} onChange={(value) => setSettings((current) => ({ ...current, dataExtras: { ...current.dataExtras, heavy: value } }))} />
          </PricingGroup>

          <PricingGroup title="추가 조건 금액">
            <NumberField label="없음" value={settings.optionExtras.none} disabled={!canEdit} onChange={(value) => setSettings((current) => ({ ...current, optionExtras: { ...current.optionExtras, none: value } }))} />
            <NumberField label="가족 결합 가능" value={settings.optionExtras.family} disabled={!canEdit} onChange={(value) => setSettings((current) => ({ ...current, optionExtras: { ...current.optionExtras, family: value } }))} />
            <NumberField label="eSIM 필요" value={settings.optionExtras.esim} disabled={!canEdit} onChange={(value) => setSettings((current) => ({ ...current, optionExtras: { ...current.optionExtras, esim: value } }))} />
          </PricingGroup>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-bold text-ink">노출 요금제 카드</h2>
            <button type="button" onClick={addPlanCard} disabled={!canEdit} className="btn-secondary text-xs">
              <Plus className="h-3.5 w-3.5" />
              요금제 추가
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {settings.planCards
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((plan) => (
                <div key={plan.id} className="grid gap-3 p-5 lg:grid-cols-[140px_1fr_130px_1fr_1fr_120px]">
                  <select
                    value={plan.carrier}
                    disabled={!canEdit}
                    onChange={(event) =>
                      updatePlanCard(plan.id, { carrier: event.target.value as MobileCarrierId })
                    }
                    className={inputCls}
                  >
                    <option value="skt">SKT</option>
                    <option value="kt">KT</option>
                    <option value="lgu">LG U+</option>
                  </select>
                  <input
                    value={plan.name}
                    disabled={!canEdit}
                    onChange={(event) => updatePlanCard(plan.id, { name: event.target.value })}
                    className={inputCls}
                    placeholder="요금제명"
                  />
                  <input
                    type="number"
                    value={plan.monthlyPrice}
                    disabled={!canEdit}
                    onChange={(event) =>
                      updatePlanCard(plan.id, { monthlyPrice: Number(event.target.value) })
                    }
                    className={inputCls}
                  />
                  <input
                    value={plan.dataLabel}
                    disabled={!canEdit}
                    onChange={(event) => updatePlanCard(plan.id, { dataLabel: event.target.value })}
                    className={inputCls}
                    placeholder="데이터"
                  />
                  <input
                    value={plan.promotionText}
                    disabled={!canEdit}
                    onChange={(event) =>
                      updatePlanCard(plan.id, { promotionText: event.target.value })
                    }
                    className={inputCls}
                    placeholder="프로모션"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-ink-muted">
                      <input
                        type="checkbox"
                        checked={plan.isRecommended}
                        disabled={!canEdit}
                        onChange={(event) =>
                          updatePlanCard(plan.id, { isRecommended: event.target.checked })
                        }
                        className="mr-1 accent-brand-600"
                      />
                      추천
                    </label>
                    <label className="text-xs font-bold text-ink-muted">
                      <input
                        type="checkbox"
                        checked={plan.isVisible}
                        disabled={!canEdit}
                        onChange={(event) =>
                          updatePlanCard(plan.id, { isVisible: event.target.checked })
                        }
                        className="mr-1 accent-brand-600"
                      />
                      노출
                    </label>
                    <button
                      type="button"
                      onClick={() => removePlanCard(plan.id)}
                      disabled={!canEdit}
                      className="text-ink-light hover:text-brand-700"
                      aria-label="요금제 삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
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

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-ink">요금 변경 로그</h2>
        <div className="mt-4 divide-y divide-slate-200">
          {auditLogs.length === 0 ? (
            <p className="py-6 text-sm text-ink-muted">아직 변경 기록이 없습니다.</p>
          ) : (
            auditLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{log.action}</p>
                  <p className="text-xs text-ink-muted">
                    {log.actorName} · {log.actorEmail}
                  </p>
                </div>
                <p className="text-xs text-ink-muted">
                  {new Date(log.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
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
