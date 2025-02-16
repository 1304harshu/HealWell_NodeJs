const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  const user =  await User.findOne({ email });
  if (!user) return res.status(400).send({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' }); 
   
  if(role != user.role) return res.status(400).send({ message: 'Please select correct role' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.send({ token: token, name: user.name, email: user.email, role: user.role, id: user._id });
});

router.post("/register", async (req, res) => {
  try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).send({ message: "User already exists" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({ name, email, password: hashedPassword, role });

      await newUser.save();

      // Generate Token
      const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(201).send({ message: "User registered successfully", token });
  } catch (error) {
      res.status(500).send({ message: "Server Error", error });
  }
});

module.exports = router;
