const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken } = require('../utils/Authentication');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = generateAccessToken({ userId: user._id })
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
