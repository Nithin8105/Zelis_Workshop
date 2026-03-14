import OpenAI from "openai";

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in backend environment");
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
};

const safeJsonParse = (rawText) => {
  try {
    return JSON.parse(rawText);
  } catch {
    const arrayMatch = rawText.match(/\[[\s\S]*\]/);
    if (!arrayMatch) {
      throw new Error("AI response did not contain a valid JSON array");
    }
    return JSON.parse(arrayMatch[0]);
  }
};

const normalizeAnswer = (answer, options) => {
  if (!answer || !Array.isArray(options)) {
    return options?.[0] ?? "";
  }

  const trimmed = String(answer).trim();
  const upper = trimmed.toUpperCase();

  const letterMap = {
    A: options[0],
    B: options[1],
    C: options[2],
    D: options[3],
  };

  if (letterMap[upper]) {
    return letterMap[upper];
  }

  const directMatch = options.find(
    (option) => option.toLowerCase() === trimmed.toLowerCase()
  );

  return directMatch ?? options[0];
};

export const generateMCQs = async ({ topics, difficulty, numberOfQuestions }) => {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const prompt = `Generate ${numberOfQuestions} multiple-choice questions for the syllabus topics: ${topics.join(
    ", "
  )}.\nDifficulty level: ${difficulty}.\n\nReturn ONLY valid JSON as an array.\nEach item must follow this shape:\n{\n  "topic": "string",\n  "question": "string",\n  "options": ["option A", "option B", "option C", "option D"],\n  "answer": "one correct option text or A/B/C/D"\n}\n\nRules:\n- Exactly 4 options for each question\n- One correct answer\n- Questions must align with provided topics and difficulty\n- Avoid duplicate questions`;

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "You are an exam paper generator. You always return strict JSON and no extra commentary.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const rawText = completion.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error("Empty response from AI model");
  }

  const parsed = safeJsonParse(rawText);
  if (!Array.isArray(parsed)) {
    throw new Error("AI response JSON is not an array");
  }

  const normalized = parsed
    .map((item) => {
      const options = Array.isArray(item.options)
        ? item.options.map((opt) => String(opt).trim()).filter(Boolean)
        : [];

      if (!item.question || options.length !== 4) {
        return null;
      }

      return {
        topic: String(item.topic ?? "").trim() || null,
        question: String(item.question).trim(),
        options,
        answer: normalizeAnswer(item.answer, options),
      };
    })
    .filter(Boolean);

  if (normalized.length === 0) {
    throw new Error("AI response could not be normalized into MCQ format");
  }

  return normalized.slice(0, numberOfQuestions);
};
