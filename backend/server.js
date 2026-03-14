import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/auth.js";
import generateTestRouter from "./routes/generateTest.js";
import testsRouter from "./routes/tests.js";
import { initDatabase } from "./db/database.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", authRouter);
app.use("/api", generateTestRouter);
app.use("/api", testsRouter);

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`Backend server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
