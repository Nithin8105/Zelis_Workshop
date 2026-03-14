export default function LandingPage({ onFacultyStart, onStudentStart }) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="interactive-card relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#0f172a_0%,#17263c_58%,#3aaed8_180%)] p-6 text-white shadow-[0_22px_60px_rgba(15,23,42,0.25)]">
          <span className="dashboard-orb -right-12 -top-10 h-40 w-40 bg-cyan/25" />
          <span className="dashboard-orb bottom-0 left-10 h-28 w-28 bg-indigo-400/20" />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan/80">Main Workspace</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
            Launch the test platform from a dashboard-first experience.
          </h2>
          <p className="mt-5 max-w-2xl text-sm text-white/78 sm:text-base">
            Faculty create and publish assessments. Students access tests, submit responses, and track results from
            the same analytics-driven environment.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onFacultyStart}
              className="interactive-button rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate transition hover:bg-cyan hover:text-ocean"
            >
              Enter Faculty Dashboard
            </button>
            <button
              type="button"
              onClick={onStudentStart}
              className="interactive-button rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Start Student Test
            </button>
          </div>
        </article>

        <article className="interactive-card rounded-[28px] border border-white/10 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">Quick Snapshot</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {[
              ["AI Generation", "MCQ papers from syllabus topics"],
              ["Role Modules", "Separate faculty and student access"],
              ["Results Flow", "Attempts, marks, and download control"],
              ["Admin Analytics", "Performance and activity insights"],
            ].map(([title, text]) => (
              <div key={title} className="interactive-card rounded-2xl border border-slate/10 bg-slate/5 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold text-slate dark:text-white">{title}</p>
                <p className="mt-1 text-sm text-slate/65 dark:text-mist/65">{text}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Tests", "24", "TT"],
          ["Students Active", "138", "ST"],
          ["Attempts Logged", "412", "AT"],
          ["Avg Score", "78%", "SC"],
        ].map(([label, value, icon]) => (
          <article key={label} className="interactive-card rounded-[26px] border border-white/10 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate/60 dark:text-mist/60">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate dark:text-white">{value}</p>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate text-xs font-bold text-white dark:bg-cyan dark:text-ocean">
                {icon}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <article className="interactive-card rounded-[28px] border border-white/10 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate dark:text-white">Module Access</h3>
              <p className="text-sm text-slate/60 dark:text-mist/60">Choose a role-specific workspace</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="interactive-card rounded-[24px] border border-slate/10 bg-slate/5 p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan">Faculty</p>
              <h4 className="mt-3 text-xl font-semibold text-slate dark:text-white">Create, publish, and monitor tests</h4>
              <p className="mt-2 text-sm text-slate/65 dark:text-mist/65">
                Build assessments, control student PDF access, and review student marks from one place.
              </p>
              <button
                type="button"
                onClick={onFacultyStart}
                className="interactive-button mt-5 rounded-2xl bg-slate px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan hover:text-ocean dark:bg-cyan dark:text-ocean"
              >
                Continue as Faculty
              </button>
            </div>

            <div className="interactive-card rounded-[24px] border border-slate/10 bg-slate/5 p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan">Student</p>
              <h4 className="mt-3 text-xl font-semibold text-slate dark:text-white">Access available tests and results</h4>
              <p className="mt-2 text-sm text-slate/65 dark:text-mist/65">
                Enter assigned tests, take exams in a focused mode, and review attended history with marks.
              </p>
              <button
                type="button"
                onClick={onStudentStart}
                className="interactive-button mt-5 rounded-2xl bg-slate px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan hover:text-ocean dark:bg-cyan dark:text-ocean"
              >
                Continue as Student
              </button>
            </div>
          </div>
        </article>

        <article className="interactive-card rounded-[28px] border border-white/10 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-slate dark:text-white">Recent Platform Activity</h3>
          <p className="mt-1 text-sm text-slate/60 dark:text-mist/60">Preview of the internal dashboard table style</p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate/10 dark:border-white/10">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3 bg-slate/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate/55 dark:bg-white/5 dark:text-mist/55">
              <span>Student</span>
              <span>Test</span>
              <span>Score</span>
            </div>
            {[
              ["Anika", "DBMS, SQL", "18/20"],
              ["Rahul", "Operating Systems", "15/20"],
              ["Maya", "Computer Networks", "17/20"],
            ].map(([student, test, score]) => (
              <div key={student + test} className="table-row-hover grid grid-cols-[1fr_1fr_auto] gap-3 border-t border-slate/10 px-4 py-4 text-sm text-slate/75 dark:border-white/10 dark:text-mist/75">
                <span className="font-medium text-slate dark:text-white">{student}</span>
                <span>{test}</span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  {score}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
