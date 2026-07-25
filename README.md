# 🏦 PaiseWale Bank API

A RESTful banking backend built with Node.js, Express.js, and MongoDB that implements a double-entry ledger system for accurate and auditable financial transactions.

The API allows users to register, log in using JWT authentication, create bank accounts, deposit funds through a dedicated System Account, transfer money securely, and receive email notifications for account registration and successful transfers.

Every transaction creates corresponding debit and credit ledger entries, ensuring financial consistency through MongoDB ACID transactions.

## ✨ Features

- User registration with welcome email
- JWT authentication
- Create bank accounts
- System Account for cash deposits
- Secure fund transfers
- Email notifications for successful transfers
- Double-entry ledger accounting
- Transaction history
- ACID-compliant MongoDB transactions
- Blacklisted JWT tokens on logout

## 📁 Project Structure

```text
src
├── config
│   └── db.js
├── controllers
│   ├── account.controller.js
│   ├── auth.controller.js
│   └── transaction.controller.js
├── middleware
│   └── auth.middleware.js
├── models
│   ├── account.model.js
│   ├── blacklist.model.js
│   ├── ledger.model.js
│   ├── transaction.model.js
│   └── user.model.js
├── routes
│   ├── account.routes.js
│   ├── auth.routes.js
│   └── transaction.routes.js
├── services
│   └── email.service.js
└── app.js

server.js
```

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Nodemailer

## 🚀 Installation

```bash
git clone https://github.com/akashbyalal/PaiseWale-Bank.git
cd PaiseWale-Bank
npm install
```

## ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token

EMAIL_USER=your_email@gmail.com
```

## ▶️ Run the Server

```bash
npm run dev
```

## 📌 API Modules

- Authentication
- Account Management
- Transactions
- Ledger
