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
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================
// LOGIN
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

    // ACCESS TOKEN
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // REFRESH TOKEN
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 🔐 HASH REFRESH TOKEN BEFORE STORING
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await prisma.refresh_tokens.create({
      data: {
        user_id: user.id,
        token: hashedRefreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error(error);
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

    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================
// REFRESH TOKEN
// =========================
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // verify JWT first
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // check user still exists
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // find stored tokens for user
    const storedTokens = await prisma.refresh_tokens.findMany({
      where: { user_id: decoded.userId },
    });

    // match hashed token
    let validToken = null;

    for (let t of storedTokens) {
      const match = await bcrypt.compare(refreshToken, t.token);
      if (match) {
        validToken = t;
        break;
      }
    }

    if (!validToken) {
      return res.status(403).json({
        success: false,
        message: "Refresh token not recognized",
      });
    }

    // NEW ACCESS TOKEN
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // ROTATE REFRESH TOKEN
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const newHashed = await bcrypt.hash(newRefreshToken, 10);

    await prisma.refresh_tokens.deleteMany({
      where: { user_id: decoded.userId },
    });

    await prisma.refresh_tokens.create({
      data: {
        user_id: decoded.userId,
        token: newHashed,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// LOGOUT
// =========================
router.post("/logout", async (req, res) => {
    try {
      const { refreshToken } = req.body;
  
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token required",
        });
      }
  
      // verify token first
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
  
      // remove ONLY this user's token
      await prisma.refresh_tokens.deleteMany({
        where: {
          user_id: decoded.userId,
        },
      });
  
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
module.exports = router;