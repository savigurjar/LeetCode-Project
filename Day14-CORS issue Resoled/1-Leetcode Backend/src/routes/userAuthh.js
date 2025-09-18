const express = require("express");
const userMiddleware = require("../middleware/verifyUser")
const adminMiddleware = require("../middleware/adminmiddleware")
const authRouter = express.Router();
const { signup, login, getProfile, logout, adminSignup, deleteProfile } = require("../controllers/userAuthenticate");


// register or signup
authRouter.post("/signup", signup)

// login
authRouter.post("/login", login);

// logout
authRouter.post("/logout", userMiddleware, logout);

// getProfile
authRouter.get("/getProfile", userMiddleware, getProfile)

// deleteProfile
authRouter.delete("/deleteProfile", userMiddleware, deleteProfile)

// emailverfiy
// forget password
// reset password
// Google signup

authRouter.post("/admin/signup", adminMiddleware, adminSignup);

// webiste pr authenticate user h ya nhi
authRouter.get("/check", userMiddleware, (req, res) => {
    const reply = {
        FirstName: req.result.FirstName,
        EmailId: req.result.EmailId,
        _id: req.result._id

    }
    res.status(200).json({
        user: reply,
        messgae: "Valid User"
    })
})

module.exports = authRouter;