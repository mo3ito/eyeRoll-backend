const mongoose = require("mongoose")
const {Schema} = mongoose;

const OnlineMenuSchema = new Schema({

    businessOwnerId:{
        type: "String",
        default:""
    },
    productName:{
        type:"String",
        required: true,
    },
    productAssortment:{
        type:"String",
        required: true,
    },
    productPrice:{
        type:"String",
        required: true
    },
    productPricePetty:{
        type:"String",
    },
    productDescription:{
        type:"String",
    }

})

const OnlineMenu = new mongoose.model("online-menu" , OnlineMenuSchema)

module.exports = OnlineMenu;