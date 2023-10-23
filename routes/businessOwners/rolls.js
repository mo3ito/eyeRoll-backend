const express = require("express")
const router = express.Router()
const {getAllAlgoritm , informationDiscount} = require("../../controllers/bussinessOwnerControllers/rolls")




router.post("/roll/getAll", getAllAlgoritm)
router.post("information-discount" , informationDiscount )






module.exports=router