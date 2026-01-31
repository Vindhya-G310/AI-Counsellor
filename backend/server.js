require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

connectDB();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://vindhya-g310.github.io",
  }),
);
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/onboarding", require("./routes/onboarding"));
app.use("/api/universities", require("./routes/universities"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/counsellor", require("./routes/counsellor"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.get("/info", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
