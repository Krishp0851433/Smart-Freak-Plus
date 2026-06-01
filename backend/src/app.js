const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const prisma = require("./config/prisma");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// TEST ROUTE
app.get("/", async (req, res) => {
  const users = await prisma.users.findMany();

  res.json({
    success: true,
    usersCount: users.length,
    data: users
  });
});

app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});