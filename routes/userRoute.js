const express = require('express');
const User = require('../models/userModel');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' }); // Adjust expiry time as needed
};

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.userId = decoded.userId;
        next();
    });
};

// Creating a new user
router.post('/createuser', [
    body('username').isLength({ min: 4 }).withMessage('Not a valid name'),
    body('email').isEmail().withMessage('Not a valid e-mail address'),
    body('password').isLength({ min: 5 }).withMessage('Password is too weak')
], async (req, res) => {
    let success = false;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: 'Email already exists!!' })
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
        });

        const token = generateToken(user.id);

        success = true;
        res.json({ success, token });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// signing in to account
router.post('/login', [
    body('email').isEmail().withMessage('Not a valid e-mail address'),
    body('password').isLength({ min: 5 }).withMessage('Type a valid Password').exists()
], async (req, res) => {
    let success = false;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: 'Please give correct details!!' })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Please give correct details!!' })
        }

        const token = generateToken(user.id);

        success = true;
        res.json({ success, token });

    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// getting user account info
router.get('/getuser', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

