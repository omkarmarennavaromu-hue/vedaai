const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ---- Mock User ----
const USER = {
  username: "omkar",
  password: "1234",
};

// ---- Simple token store (no DB) ----
let activeToken = null;

// ---- LOGIN ----
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    activeToken = "omkar_token_" + Date.now();
    return res.json({
      success: true,
      token: activeToken,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

// ---- DASHBOARD (Protected) ----
app.get("/api/dashboard", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = auth.split(" ")[1];

  if (token !== activeToken) {
    return res.status(403).json({ message: "Invalid token" });
  }

  // Mock dashboard data
  res.json({
    user: "Omkar",
    progress: 67,
    streak: 12,
    weakTopics: ["Organic Chemistry", "Kinematics", "Probability"],
    recommendations: [
      "Revise Organic Chemistry reactions",
      "Practice 20 Physics numericals",
      "Solve 1 mock test today",
    ],
    subjects: [
      { name: "Physics", progress: 72 },
      { name: "Chemistry", progress: 61 },
      { name: "Maths", progress: 68 },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Omkar AI server running on http://localhost:${PORT}`);
});
