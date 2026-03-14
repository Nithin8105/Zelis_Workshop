export default function FacultyHistoryPage({ tests, onOpenAttempts, onCreateNew, onLogout, loading, error }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-sand transition hover:bg-ink"
        >
          Create New Test
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-moss/35 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
        >
          Logout
        </button>
      </div>

      {error ? <p className="rounded-xl bg-ember/10 p-3 text-sm text-ember">{error}</p> : null}
      {loading ? <p className="text-sm text-moss/80">Loading conducted tests...</p> : null}

      <div className="space-y-3">
        {tests.length === 0 ? (
          <p className="rounded-xl border border-moss/20 bg-white/75 p-4 text-sm text-moss/80">
            No conducted tests yet.
          </p>
        ) : (
          tests.map((test) => (
            <article key={test.id} className="rounded-2xl border border-moss/20 bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Test ID: {test.id}</p>
              <p className="text-sm text-moss/80">Topics: {test.topicsRaw}</p>
              <p className="text-sm text-moss/80">Difficulty: {test.difficulty}</p>
              <p className="text-sm text-moss/80">Questions: {test.questionCount}</p>
              <p className="text-sm text-moss/80">Attempts: {test.attemptCount}</p>
              <p className="text-sm text-moss/80">Student PDF Access: {test.allowStudentPdf ? "Enabled" : "Disabled"}</p>
              <button
                type="button"
                onClick={() => onOpenAttempts(test.id)}
                className="mt-3 rounded-xl border border-moss/35 px-3 py-2 text-sm text-ink transition hover:bg-moss/10"
              >
                View Student Marks
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
