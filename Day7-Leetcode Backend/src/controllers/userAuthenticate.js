const validUser = require("../validater/validUser")
const User = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const redisClient = require("../config/redis")


const signup = async (req, res) => {
    try {
        await validUser(req.body);
        req.body.Password = await bcrypt.hash(req.body.Password, 10)
        // req.body.Role = 'user'
        const people = await User.create(req.body);



        const token = jwt.sign({ _id: people._id, Role: people.Role, EmailId: people.EmailId }, process.env.SECRET_KEY, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true, // prevents JS access
            secure: process.env.NODE_ENV === "production", // https only in prod
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
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

        const token = jwt.sign({ _id: people._id, Role: people.Role, EmailId: people.EmailId }, process.env.SECRET_KEY, { expiresIn: "1d" })

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

const logout = async (req, res) => {
    try {
        // validate the token
        // token add kr denge Redis ke blocklist me
        const { token } = req.cookies;
        if (!token) throw new Error("Token is missing");

        // verify and decode token
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        // add token to Redis blocklist
        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        // clear cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).send("Logout Successfully")

    } catch (err) {
        res.status(401).send("Error " + err.message);

    }
}

const adminSignup = async (req, res) => {
    try {

        // or 
        // if(req.result.Role != admin) throw new Error("Invalid Credentials")

        await validUser(req.body);
        req.body.Password = await bcrypt.hash(req.body.Password, 10)
        req.body.Role = 'admin'
        const people = await User.create(req.body);

        const token = jwt.sign({ _id: people._id, Role: people.Role, EmailId: people.EmailId }, process.env.SECRET_KEY, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true, // prevents JS access
            secure: process.env.NODE_ENV === "production", // https only in prod
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(201).send("Admin created successfully")
    } catch (err) {
        res.status(401).send("Error " + err)
    }
}

module.exports = { signup, login, getProfile, logout, adminSignup }