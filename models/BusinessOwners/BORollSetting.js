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
    firstـpercentageـrange:{
        type:"String",
        default:""
    },
    secondـpercentageـrange:{
        type:"String",
        default:""
    },
    first_time_discount:{
        type:"String",
        default:""
    },
    last_time_discount:{
        type:"String",
        default:""
    },
    gift:{
        type:"String",
    },
    peak_time_discount:{
        type:"String",
        default:""
    },
    special_product_discount:{
        type:"String",
        default:""
    },
    first_date:{
        type: Date,
        default: Date.now 
        
    },
    last_date:{
        type: Date,
        default: Date.now 
    }
})


const BoRollSetting = mongoose.model( "roll-information" , BORollSettingSchema )

module.exports= BoRollSetting