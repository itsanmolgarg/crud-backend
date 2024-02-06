// routes.js

const express = require("express");
const profileRoutes = require("./apis/profiles/routes");
const commentRoutes = require("./apis/comments/routes");
const router = express.Router();

router.use("/api/profile", profileRoutes);
router.use("/api/comments", commentRoutes);

module.exports = router;
