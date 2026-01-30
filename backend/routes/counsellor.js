const express = require("express");
const auth = require("../middleware/auth");
const { requireOnboardingComplete } = require("../middleware/stageGuard");
const { analyzeProfile, executeActions } = require("../services/aiCounsellor");

const router = express.Router();

router.post("/analyze", auth, requireOnboardingComplete, async (req, res) => {
  try {
    const counsel = await analyzeProfile(req.userId);

    if (counsel.actions && counsel.actions.length > 0) {
      const executedActions = await executeActions(req.userId, counsel.actions);
      counsel.executedActions = executedActions;
    }

    res.json(counsel);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get counseling",
      error: error.message,
    });
  }
});

router.get("/status", auth, async (req, res) => {
  try {
    const counsel = await analyzeProfile(req.userId);
    res.json(counsel);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch counselor status" });
  }
});

module.exports = router;
