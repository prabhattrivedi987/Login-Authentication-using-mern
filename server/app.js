// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5257;
const SECRET_KEY = "your-secret-key";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Users Database
let users = [
  {
    id: 1,
    userId: "admin",
    password: bcrypt.hashSync("1234", 8),
    name: "Admin User",
    email: "admin@example.com",
  },
  {
    id: 2,
    userId: "user1",
    password: bcrypt.hashSync("12345", 8),
    name: "John Doe",
    email: "john@example.com",
  },
];

// Token blacklist for server-side logout
let tokenBlacklist = [];

// Login Route
app.post("/login", (req, res) => {
  const { userId, password } = req.body;

  const user = users.find((u) => u.userId === userId);
  if (!user) return res.status(401).json({ message: "User not found" });

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid)
    return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    token,
    user: {
      id: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email,
    },
  });
});

// Protected route example
app.get("/profile", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  if (tokenBlacklist.includes(token))
    return res.status(401).json({ message: "Token has been logged out" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = users.find((u) => u.id === decoded.id);
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "No token provided" });

  // Add token to blacklist
  tokenBlacklist.push(token);

  res.json({ message: "Logged out successfully" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
