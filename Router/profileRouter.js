const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
} = require("../Controller/userProfile");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

module.exports = router;
