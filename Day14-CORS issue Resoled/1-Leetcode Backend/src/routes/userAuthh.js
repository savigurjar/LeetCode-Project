const express = require("express");
const userMiddleware = require("../middleware/verifyUser")
const adminMiddleware = require("../middleware/adminmiddleware")
const authRouter = express.Router();
const { signup, login, getProfile, logout, adminSignup, deleteProfile } = require("../controllers/userAuthenticate");

// Register or signup
authRouter.post("/signup", signup)

// Login
authRouter.post("/login", login);

// Logout - FIXED: Added userMiddleware
authRouter.post("/logout", userMiddleware, logout);

// Get Profile
authRouter.get("/getProfile", userMiddleware, getProfile)

// Delete Profile
authRouter.delete("/deleteProfile", userMiddleware, deleteProfile)

// Admin signup
authRouter.post("/admin/signup", adminMiddleware, adminSignup);

// Check authentication - IMPROVED ERROR HANDLING
authRouter.get("/check", userMiddleware, (req, res) => {
    try {
        const reply = {
            FirstName: req.result.FirstName,
            EmailId: req.result.EmailId,
            _id: req.result._id
        }
        res.status(200).json({
            user: reply,
            message: "Valid User" //  Fixed typo: messgae -> message
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message //  Only send message, not full error object
        });
    }
});

module.exports = authRouter;