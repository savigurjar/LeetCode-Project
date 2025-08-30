const express = require("express");
const problemRouter = express.Router();


// admin middleware add +3
// create
problemRouter.post("/create", problemCreate);
// update
problemRouter.patch("/:id", problemUpdate);
// delete
problemRouter.delete("/:id", problemDelete)





// fetch
problemRouter.get("/:id", problemFetch)
problemRouter.get("/", problemFetchAll)

// kon si problem solve ki h user be
problemRouter.get("/user", solvedProblem)
