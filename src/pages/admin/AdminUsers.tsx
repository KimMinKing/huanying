import { useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Plus, ShieldCheck, UserPlus } from 'lucide-react'
import {
  createAdmin,
  getSession,
  listAdmins,
  type AdminRole,
  type AdminUser,
} from '../../lib/adminAuth'

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15'

export default function AdminUsers() {
  const session = getSession()
  const [admins, setAdmins] = useState<AdminUser[]>(listAdmins())
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'admin' as AdminRole,
  })
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const canManage = session?.role === 'super_admin'

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSaved(false)

    try {
      await createAdmin(form)
      setAdmins(listAdmins())
      setForm({ email: '', name: '', password: '', role: 'admin' })
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
    } catch (err) {
      setError(err instanceof Error ? err.message : '관리자 추가에 실패했습니다.')
    }
  }

  if (!canManage) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
        관리자 관리는 최상위 관리자만 접근할 수 있습니다.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">관리자 관리</h1>
        <p className="mt-1 text-sm text-ink-soft">
          최상위 관리자는 다른 관리자를 추가하고 권한을 지정할 수 있습니다.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
          <UserPlus className="h-4 w-4 text-brand-600" />
          관리자 추가
        </h2>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_180px_auto]">
          <Field label="이름">
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className={inputCls}
              required
            />
          </Field>
          <Field label="이메일">
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className={inputCls}
              required
            />
          </Field>
          <Field label="초기 비밀번호">
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className={inputCls}
              required
            />
          </Field>
          <Field label="권한">
            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value as AdminRole })}
              className={inputCls}
            >
              <option value="admin">일반 관리자</option>
              <option value="super_admin">최상위 관리자</option>
            </select>
          </Field>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full text-sm">
              <Plus className="h-4 w-4" />
              추가
            </button>
          </div>
        </form>

        {error ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        ) : null}

        {saved ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-mint-200 bg-mint-50 px-4 py-3 text-sm font-medium text-mint-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            관리자가 추가되었습니다.
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-bold text-ink">관리자 목록</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-5 py-3">이름</th>
                <th className="px-5 py-3">이메일</th>
                <th className="px-5 py-3">권한</th>
                <th className="px-5 py-3">상태</th>
                <th className="px-5 py-3">생성일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-5 py-3 font-bold text-ink">{admin.name}</td>
                  <td className="px-5 py-3 text-ink-soft">{admin.email}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-ink-soft">
                      <ShieldCheck className="h-3 w-3" />
                      {admin.role === 'super_admin' ? '최상위 관리자' : '일반 관리자'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full border border-mint-200 bg-mint-50 px-2 py-0.5 text-xs font-bold text-mint-700">
                      {admin.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-muted">
                    {new Date(admin.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-ink-soft">{label}</span>
      {children}
    </label>
  )
}
