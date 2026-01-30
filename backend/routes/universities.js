const express = require("express");
const University = require("../models/University");
const Shortlist = require("../models/Shortlist");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { requireOnboardingComplete } = require("../middleware/stageGuard");

const router = express.Router();

router.get("/", auth, requireOnboardingComplete, async (req, res) => {
  try {
    const { country, minBudget, maxBudget, competitiveness } = req.query;
    const filter = {};

    if (country) filter.country = country;
    if (minBudget || maxBudget) {
      filter.avgCost = {};
      if (minBudget) filter.avgCost.$gte = Number(minBudget);
      if (maxBudget) filter.avgCost.$lte = Number(maxBudget);
    }
    if (competitiveness) filter.competitiveness = competitiveness;

    const universities = await University.find(filter);
    const shortlists = await Shortlist.find({ userId: req.userId });

    const result = universities.map((uni) => {
      const shortlist = shortlists.find(
        (s) => s.universityId.toString() === uni._id.toString(),
      );
      return {
        ...uni.toObject(),
        isShortlisted: !!shortlist,
        category: shortlist?.category,
        isLocked: shortlist?.isLocked,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch universities" });
  }
});

router.get("/:id", requireOnboardingComplete, async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    const shortlist = await Shortlist.findOne({
      userId: req.userId,
      universityId: req.params.id,
    });

    res.json({
      ...university.toObject(),
      isShortlisted: !!shortlist,
      category: shortlist?.category,
      isLocked: shortlist?.isLocked,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch university" });
  }
});

router.post("/:id/shortlist", auth, async (req, res) => {
  try {
    const { category } = req.body;
    const universityId = req.params.id;

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    let shortlist = await Shortlist.findOne({
      userId: req.userId,
      universityId,
    });

    if (!shortlist) {
      shortlist = new Shortlist({
        userId: req.userId,
        universityId,
        category: category || "Target",
      });
    } else {
      shortlist.category = category || shortlist.category;
    }

    await shortlist.save();

    const user = await User.findById(req.userId);
    user.profile.dreamUniversities = await Shortlist.countDocuments({
      userId: req.userId,
      category: "Dream",
    });
    user.profile.targetUniversities = await Shortlist.countDocuments({
      userId: req.userId,
      category: "Target",
    });
    user.profile.safeUniversities = await Shortlist.countDocuments({
      userId: req.userId,
      category: "Safe",
    });
    await user.save();

    res.json({ message: "University shortlisted", shortlist });
  } catch (error) {
    res.status(500).json({ message: "Failed to shortlist university" });
  }
});

router.delete("/:id/shortlist", auth, async (req, res) => {
  try {
    await Shortlist.findOneAndDelete({
      userId: req.userId,
      universityId: req.params.id,
    });

    const user = await User.findById(req.userId);
    user.profile.dreamUniversities = await Shortlist.countDocuments({
      userId: req.userId,
      category: "Dream",
    });
    user.profile.targetUniversities = await Shortlist.countDocuments({
      userId: req.userId,
      category: "Target",
    });
    user.profile.safeUniversities = await Shortlist.countDocuments({
      userId: req.userId,
      category: "Safe",
    });
    await user.save();

    res.json({ message: "University removed from shortlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from shortlist" });
  }
});

router.post("/:id/lock", auth, async (req, res) => {
  try {
    const shortlist = await Shortlist.findOne({
      userId: req.userId,
      universityId: req.params.id,
    });

    if (!shortlist) {
      return res.status(404).json({ message: "Shortlist not found" });
    }

    shortlist.isLocked = true;
    await shortlist.save();

    const user = await User.findById(req.userId);
    user.currentStage = 4;
    await user.save();

    res.json({ message: "University locked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to lock university" });
  }
});

router.post("/:id/unlock", auth, async (req, res) => {
  try {
    const shortlist = await Shortlist.findOne({
      userId: req.userId,
      universityId: req.params.id,
    });

    if (!shortlist) {
      return res.status(404).json({ message: "Shortlist not found" });
    }

    shortlist.isLocked = false;
    await shortlist.save();

    const Task = require("../models/Task");
    await Task.deleteMany({
      userId: req.userId,
      universityId: req.params.id,
    });

    const user = await User.findById(req.userId);
    user.currentStage = 2;
    await user.save();

    res.json({ message: "University unlocked and tasks cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unlock university" });
  }
});

router.get("/user/shortlist", auth, async (req, res) => {
  try {
    const shortlists = await Shortlist.find({ userId: req.userId }).populate(
      "universityId",
    );
    res.json(shortlists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shortlist" });
  }
});

module.exports = router;
