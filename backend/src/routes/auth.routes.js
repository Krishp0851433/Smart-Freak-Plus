const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

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

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        gender,
        date_of_birth: date_of_birth
          ? new Date(date_of_birth)
          : null,
        height,
        weight,
        goal_type,
        activity_level,
      },
    });

    // Don't return password
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;