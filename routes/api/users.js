const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require('gravatar');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/user");

// @route   GET /api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
    const {
        errors,
        isValid
    } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
            email: req.body.email
        }) // asynchronous, therefore must be handled using a promise
        .then(user => {
            if (user) {
                errors.email = "Email already exists";
                return res.status(400).json(errors);
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
    const {
        errors,
        isValid
    } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({
        email: email
    }).then(user => {
        if (!user) {
            errors.email = "User not found";
            return res.status(400).json(errors);
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) { // User matched
                // res.json({ msg: "Success" });

                // The payload is a set of user attributes to be included in the token. You may pick whatever you want.
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                };

                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey, {
                        expiresIn: 3600
                    }, // an hour
                    (err, token) => { //a callback function that receives the token that jwt generates as an argument
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                errors.password = "Password incorrect";
                return res.status(400).json(errors);
            }

        });
    });
});


// @route   GET /api/users/current
// @desc    Return current user
// @access  Private
router.get(
    "/current",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        // if passport.authenticate is successful, req contains the user's information extracted from the jwt token
        // notice that what information to be included in res.json is up to you. Here I just chose id, name, and email.
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
);


module.exports = router;