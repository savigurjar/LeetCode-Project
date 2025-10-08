const mongoose = require("mongoose")

async function main() {
    await mongoose.connect(process.env.CONNECT_KEY)
}

module.exports = main;