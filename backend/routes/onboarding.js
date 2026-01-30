const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/submit', auth, async (req, res) => {
  try {
    const { academic, studyGoals, budget, exams } = req.body;

    const user = await User.findById(req.userId);

    user.onboarding = {
      academic,
      studyGoals,
      budget,
      exams,
    };

    user.profileCompleted = true;
    user.currentStage = 2;

    user.profile = {
      strength: calculateProfileStrength(user.onboarding),
      dreamUniversities: 0,
      targetUniversities: 0,
      safeUniversities: 0,
    };

    await user.save();

    res.json({
      message: 'Onboarding completed',
      user: {
        id: user._id,
        profileCompleted: user.profileCompleted,
        currentStage: user.currentStage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete onboarding' });
  }
});

router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      profileCompleted: user.profileCompleted,
      onboarding: user.onboarding,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch onboarding status' });
  }
});

const calculateProfileStrength = (onboarding) => {
  let strength = 0;
  if (onboarding.academic?.educationLevel) strength += 10;
  if (onboarding.academic?.major) strength += 10;
  if (onboarding.academic?.gpa) strength += 15;
  if (onboarding.studyGoals?.intendedDegree) strength += 15;
  if (onboarding.studyGoals?.fieldOfStudy) strength += 15;
  if (onboarding.studyGoals?.preferredCountries?.length) strength += 15;
  if (onboarding.budget?.yearlyBudget) strength += 10;
  if (onboarding.exams?.ielts) strength += 10;
  return Math.min(strength, 100);
};

module.exports = router;
