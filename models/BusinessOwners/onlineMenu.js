const mongoose = require("mongoose")
const {Schema} = mongoose;

const OnlineMenuSchema = new Schema({

    productName:{
        type:"String",
        required: true,
    },
    assortment:{
        type:"String",
        required: true,
    },
    productPrice:{
        type:"String",
        required: true
    },
    productDescription:{
        type:"String",
    }

})

const onlineMenuModel = new mongoose.model("online-menu" , OnlineMenuSchema)

module.exports = onlineMenuModel