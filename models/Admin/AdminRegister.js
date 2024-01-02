const mongoose = require("mongoose")
const { Schema } = mongoose;

const AdminRegisterSchema = new Schema({
  name: {
    type: "String",
    required: true,
    trim: true,
  },
  last_name: {
    type: "String",
    required: true,
    trim: true,
  },
  phone_number: {
    type: "String",
    unique: true,
  },
  username: {
    type: "String",
    required: true,
    minLength: 4,
  },
  password: {
    type: "String",
    required: true,
    minLength: 8,
  },
  email: {
    type: "String",
  },
  is_admin: {
    type: Boolean,
    default: true,
  },
  registration_date:{
    type : Date,
    default: Date.now 
  },
  is_verified: {
    type : Boolean,
    default: true
  },
});

const AdminRegister = mongoose.model("admins", AdminRegisterSchema);

module.exports = AdminRegister;
