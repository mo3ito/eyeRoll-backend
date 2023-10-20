const BoRollSettingModel = require("../../models/BusinessOwners/BORollSetting")




const getAllAlgoritm = async (req , res)=>{

    const {businessOwner_name,
        businessOwner_last_name,
        businessOwner_id,
        firstـpercentageـrange,
        secondـpercentageـrange,
        first_time_discount,
        last_time_discount,
        gift,
        peak_time_discount,
        special_product_discount,
        first_date,
        last_date } = req.body

    try {
        if(!firstـpercentageـrange && !first_time_discount && !last_time_discount && !first_date  ){

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
            firstـpercentageـrange,
            first_time_discount,
            secondـpercentageـrange,
            gift,
            last_time_discount,
            peak_time_discount,
            special_product_discount,
            first_date,
            last_date }

            const newRollSetting = await new BoRollSettingModel(informationRoll)

            newRollSetting.save()

            res.status(200).json({message : "information got successfully"})

        
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }

}




module.exports= {getAllAlgoritm}