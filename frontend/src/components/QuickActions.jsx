const buttonStyles = {
  primary: "bg-slate text-white hover:bg-cyan hover:text-ocean dark:bg-cyan dark:text-ocean",
  secondary: "border border-slate/10 text-slate hover:bg-slate/5 dark:border-white/10 dark:text-mist dark:hover:bg-white/5",
};

export default function QuickActions({ title = "Quick Actions", actions }) {
  return (
    <section className="interactive-card rounded-[26px] border border-white/10 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate dark:text-white">{title}</h3>
        <p className="text-sm text-slate/60 dark:text-mist/60">Fast access to the most common dashboard tasks</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`interactive-button rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${buttonStyles[action.variant || "primary"]}`}
          >
            <span className="block">{action.label}</span>
            {action.helper ? <span className="mt-1 block text-xs font-normal opacity-80">{action.helper}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
