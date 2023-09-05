const mongoose = require("mongoose")
const {Schema} = mongoose

const CustomersShema = new Schema({
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
    is_verified: {
        type : Boolean,
        default: false
      },
    token_email: {
        type: String,
        default: null,
      },
    
})




const Customers = mongoose.model("customers" , CustomersShema)

module.exports = Customers;