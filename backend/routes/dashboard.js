const express = require("express");
const User = require("../models/User");
const Shortlist = require("../models/Shortlist");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const { requireOnboardingComplete } = require("../middleware/stageGuard");

const router = express.Router();

router.get("/", auth, requireOnboardingComplete, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const shortlistedCount = await Shortlist.countDocuments({
      userId: req.userId,
    });
    const lockedUniversity = await Shortlist.findOne({
      userId: req.userId,
      isLocked: true,
    }).populate("universityId");

    const incompleteTasks = await Task.find({
      userId: req.userId,
      completed: false,
    }).sort({ dueDate: 1 });

    const profileStrength = user.profile?.strength || 0;

    const stageInfo = {
      1: { name: "Building Profile", description: "Complete your onboarding" },
      2: {
        name: "Discovering Universities",
        description: "Shortlist universities",
      },
      3: {
        name: "Finalizing Universities",
        description: "Lock at least one university",
      },
      4: {
        name: "Preparing Applications",
        description: "Complete application tasks",
      },
    };

    res.json({
      user: {
        name: user.name,
        email: user.email,
      },
      profileStrength,
      currentStage: user.currentStage,
      stageInfo: stageInfo[user.currentStage],
      shortlistedUniversities: shortlistedCount,
      lockedUniversity: lockedUniversity?.universityId?.name || null,
      profileCounts: {
        dream: user.profile?.dreamUniversities || 0,
        target: user.profile?.targetUniversities || 0,
        safe: user.profile?.safeUniversities || 0,
      },
      upcomingTasks: incompleteTasks.slice(0, 5),
      totalTasks: await Task.countDocuments({ userId: req.userId }),
      completedTasks: await Task.countDocuments({
        userId: req.userId,
        completed: true,
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
