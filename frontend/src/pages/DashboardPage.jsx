import DashboardCards from "../components/DashboardCards";
import Charts from "../components/Charts";
import ActivityTable from "../components/ActivityTable";
import QuickActions from "../components/QuickActions";

export default function DashboardPage({ role, analytics, onQuickAction }) {
  const summary = analytics?.summary || {};
  const cards =
    role === "faculty"
      ? [
          {
            label: "Total Tests Created",
            value: summary.totalTestsCreated ?? 0,
            icon: "tests",
            accent: "cyan",
            helper: "Published and draft assessments",
            trend: "+12% this week",
          },
          {
            label: "Total Students",
            value: summary.totalStudents ?? 0,
            icon: "students",
            accent: "emerald",
            helper: "Unique students who attended your tests",
            trend: "+8% this week",
          },
          {
            label: "Tests Taken",
            value: summary.testsTaken ?? 0,
            icon: "attempts",
            accent: "indigo",
            helper: "All recorded student submissions",
            trend: "+15% this month",
          },
          {
            label: "Average Score",
            value: `${Math.round(summary.averageScore ?? 0)}%`,
            icon: "score",
            accent: "amber",
            helper: "Average score across conducted tests",
            trend: "+4% this month",
          },
        ]
      : [
          {
            label: "Available Tests",
            value: summary.totalTestsCreated ?? 0,
            icon: "tests",
            accent: "cyan",
            helper: "Tests you can access right now",
            trend: "+3 new this week",
          },
          {
            label: "Completed Tests",
            value: summary.testsTaken ?? 0,
            icon: "attempts",
            accent: "emerald",
            helper: "Tests already attended by you",
            trend: "On track",
          },
          {
            label: "Average Score",
            value: `${Math.round(summary.averageScore ?? 0)}%`,
            icon: "score",
            accent: "amber",
            helper: "Average performance across completed tests",
            trend: "+6% from last attempt",
          },
          {
            label: "Upcoming Tests",
            value: Math.max((summary.totalTestsCreated ?? 0) - (summary.testsTaken ?? 0), 0),
            icon: "upcoming",
            accent: "indigo",
            helper: "Available tests not attempted yet",
            trend: "Ready to take",
          },
        ];

  const quickActions =
    role === "faculty"
      ? [
          { label: "Create Test", helper: "Open the faculty creation module", onClick: () => onQuickAction?.("create"), variant: "primary" },
          { label: "Generate Questions with AI", helper: "Start an AI-powered MCQ build", onClick: () => onQuickAction?.("generate"), variant: "primary" },
          { label: "Publish Test", helper: "Review and publish the latest paper", onClick: () => onQuickAction?.("publish"), variant: "secondary" },
          { label: "View Submissions", helper: "Check student attempts and marks", onClick: () => onQuickAction?.("submissions"), variant: "secondary" },
        ]
      : [
          { label: "View Available Tests", helper: "Open your assigned tests", onClick: () => onQuickAction?.("available"), variant: "primary" },
          { label: "Take Test", helper: "Jump back into the test module", onClick: () => onQuickAction?.("take"), variant: "primary" },
          { label: "View Results", helper: "Open attended history and marks", onClick: () => onQuickAction?.("results"), variant: "secondary" },
          { label: "Check Analytics", helper: "Review your performance trend", onClick: () => onQuickAction?.("analytics"), variant: "secondary" },
        ];

  return (
    <div className="space-y-4">
      <DashboardCards cards={cards} />
      <QuickActions actions={quickActions} />
      <Charts
        attemptsPerDay={analytics?.attemptsPerDay || []}
        difficultyDistribution={analytics?.difficultyDistribution || []}
        performanceTrend={analytics?.performanceTrend || []}
      />
      <ActivityTable rows={analytics?.recentActivity || []} />
    </div>
  );
}
