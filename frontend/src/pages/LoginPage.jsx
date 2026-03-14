import { useState } from "react";

export default function LoginPage({ role, onLogin, onSignup, loading, error, onBack }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState("");

  const roleLabel = role === "faculty" ? "Faculty" : "Student";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (mode === "signup") {
      if (password !== confirmPassword) {
        setLocalError("Password and confirm password must match");
        return;
      }

      await onSignup({ name, email, password, role });
      return;
    }

    await onLogin({ email, password, role, rememberMe });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="interactive-card relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#15243a_100%)] p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
        <span className="dashboard-orb -right-10 top-0 h-36 w-36 bg-cyan/20" />
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">{roleLabel} Portal</p>
        <h2 className="mt-4 font-display text-4xl leading-tight">
          {mode === "signin" ? `Access ${roleLabel} workspace` : `Create ${roleLabel} workspace access`}
        </h2>
        <p className="mt-4 text-sm text-white/75">
          {mode === "signin"
            ? role === "faculty"
              ? "Sign in to create tests, review marks, and control publication settings."
              : "Sign in to access available tests, submit answers, and review your results."
            : role === "faculty"
              ? "Create a faculty account to manage assessments from the internal dashboard."
              : "Create a student account to join the testing workspace."}
        </p>

        <div className="mt-8 space-y-3">
          {[
            role === "faculty" ? "Create and publish tests" : "Access available tests",
            role === "faculty" ? "Review student marks" : "Take tests in focused mode",
            role === "faculty" ? "Enable student downloads" : "Track attended history",
          ].map((item) => (
            <div key={item} className="interactive-card rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="interactive-card rounded-[28px] border border-white/10 bg-white/75 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/5 dark:bg-white/5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-body text-2xl font-semibold text-slate dark:text-white">
              {roleLabel} {mode === "signin" ? "Login" : "Signup"}
            </h2>
            <p className="mt-2 text-sm text-slate/65 dark:text-mist/65">Use the same dashboard style access flow as the internal workspace.</p>
          </div>

          <div className="inline-flex rounded-2xl border border-slate/10 bg-slate/5 p-1 dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              onClick={() => {
                setLocalError("");
                setMode("signin");
              }}
              className={`interactive-button rounded-xl px-4 py-2 text-sm transition ${
                mode === "signin"
                  ? "bg-slate text-white dark:bg-cyan dark:text-ocean"
                  : "text-slate dark:text-mist"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setLocalError("");
                setMode("signup");
              }}
              className={`interactive-button rounded-xl px-4 py-2 text-sm transition ${
                mode === "signup"
                  ? "bg-slate text-white dark:bg-cyan dark:text-ocean"
                  : "text-slate dark:text-mist"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate dark:text-white">
              Full Name
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate/45 dark:text-mist/45">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </span>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-slate/10 bg-slate/5 py-3 pl-12 pr-4 text-sm text-slate outline-none transition focus:border-cyan dark:border-white/10 dark:bg-white/5 dark:text-white"
                placeholder="Enter full name"
              />
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate dark:text-white">
            Email
          </label>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate/45 dark:text-mist/45">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
            </span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate/10 bg-slate/5 py-3 pl-12 pr-4 text-sm text-slate outline-none transition focus:border-cyan dark:border-white/10 dark:bg-white/5 dark:text-white"
              placeholder={`${role}@example.com`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate dark:text-white">
            Password
          </label>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate/45 dark:text-mist/45">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            </span>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate/10 bg-slate/5 py-3 pl-12 pr-4 text-sm text-slate outline-none transition focus:border-cyan dark:border-white/10 dark:bg-white/5 dark:text-white"
              placeholder="Enter password"
            />
          </div>
        </div>

        {mode === "signup" ? (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate dark:text-white">
              Confirm Password
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate/45 dark:text-mist/45">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4" /><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
              </span>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate/10 bg-slate/5 py-3 pl-12 pr-4 text-sm text-slate outline-none transition focus:border-cyan dark:border-white/10 dark:bg-white/5 dark:text-white"
                placeholder="Confirm password"
              />
            </div>
          </div>
        ) : null}

        {mode === "signin" ? (
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-slate/70 dark:text-mist/70">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate/20 text-cyan focus:ring-cyan"
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => setLocalError("Forgot Password flow is not implemented yet. Use signup or contact the administrator.")}
              className="text-cyan transition hover:opacity-80"
            >
              Forgot Password?
            </button>
          </div>
        ) : null}

        {localError ? <p className="rounded-2xl bg-ember/10 p-3 text-sm text-ember">{localError}</p> : null}
        {error ? <p className="rounded-2xl bg-ember/10 p-3 text-sm text-ember">{error}</p> : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading}
            className="interactive-button rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan hover:text-ocean disabled:opacity-70 dark:bg-cyan dark:text-ocean"
          >
            {loading
              ? mode === "signin"
                ? "Signing In..."
                : "Creating Account..."
              : mode === "signin"
                ? `Sign In as ${roleLabel}`
                : `Create ${roleLabel} Account`}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="interactive-button rounded-2xl border border-slate/10 px-5 py-3 text-sm text-slate transition hover:bg-slate/5 dark:border-white/10 dark:text-mist dark:hover:bg-white/5"
          >
            Back
          </button>
        </div>
        </form>
      </section>
    </div>
  );
}
