const express = require("express");
const app = express();
require("dotenv").config()
const main = require("./config/db")
const cookieParser = require("cookie-parser")
const userAuth = require("./routes/userAuthh")


app.use(express.json())
app.use(cookieParser())

app.use("/auth",userAuth)



main()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server listening at port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("err " + err)
    })
