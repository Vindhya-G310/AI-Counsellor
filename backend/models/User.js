const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    currentStage: {
      type: Number,
      default: 1,
      enum: [1, 2, 3, 4],
    },
    onboarding: {
      academic: {
        educationLevel: String,
        major: String,
        graduationYear: Number,
        gpa: Number,
      },
      studyGoals: {
        intendedDegree: String,
        fieldOfStudy: String,
        intakeYear: Number,
        preferredCountries: [String],
      },
      budget: {
        yearlyBudget: Number,
        fundingType: String,
      },
      exams: {
        ielts: String,
        greGmat: String,
        sop: String,
      },
    },
    profile: {
      strength: Number,
      dreamUniversities: Number,
      targetUniversities: Number,
      safeUniversities: Number,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
