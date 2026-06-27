import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  to?: string
}

/**
 * 상세 페이지용 브레드크럼.
 * - 마지막 항목은 현재 페이지 (링크 없음).
 * - 접근성: nav + aria-label.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-muted">
        {items.map((item, idx) => {
          const last = idx === items.length - 1
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className="font-medium transition hover:text-brand-600">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? 'font-bold text-ink' : 'font-medium'}>{item.label}</span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 text-ink-light" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
