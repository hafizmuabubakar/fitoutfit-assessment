const express = require('express');
const jwt = require('jsonwebtoken');
const Flashcard = require('../models/Flashcard');
const User = require('../models/User');
const {authenticate} = require('../utils/Authentication.js');

const router = express.Router();


router.get('/flashcards', authenticate, async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ user: req.userId });
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/flashcards', authenticate, async (req, res) => {
  try {
    const { question, answer } = req.body;
    const flashcard = new Flashcard({ user: req.userId, question, answer });
    await flashcard.save();
    res.status(201).json({ message: 'Flashcard created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.put('/flashcards/:id', authenticate, async (req, res) => {
  try {
    const flashcardId = req.params.id;
    const { question, answer } = req.body;

    const flashcard = await Flashcard.findOne({ _id: flashcardId, user: req.userId });

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    flashcard.question = question;
    flashcard.answer = answer;
    await flashcard.save();

    res.status(200).json({ message: 'Flashcard updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.delete('/flashcards/:id', authenticate, async (req, res) => {
  try {
    const flashcardId = req.params.id;

    const flashcard = await Flashcard.findOne({ _id: flashcardId, user: req.userId });

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    await flashcard.remove();

    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;