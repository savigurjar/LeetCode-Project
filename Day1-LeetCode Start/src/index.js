const express = require("express");
const app = express();
require("dotenv").config()
const main = require("./config/db")
const cookieParser = require("cookie-parser")
const User = require("./models/users")

app.use(express.json())
app.use(cookieParser())



main()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server listening at port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("err " + err)
    })
