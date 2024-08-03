// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminLoginMiddleware = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: false, data: null, error: 'Username and password are required!' });
    }

    try {
        const user = await User.findOne({ username }).lean()

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ status: false, data: null, error: 'Invalid credentials!' });
        }

        // Generate a token if credentials are valid
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(500).json({ status: false, data: null, error: 'Internal server error!' });
    }
};

module.exports = adminLoginMiddleware;
