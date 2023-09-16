const mongoose = require("mongoose")
const {Schema} = mongoose

const BusinessOwnersSchema = new Schema({
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
        minLength:8
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




const BusinessOwners = mongoose.model("business-owners" , BusinessOwnersSchema)

module.exports = BusinessOwners;