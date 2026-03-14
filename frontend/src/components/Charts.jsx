import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartCardClass = "interactive-card rounded-[26px] border border-white/10 bg-white/75 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5";
const difficultyColors = {
  easy: "#34d399",
  medium: "#f59e0b",
  hard: "#f43f5e",
};

const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.92)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  color: "#fff",
};

export default function Charts({ attemptsPerDay, difficultyDistribution, performanceTrend }) {
  const safeAttempts = attemptsPerDay.length ? attemptsPerDay : [{ day: "03-14", count: 0 }];
  const safeDifficulty = difficultyDistribution.length
    ? difficultyDistribution
    : [
        { difficulty: "easy", count: 0 },
        { difficulty: "medium", count: 0 },
        { difficulty: "hard", count: 0 },
      ];
  const safeTrend = performanceTrend.length ? performanceTrend : [{ day: "03-14", averageScore: 0 }];

  const normalizedAttempts = safeAttempts.map((item) => ({ ...item, day: item.day?.slice?.(5) || item.day }));
  const normalizedTrend = safeTrend.map((item) => ({ ...item, day: item.day?.slice?.(5) || item.day }));

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr]">
      <section className={chartCardClass}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate dark:text-white">Test Attempts Per Day</h3>
          <p className="text-sm text-slate/60 dark:text-mist/60">Bar chart of test attempts grouped by date</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={normalizedAttempts}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#3AAED8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={chartCardClass}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate dark:text-white">Difficulty Distribution</h3>
          <p className="text-sm text-slate/60 dark:text-mist/60">Donut chart for easy, medium, and hard tests</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeDifficulty}
                dataKey="count"
                nameKey="difficulty"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
              >
                {safeDifficulty.map((entry) => (
                  <Cell key={entry.difficulty} fill={difficultyColors[entry.difficulty] || "#3AAED8"} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={`${chartCardClass} xl:col-span-2`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate dark:text-white">Performance Trend</h3>
          <p className="text-sm text-slate/60 dark:text-mist/60">Line chart of average student performance over time</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={normalizedTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="averageScore" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
