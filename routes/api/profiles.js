const express = require("express");
const router = express.Router();

// @route   GET /api/profiles/test
// @desc    Tests profiles route
// @access  Public
router.get("/test", (req, res) => res.json({
    msg: "Profiles works."
})); // The route implies /api/profiles/test

module.exports = router;