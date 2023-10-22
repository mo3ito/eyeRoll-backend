const mongoose = require("mongoose")
const {Schema} = mongoose

const BORollSettingSchema = new Schema({
    businessOwner_name:{
        type:"String",
    },
    businessOwner_last_name:{
        type:"String",
    },
    businessOwner_id:{
        type:"String",
    },
    minـpercentage:{
        type:"String",
        default:""
    },
    maxـpercentage:{
        type:"String",
        default:""
    },
    first_date:{
        type : Date,
        default: null,
    },
    last_date:{
        type : Date,
        default: null,
    },
    first_date_peak:{
        type : Date,
        default: null,
    },
    last_date_peak:{
        type : Date,
        default: null,
    },
    min_percentage_peak:{
        type:"String",
        default:""
    },
    max_percentage_peak:{
        type:"String",
        default:""
    },
    special_product_discount: {
        type: Array,
        default: [],
    },
    gift:{
        type:"String",
    },
    number_Purchase_gift:{
        type:"String",
    }
   
})


const BoRollSetting = mongoose.model( "roll-information" , BORollSettingSchema )

module.exports= BoRollSetting