const mongoose = require("mongoose")
const {Schema} = mongoose;

const UserShema = new Schema({
    email:{
        type:"String",
    },
    password:{
        type:"String",
        required:true,
        minLength:8
    },
    username:{
        type:"String",
        required: true,
        minLength:4,

    },
    is_verified: {
        type : Boolean,
        default: false
      },
    token_email: {
        type: String,
        default: null,
      }, 
      registration_date:{
        type : Date,
        default: Date.now 
      },
      discounts_eyeRoll:{
        type: Array,
        default: [],

      }
})

const Users = mongoose.model("users",UserShema)

module.exports = Users