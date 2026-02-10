const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profession: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    default: 'computer_science'
  },
  plan: {
    type: String,
    enum: ['freemium', 'advanced', 'full'],
    default: 'freemium'
  },
  streak: {
    type: Number,
    default: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);