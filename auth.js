import { Router } from "express";
import { usersByEmail } from "./users.js";

const router = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeFakeToken(email) {
  return Buffer.from(`kiln-session:${email}:${Date.now()}`).toString("base64");
}

function publicUser(user) {
  return { name: user.name, email: user.email };
}

// ---- Sign up: creates a new mock account in memory ----
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name?.trim() || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are all required.",
    });
  }

  if (!EMAIL_PATTERN.test(String(email))) {
    return res.status(400).json({
      success: false,
      message: "That email doesn't look right.",
    });
  }

  if (String(password).length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters.",
    });
  }

  const normalizedEmail = String(email).toLowerCase();

  if (usersByEmail.has(normalizedEmail)) {
    return res.status(409).json({
      success: false,
      message: "An account with that email already exists. Try logging in instead.",
    });
  }

  const user = { name: name.trim(), email: normalizedEmail, password };
  usersByEmail.set(normalizedEmail, user);

  return res.status(201).json({
    success: true,
    message: "Account created. You can now log in.",
    user: publicUser(user),
  });
});

// ---- Log in: checks against accounts created via /signup ----
router.post("/login", (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are both required.",
    });
  }

  if (!EMAIL_PATTERN.test(String(email))) {
    return res.status(400).json({
      success: false,
      message: "That email doesn't look right.",
    });
  }

  const normalizedEmail = String(email).toLowerCase();
  const user = usersByEmail.get(normalizedEmail);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No account found with that email. Sign up first.",
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password.",
    });
  }

  return res.status(200).json({
    success: true,
    token: makeFakeToken(user.email),
    user: publicUser(user),
  });
});

export default router;