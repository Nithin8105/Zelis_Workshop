export default function StudentHistoryPage({ attempts, onBack }) {
  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-moss/35 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
      >
        Back to Student Access
      </button>

      <div className="rounded-2xl border border-moss/20 bg-white/80 p-4">
        <h2 className="font-body text-lg font-semibold text-ink">Your Attended Test History</h2>
      </div>

      <div className="space-y-3">
        {attempts.length === 0 ? (
          <p className="rounded-xl border border-moss/20 bg-white/75 p-4 text-sm text-moss/80">
            No attended tests found yet.
          </p>
        ) : (
          attempts.map((attempt) => (
            <article key={attempt.attemptId} className="rounded-2xl border border-moss/20 bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Test ID: {attempt.testId}</p>
              <p className="text-sm text-moss/80">Topics: {attempt.topicsRaw}</p>
              <p className="text-sm text-moss/80">Difficulty: {attempt.difficulty}</p>
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
