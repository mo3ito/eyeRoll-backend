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



module.exports = {searchInformation};