const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    FirstName: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: true
    },
    LastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
    },
    EmailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true
    },
    Age: {
        type: Number,
        min: 7,
        max: 90
    },
    Role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    ProblemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:"problem",
        }],
        unique:true
    },
    Password:{
        type:String,
        required:true
    }


}, { timestamps: true })

const User = mongoose.model("user",userSchema);
module.exports = User