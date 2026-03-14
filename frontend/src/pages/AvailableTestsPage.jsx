export default function AvailableTestsPage({ tests, onOpenTest, loading }) {
  return (
    <div className="space-y-4">
      {loading ? <p className="text-sm text-slate/60 dark:text-mist/60">Loading available tests...</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {tests.length === 0 ? (
          <div className="interactive-card rounded-[26px] border border-white/10 bg-white/75 p-5 text-sm text-slate/60 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5 dark:text-mist/60">
            No tests created yet. Faculty needs to create and publish the first AI-generated test.
          </div>
        ) : (
          tests.map((test) => (
            <article
              key={test.id}
              className="interactive-card rounded-[26px] border border-white/10 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-cyan">Test ID {test.id}</p>
              <h3 className="mt-3 text-lg font-semibold text-slate dark:text-white">{test.topicsRaw}</h3>
              <div className="mt-3 grid gap-2 text-sm text-slate/65 dark:text-mist/65">
                <p>Difficulty: {test.difficulty}</p>
                <p>Questions: {test.questionCount}</p>
                <p>Student PDF: {test.allowStudentPdf ? "Enabled" : "Disabled"}</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenTest(test.id)}
                className="interactive-button mt-5 rounded-2xl bg-slate px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-cyan hover:text-ocean dark:bg-cyan dark:text-ocean"
              >
                Take Test
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
