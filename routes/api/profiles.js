const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load User and Profile models
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// Load Input Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");


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

// @route   POST /api/profiles
// @desc    Create or edit user profile
// @access  Private
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const {
            errors,
            isValid
        } = validateProfileInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        // Get fields
        const profileFields = {};

        // if passport.authenticate is successful, req contains the user's information extracted from the jwt token

        // so first, associate profile with the user
        profileFields.user = req.user.id;
        // then the rest of the fields
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.handle = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.githubusername)
            profileFields.githubusername = req.body.githubusername;

        if (typeof req.body.skills !== "undefined") {
            profileFields.skills = req.body.skills.split(",");
        }

        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook)
            profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin)
            profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram)
            profileFields.social.instagram = req.body.instagram;

        // experience and education will be handled separately

        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            if (profile) {
                //update
                Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                }).then(profile => res.json(profile));
            } else {
                //create

                // check if handle exists
                Profile.findOne({
                    handle: profileFields.handle
                }).then(
                    profile => {
                        if (profile) {
                            errors.handle = "That handle already exists";
                            return res.status(400).json(errors);
                        }

                        // save profile
                        new Profile(profileFields)
                            .save()
                            .then(profile => res.json(profile));
                    }
                );
            }
        });
    }
);

// @route   GET /api/profiles/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
    const errors = {};

    Profile.findOne({
            handle: req.params.handle
        }) // the specific ":handle" is stored in req.params.handle
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if (!profile) {
                errors.nonprofile = "There is no profile for this handle";
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route   GET /api/profiles/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get("/user/:user_id", (req, res) => {
    const errors = {};

    Profile.findOne({
            user: req.params.user_id
        }) // the specific ":user_id" is stored in req.params.user_id
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if (!profile) {
                errors.nonprofile = "There is no profile for this user id";
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route   GET /api/profiles/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
    const errors = {};

    Profile.find()
        .populate("user", ["name", "avatar"])
        .then(profiles => {
            if (!profiles) {
                errors.nonprofiles = "There are no profiles";
                return res.status(404).json(errors);
            }

            res.json(profiles);
        })
        .catch(err => res.status(404).json(err));
});

// @route   POST /api/profiles/experience
// @desc    Add experience to profile
// @access  Private
router.post(
    "/experience",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const {
            errors,
            isValid
        } = validateExperienceInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // add to exp array
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        });
    }
);

// @route   POST /api/profiles/education
// @desc    Add education to profile
// @access  Private
router.post(
    "/education",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const {
            errors,
            isValid
        } = validateEducationInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // add to education array
            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile));
        });
    }
);

// @route   DELETE /api/profiles/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
    "/experience/:exp_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then(profile => {
                // Get remove index
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.exp_id);
                // Splice out of array
                profile.experience.splice(removeIndex, 1);

                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route   DELETE /api/profiles/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
    "/education/:edu_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then(profile => {
                // Get remove index
                const removeIndex = profile.education
                    .map(item => item.id)
                    .indexOf(req.params.edu_id);
                // Splice out of array
                profile.education.splice(removeIndex, 1);

                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route   DELETE /api/profiles
// @desc    Delete profile and user
// @access  Private
router.delete(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOneAndRemove({
            user: req.user.id
        }).then(() => {
            User.findOneAndRemove({
                _id: req.user.id
            }).then(() =>
                res.json({
                    success: true
                })
            );
        });
    }
);

module.exports = router;