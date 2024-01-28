const AdminRegisterModel = require("../../models/Admin/AdminRegister")
const BusinessOwnersModel = require("../../models/BusinessOwners/BusinessOwnersRegister");
require("dotenv").config();



const registerationRequests = async (req , res)=>{

const adminId = req.headers.authorization;

try {
    if(!adminId){
        return res.status(400).json({
            message:"admin id is not find"
        })
    }

    const admin = await AdminRegisterModel.findById(adminId)

    if(!admin.is_admin){
        return res.status(400).json({
            message:"admin is not find"
        })
    }

    allRequestBusinessOwner = await BusinessOwnersModel.find({
        is_approvedـbyـadmin: false,
        is_businessOwner: true,
        is_verified: true,
        is_complete_information: true
      }).select("name last_name username phone_number email country_name state_name city_name address brand_name postal_code work_phone registration_date")

      if(allRequestBusinessOwner){
        return res.status(200).json(allRequestBusinessOwner)
      }else{
        return res.status(200).json([])
      }

} catch (error) {
    console.error(error);
    res.status(500).json(error.message)
}
}


module.exports = {registerationRequests}