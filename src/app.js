const express = require("express");

/** - Routes */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");

const app = express();

const cookieParser = require("cookie-parser");
const transactionRoutes = require("./routes/transaction.routes");

app.use(express.json());
app.use(cookieParser());


/** -Use Routes */
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

module.exports = app;
