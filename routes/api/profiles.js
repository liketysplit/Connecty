const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load User and Profile models
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   GET /api/profiles/test
// @desc    Tests profiles route
// @access  Public
router.get("/test", (req, res) => res.json({
    msg: "Profiles works."
})); // The route implies /api/profiles/test

// @route   GET /api/profiles/current
// @desc    Get current user's profile
// @access  Private
router.get(
    "/current",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const errors = {};

        // if passport.authenticate is successful, req contains the user's information extracted from the jwt token
        Profile.findOne({
                user: req.user.id
            })
            .populate("user", ["name", "avatar"]) // include name and avatar in the response such that they are shown on the profile page, which is a public page
            .then(profile => {
                if (!profile) {
                    errors.nonprofile = "There is no profile for this user";
                    return res.status(404).json(errors);
                }

                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

module.exports = router;