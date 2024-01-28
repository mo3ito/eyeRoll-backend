const AdminRegisterModel = require("../../models/Admin/AdminRegister")
const BusinessOwnersModel = require("../../models/BusinessOwners/BusinessOwnersRegister");
const moment = require('moment');
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
      }).select("_id name last_name username phone_number email country_name state_name city_name address brand_name postal_code work_phone registration_date")

   

      const formattedRequests = allRequestBusinessOwner.map(request => {
        const formattedDate = moment(request.registration_date).format("YYYY-MM-DD");
    
        return {
          _id: request._id,
          name: request.name,
          last_name: request.last_name,
          username: request.username,
          phone_number: request.phone_number,
          email: request.email,
          country_name: request.country_name,
          state_name: request.state_name,
          city_name: request.city_name,
          address: request.address,
          brand_name: request.brand_name,
          postal_code: request.postal_code,
          work_phone: request.work_phone,
          registration_date: formattedDate
        };
      });

      if(formattedRequests){
        return res.status(200).json(formattedRequests)
      }else{
        return res.status(200).json([])
      }


} catch (error) {
    console.error(error);
    res.status(500).json(error.message)
}
}

const confirmRegistrationRequests = async (req , res)=>{

    const adminId = req.headers.authorization;

    const {businessOwnerId} = req.body;

    try {
        if(!adminId){
            return res.status(400).json({
                message:"admin id is not find"
            })
        }
    
        const admin = await AdminRegisterModel.findById(adminId)
    
        if(!admin.is_admin){
            return res.status(400).json({
                message:"admin does not find"
            })
        }

       const businessOwner = await BusinessOwnersModel.findById(businessOwnerId)

       if(businessOwner.is_approvedـbyـadmin){
        return res.status(400).json({
            message: "This business owner has already been approved by admin"
          })
       }

       businessOwner.is_approvedـbyـadmin = true

      await businessOwner.save()

      return res.status(200).json({
        message: "The registration request has been successfully approved"
      })

    } catch (error) {
        console.error(error);
        res.status(500).json(error.message)
    }
    

}


module.exports = {registerationRequests , confirmRegistrationRequests}