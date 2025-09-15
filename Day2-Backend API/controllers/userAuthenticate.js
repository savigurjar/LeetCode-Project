const validUser = require("../validater/validUser");
const User = require("../src/models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const signup = async (req, res) => {
    try {
        await validUser(req.body);
        req.body.Password = await bcrypt.hash(req.body.Password, 10)
        await User.create(req.body);
        res.status(201).send("User created successfully")
    } catch (err) {
        res.status(401).send("Error " + err)
    }
}

const login = async (req, res) => {

    try {
        const { EmailId, Password } = req.body;

        const people = await User.findOne({ EmailId });
        if (!people) throw new Error("Invalid Credentials");

        const Isallowed = await bcrypt.compare(Password, people.Password);
        if (!Isallowed) throw new Error("Invalid Credentials")

        const token = jwt.sign({ _id: people._id, EmailId: people.EmailId }, process.env.SECRET_KEY, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true, // prevents JS access
            secure: process.env.NODE_ENV === "production", // https only in prod
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).send("User Login Successfully")
    } catch (err) {
        res.status(401).send("Error " + err)
    }

}

const getProfile = async (req, res) => {
    try {
        res.status(200).send(req.result)
    }
    catch (err) {
        res.status(400).send("Error " + err)
    }
}

module.exports = { signup, login, getProfile }