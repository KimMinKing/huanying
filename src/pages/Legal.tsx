/**
 * 법적 페이지(이용약관 / 개인정보처리방침) 공통 레이아웃.
 * 마크다운 스타일의 글 본문을 styled prose로 렌더링.
 */
export default function Legal({
  title,
  effectiveDate,
  sections,
}: {
  title: string
  effectiveDate: string
  sections: { id: string; heading: string; body: React.ReactNode }[]
}) {
  return (
    <section className="bg-slate-50/60 py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
              {title}
            </p>
            <p className="mt-1 text-sm text-ink-muted">시행일: {effectiveDate}</p>

            <nav className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                목차
              </p>
              <ol className="mt-3 space-y-1.5 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-ink-soft transition hover:text-brand-700"
                    >
                      <span className="font-bold text-ink-muted">{i + 1}.</span>{' '}
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="legal-prose mt-10 space-y-10">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-xl font-extrabold tracking-tight text-ink">
                    <span className="text-brand-700">{i + 1}.</span> {s.heading}
                  </h2>
                  <div className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {s.body}
                  </div>
                </section>
              ))}
            </article>

            <p className="mt-12 rounded-2xl bg-brand-50 px-4 py-3 text-xs text-brand-800">
              본 {title}은(는) 라이플의 서비스 이용과 관련된 중요한 사항을 규정합니다.
              자세한 문의는{' '}
              <a
                href="mailto:hello@lifful.example"
                className="font-bold underline underline-offset-2"
              >
                hello@lifful.example
              </a>{' '}
              으로 연락 주세요.
            </p>
          </div>
        </div>
      </section>
  )
}
