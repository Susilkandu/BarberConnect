const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  salon:{
    type: Schema.Types.ObjectId,
    ref: "salon",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender:{
    type: String, 
    enum: ['male','female','transgender','others'],
    required: true,
  },
  dob:{
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'deactive'],
    default: 'active'
  },
  photoUrl: {
    type: String
  },
}, { timestamps: true });

const Staff = mongoose.model("staff", staffSchema);
module.exports = Staff;
