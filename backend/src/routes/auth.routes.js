const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");
const prisma = require("../config/prisma");
const { authLimiter } = require("../middleware/rateLimit.middleware");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


// =========================
// EMAIL SETUP (Nodemailer)
// =========================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password 
  },
});

async function sendResetEmail(email, token) {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset.</p>
      <p>Click below link to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
}


// =========================
// SIGNUP
// =========================
router.post("/signup", authLimiter, async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      gender,
      date_of_birth,
      height,
      weight,
      goal_type,
      activity_level,
    } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        gender,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        height,
        weight,
        goal_type,
        activity_level,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// =========================
// LOGIN
// =========================
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      }
    );

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    const session = await prisma.sessions.create({
      data: {
        user_id: user.id,
        refresh_token: hashedToken,
        is_valid: true,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      accessToken,
      sessionId: session.id,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// =========================
// FORGOT PASSWORD (UPDATED  EMAIL SENT)
// =========================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.users.findUnique({
      where: { email },
    });

    // always return success (security)
    if (!user) {
      return res.json({
        success: true,
        message: "If account exists, email will be sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    await prisma.password_reset_tokens.create({
      data: {
        user_id: user.id,
        token,
        expires_at: expiresAt,
      },
    });

    // SEND EMAIL HERE
    await sendResetEmail(user.email, token);

    res.json({
      success: true,
      message: "Reset email sent",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// =========================
// RESET PASSWORD (UNCHANGED LOGIC)
// =========================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const resetToken = await prisma.password_reset_tokens.findFirst({
      where: {
        token,
        expires_at: { gt: new Date() },
      },
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: resetToken.user_id },
      data: { password: hashedPassword },
    });

    await prisma.password_reset_tokens.delete({
      where: { id: resetToken.id },
    });

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// =========================
// PROFILE (Protected Route)
// =========================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        gender: true,
        height: true,
        weight: true,
        goal_type: true,
        activity_level: true,
      },
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;