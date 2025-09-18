const jwt = require("jsonwebtoken")
const User = require("../models/users")
const redisClient = require("../config/redis")

const userMiddleware = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        if (!token) throw new Error("Token is Missing");

        const payload = jwt.verify(token, process.env.SECRET_KEY);
        const { _id } = payload;
        if (!_id) throw new Error("Invalid token payload");

        const result = await User.findById(_id);
        if (!result) throw new Error("User not Found");

        // Redis ke blocklist me token present to nhi h
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if (IsBlocked) throw new Error("Invalid Token")

        req.result = result;

        next();
    } catch (err) {
        res.status(401).send( "Unauthorized: " + err.message );
    }

}
module.exports = userMiddleware;