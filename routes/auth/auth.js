const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config/config' });
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret;
const auth = require('../../middleware/auth.middleware');

const User = require('../../models/user.model');

// @route        post api/auth
// @description  auth user
// @access       public
router.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email })
        .then(user => {
            if (!user)
                return res.status(400).json({ msg: 'User does not exist' })
            
            // validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch)
                        return res.status(400).json({ msg: 'Invalid credentials' });

                    jwt.sign(
                        { id: user.id },
                        jwtSecret,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            })
                        }
                    );
                })
        })
});

// @route        get api/auth/user
// @description  get the user data
// @access       private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
})

module.exports = router;