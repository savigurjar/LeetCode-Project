const express = require("express");
const userMiddleware = require("../middleware/verifyUser")
const adminMiddleware = require("../middleware/adminmiddleware")
const authRouter = express.Router();
const { signup, login, getProfile, logout ,adminSignup} = require("../controllers/userAuthenticate");


// register or signup
authRouter.post("/signup", signup)

// login
authRouter.post("/login", login);

// logout
authRouter.post("/logout", userMiddleware, logout);

// getProfile
authRouter.get("/getProfile", userMiddleware, getProfile)

// emailverfiy
// forget password
// reset password
// Google signup

authRouter.post("/admin/signup", adminMiddleware, adminSignup)

module.exports = authRouter;