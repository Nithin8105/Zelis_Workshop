const iconMap = {
  tests: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3.5" />
      <path d="M20 8v6M23 11h-6" />
    </svg>
  ),
  attempts: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 8v5l3 3" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  score: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19h16" />
      <path d="M7 16l3-4 3 2 4-6" />
    </svg>
  ),
  upcoming: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
};

const accentMap = {
  cyan: "from-cyan/20 to-cyan/5 text-cyan",
  emerald: "from-emerald-400/20 to-emerald-400/5 text-emerald-500",
  amber: "from-amber-400/20 to-amber-400/5 text-amber-500",
  indigo: "from-indigo-400/20 to-indigo-400/5 text-indigo-500",
};

export default function StatCard({ label, value, helper, trend, icon = "tests", accent = "cyan" }) {
  const accentClass = accentMap[accent] || accentMap.cyan;

  return (
    <article className={`interactive-card relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br ${accentClass} bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5`}>
      <span className="dashboard-orb -right-8 top-2 h-20 w-20 bg-current/10" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate/60 dark:text-mist/60">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate dark:text-white">{value}</p>
          {trend ? <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">{trend}</p> : null}
        </div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate text-white dark:bg-cyan dark:text-ocean">
          {iconMap[icon] || iconMap.tests}
        </span>
      </div>
      {helper ? <p className="relative z-10 mt-4 text-xs text-slate/55 dark:text-mist/55">{helper}</p> : null}
    </article>
  );
}
