export default function ActivityTable({ rows, title = "Recent Activity" }) {
  const badgeClass = (status) => {
    if (status === "Failed") {
      return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
    }
    if (status === "Pending") {
      return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
    }
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
  };

  return (
    <section className="interactive-card rounded-[26px] border border-white/10 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate dark:text-white">{title}</h3>
        <p className="text-sm text-slate/60 dark:text-mist/60">Latest test activity and outcomes</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate/10 text-slate/55 dark:border-white/10 dark:text-mist/55">
              <th className="pb-3 pr-4 font-medium">Student Name</th>
              <th className="pb-3 pr-4 font-medium">Test Name</th>
              <th className="pb-3 pr-4 font-medium">Score</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate/55 dark:text-mist/55">
                  No recent activity yet. New attempts and submissions will appear here.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="table-row-hover border-b border-slate/10 last:border-0 dark:border-white/5">
                  <td className="py-4 pr-4 font-medium text-slate dark:text-white">{row.studentName}</td>
                  <td className="py-4 pr-4 text-slate/75 dark:text-mist/75">{row.testName}</td>
                  <td className="py-4 pr-4 text-slate/75 dark:text-mist/75">{row.score}</td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-slate/60 dark:text-mist/60">{row.time || "--"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
