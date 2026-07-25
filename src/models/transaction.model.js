const mongoose = require("mongoose");
const accountModel = require("./account.model");
const ledgerModel = require("./ledger.model");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a from account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a from account"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for creating a Transaction"],
      min: [0, "Transaction amount cannot be Negative"],
    },
    idempotencyKey: {
      type: String,
      required: [
        true,
        "Idempotency Key is Required for creating a Transaction",
      ],
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;
  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount and idempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });
  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid toAccount",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    systemUser: true,
    user: req.user._id,
  });
  const account = await accountModel.findOne({ user: req.user._id });
  console.log(account);
  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System user Account not Found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });
  await transaction.save({ session });
  await transaction.save();

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
await transaction.save({ session });

await session.commitTransaction();
await session.endSession();

console.log("Transaction:", await transactionModel.find());
console.log("Ledger:", await ledgerModel.find());

return res.status(201).json({
  message: "Initial funds transaction completed Successfully",
  transaction,
});

}

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = { transactionModel, createInitialFundsTransaction };
