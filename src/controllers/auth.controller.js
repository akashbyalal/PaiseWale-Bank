const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const emailServices = require("../services/email.service");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 *
 * User Registration Controller
 * -post /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, name, password } = req.body;

  const isExist = await userModel.findOne({
    email: email,
  });

  if (isExist) {
    return res.status(422).json({
      message: " User Already Exists",
      status: "Failed",
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);
  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
    user,
  });

  await emailServices.sendRegistrationEmail(user.email, user.name);
}

/**
 *  - userLogin
 *  - post /api/auth/login
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;
  const user = await userModel
    .findOne({
      email: email,
    })
    .select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Email or Password is Incorrect",
    });
  }

  const isValidPassword = await user.comparePassword(password);

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);
  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
    user,
  });
}
/**
 *
 * @param {userLogoutController} req
 * user logout Controller
 * -post /api/auth/logout
 */
async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(200).json({
      message: "User Logged out Already",
    });
  }

  res.cookie(token, "");
  await tokenBlacklistModel.create({
    token: token,
  });

  return res.status(200).json({
    message: "User Logged out Successfully",
  });
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
};
