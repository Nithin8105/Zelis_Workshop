import { useState } from "react";

export default function StudentAccessPage({ onLoadTest, loading, error, onLogout, onOpenHistory }) {
  const [testId, setTestId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onLoadTest(Number(testId));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-moss/20 bg-white/80 p-4">
        <h2 className="font-body text-xl font-semibold text-ink">Student Test Access</h2>
        <p className="mt-2 text-sm text-moss/80">Enter the Test ID shared by faculty to begin the attempt.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-moss/20 bg-white/75 p-4">
        <div>
          <label htmlFor="test-id" className="block text-sm font-semibold text-ink">
            Test ID
          </label>
          <input
            id="test-id"
            type="number"
            min={1}
            required
            value={testId}
            onChange={(event) => setTestId(event.target.value)}
            className="mt-2 w-full rounded-xl border border-moss/30 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-ember"
            placeholder="e.g. 12"
          />
        </div>

        {error ? <p className="rounded-xl bg-ember/10 p-3 text-sm text-ember">{error}</p> : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-sand transition hover:bg-ink disabled:opacity-70"
          >
            {loading ? "Loading Test..." : "Start Test"}
          </button>
          <button
            type="button"
            onClick={onOpenHistory}
            className="rounded-xl border border-moss/35 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
          >
            View My History
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-moss/35 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}
