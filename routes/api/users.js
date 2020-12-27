const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config/config' });
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret;

// user model
const User = require('../../models/user.model');

router.post('/', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ msg: 'Please enter all fields' });
    
    User.findOne({ email })
        .then(user => {
            if (user)
                res.status(400).json({ msg: 'User already exists' });
            const newUser = new User({
                name,
                email,
                password
            });

            // create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err)
                        throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                {id: user.id},
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
                            )
                        })
                })
            })
        })
})

module.exports = router;