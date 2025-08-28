const jwt = require("jsonwebtoken")
const User = require("../src/models/users")

const verifyUser = async (req, res, next) => {

    try {
        const { token } = req.cookie;
        if (!token) throw new Error("Token is Missing");

        const payload = jwt.verify(token, process.env.SECRET_KEY);
        const { _id } = payload;
        if (!_id) throw new Error("Invalid token payload");

        const result = await User.findById(_id);
        if (!result) throw new Error("User not Found");

        req.result = result;

        next();
    } catch (err) {
        res.status(401).send({ error: "Unauthorized: " + err.message });
    }

}
module.exports = verifyUser;