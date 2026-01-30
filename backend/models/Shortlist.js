const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    category: {
      type: String,
      enum: ['Dream', 'Target', 'Safe'],
      default: 'Target',
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  { timestamps: true }
);

shortlistSchema.index({ userId: 1, universityId: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);
