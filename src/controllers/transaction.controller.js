const transactionModel = require("../models/transaction.model.js");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");
const mongoose = require("mongoose");

/**
 * *- Create a new Transaction
 * *- steps:
 *      1. Validate request
 *      2. Validate idempotency key
 *      3, check account Status
 *      4, Derive sender balance from ledger
 *      5, create transactoin (Initiallay PENDING)
 *      6, Crete DEBIT entry
 *      7, Create CREDIT Entry
 *      8, Mark Tranasaction COMPLETED
 *      9, Commit MongoDB session
 *      10. SEnd email notification
 */

async function createTransaction(req, res) {
  //step 1
  

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  
  
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "FromAccount, toAccount, Amount, IdempotencyKey is Required to make the Transaction",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  //step2 check idempotency

  const isTransactionAlreadyExists = await transactionModel.transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already Completed",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is Still Pending",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction Processing failed previously, Please Try again",
      });
    }
    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(500).json({
        message: "Transaction was reversed, Please try again",
      });
    }
  }

  //step 3 account status check

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both fromAccount and toAccount must be ACTIVE to process the Transaction.",
    });
  }

  // step 4 Derieve sender balance from ledger

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}, required amount is ${amount}`,
    });
  }

  //step 5 Create the Transaction

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel.transactionModel({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  await transaction.save({ session });

  //step 6 Debit Entry
  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  //Step 7 Credit Entry
  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  //Transaction completed
  transaction.status = "COMPLETED";
  await transaction.save({ session });

  //MongoDB session commited
  await session.commitTransaction();
  session.endSession();

  //Send the email
  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  return res.status(201).json({
    message: `Transaction is Completed`,
  });
}

module.exports = { createTransaction };
