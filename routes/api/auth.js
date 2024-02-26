const express = require("express");
const {
  registrationController,
  sentOTPController,
  verifyOTPController,
  logoutController,
  profileController,
  profileUpdateController,
} = require("../../controllers/authControllers/usersControllers");
const authMiddleware = require("../../middlewares/authMiddleware");
const router = express.Router();

// Registration
router.post("/registration", registrationController);

// Sent OTP
router.post("/sentotp", sentOTPController);

// Verify OTP
router.post("/verifyotp", verifyOTPController);

// Logout
router.get("/logout", logoutController);

// profile
router.get("/profile", authMiddleware, profileController);

// profile update
router.post("/profileupdate", authMiddleware, profileUpdateController);

module.exports = router;
