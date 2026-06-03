const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");
const prisma = require("../config/prisma");


// =========================
// SIGNUP
// =========================
router.post("/signup", async (req, res) => {
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
// LOGIN (MULTI DEVICE SESSION)
// =========================
router.post("/login", async (req, res) => {
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

    // device info
    const userAgent = req.headers["user-agent"] || "unknown";
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

    // tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // HASH refresh token before storing
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    // create session
    const session = await prisma.sessions.create({
      data: {
        user_id: user.id,
        refresh_token: hashedToken,
        user_agent: userAgent,
        ip_address: ip,
        device_name: userAgent,
        is_valid: true,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("sessionId", session.id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken,
      sessionId: session.id,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// =========================
// CURRENT USER
// =========================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { password, ...safeUser } = user;

    res.json({
      success: true,
      user: safeUser,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// =========================
// REFRESH TOKEN (DEVICE SAFE)
// =========================
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    const sessionId = req.cookies?.sessionId;

    if (!token || !sessionId) {
      return res.status(401).json({
        success: false,
        message: "No refresh session",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const session = await prisma.sessions.findFirst({
        where: {
          id: sessionId,
          user_id: decoded.userId,
          is_valid: true,
          expires_at: {
            gt: new Date(),
          },
        },
      });
      
      if (!session) {
        return res.status(403).json({
          success: false,
          message: "Session not found or expired",
        });
      }

    const match = await bcrypt.compare(token, session.refresh_token);

    if (!match) {
      return res.status(403).json({
        success: false,
        message: "Refresh token mismatch",
      });
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const hashed = await bcrypt.hash(newRefreshToken, 10);

    await prisma.sessions.update({
      where: { id: session.id },
      data: {
        refresh_token: hashed,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// =========================
// LOGOUT SINGLE DEVICE
// =========================
router.post("/logout", async (req, res) => {
  try {
    const sessionId = req.cookies?.sessionId;

    if (sessionId) {
        const result = await prisma.sessions.updateMany({
            where: {
              id: sessionId,
              user_id: req.user.userId,
              is_valid: true,
            },
            data: {
              is_valid: false,
            },
          });
          
          if (result.count === 0) {
            return res.status(404).json({
              success: false,
              message: "Session not found",
            });
          }
    }

    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");

    res.json({
      success: true,
      message: "Logged out from this device",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// =========================
// GET ACTIVE SESSIONS
// =========================
router.get("/sessions", authMiddleware, async (req, res) => {
  try {
    const sessions = await prisma.sessions.findMany({
      where: {
        user_id: req.user.userId,
        is_valid: true,
      },
      select: {
        id: true,
        device_name: true,
        ip_address: true,
        created_at: true,
        expires_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.json({
      success: true,
      sessions,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// =========================
// LOGOUT SINGLE DEVICE BY ID
// =========================
router.post("/logout-device", authMiddleware, async (req, res) => {
    try {
      const { sessionId } = req.body;
  
      const result = await prisma.sessions.updateMany({
        where: {
          id: sessionId,
          user_id: req.user.userId,
          is_valid: true,
        },
        data: {
          is_valid: false,
        },
      });
  
      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }
  
      res.json({
        success: true,
        message: "Device logged out",
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

module.exports = router;