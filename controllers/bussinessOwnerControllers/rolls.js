const RollSettingModel = require("../../models/BusinessOwners/Roll")




const getAllAlgoritm = async (req , res)=>{

    const businessOwnerId = req.headers.authorization;

    const {businessOwner_name,
        businessOwner_last_name,
        businessOwner_id,
        firstـpercentage,
        lastـpercentage,
        first_date,
        last_date,
        first_date_peak,
        last_date_peak,
        first_percentage_peak,
        last_percentage_peak,
        special_product_discount,
        gift
     } = req.body

    try {

       

        if (!businessOwnerId) {
            return res.status(400).json({
              message: "No business owner was found with this profile",
            })}

        if((!firstـpercentage && !first_date) || (!first_date && !special_product_discount) ){

            return res.status(400).json({
                message: "Please fill all required fields.",
              });
        }
        if(!businessOwner_id || !businessOwner_name || !businessOwner_last_name ){
            return res.status(400).json({
                message: "The ID of the business owner was not found",
              });
        }
        

        
        const informationRoll = {businessOwner_name,
            businessOwner_last_name,
            businessOwner_id,
            firstـpercentage,
            lastـpercentage,
            first_date,
            last_date,
            first_date_peak,
            last_date_peak,
            first_percentage_peak,
            last_percentage_peak,
            special_product_discount,
            gift
         }

            const newRollSetting = await new RollSettingModel(informationRoll)

            newRollSetting.save()

            res.status(200).json({message : "information got successfully"})

        
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }

}




module.exports= {getAllAlgoritm}