const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require('gravatar');

// Load User model
const User = require('../../models/User');

// @route   GET /api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
    User.findOne({
            email: req.body.email
        }) // asynchronous, therefore must be handled using a promise
        .then(user => {
            if (user) {
                return res.status(400).json({
                    email: "Email already exists"
                });
            } else {
                avatar = gravatar.url(req.body.email, {
                    s: "200", //size
                    r: "pg", //rating
                    d: "mm" //default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar, // ES6 for avatar: avatar
                    password: req.body.password // will be encrypted below
                });

                bcrypt.genSalt(10, (err, salt) => { // callback
                    bcrypt.hash(newUser.password, salt, (err, hash) => { // callback
                        if (err) throw err;

                        newUser.password = hash;
                        newUser
                            .save() // asynch, therefore must be handled using a promise
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

// @route   GET /api/users/login
// @desc    login user and return a JWT token
// @access  Public
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({
        email: email
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                email: "User not found"
            });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                res.json({
                    msg: "Success"
                });
            } else {
                return res.status(400).json({
                    password: "Password incorrect"
                });
            }
        });
    });
});

module.exports = router;