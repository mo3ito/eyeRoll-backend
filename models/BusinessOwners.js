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
    country_name:{
        type:"String",
        default: ""
    },
    state_name:{
        type:"String",
        default: ""
    },
    city:{
        type:"String",
        default: ""
    },
    address:{
        type:"String",
        default: ""
    },
    brand_name:{
        type:"String",
        default: ""
        
    },
    is_additional_specifications:{
        type:Boolean,
        default: false
        
    },  
    is_verified: {
        type : Boolean,
        default: false
      },
    token_email: {
        type: "String",
        default: null,
      },
      registration_date:{
        type : Date,
        default: Date.now 
      },
      is_businessOwner:{
        type : Boolean,
        default: true
      }
    
})




const BusinessOwners = mongoose.model("business-owners" , BusinessOwnersSchema)

module.exports = BusinessOwners;