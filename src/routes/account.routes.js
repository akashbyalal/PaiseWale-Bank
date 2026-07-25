const express = require("express");

const accountModel = require("../models/account.model");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

const router = express.Router();

/**
 * -Post /api/account/
 * -create a new Acccount
 * -this is a protected route
 */

router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);

//Get /api/accounts
//get all accounts of the logged in user
//protected Route

router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController)

//Get /api/accounts/balance/:accountId
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)
module.exports = router;
