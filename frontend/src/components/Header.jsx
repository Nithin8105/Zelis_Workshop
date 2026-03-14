export default function Header({ title, subtitle, user, theme, onToggleTheme }) {
  return (
    <header className="interactive-card relative flex flex-col gap-4 overflow-hidden rounded-[28px] border border-white/10 bg-white/75 px-5 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5 dark:shadow-[0_20px_55px_rgba(0,0,0,0.35)] lg:flex-row lg:items-center lg:justify-between">
      <span className="dashboard-orb -right-10 top-0 h-28 w-28 bg-cyan/30" />
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan">Analytics Dashboard</p>
        <h1 className="mt-2 font-display text-3xl text-slate dark:text-white">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-slate/70 dark:text-mist/70">{subtitle}</p> : null}
      </div>

      <div className="relative z-10 flex items-center gap-3 self-start lg:self-auto">
        <button
          type="button"
          onClick={onToggleTheme}
          className="interactive-button rounded-2xl border border-slate/10 bg-slate/5 px-4 py-2 text-sm font-medium text-slate transition hover:bg-slate/10 dark:border-white/10 dark:bg-white/5 dark:text-mist dark:hover:bg-white/10"
        >
          {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
        </button>

        <div className="interactive-card flex items-center gap-3 rounded-2xl border border-slate/10 bg-slate/5 px-3 py-2 dark:border-white/10 dark:bg-white/5">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate text-sm font-bold text-white dark:bg-cyan dark:text-ocean">
            {user?.name?.slice(0, 2)?.toUpperCase() || "GU"}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate dark:text-white">{user?.name || "Guest User"}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate/55 dark:text-mist/60">{user?.role || "visitor"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
