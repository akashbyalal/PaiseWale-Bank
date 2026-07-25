const express = require("express");
const authController = require("../controllers/auth.controller");
const { userRegisterController, userLoginController } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", userRegisterController);

/** Post /api/auth/login */
router.post("/login", userLoginController)


//  -/apiauth/logout
//  -Logs out and Blacklist's the Token

router.post("/logout", authController.userLogoutController)

module.exports = router;
