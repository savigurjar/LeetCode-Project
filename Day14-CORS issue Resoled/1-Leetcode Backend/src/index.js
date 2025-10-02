const express = require("express");
const app = express();
require("dotenv").config()
const main = require("./config/db")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/userAuthh");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemCreater")
const submitRouter = require("./routes/submit")
const cors = require("cors");


app.use(cors({
    origin:'http://localhost:5173/',
    Credentials:true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/user", authRouter)
app.use("/problem", problemRouter)
app.use("/submission",submitRouter)


const InitializeConnections = async () => {
    try {
        await Promise.all([main(), redisClient.connect()])
        console.log("DB Connected");

        app.listen(process.env.PORT, () => {
            console.log(`server listening at port ${process.env.PORT}`)
        })

    } catch (err) {
        console.log("err " + err)
    }
}
InitializeConnections()


// main()
//     .then(() => {
//         app.listen(process.env.PORT, () => {
//             console.log(`server listening at port ${process.env.PORT}`)
//         })
//     })
//     .catch((err) => {
//         console.log("err " + err)
//     })
