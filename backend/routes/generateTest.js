import express from "express";
import {
  createTest,
  getTestWithQuestions,
  saveGeneratedQuestions,
  saveSyllabusTopics,
} from "../db/database.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { generateMCQs } from "../services/aiService.js";

const router = express.Router();

const validDifficulty = new Set(["easy", "medium", "hard"]);

const parseTopics = (topics) => {
  if (Array.isArray(topics)) {
    return topics.map((topic) => String(topic).trim()).filter(Boolean);
  }

  if (typeof topics === "string") {
    return topics
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);
  }

  return [];
};

router.post("/generate-test", authenticate, requireRole("faculty"), async (req, res) => {
  try {
    const topics = parseTopics(req.body.topics);
    const difficulty = String(req.body.difficulty || "").toLowerCase().trim();
    const numberOfQuestions = Number(req.body.numberOfQuestions);

    if (topics.length === 0) {
      return res.status(400).json({ error: "At least one syllabus topic is required" });
    }

    if (!validDifficulty.has(difficulty)) {
      return res
        .status(400)
        .json({ error: "Difficulty must be one of: easy, medium, hard" });
    }

    if (!Number.isInteger(numberOfQuestions) || numberOfQuestions < 1 || numberOfQuestions > 50) {
      return res
        .status(400)
        .json({ error: "numberOfQuestions must be an integer between 1 and 50" });
    }

    const testId = await createTest({
      topics,
      difficulty,
      numberOfQuestions,
      createdBy: req.user.userId,
    });
    await saveSyllabusTopics(testId, topics);

    const generatedQuestions = await generateMCQs({
      topics,
      difficulty,
      numberOfQuestions,
    });

    await saveGeneratedQuestions(testId, generatedQuestions);

    const fullTest = await getTestWithQuestions(testId);

    return res.status(200).json({
      testId,
      topics: fullTest.topics,
      difficulty: fullTest.difficulty,
      numberOfQuestions: fullTest.question_count,
      allowStudentPdf: Number(fullTest.allow_student_pdf || 0),
      createdAt: fullTest.created_at,
      questions: fullTest.questions,
    });
  } catch (error) {
    console.error("Error generating test:", error);
    return res.status(500).json({
      error: "Failed to generate test",
      details: error.message,
    });
  }
});

export default router;
