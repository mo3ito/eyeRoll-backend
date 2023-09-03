const mongoose = require("mongoose")
const {Schema} = mongoose

const UsersShema = new Schema({
    name:{
        type:"String",
        required: true,
        trim: true
    },
    last_name:{
        type:"String",
        required: true,
        trim: true
    },
    phone_number:{
        type:"String",
        unique: true,
    },
    username:{
        type:"String",
        required: true,
        minLength:4,

    },
    password:{
        type:"String",
        required:true,
        minLength:6
    },
    email:{
        type:"String",
    },
    token_email: {
        type: String,
        default: null,
      },
      email_token_expires: {
        type: Date,
        default: null,
      },
})

// UsersSchema.methods.isEmailTokenExpired = function () {
//     return this.email_token_expires <= new Date();
//   };
  


const Users = mongoose.model("users" , UsersShema)

module.exports = Users;