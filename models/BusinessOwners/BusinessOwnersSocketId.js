const mongoose = require("mongoose")
const {Schema} = mongoose


const BusinessOwnersSocketIdSchema = new Schema({
    businessOwnerId:{
        type: "String"
    },
    socketId:{
        type: "String"
    }
})

const BusinessOwnersSocketId = mongoose.model("business-owners-socketId" , BusinessOwnersSocketIdSchema)

module.exports = BusinessOwnersSocketId;