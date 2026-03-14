import { useEffect, useMemo, useState } from "react";
import Shell from "./components/Shell";
import DashboardLayout from "./components/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import InputPage from "./pages/InputPage";
import TestPage from "./pages/TestPage";
import DownloadPage from "./pages/DownloadPage";
import StudentModePage from "./pages/StudentModePage";
import StudentAccessPage from "./pages/StudentAccessPage";
import FacultyHistoryPage from "./pages/FacultyHistoryPage";
import FacultyAttemptsPage from "./pages/FacultyAttemptsPage";
import StudentHistoryPage from "./pages/StudentHistoryPage";
import DashboardPage from "./pages/DashboardPage";
import AvailableTestsPage from "./pages/AvailableTestsPage";
import {
  fetchAttemptsByTest,
  fetchAvailableTests,
  fetchFacultyAnalytics,
  fetchFacultyTests,
  fetchStudentAnalytics,
  fetchStudentAttemptHistory,
  fetchTestById,
  generateTest,
  loginUser,
  signupUser,
  submitStudentAttempt,
  updateStudentPdfAccess,
} from "./services/api";

const TITLES = {
  dashboard: {
    title: "Dashboard Overview",
    subtitle: "Track assessment activity, performance, and platform usage from a unified command center.",
  },
  landing: {
    title: "Exam Forge Studio",
    subtitle: "Design smarter assessments with AI and deliver them in a student-friendly test experience.",
  },
  facultyLogin: {
    title: "Faculty Authentication",
    subtitle: "Sign in to create and conduct tests in the faculty module.",
  },
  studentLogin: {
    title: "Student Authentication",
    subtitle: "Sign in to access your assigned tests.",
  },
  input: {
    title: "Build Test Blueprint",
    subtitle:
      "Create MCQ test papers from your syllabus topics. Choose difficulty, question count, and let the model generate classroom-ready assessments.",
  },
  test: {
    title: "Generated MCQ Paper",
    subtitle: "Review generated questions, then switch to student mode or download instantly.",
  },
  student: {
    title: "Student Attempt Workspace",
    subtitle: "Students can answer, write notes, and take the test in full-screen mode.",
  },
  studentAccess: {
    title: "Access Assigned Test",
    subtitle: "Enter a valid test ID shared by faculty to begin your attempt.",
  },
  facultyHistory: {
    title: "Conducted Tests",
    subtitle: "Track all tests conducted by you and review student marks.",
  },
  facultyAttempts: {
    title: "Student Marks",
    subtitle: "See student attendance details and marks for a selected test.",
  },
  studentHistory: {
    title: "Attended Tests",
    subtitle: "See your previously attended tests and marks.",
  },
  available: {
    title: "Available Tests",
    subtitle: "Browse all currently available tests and launch attempts directly.",
  },
  analytics: {
    title: "Analytics",
    subtitle: "Monitor attempts, score trends, and difficulty distribution in one place.",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage theme preferences and account context.",
  },
  download: {
    title: "Export Dynamic Result",
    subtitle: "Download generated paper with student responses and score summary.",
  },
};

const facultyMenu = [
  { key: "dashboard", label: "Dashboard" },
  { key: "create", label: "Create Test" },
  { key: "myTests", label: "My Tests" },
  { key: "results", label: "Results" },
  { key: "analytics", label: "Analytics" },
  { key: "settings", label: "Settings" },
  { key: "logout", label: "Logout" },
];

const studentMenu = [
  { key: "dashboard", label: "Dashboard" },
  { key: "available", label: "Available Tests" },
  { key: "results", label: "Results" },
  { key: "analytics", label: "Analytics" },
  { key: "settings", label: "Settings" },
  { key: "logout", label: "Logout" },
];

const getActiveNavKey = (page, role) => {
  if (!role) {
    return "dashboard";
  }

  if (role === "faculty") {
    if (["input", "test"].includes(page)) {
      return "create";
    }
    if (page === "facultyHistory") {
      return "myTests";
    }
    if (["facultyAttempts", "download"].includes(page)) {
      return "results";
    }
    if (page === "settings") {
      return "settings";
    }
    if (page === "analytics") {
      return "analytics";
    }
    return "dashboard";
  }

  if (["available", "student", "studentAccess"].includes(page)) {
    return "available";
  }
  if (["studentHistory", "download"].includes(page)) {
    return "results";
  }
  if (page === "settings") {
    return "settings";
  }
  if (page === "analytics") {
    return "analytics";
  }
  return "dashboard";
};

function SettingsPanel({ user, theme, onToggleTheme, onLogout }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[26px] border border-white/10 bg-white/75 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan">Preferences</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate dark:text-white">Appearance</h3>
        <p className="mt-2 text-sm text-slate/65 dark:text-mist/65">Switch between light and dark dashboard themes.</p>
        <button
          type="button"
          onClick={onToggleTheme}
          className="mt-5 rounded-2xl bg-slate px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan hover:text-ocean dark:bg-cyan dark:text-ocean"
        >
          {theme === "dark" ? "Use Light Theme" : "Use Dark Theme"}
        </button>
      </section>

      <section className="rounded-[26px] border border-white/10 bg-white/75 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan">Account</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate dark:text-white">Profile</h3>
        <div className="mt-4 space-y-2 text-sm text-slate/70 dark:text-mist/70">
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-5 rounded-2xl border border-slate/10 px-4 py-2 text-sm font-semibold text-slate transition hover:bg-slate/5 dark:border-white/10 dark:text-mist dark:hover:bg-white/5"
        >
          Logout
        </button>
      </section>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(null);
  const [testData, setTestData] = useState(null);
  const [attemptData, setAttemptData] = useState(null);
  const [facultyTests, setFacultyTests] = useState([]);
  const [facultyAttempts, setFacultyAttempts] = useState([]);
  const [selectedFacultyTestId, setSelectedFacultyTestId] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("dashboard-theme") || "light");

  const header = useMemo(() => TITLES[page] || TITLES.dashboard, [page]);
  const activeNavKey = useMemo(() => getActiveNavKey(page, auth?.role), [page, auth?.role]);
  const dashboardMenu = useMemo(() => (auth?.role === "faculty" ? facultyMenu : studentMenu), [auth?.role]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  const loadAnalytics = async (role = auth?.role, token = auth?.token) => {
    if (!role || !token) {
      return;
    }

    const result = role === "faculty" ? await fetchFacultyAnalytics({ token }) : await fetchStudentAnalytics({ token });
    setAnalytics(result);
  };

  const handleGenerate = async ({ topics, difficulty, numberOfQuestions }) => {
    setError("");
    setLoading(true);

    try {
      const result = await generateTest({
        topics,
        difficulty,
        numberOfQuestions,
        token: auth?.token,
      });
      setTestData(result);
      setAttemptData(null);
      await loadAnalytics();
      setPage("test");
    } catch (err) {
      setError(err.message || "Unable to generate test");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setTestData(null);
    setAttemptData(null);
    setFacultyTests([]);
    setFacultyAttempts([]);
    setStudentHistory([]);
    setError("");
    if (auth?.role === "faculty") {
      setPage("input");
      return;
    }
    if (auth?.role === "student") {
      setPage("studentAccess");
      return;
    }
    setPage("landing");
  };

  const handleStudentSubmit = async ({ studentName, answers, notes }) => {
    setError("");
    setLoading(true);

    try {
      if (!testData?.testId) {
        throw new Error("No active test found");
      }

      await submitStudentAttempt({
        testId: testData.testId,
        answers,
        notes,
        token: auth?.token,
      });

      setAttemptData({ studentName, answers, notes });
      await loadAnalytics();
      setPage("download");
    } catch (err) {
      setError(err.message || "Failed to submit test");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, password, role }) => {
    setLoading(true);
    setError("");

    try {
      const result = await loginUser({ email, password, role });
      setAuth({
        token: result.token,
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
      });
      setTestData(null);
      setAttemptData(null);
      setFacultyTests([]);
      setFacultyAttempts([]);
      setStudentHistory([]);
      setAvailableTests([]);
      await loadAnalytics(result.user.role, result.token);
      if (result.user.role === "student") {
        const availableResult = await fetchAvailableTests({ token: result.token });
        setAvailableTests(availableResult.tests || []);
      }
      setPage("dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async ({ name, email, password, role }) => {
    setLoading(true);
    setError("");

    try {
      const result = await signupUser({ name, email, password, role });
      setAuth({
        token: result.token,
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
      });
      setTestData(null);
      setAttemptData(null);
      setFacultyTests([]);
      setFacultyAttempts([]);
      setStudentHistory([]);
      setAvailableTests([]);
      await loadAnalytics(result.user.role, result.token);
      if (result.user.role === "student") {
        const availableResult = await fetchAvailableTests({ token: result.token });
        setAvailableTests(availableResult.tests || []);
      }
      setPage("dashboard");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLoadTest = async (testId) => {
    setLoading(true);
    setError("");

    try {
      if (!Number.isInteger(testId) || testId <= 0) {
        throw new Error("Please enter a valid numeric test ID");
      }

      const result = await fetchTestById({ testId, token: auth?.token });
      setTestData(result);
      setAttemptData(null);
      setPage("student");
    } catch (err) {
      setError(err.message || "Unable to load test");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setTestData(null);
    setAttemptData(null);
    setFacultyTests([]);
    setFacultyAttempts([]);
    setStudentHistory([]);
    setAvailableTests([]);
    setAnalytics(null);
    setError("");
    setPage("landing");
  };

  const handleToggleStudentPdf = async () => {
    if (!testData?.testId) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const enabled = !Boolean(testData.allowStudentPdf);
      await updateStudentPdfAccess({
        testId: testData.testId,
        enabled,
        token: auth?.token,
      });
      setTestData((prev) => ({
        ...prev,
        allowStudentPdf: enabled ? 1 : 0,
      }));
    } catch (err) {
      setError(err.message || "Unable to change student PDF access");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFacultyHistory = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await fetchFacultyTests({ token: auth?.token });
      setFacultyTests(result.tests || []);
      setPage("facultyHistory");
    } catch (err) {
      setError(err.message || "Failed to load conducted tests");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFacultyAttempts = async (testId) => {
    setError("");
    setLoading(true);

    try {
      const result = await fetchAttemptsByTest({ testId, token: auth?.token });
      setSelectedFacultyTestId(testId);
      setFacultyAttempts(result.attempts || []);
      setPage("facultyAttempts");
    } catch (err) {
      setError(err.message || "Failed to load student marks");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStudentHistory = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await fetchStudentAttemptHistory({ token: auth?.token });
      setStudentHistory(result.attempts || []);
      setPage("studentHistory");
    } catch (err) {
      setError(err.message || "Failed to load attended tests");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAvailableTests = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await fetchAvailableTests({ token: auth?.token });
      setAvailableTests(result.tests || []);
      setPage("available");
    } catch (err) {
      setError(err.message || "Failed to load available tests");
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarSelect = async (key) => {
    if (key === "logout") {
      handleLogout();
      return;
    }

    if (key === "dashboard") {
      setError("");
      setPage("dashboard");
      return;
    }

    if (key === "create") {
      setError("");
      setPage("input");
      return;
    }

    if (key === "myTests") {
      await handleOpenFacultyHistory();
      return;
    }

    if (key === "available") {
      await handleOpenAvailableTests();
      return;
    }

    if (key === "results") {
      if (auth?.role === "faculty") {
        setPage("facultyAttempts");
      } else {
        await handleOpenStudentHistory();
      }
      return;
    }

    if (key === "analytics") {
      setPage("analytics");
      return;
    }

    if (key === "settings") {
      setPage("settings");
    }
  };

  const handleDashboardQuickAction = async (action) => {
    if (action === "create" || action === "generate") {
      setPage("input");
      return;
    }

    if (action === "publish") {
      if (testData) {
        setPage("test");
      } else {
        setError("No generated test yet. Create a test first.");
        setPage("input");
      }
      return;
    }

    if (action === "submissions") {
      await handleOpenFacultyHistory();
      return;
    }

    if (action === "available" || action === "take") {
      await handleOpenAvailableTests();
      return;
    }

    if (action === "results") {
      await handleOpenStudentHistory();
      return;
    }

    if (action === "analytics") {
      setPage("analytics");
    }
  };

  const renderAuthenticatedContent = () => {
    if (page === "dashboard") {
      return <DashboardPage role={auth?.role} analytics={analytics} onQuickAction={handleDashboardQuickAction} />;
    }

    if (page === "analytics") {
      return <DashboardPage role={auth?.role} analytics={analytics} onQuickAction={handleDashboardQuickAction} />;
    }

    if (page === "settings") {
      return <SettingsPanel user={auth} theme={theme} onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} onLogout={handleLogout} />;
    }

    if (page === "available") {
      return <AvailableTestsPage tests={availableTests} onOpenTest={handleStudentLoadTest} loading={loading} />;
    }

    if (page === "facultyHistory") {
      return (
        <FacultyHistoryPage
          tests={facultyTests}
          onOpenAttempts={handleOpenFacultyAttempts}
          onCreateNew={() => setPage("input")}
          onLogout={handleLogout}
          loading={loading}
          error={error}
        />
      );
    }

    if (page === "facultyAttempts") {
      return <FacultyAttemptsPage testId={selectedFacultyTestId} attempts={facultyAttempts} onBack={handleOpenFacultyHistory} />;
    }

    if (page === "studentHistory") {
      return <StudentHistoryPage attempts={studentHistory} onBack={() => setPage("available")} />;
    }

    if (page === "input") {
      return <InputPage onGenerate={handleGenerate} loading={loading} error={error} />;
    }

    if (page === "test" && testData) {
      return (
        <TestPage
          test={testData}
          onEdit={() => setPage("input")}
          onGoStudentMode={() => setPage("student")}
          onGoDownload={() => setPage("download")}
          onToggleStudentPdf={handleToggleStudentPdf}
          onOpenConductedHistory={handleOpenFacultyHistory}
          onLogout={handleLogout}
        />
      );
    }

    if (page === "student" && testData) {
      return <StudentModePage test={testData} onSubmitAttempt={handleStudentSubmit} onExit={() => setPage("available")} />;
    }

    if (page === "download" && testData) {
      return (
        <DownloadPage
          test={testData}
          attempt={attemptData}
          onBackToTest={() => setPage(auth?.role === "faculty" ? "test" : "available")}
          onStartOver={handleStartOver}
          onLogout={handleLogout}
        />
      );
    }

    if (page === "studentAccess") {
      return (
        <StudentAccessPage
          onLoadTest={handleStudentLoadTest}
          loading={loading}
          error={error}
          onLogout={handleLogout}
          onOpenHistory={handleOpenStudentHistory}
        />
      );
    }

    return <DashboardPage role={auth?.role} analytics={analytics} />;
  };

  if (auth) {
    return (
      <DashboardLayout
        items={dashboardMenu}
        activeKey={activeNavKey}
        onSelect={handleSidebarSelect}
        title={header.title}
        subtitle={header.subtitle}
        user={auth}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      >
        {error && page !== "input" && page !== "facultyHistory" && page !== "studentAccess" ? (
          <div className="mb-4 rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ember">{error}</div>
        ) : null}
        {renderAuthenticatedContent()}
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-hero-wash dark:bg-none">
      <Shell title={header.title} subtitle={header.subtitle}>
        {page === "landing" ? (
          <LandingPage
            onFacultyStart={() => {
              setError("");
              setPage("facultyLogin");
            }}
            onStudentStart={() => {
              setError("");
              setPage("studentLogin");
            }}
          />
        ) : null}

        {page === "facultyLogin" ? (
          <LoginPage
            role="faculty"
            onLogin={handleLogin}
            onSignup={handleSignup}
            loading={loading}
            error={error}
            onBack={() => setPage("landing")}
          />
        ) : null}

        {page === "studentLogin" ? (
          <LoginPage
            role="student"
            onLogin={handleLogin}
            onSignup={handleSignup}
            loading={loading}
            error={error}
            onBack={() => setPage("landing")}
          />
        ) : null}
      </Shell>
    </div>
  );
}
