const mongoose = require("mongoose");
const {MONGO_URI} = require("./env");
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Suceess connectivity of Database");
    } catch (error) {
        console.error("Database connectivity failed", error.message);
        
    }
}
module.exports = connectDB;