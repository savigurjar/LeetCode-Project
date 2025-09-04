const express = require("express");
const submitRouter = express.Router();
const userMiddleware = require("../middleware/verifyUser")
const {submitCode} = require("../controllers/userSubmission")

// kon si problem ko submit kr rhe
submitRouter.post("/submit/:id",userMiddleware,submitCode);