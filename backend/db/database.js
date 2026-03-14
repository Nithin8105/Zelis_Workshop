import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, "..", "test-generator.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new sqlite3.Database(dbPath);

const run = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });

const get = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });

const all = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

const columnExists = async (tableName, columnName) => {
  const columns = await all(`PRAGMA table_info(${tableName})`);
  return columns.some((column) => column.name === columnName);
};

export const initDatabase = async () => {
  await run("PRAGMA foreign_keys = ON");

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('faculty', 'student')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topics_raw TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      question_count INTEGER NOT NULL,
      created_by INTEGER,
      allow_student_pdf INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  if (!(await columnExists("tests", "created_by"))) {
    await run(`ALTER TABLE tests ADD COLUMN created_by INTEGER`);
  }

  if (!(await columnExists("tests", "allow_student_pdf"))) {
    await run(`ALTER TABLE tests ADD COLUMN allow_student_pdf INTEGER DEFAULT 0`);
  }

  await run(`
    CREATE TABLE IF NOT EXISTS syllabus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_id INTEGER NOT NULL,
      topic TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS generated_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_id INTEGER NOT NULL,
      topic TEXT,
      question TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS test_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_id INTEGER NOT NULL,
      student_user_id INTEGER NOT NULL,
      student_name_snapshot TEXT NOT NULL,
      student_email_snapshot TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      answers_json TEXT NOT NULL,
      notes_json TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
      FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await seedDefaultUsers();
};

const createUserIfNotExists = async ({ name, email, password, role }) => {
  const existing = await get(
    `
    SELECT id FROM users WHERE email = ?
    `,
    [email]
  );

  if (existing) {
    return existing.id;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await run(
    `
    INSERT INTO users (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
    `,
    [name, email, passwordHash, role]
  );

  return result.lastID;
};

export const createUser = async ({ name, email, password, role }) => {
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await run(
      `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
      `,
      [name, email, passwordHash, role]
    );

    return result.lastID;
  } catch (error) {
    if (String(error.message || "").includes("UNIQUE constraint failed: users.email")) {
      throw new Error("An account with this email already exists");
    }
    throw error;
  }
};

const seedDefaultUsers = async () => {
  await createUserIfNotExists({
    name: "Faculty Demo",
    email: process.env.DEFAULT_FACULTY_EMAIL || "faculty@example.com",
    password: process.env.DEFAULT_FACULTY_PASSWORD || "faculty123",
    role: "faculty",
  });

  await createUserIfNotExists({
    name: "Student Demo",
    email: process.env.DEFAULT_STUDENT_EMAIL || "student@example.com",
    password: process.env.DEFAULT_STUDENT_PASSWORD || "student123",
    role: "student",
  });
};

export const findUserByEmail = async (email) =>
  get(
    `
    SELECT id, name, email, password_hash, role
    FROM users
    WHERE email = ?
    `,
    [email]
  );

export const createTest = async ({ topics, difficulty, numberOfQuestions, createdBy }) => {
  const result = await run(
    `
    INSERT INTO tests (topics_raw, difficulty, question_count, created_by, allow_student_pdf)
    VALUES (?, ?, ?, ?, 0)
    `,
    [topics.join(", "), difficulty, numberOfQuestions, createdBy ?? null]
  );

  return result.lastID;
};

export const saveSyllabusTopics = async (testId, topics) => {
  for (const topic of topics) {
    await run(
      `
      INSERT INTO syllabus (test_id, topic)
      VALUES (?, ?)
      `,
      [testId, topic]
    );
  }
};

export const saveGeneratedQuestions = async (testId, questions) => {
  for (const q of questions) {
    await run(
      `
      INSERT INTO generated_questions (
        test_id, topic, question, option_a, option_b, option_c, option_d, answer
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        testId,
        q.topic ?? null,
        q.question,
        q.options[0],
        q.options[1],
        q.options[2],
        q.options[3],
        q.answer,
      ]
    );
  }
};

export const getTestWithQuestions = async (testId) => {
  const test = await get(
    `
    SELECT id, topics_raw, difficulty, question_count, created_by, allow_student_pdf, created_at
    FROM tests
    WHERE id = ?
    `,
    [testId]
  );

  const topics = await all(
    `
    SELECT topic
    FROM syllabus
    WHERE test_id = ?
    ORDER BY id ASC
    `,
    [testId]
  );

  const questions = await all(
    `
    SELECT question, option_a, option_b, option_c, option_d, answer, topic
    FROM generated_questions
    WHERE test_id = ?
    ORDER BY id ASC
    `,
    [testId]
  );

  return {
    ...test,
    allow_student_pdf: Number(test?.allow_student_pdf || 0),
    topics: topics.map((row) => row.topic),
    questions: questions.map((row) => ({
      topic: row.topic,
      question: row.question,
      options: [row.option_a, row.option_b, row.option_c, row.option_d],
      answer: row.answer,
    })),
  };
};

export const listTests = async () => {
  const tests = await all(
    `
    SELECT id, topics_raw, difficulty, question_count, created_by, allow_student_pdf, created_at
    FROM tests
    ORDER BY created_at DESC
    LIMIT 50
    `
  );

  return tests.map((row) => ({
    id: row.id,
    topicsRaw: row.topics_raw,
    difficulty: row.difficulty,
    questionCount: row.question_count,
    createdBy: row.created_by,
    allowStudentPdf: Number(row.allow_student_pdf || 0),
    createdAt: row.created_at,
  }));
};

export const listTestsByFaculty = async (facultyUserId) => {
  const tests = await all(
    `
    SELECT t.id, t.topics_raw, t.difficulty, t.question_count, t.allow_student_pdf, t.created_at,
      COUNT(a.id) AS attempt_count
    FROM tests t
    LEFT JOIN test_attempts a ON a.test_id = t.id
    WHERE t.created_by = ?
    GROUP BY t.id
    ORDER BY t.created_at DESC
    LIMIT 100
    `,
    [facultyUserId]
  );

  return tests.map((row) => ({
    id: row.id,
    topicsRaw: row.topics_raw,
    difficulty: row.difficulty,
    questionCount: row.question_count,
    allowStudentPdf: Number(row.allow_student_pdf || 0),
    attemptCount: Number(row.attempt_count || 0),
    createdAt: row.created_at,
  }));
};

export const updateStudentPdfAccess = async ({ testId, facultyUserId, enabled }) => {
  const result = await run(
    `
    UPDATE tests
    SET allow_student_pdf = ?
    WHERE id = ? AND created_by = ?
    `,
    [enabled ? 1 : 0, testId, facultyUserId]
  );

  return result.changes;
};

const computeScore = (questions, answersMap) => {
  let score = 0;
  questions.forEach((question, index) => {
    const studentAnswer = answersMap?.[index] || answersMap?.[String(index)];
    if (studentAnswer && studentAnswer === question.answer) {
      score += 1;
    }
  });
  return score;
};

export const saveStudentAttempt = async ({ testId, studentUserId, studentName, studentEmail, answers, notes }) => {
  const test = await getTestWithQuestions(testId);
  if (!test || !test.id) {
    throw new Error("Test not found");
  }

  const score = computeScore(test.questions, answers || {});
  const totalQuestions = test.questions.length;

  const result = await run(
    `
    INSERT INTO test_attempts (
      test_id,
      student_user_id,
      student_name_snapshot,
      student_email_snapshot,
      score,
      total_questions,
      answers_json,
      notes_json
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      testId,
      studentUserId,
      studentName,
      studentEmail,
      score,
      totalQuestions,
      JSON.stringify(answers || {}),
      JSON.stringify(notes || {}),
    ]
  );

  return {
    attemptId: result.lastID,
    score,
    totalQuestions,
    submittedAt: new Date().toISOString(),
  };
};

export const getAttemptsByTestForFaculty = async ({ testId, facultyUserId }) => {
  const test = await get(
    `
    SELECT id, created_by
    FROM tests
    WHERE id = ?
    `,
    [testId]
  );

  if (!test || test.created_by !== facultyUserId) {
    return null;
  }

  const attempts = await all(
    `
    SELECT id, student_name_snapshot, student_email_snapshot, score, total_questions, submitted_at
    FROM test_attempts
    WHERE test_id = ?
    ORDER BY submitted_at DESC
    `,
    [testId]
  );

  return attempts.map((row) => ({
    id: row.id,
    studentName: row.student_name_snapshot,
    studentEmail: row.student_email_snapshot,
    score: row.score,
    totalQuestions: row.total_questions,
    submittedAt: row.submitted_at,
  }));
};

export const getStudentAttemptHistory = async (studentUserId) => {
  const attempts = await all(
    `
    SELECT
      a.id,
      a.test_id,
      a.score,
      a.total_questions,
      a.submitted_at,
      t.topics_raw,
      t.difficulty
    FROM test_attempts a
    JOIN tests t ON t.id = a.test_id
    WHERE a.student_user_id = ?
    ORDER BY a.submitted_at DESC
    LIMIT 100
    `,
    [studentUserId]
  );

  return attempts.map((row) => ({
    attemptId: row.id,
    testId: row.test_id,
    score: row.score,
    totalQuestions: row.total_questions,
    submittedAt: row.submitted_at,
    topicsRaw: row.topics_raw,
    difficulty: row.difficulty,
  }));
};

export const listAvailableTestsForStudent = async () => {
  const tests = await all(
    `
    SELECT id, topics_raw, difficulty, question_count, allow_student_pdf, created_at
    FROM tests
    ORDER BY created_at DESC
    LIMIT 100
    `
  );

  return tests.map((row) => ({
    id: row.id,
    topicsRaw: row.topics_raw,
    difficulty: row.difficulty,
    questionCount: row.question_count,
    allowStudentPdf: Number(row.allow_student_pdf || 0),
    createdAt: row.created_at,
  }));
};

export const getFacultyAnalytics = async (facultyUserId) => {
  const summary =
    (await get(
      `
      SELECT
        COUNT(DISTINCT t.id) AS total_tests_created,
        COUNT(a.id) AS tests_taken,
        COUNT(DISTINCT a.student_user_id) AS total_students,
        AVG(CASE WHEN a.total_questions > 0 THEN (a.score * 100.0 / a.total_questions) END) AS average_score
      FROM tests t
      LEFT JOIN test_attempts a ON a.test_id = t.id
      WHERE t.created_by = ?
      `,
      [facultyUserId]
    )) || {};

  const attemptsPerDay = await all(
    `
    SELECT DATE(a.submitted_at) AS day, COUNT(a.id) AS count
    FROM test_attempts a
    JOIN tests t ON t.id = a.test_id
    WHERE t.created_by = ?
    GROUP BY DATE(a.submitted_at)
    ORDER BY day ASC
    `,
    [facultyUserId]
  );

  const difficultyDistribution = await all(
    `
    SELECT difficulty, COUNT(id) AS count
    FROM tests
    WHERE created_by = ?
    GROUP BY difficulty
    `,
    [facultyUserId]
  );

  const performanceTrend = await all(
    `
    SELECT DATE(a.submitted_at) AS day,
      AVG(CASE WHEN a.total_questions > 0 THEN (a.score * 100.0 / a.total_questions) END) AS average_score
    FROM test_attempts a
    JOIN tests t ON t.id = a.test_id
    WHERE t.created_by = ?
    GROUP BY DATE(a.submitted_at)
    ORDER BY day ASC
    `,
    [facultyUserId]
  );

  const recentActivity = await all(
    `
    SELECT
      a.id,
      a.student_name_snapshot,
      t.topics_raw,
      a.score,
      a.total_questions,
      a.submitted_at
    FROM test_attempts a
    JOIN tests t ON t.id = a.test_id
    WHERE t.created_by = ?
    ORDER BY a.submitted_at DESC
    LIMIT 10
    `,
    [facultyUserId]
  );

  return {
    summary: {
      totalTestsCreated: Number(summary.total_tests_created || 0),
      totalStudents: Number(summary.total_students || 0),
      testsTaken: Number(summary.tests_taken || 0),
      averageScore: Number(summary.average_score || 0),
    },
    attemptsPerDay: attemptsPerDay.map((row) => ({ day: row.day, count: Number(row.count || 0) })),
    difficultyDistribution: difficultyDistribution.map((row) => ({
      difficulty: row.difficulty,
      count: Number(row.count || 0),
    })),
    performanceTrend: performanceTrend.map((row) => ({
      day: row.day,
      averageScore: Number(row.average_score || 0),
    })),
    recentActivity: recentActivity.map((row) => {
      const percent = row.score && row.total_questions ? (row.score * 100) / row.total_questions : 0;

      return {
      id: row.id,
      studentName: row.student_name_snapshot,
      testName: row.topics_raw,
      score: `${row.score}/${row.total_questions}`,
      status: percent < 40 ? "Failed" : "Completed",
      time: row.submitted_at,
      };
    }),
  };
};

export const getStudentAnalytics = async (studentUserId) => {
  const summary =
    (await get(
      `
      SELECT
        COUNT(a.id) AS tests_taken,
        AVG(CASE WHEN a.total_questions > 0 THEN (a.score * 100.0 / a.total_questions) END) AS average_score
      FROM test_attempts a
      WHERE a.student_user_id = ?
      `,
      [studentUserId]
    )) || {};

  const available = (await get(`SELECT COUNT(id) AS total FROM tests`)) || { total: 0 };

  const attemptsPerDay = await all(
    `
    SELECT DATE(submitted_at) AS day, COUNT(id) AS count
    FROM test_attempts
    WHERE student_user_id = ?
    GROUP BY DATE(submitted_at)
    ORDER BY day ASC
    `,
    [studentUserId]
  );

  const difficultyDistribution = await all(
    `
    SELECT t.difficulty, COUNT(a.id) AS count
    FROM test_attempts a
    JOIN tests t ON t.id = a.test_id
    WHERE a.student_user_id = ?
    GROUP BY t.difficulty
    `,
    [studentUserId]
  );

  const performanceTrend = await all(
    `
    SELECT DATE(a.submitted_at) AS day,
      AVG(CASE WHEN a.total_questions > 0 THEN (a.score * 100.0 / a.total_questions) END) AS average_score
    FROM test_attempts a
    WHERE a.student_user_id = ?
    GROUP BY DATE(a.submitted_at)
    ORDER BY day ASC
    `,
    [studentUserId]
  );

  const recentActivity = await all(
    `
    SELECT
      a.id,
      u.name AS student_name,
      t.topics_raw,
      a.score,
      a.total_questions,
      a.submitted_at
    FROM test_attempts a
    JOIN tests t ON t.id = a.test_id
    JOIN users u ON u.id = a.student_user_id
    WHERE a.student_user_id = ?
    ORDER BY a.submitted_at DESC
    LIMIT 10
    `,
    [studentUserId]
  );

  return {
    summary: {
      totalTestsCreated: Number(available.total || 0),
      totalStudents: 1,
      testsTaken: Number(summary.tests_taken || 0),
      averageScore: Number(summary.average_score || 0),
    },
    attemptsPerDay: attemptsPerDay.map((row) => ({ day: row.day, count: Number(row.count || 0) })),
    difficultyDistribution: difficultyDistribution.map((row) => ({
      difficulty: row.difficulty,
      count: Number(row.count || 0),
    })),
    performanceTrend: performanceTrend.map((row) => ({
      day: row.day,
      averageScore: Number(row.average_score || 0),
    })),
    recentActivity: recentActivity.map((row) => {
      const percent = row.score && row.total_questions ? (row.score * 100) / row.total_questions : 0;

      return {
      id: row.id,
      studentName: row.student_name,
      testName: row.topics_raw,
      score: `${row.score}/${row.total_questions}`,
      status: percent < 40 ? "Failed" : "Completed",
      time: row.submitted_at,
      };
    }),
  };
};
