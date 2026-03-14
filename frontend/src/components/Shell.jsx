export default function Shell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-[1500px] animate-rise rounded-[32px] border border-white/10 bg-white/70 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/5 dark:bg-white/5 dark:shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#18263d_100%)] p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.35)] dark:border-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan">Exam Forge</p>
            <h2 className="mt-4 font-display text-4xl leading-tight">Public Access</h2>
            <p className="mt-4 text-sm text-white/75">
              Same product language as the internal dashboard, adapted for entry, signup, and module access.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Faculty workspace",
                "Student access portal",
                "AI-generated tests",
                "Analytics-driven flow",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/70 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/5 dark:bg-white/5 sm:p-8">
            <header className="mb-8 border-b border-slate/10 pb-6 dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">AI-powered evaluation builder</p>
              <h1 className="mt-3 text-balance font-display text-4xl leading-tight text-slate dark:text-white sm:text-6xl">{title}</h1>
              {subtitle ? <p className="mt-4 max-w-3xl font-body text-base text-slate/70 dark:text-mist/70">{subtitle}</p> : null}
            </header>

            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
