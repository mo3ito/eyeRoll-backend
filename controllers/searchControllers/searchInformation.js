

const searchInformation =async (req , res)=>{


    try {
        return  await res.status(200).json({ message: "hi" });
    } catch (error) {
        console.log(error);
    }


}




module.exports = {searchInformation};