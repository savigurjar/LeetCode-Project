const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminmiddleware")


// admin middleware add +3 - phle dekhege problem create krne wala admin h ya nhi
// create
problemRouter.post("/create",adminMiddleware, CreateProblem);
// update
problemRouter.patch("/:id",adminMiddleware, UpdateProblem);
// delete
problemRouter.delete("/:id",adminMiddleware, DeleteProblem)





// fetch
problemRouter.get("/:id", getProblemById)
problemRouter.get("/", getAllProblem)

// kon si problem solve ki h user be
problemRouter.get("/user", solvedProblemByUser)
