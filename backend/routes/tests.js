import express from "express";
import {
  getAttemptsByTestForFaculty,
  getFacultyAnalytics,
  getStudentAnalytics,
  getStudentAttemptHistory,
  getTestWithQuestions,
  listAvailableTestsForStudent,
  listTestsByFaculty,
  saveStudentAttempt,
  updateStudentPdfAccess,
} from "../db/database.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/tests", authenticate, requireRole("faculty"), async (req, res) => {
  try {
    const tests = await listTestsByFaculty(req.user.userId);
    return res.status(200).json({ tests });
  } catch (error) {
    console.error("List tests error:", error);
    return res.status(500).json({ error: "Failed to fetch tests" });
  }
});

router.get("/faculty/analytics", authenticate, requireRole("faculty"), async (req, res) => {
  try {
    const analytics = await getFacultyAnalytics(req.user.userId);
    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Faculty analytics error:", error);
    return res.status(500).json({ error: "Failed to load analytics" });
  }
});

router.get("/students/me/analytics", authenticate, requireRole("student"), async (req, res) => {
  try {
    const analytics = await getStudentAnalytics(req.user.userId);
    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Student analytics error:", error);
    return res.status(500).json({ error: "Failed to load analytics" });
  }
});

router.get("/students/me/available-tests", authenticate, requireRole("student"), async (req, res) => {
  try {
    const tests = await listAvailableTestsForStudent();
    return res.status(200).json({ tests });
  } catch (error) {
    console.error("Available tests error:", error);
    return res.status(500).json({ error: "Failed to load available tests" });
  }
});

router.get("/tests/:testId", authenticate, requireRole(["faculty", "student"]), async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    if (!Number.isInteger(testId) || testId <= 0) {
      return res.status(400).json({ error: "Invalid test id" });
    }

    const test = await getTestWithQuestions(testId);
    if (!test || !test.id) {
      return res.status(404).json({ error: "Test not found" });
    }

    const sanitizedQuestions =
      req.user.role === "faculty"
        ? test.questions
        : test.questions.map((question) => ({
            topic: question.topic,
            question: question.question,
            options: question.options,
          }));

    return res.status(200).json({
      testId: test.id,
      topics: test.topics,
      difficulty: test.difficulty,
      numberOfQuestions: test.question_count,
      allowStudentPdf: Number(test.allow_student_pdf || 0),
      createdAt: test.created_at,
      questions: sanitizedQuestions,
    });
  } catch (error) {
    console.error("Get test error:", error);
    return res.status(500).json({ error: "Failed to fetch test" });
  }
});

router.patch("/tests/:testId/pdf-access", authenticate, requireRole("faculty"), async (req, res) => {
  try {
    const testId = Number(req.params.testId);
    const enabled = Boolean(req.body.enabled);

    if (!Number.isInteger(testId) || testId <= 0) {
      return res.status(400).json({ error: "Invalid test id" });
    }

    const changes = await updateStudentPdfAccess({
      testId,
      facultyUserId: req.user.userId,
      enabled,
    });

    if (!changes) {
      return res.status(404).json({ error: "Test not found or unauthorized" });
    }

    return res.status(200).json({ testId, allowStudentPdf: enabled ? 1 : 0 });
  } catch (error) {
    console.error("Update PDF access error:", error);
    return res.status(500).json({ error: "Failed to update PDF access" });
  }
});

router.post("/tests/:testId/attempts", authenticate, requireRole("student"), async (req, res) => {
  try {
    const testId = Number(req.params.testId);

    if (!Number.isInteger(testId) || testId <= 0) {
      return res.status(400).json({ error: "Invalid test id" });
    }

    const answers = req.body.answers || {};
    const notes = req.body.notes || {};

    const result = await saveStudentAttempt({
      testId,
      studentUserId: req.user.userId,
      studentName: req.user.name,
      studentEmail: req.user.email,
      answers,
      notes,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Save attempt error:", error);
    return res.status(500).json({ error: error.message || "Failed to submit attempt" });
  }
});

router.get("/tests/:testId/attempts", authenticate, requireRole("faculty"), async (req, res) => {
  try {
    const testId = Number(req.params.testId);

    if (!Number.isInteger(testId) || testId <= 0) {
      return res.status(400).json({ error: "Invalid test id" });
    }

    const attempts = await getAttemptsByTestForFaculty({
      testId,
      facultyUserId: req.user.userId,
    });

    if (attempts === null) {
      return res.status(404).json({ error: "Test not found or unauthorized" });
    }

    return res.status(200).json({ attempts });
  } catch (error) {
    console.error("Get attempts error:", error);
    return res.status(500).json({ error: "Failed to fetch attempts" });
  }
});

router.get("/students/me/attempts", authenticate, requireRole("student"), async (req, res) => {
  try {
    const attempts = await getStudentAttemptHistory(req.user.userId);
    return res.status(200).json({ attempts });
  } catch (error) {
    console.error("Student attempt history error:", error);
    return res.status(500).json({ error: "Failed to fetch student history" });
  }
});

export default router;
