const menuIcons = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6Zm10-10h8V3h-8v8Z" /></svg>
  ),
  create: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>
  ),
  myTests: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>
  ),
  available: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
  ),
  results: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19h16" /><path d="M7 15l3-3 3 2 4-5" /></svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19V5M10 19v-8M16 19v-5M22 19v-12" /></svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M19.4 15a1.6 1.6 0 0 0 .32 1.76l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.6 1.6 0 0 0 15 19.4a1.6 1.6 0 0 0-1 .6 1.6 1.6 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-.4-1.1 1.6 1.6 0 0 0-1-.6 1.6 1.6 0 0 0-1.76.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.6 15a1.6 1.6 0 0 0-.6-1 1.6 1.6 0 0 0-1.1-.4H2.8a2 2 0 1 1 0-4H2.9a1.6 1.6 0 0 0 1.1-.4 1.6 1.6 0 0 0 .6-1 1.6 1.6 0 0 0-.32-1.76l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 9 4.6c.37-.1.7-.33 1-.6.27-.29.41-.67.4-1.06V2.8a2 2 0 1 1 4 0v.1c-.01.39.13.77.4 1.06.3.27.63.5 1 .6a1.6 1.6 0 0 0 1.76-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.4 9c.1.37.33.7.6 1 .29.27.67.41 1.06.4h.14a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.1.4 1.6 1.6 0 0 0-.6 1Z" /></svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></svg>
  ),
};

export default function Sidebar({ items, activeKey, onSelect }) {
  return (
    <aside className="interactive-card flex h-full w-full flex-col rounded-[28px] border border-white/10 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5 dark:shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
      <div className="mb-8 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan">Exam Forge</p>
        <h2 className="mt-3 font-display text-3xl text-slate dark:text-white">Control Hub</h2>
        <p className="mt-2 text-sm text-slate/60 dark:text-mist/60">Navigate tests, analytics, results, and settings from one place.</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`interactive-button relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${
                isActive
                  ? "bg-slate text-white shadow-lg dark:bg-cyan dark:text-ocean"
                  : "text-slate hover:bg-slate/5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] dark:text-mist dark:hover:bg-white/5"
              }`}
            >
              {isActive ? <span className="absolute left-0 top-3 h-8 w-1 rounded-r-full bg-cyan dark:bg-ocean" /> : null}
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-bold ${
                  isActive
                    ? "bg-white/15 text-white dark:bg-ocean/10 dark:text-ocean"
                    : "bg-slate/5 text-slate dark:bg-white/10 dark:text-mist"
                }`}
              >
                {menuIcons[item.key] || menuIcons.dashboard}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
