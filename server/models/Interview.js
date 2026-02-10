const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    required: true
  },
  questions: [{
    id: String,
    text: String,
    type: String,
    followUpTo: String
  }],
  answers: [{
    questionId: String,
    text: String,
    audioUrl: String,
    duration: Number,
    timestamp: Date
  }],
  feedback: {
    overallScore: Number,
    confidenceScore: Number,
    communicationScore: Number,
    technicalScore: Number,
    strengths: [String],
    improvements: [String],
    summary: String,
    weaknessRadar: {
      clarity: Number,
      structure: Number,
      technicalDepth: Number,
      confidence: Number,
      relevance: Number
    }
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);