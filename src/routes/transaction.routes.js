const {router} = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const express = require("express")
const transactionController = require("../controllers/transaction.controller");
const { createInitialFundsTransaction } = require("../models/transaction.model");




const transactionRoutes = express.Router();


/**
 * -Post /api/transaction
 * - Create a new Transaction
 */

transactionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction
);


//Post /api/transations/system/initial-funds
// create initial funds.. like cash deposits

transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, createInitialFundsTransaction)

//


module.exports = transactionRoutes