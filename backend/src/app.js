const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const prisma = require("./config/prisma");
const authRoutes = require("./routes/auth.routes");

const app = express(); // MUST BE FIRST

// =========================
// MIDDLEWARE
// =========================
app.use(cors({
  origin: true,
  credentials: true, // REQUIRED for cookies
}));

app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // FIXED POSITION

// =========================
// ROUTES
// =========================
app.use("/auth", authRoutes);

// =========================
// TEST ROUTE
// =========================
app.get("/", async (req, res) => {
  try {
    const users = await prisma.users.findMany();

    res.json({
      success: true,
      usersCount: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// START SERVER
// =========================
app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});