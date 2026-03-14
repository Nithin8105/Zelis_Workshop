import { useState } from "react";

const difficulties = ["easy", "medium", "hard"];

export default function InputPage({ onGenerate, loading, error }) {
  const [topics, setTopics] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onGenerate({ topics, difficulty, numberOfQuestions: Number(numberOfQuestions) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="topics" className="block font-body text-sm font-semibold text-ink">
          Syllabus topics
        </label>
        <p className="mt-1 text-sm text-moss/80">Use commas to separate topics, for example: Algebra, Trigonometry, Calculus.</p>
        <textarea
          id="topics"
          value={topics}
          onChange={(event) => setTopics(event.target.value)}
          rows={5}
          required
          className="mt-3 w-full rounded-2xl border border-moss/30 bg-white/80 p-3 text-sm text-ink outline-none ring-0 transition focus:border-ember"
          placeholder="Enter syllabus topics"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="difficulty" className="block font-body text-sm font-semibold text-ink">
            Difficulty level
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-moss/30 bg-white/90 p-3 text-sm text-ink outline-none transition focus:border-ember"
          >
            {difficulties.map((level) => (
              <option key={level} value={level}>
                {level[0].toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="count" className="block font-body text-sm font-semibold text-ink">
            Number of questions
          </label>
          <input
            id="count"
            type="number"
            value={numberOfQuestions}
            min={1}
            max={50}
            onChange={(event) => setNumberOfQuestions(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-moss/30 bg-white/90 p-3 text-sm text-ink outline-none transition focus:border-ember"
          />
        </div>
      </div>

      {error ? <p className="rounded-xl bg-ember/10 p-3 text-sm text-ember">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-2xl bg-moss px-6 py-3 font-body text-sm font-semibold text-sand transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Generating..." : "Generate Test"}
      </button>
    </form>
  );
}
