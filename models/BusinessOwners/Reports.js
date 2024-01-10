const mongoose = require("mongoose")
const {Schema} = mongoose;

const ReportsSchema = new Schema({
    businessOwnerId:{
        type: "String",
        default:""
    },
    eyeRoll_all_seen_user:{
        type: Array,
        default: [],
    },
    online_menu_all_seen_user:{
        type: Array,
        default: [],
    },
    all_register_discount_taken:{
        type: Array,
        default: [],
    }
})

const Reports = new mongoose.model("reports" ,ReportsSchema)

module.exports = Reports