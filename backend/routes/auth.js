import bcrypt from "bcryptjs";
import express from "express";
import { createUser, findUserByEmail } from "../db/database.js";
import { authenticate, signAuthToken } from "../middleware/auth.js";

const router = express.Router();
const validRoles = new Set(["faculty", "student"]);

router.post("/auth/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const role = String(req.body.role || "").trim().toLowerCase();

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password, and role are required" });
    }

    if (!validRoles.has(role)) {
      return res.status(400).json({ error: "Role must be faculty or student" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const userId = await createUser({ name, email, password, role });

    const token = signAuthToken({
      userId,
      email,
      role,
      name,
    });

    return res.status(201).json({
      token,
      user: {
        id: userId,
        name,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    const statusCode = error.message === "An account with this email already exists" ? 409 : 500;
    return res.status(statusCode).json({ error: error.message || "Unable to signup" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const requestedRole = String(req.body.role || "").trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    if (requestedRole && requestedRole !== user.role) {
      return res.status(403).json({ error: `This account is not registered as ${requestedRole}` });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Unable to login" });
  }
});

router.get("/auth/me", authenticate, async (req, res) => {
  return res.status(200).json({ user: req.user });
});

export default router;
