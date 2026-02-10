const express = require('express');
const Interview = require('../models/Interview');
const router = express.Router();

// Save an interview session
router.post('/', async (req, res) => {
  try {
    const { userId, config, questions, answers, feedback } = req.body;

    const interview = new Interview({
      userId,
      config,
      questions,
      answers,
      feedback,
      startedAt: new Date(),
      endedAt: new Date()
    });

    await interview.save();

    res.status(201).json({ success: true, interview });
  } catch (error) {
    console.error('Save interview error:', error);
    res.status(500).json({ message: 'Server error saving interview' });
  }
});

// Get user's interview history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });

    res.json({ interviews });
  } catch (error) {
    console.error('Get interview history error:', error);
    res.status(500).json({ message: 'Server error getting interview history' });
  }
});

// Get specific interview
router.get('/:interviewId', async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ interview });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: 'Server error getting interview' });
  }
});

module.exports = router;