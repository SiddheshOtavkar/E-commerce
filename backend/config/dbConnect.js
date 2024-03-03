const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
    const conn = await mongoose.connect("mongodb://0.0.0.0:27017/e-commerce")
    if (conn) {
        console.log(`Connected to Mongodb Database LocalHost`.bgMagenta.white);
    }
    else {
        console.log(`Error in Mongodb ${error}`.bgRed.white);
    }
};

module.exports = connectDB