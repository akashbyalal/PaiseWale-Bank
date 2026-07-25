require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
connectDB();

app.listen(3000, () => {
    console.log("Server is running Sucessfully");
});