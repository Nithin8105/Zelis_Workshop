export default function TestPage({
  test,
  onEdit,
  onGoStudentMode,
  onGoDownload,
  onToggleStudentPdf,
  onOpenConductedHistory,
  onLogout,
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-moss/20 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Test ID: {test.testId}</p>
          <p className="text-sm text-moss/80">Topics: {test.topics.join(", ")}</p>
          <p className="text-sm text-moss/80">Difficulty: {test.difficulty}</p>
          <p className="text-sm text-moss/80">Questions: {test.numberOfQuestions}</p>
          <p className="text-sm text-moss/80">Student PDF Access: {test.allowStudentPdf ? "Enabled" : "Disabled"}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl border border-moss/40 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
          >
            Edit Inputs
          </button>
          <button
            type="button"
            onClick={onGoStudentMode}
            className="rounded-xl border border-moss/40 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
          >
            Start Student Mode
          </button>
          <button
            type="button"
            onClick={onGoDownload}
            className="rounded-xl bg-moss px-4 py-2 text-sm text-sand transition hover:bg-ink"
          >
            Download Generated Paper
          </button>
          <button
            type="button"
            onClick={onToggleStudentPdf}
            className="rounded-xl border border-moss/40 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
          >
            {test.allowStudentPdf ? "Disable Student PDF" : "Enable Student PDF"}
          </button>
          <button
            type="button"
            onClick={onOpenConductedHistory}
            className="rounded-xl border border-moss/40 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
          >
            Conducted History
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-moss/40 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {test.questions.map((mcq, index) => (
          <article key={`${mcq.question}-${index}`} className="rounded-2xl border border-moss/20 bg-white/80 p-4">
            <h3 className="font-body text-base font-semibold text-ink">
              Q{index + 1}. {mcq.question}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-moss">
              {mcq.options.map((option, optionIndex) => {
                const label = String.fromCharCode(65 + optionIndex);
                return (
                  <li key={option} className="rounded-xl border border-moss/15 bg-sand px-3 py-2">
                    {label}. {option}
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
