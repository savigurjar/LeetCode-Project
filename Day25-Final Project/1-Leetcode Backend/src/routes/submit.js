const express = require("express");
const submitRouter = express.Router();
const userMiddleware = require("../middleware/verifyUser")
const {submitCode,runCode} = require("../controllers/userSubmission")

// kon si problem ko submit kr rhe
submitRouter.post("/submit/:id",userMiddleware,submitCode);

submitRouter.post("/run/:id",userMiddleware,runCode)

module.exports = submitRouter;