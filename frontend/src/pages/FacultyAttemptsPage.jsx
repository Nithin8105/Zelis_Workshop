export default function FacultyAttemptsPage({ testId, attempts, onBack }) {
  if (!testId) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-moss/20 bg-white/80 p-4 dark:border-white/5 dark:bg-white/5">
          <h2 className="font-body text-lg font-semibold text-ink dark:text-white">Student Results</h2>
          <p className="mt-2 text-sm text-moss/80 dark:text-mist/70">
            Select a conducted test from My Tests to view the student details and marks for that paper.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-moss/35 px-4 py-2 text-sm text-ink transition hover:bg-moss/10 dark:border-white/10 dark:text-mist dark:hover:bg-white/5"
        >
          Open My Tests
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-moss/35 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
        >
          Back to Conducted Tests
        </button>
      </div>

      <div className="rounded-2xl border border-moss/20 bg-white/80 p-4">
        <h2 className="font-body text-lg font-semibold text-ink">Student Attempts and Marks for Test {testId}</h2>
      </div>

      <div className="space-y-3">
        {attempts.length === 0 ? (
          <p className="rounded-xl border border-moss/20 bg-white/75 p-4 text-sm text-moss/80">
            No student attempts recorded yet.
          </p>
        ) : (
          attempts.map((attempt) => (
            <article key={attempt.id} className="rounded-2xl border border-moss/20 bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">{attempt.studentName}</p>
              <p className="text-sm text-moss/80">Email: {attempt.studentEmail}</p>
              <p className="text-sm text-moss/80">
                Marks: {attempt.score}/{attempt.totalQuestions}
              </p>
              <p className="text-sm text-moss/80">Submitted: {attempt.submittedAt}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
