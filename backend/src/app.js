const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const prisma = require("./config/prisma");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());


app.use("/auth", authRoutes);


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

app.listen(5001, () => {
  console.log(
    "Server running on http://localhost:5001"
  );
});