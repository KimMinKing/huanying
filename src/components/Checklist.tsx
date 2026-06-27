import { useEffect, useMemo, useState } from 'react'
import { checklistGroups } from '../data/settlementSteps'
import { t, type Locale } from '../data/i18n'
import { SectionHeader } from './ServiceCards'

const STORAGE_KEY = 'lifful:settlement-checklist:v1'

/**
 * 한국 정착 체크리스트.
 * - 그룹별로 체크 상태를 localStorage에 저장 (새로고침해도 유지).
 * - 상단에 전체 진행률 바 + 완료 개수 표시.
 * - 모바일에서는 그룹을 1열, 데스크탑에서는 2열로 자동 배치.
 */
export function Checklist({ locale = 'ko' }: { locale?: Locale }) {
  const groups = checklistGroups
  // 모든 체크박스 id 평탄화 → 상태 딕셔너리로 관리
  const allIds = useMemo(
    () =>
      groups.flatMap((g) => g.items.map((_, idx) => `${g.id}:${idx}`)),
    [groups],
  )

  const [checked, setChecked] = useState<Record<string, boolean>>({})

  // 초기 로드: localStorage 복원
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setChecked(JSON.parse(raw))
    } catch {
      /* 저장소 접근 실패 시 무시 */
    }
  }, [])

  // 변경 시 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
    } catch {
      /* 무시 */
    }
  }, [checked])

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))

  const doneCount = allIds.filter((id) => checked[id]).length
  const total = allIds.length
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  const reset = () => setChecked({})

  return (
    <div>
      {/* 진행률 요약 */}
      <div className="sticky top-[calc(var(--header-h)+12px)] z-20 mb-8 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-card backdrop-blur sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-ink">
              정착 준비도 <span className="text-brand-600">{pct}%</span>
            </p>
            <p className="text-xs text-ink-muted">
              {doneCount} / {total} 항목 완료
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden h-2 w-40 overflow-hidden rounded-full bg-slate-100 sm:block">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-gold-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-slate-300 hover:text-ink"
            >
              초기화
            </button>
          </div>
        </div>
        {/* 모바일 진행률 바 */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 sm:hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-gold-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 그룹 그리드 */}
      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((group) => {
          const Icon = group.icon
          const groupIds = group.items.map((_, idx) => `${group.id}:${idx}`)
          const groupDone = groupIds.filter((id) => checked[id]).length
          const groupComplete = groupDone === group.items.length
          return (
            <article
              key={group.id}
              className={[
                'rounded-3xl border bg-white p-5 shadow-soft transition sm:p-6',
                groupComplete
                  ? 'border-mint-200 bg-mint-50/40'
                  : 'border-slate-200',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight text-ink">
                    {t(group.title, locale)}
                  </h3>
                </div>
                <span className="text-xs font-bold text-ink-muted">
                  {groupDone}/{group.items.length}
                </span>
              </div>

              <ul className="mt-4 space-y-1">
                {group.items.map((item, idx) => {
                  const id = `${group.id}:${idx}`
                  const isChecked = !!checked[id]
                  return (
                    <li key={id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl px-2.5 py-2 transition hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(id)}
                          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span
                          className={[
                            'text-sm font-medium leading-snug transition',
                            isChecked
                              ? 'text-ink-muted line-through'
                              : 'text-ink-soft',
                          ].join(' ')}
                        >
                          {t(item, locale)}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export function ChecklistSection({
  locale,
  title,
}: {
  locale?: Locale
  title: React.ReactNode
}) {
  return (
    <section className="section">
      <div className="container-page">
        <SectionHeader eyebrow="정착 체크리스트" align="center" title={title} />
        <div className="mx-auto mt-10 max-w-4xl">
          <Checklist locale={locale} />
        </div>
      </div>
    </section>
  )
}
