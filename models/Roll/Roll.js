const mongoose = require("mongoose")
const {Schema} = mongoose


const BORollSettingSchema = new Schema({
    isRollUse:{
        type : Boolean,
        default: false
    },
    businessOwner_name:{
        type:"String",
    },
    businessOwner_last_name:{
        type:"String",
    },
    businessOwner_id:{
        type:"String",
    },
    min_percentage:{
        type:"String",
        default:""
    },
    max_percentage:{
        type:"String",
        default:""
    },
    start_day:{
        type : Date,
        default: null,
    },
    finish_day:{
        type : Date,
        default: null,
    },
    start_day_time:{
        type:"String",
        default:""
    },
    end_day_time:{
        type:"String",
        default:""
    },
    start_day_peak_time:{
        type:"String",
        default:""
    },
    end_day_peak_time:{
        type:"String",
        default:""
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