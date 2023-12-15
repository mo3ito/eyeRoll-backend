const BusinessOwnerModel =  require("../../models/BusinessOwners/BusinessOwnersRegister")

const searchInformation = async (req, res) => {
    const inputValue = req.query.input_value;
    

    try {
        const result = await BusinessOwnerModel.find({
            brand_name: { $regex: new RegExp(`^${inputValue}`, 'i') }
        }).select('_id brand_name');
        
       await res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

const getBusinessOwnerInfosSearched = async (req , res)=>{

    const businessOwnerId = req.query.businessOwnerId

    try {

        if(!businessOwnerId){
            return res.status(400).json({
                message: "businessOwner id not found"
            })
        }

       const infos = await BusinessOwnerModel.findById(businessOwnerId).select('_id name last_name country_name state_name city_name address brand_name work_phone')
       console.log(infos);
      return res.status(200).json(infos)
        
    } catch (error) {
        console.error(error)
            res.status(500).json(error.message)
    }

}



module.exports = {searchInformation , getBusinessOwnerInfosSearched};