const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (path, { method = "GET", body, token } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.details || "Request failed");
  }

  return data;
};

export const loginUser = async ({ email, password, role }) =>
  request("/api/auth/login", {
    method: "POST",
    body: { email, password, role },
  });

export const signupUser = async ({ name, email, password, role }) =>
  request("/api/auth/signup", {
    method: "POST",
    body: { name, email, password, role },
  });

export const generateTest = async ({ topics, difficulty, numberOfQuestions, token }) =>
  request("/api/generate-test", {
    method: "POST",
    token,
    body: {
      topics,
      difficulty,
      numberOfQuestions,
    },
  });

export const fetchTestById = async ({ testId, token }) => request(`/api/tests/${testId}`, { token });

export const fetchFacultyTests = async ({ token }) => request("/api/tests", { token });

export const fetchFacultyAnalytics = async ({ token }) => request("/api/faculty/analytics", { token });

export const fetchStudentAnalytics = async ({ token }) => request("/api/students/me/analytics", { token });

export const fetchAvailableTests = async ({ token }) => request("/api/students/me/available-tests", { token });

export const updateStudentPdfAccess = async ({ testId, enabled, token }) =>
  request(`/api/tests/${testId}/pdf-access`, {
    method: "PATCH",
    token,
    body: { enabled },
  });

export const submitStudentAttempt = async ({ testId, answers, notes, token }) =>
  request(`/api/tests/${testId}/attempts`, {
    method: "POST",
    token,
    body: { answers, notes },
  });

export const fetchAttemptsByTest = async ({ testId, token }) => request(`/api/tests/${testId}/attempts`, { token });

export const fetchStudentAttemptHistory = async ({ token }) => request("/api/students/me/attempts", { token });
