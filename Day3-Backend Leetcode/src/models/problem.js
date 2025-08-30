const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    tages: {
        type: String,
        enum: ["array", "linkedlist", "binarysearch", "stack", "queue", "tree", "graph", "dp"],
        required: true
    },
    visibleTestCases: [{
        input: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        },
        explanation: {
            type: String,
            required: true
        }
    }],
    hiddenTestCases: [{
        input: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        },

    }],
    startCode: [{
        language: {
            type: String,
            required: true
        },
        initialCode: {
            type: String,
            required: true
        }
    }],
    problemCreater: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },


})

const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;