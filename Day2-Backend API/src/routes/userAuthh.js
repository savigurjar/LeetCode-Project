const express = require("express");
const verifyUser = require("../../middleware/verifyUser")
const authRouter = express.Router();
const { signup, login, getProfile } = require("../../controllers/userAuthenticate");

// register or signup
authRouter.post("/signup", signup)

// login
authRouter.post("/login", login);

// logout
// authRouter.post("/logout",verifyUser, logout);

// getProfile
authRouter.get("/getProfile",verifyUser, getProfile)

// emailverfiy
// forget password
// reset password
// Google signup

module.exports = authRouter;