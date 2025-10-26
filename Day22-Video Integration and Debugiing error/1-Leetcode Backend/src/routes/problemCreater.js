const express = require("express");
const problemRouter = express.Router();
const userMiddleware = require("../middleware/verifyUser")
const adminMiddleware = require("../middleware/adminmiddleware")
const { createProblem, updateProblem, deleteProblem, getProblemById,getAllProblem ,solvedAllProblemByUser,submittedProblem } = require("../controllers/userProblem")



// admin middleware add +3 - phle dekhege problem create krne wala admin h ya nhi
// create
problemRouter.post("/create", adminMiddleware, createProblem);
// update
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
// // delete
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem)
// 





// // fetch
problemRouter.get("/problemById/:id", userMiddleware, getProblemById)

problemRouter.get("/getAllProblem",userMiddleware, getAllProblem)

// // kon si problem solve ki h user be
problemRouter.get("/problemAllSolvedByUser",userMiddleware, solvedAllProblemByUser)

// submitted problem
problemRouter.get("/submittedProblem/:id",userMiddleware,submittedProblem)
module.exports = problemRouter;


