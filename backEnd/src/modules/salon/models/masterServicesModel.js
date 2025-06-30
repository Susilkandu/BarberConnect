const mongoose = require("mongoose");
const { Schema } = mongoose;
const masterServicesSchema = new Schema({
  name: { type: String, required: true, trim: true, unique: true},
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});
const MasterServices = mongoose.model("masterservice", masterServicesSchema);
module.exports = MasterServices;
