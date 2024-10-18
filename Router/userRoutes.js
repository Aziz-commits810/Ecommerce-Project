const express = require("express");
const userController = require("../Controller/userController");
const passport = require("passport");
const authMiddleware = require("../Middleware/authMiddleware");
const {
  forgotPassword,
  updatePassword,
} = require("../Controller/userController");
require("../Config/passport");
const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);

// social login >>>>google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.json({
      success: true,
      token: req.user.token,
      user: req.user.user,
    });
  }
);
//forget password
router.post("/forgotpassword", userController.forgotPassword);

///verify or reset password
router.post("/verifyotp", userController.verifyOtp);
router.post("/resetpassword", userController.resetPassword);

//update password
router.put("/updatepassword", authMiddleware, userController.updatePassword);

module.exports = router;
