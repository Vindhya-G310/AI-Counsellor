const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    degreeTypes: {
      type: [String],
      default: [],
    },
    avgCost: {
      type: Number,
      required: true,
    },
    competitiveness: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Very High'],
      required: true,
    },
    minGPA: {
      type: Number,
      default: 2.5,
    },
    examRequirements: {
      type: [String],
      default: [],
    },
    description: String,
    ranking: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('University', universitySchema);
