import { useMemo, useRef, useState } from "react";

const getInitialAnswers = (questions) =>
  questions.reduce((acc, _, idx) => {
    acc[idx] = "";
    return acc;
  }, {});

const getInitialNotes = (questions) =>
  questions.reduce((acc, _, idx) => {
    acc[idx] = "";
    return acc;
  }, {});

export default function StudentModePage({ test, onSubmitAttempt, onExit }) {
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState(() => getInitialAnswers(test.questions));
  const [notes, setNotes] = useState(() => getInitialNotes(test.questions));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const examWrapRef = useRef(null);

  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  );

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await examWrapRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmitAttempt({ studentName, answers, notes });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={examWrapRef} className="space-y-5">
      <section className="sticky top-3 z-20 rounded-2xl border border-moss/25 bg-white/95 p-4 shadow-md backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-body text-lg font-semibold text-ink">Student Full-Screen Exam Mode</h2>
            <p className="text-sm text-moss/80">
              Answered {answeredCount}/{test.questions.length} questions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-xl border border-moss/40 px-3 py-2 text-sm text-ink transition hover:bg-moss/10"
            >
              {isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-xl border border-moss/40 px-3 py-2 text-sm text-ink transition hover:bg-moss/10"
            >
              Exit Student Mode
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-sand transition hover:bg-ink"
            >
              {submitting ? "Submitting..." : "Submit And Open Download"}
            </button>
          </div>
        </div>

        <div className="mt-3">
          <label htmlFor="studentName" className="block text-sm font-semibold text-ink">
            Student Name (optional)
          </label>
          <input
            id="studentName"
            type="text"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-moss/30 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-ember"
            placeholder="Enter student name"
          />
        </div>
      </section>

      <section className="space-y-4">
        {test.questions.map((mcq, qIndex) => (
          <article key={`${mcq.question}-${qIndex}`} className="rounded-2xl border border-moss/20 bg-white/85 p-4">
            <h3 className="font-body text-base font-semibold text-ink">
              Q{qIndex + 1}. {mcq.question}
            </h3>

            <div className="mt-3 grid gap-2">
              {mcq.options.map((option, optionIndex) => {
                const label = String.fromCharCode(65 + optionIndex);
                const selected = answers[qIndex] === option;
                return (
                  <button
                    key={`${qIndex}-${option}`}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [qIndex]: option }))}
                    className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                      selected
                        ? "border-ember bg-ember/10 text-ink"
                        : "border-moss/20 bg-sand text-moss hover:border-moss/40"
                    }`}
                  >
                    {label}. {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <label htmlFor={`note-${qIndex}`} className="block text-sm font-semibold text-ink">
                Student Note / Working Area
              </label>
              <textarea
                id={`note-${qIndex}`}
                value={notes[qIndex]}
                onChange={(event) => setNotes((prev) => ({ ...prev, [qIndex]: event.target.value }))}
                rows={3}
                className="mt-2 w-full rounded-xl border border-moss/30 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-ember"
                placeholder="Write your working or explanation here"
              />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
