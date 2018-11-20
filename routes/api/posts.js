const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Post model
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Load Input Validation
const validatePostInput = require("../../validation/post");
const Profile = require("../../models/Profile");

// @route   GET /api/posts/test
// @desc    Tests posts route
// @access  Public
router.get("/test", (req, res) => res.json({
    msg: "Posts works."
})); // The route implies /api/posts/test

// @route   POST /api/posts
// @desc    Create post
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
        } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        });

        newPost.save().then(post => res.json(post));
    }
);

// @route   GET /api/posts
// @desc    Get posts
// @access  Public
router.get("/", (req, res) => {
    Post.find()
        .sort({
            date: -1
        })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostsfound: "No Posts Found"
        }));
});

// @route   GET /api/posts/:post_id
// @desc    Get single post by post_id
// @access  Public
router.get("/:post_id", (req, res) => {
    Post.findById(req.params.post_id)
        .then(post => res.json(post))
        .catch(err =>
            res.status(404).json({
                nopostfound: "No Post Found with that Id"
            })
        );
});

// @route   DELETE /api/posts/:post_id
// @desc    Delete single post by post_id
// @access  Private
router.delete(
    "/:post_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    // check for post owner because you don't want someone to delete posts created by someone else

                    if (post.user.toString() !== req.user.id) {
                        return res
                            .status(401)
                            .json({
                                notauthorized: "User not authorized"
                            });
                    }

                    //Delete
                    post.remove().then(() => res.json({
                        success: true
                    }));
                })
                .catch(err =>
                    res.status(404).json({
                        postnotfound: "No post found"
                    })
                );
        });
    }
);

// @route   POST /api/posts/like/:post_id
// @desc    Like post by post_id
// @access  Private
router.post(
    "/like/:post_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    if (
                        post.likes.filter(
                            like => like.user.toString() === req.user.id
                        ).length > 0
                    ) {
                        return res.status(400).json({
                            alreadyliked: "User already liked this post"
                        });
                    }

                    // Add the user id to the likes array
                    post.likes.unshift({
                        user: req.user.id
                    });
                    post.save().then(post => res.json(post));
                })
                .catch(err =>
                    res.status(404).json({
                        postnotfound: "No post found"
                    })
                );
        });
    }
);

// @route   POST /api/posts/dislike/:post_id
// @desc    Dislike post by post_id
// @access  Private
router.post(
    "/dislike/:post_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    if (
                        post.likes.filter(
                            like => like.user.toString() === req.user.id
                        ).length == 0
                    ) {
                        return res.status(400).json({
                            notliked: "User has not yet liked this post"
                        });
                    }

                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    post.likes.splice(removeIndex);
                    post.save().then(post => res.json(post));
                })
                .catch(err =>
                    res.status(404).json({
                        postnotfound: "No post found"
                    })
                );
        });
    }
);

// @route   POST /api/posts/comment/:post_id
// @desc    Add comment to post by post_id
// @access  Private
router.post(
    "/comment/:post_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        // we use the same validator for both Post and Comment to
        // make sure that the text field has beeen received.
        const {
            errors,
            isValid
        } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        // redundant to check profile?
        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    const newComment = {
                        text: req.body.text,
                        name: req.body.name,
                        avatar: req.body.avatar,
                        user: req.user.id
                    };

                    post.comments.unshift(newComment);
                    post.save().then(post => res.json(post));
                })
                .catch(err =>
                    res.status(404).json({
                        postnotfound: "No post found"
                    })
                );
        });
    }
);

// @route   DELETE /api/posts/comment/:post_id/:comment_id
// @desc    Delete comment by the comment_id from post by post_id
// @access  Private
router.delete(
    "/comment/:post_id/:comment_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        // redundant to check profile?
        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    if (
                        post.comments.filter(
                            comment =>
                            comment._id.toString() === req.params.comment_id // req.params.comment_id is a string, therefore, comment._id has to be converted into a string before the comparison
                        ).length === 0
                    ) {
                        return res.status(404).json({
                            commentnotfound: "Comment does not exist"
                        });
                    }

                    // Get remove index
                    const removeIndex = post.comments
                        .map(item => item._id.toString())
                        .indexOf(req.params.comment_id);

                    // check for comment owner because you don't want someone to delete comments made by someone else
                    if (
                        post.comments[removeIndex].user.toString() !==
                        req.user.id
                    ) {
                        return res
                            .status(401)
                            .json({
                                notauthorized: "User not authorized"
                            });
                    }

                    post.comments.splice(removeIndex, 1);
                    post.save().then(post => res.json(post));
                })
                .catch(err =>
                    res.status(404).json({
                        postnotfound: "No post found"
                    })
                );
        });
    }
);


module.exports = router;