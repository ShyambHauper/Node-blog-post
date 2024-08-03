// routes/user.js
const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middelware/auth');
const adminLoginMiddleware = require('../middelware/adminLogin');
const router = new express.Router();
const bcrypt = require('bcryptjs');

// Admin Login route using middleware
router.post('/login', adminLoginMiddleware, (req, res) => {
  res.status(200).json({ status: true, data: { user: req.user, token: req.token }, message: 'Login successfully!' });
});

// Create user
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: false, data: null, error: 'Only admin can add users!' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: false, data: null, error: 'Username and password are required!' });
  }

  req.body.createdBy = req.user._id;

  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).json({ status: true, data: { user: user }, message: 'User created successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, error: error?.errorResponse?.errmsg });
  }
})

// Edit user
router.patch('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: false, data: null, error: 'Only admin can update users!!' });
  }

  try {
    // If password is provided, hash it before updating
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 8);
      req.body.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
    if (!user) {
      return res.status(404).json({ status: false, data: null, message: 'User not found!' });
    }
    res.status(200).json({ status: true, data: { user: user }, message: 'User updated successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, error: error });
  }
});

// Delete user
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: false, data: null, error: 'Only admin can delete users!!' });
  }
  try {
    const user = await User.findById(req.params.id).lean()
    if (!user) {
      return res.status(404).json({ status: false, data: null, message: 'User not found!' });
    }

    await User.findByIdAndDelete(req.params.id).lean()
    res.status(200).json({ status: true, data: null, message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, error: error });
  }
});

module.exports = router;
