const User = require('../models/User');

const requireOnboardingComplete = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.profileCompleted) {
      return res.status(403).json({ message: 'Onboarding not completed' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const requireUniversityLocked = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const Shortlist = require('../models/Shortlist');
    const lockedUniversity = await Shortlist.findOne({
      userId: req.userId,
      isLocked: true,
    });
    if (!lockedUniversity) {
      return res.status(403).json({ message: 'No university locked' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  requireOnboardingComplete,
  requireUniversityLocked,
};
