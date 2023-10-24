const express = require("express")
const router = express.Router()
const {getAllAlgoritm , discountInformation } = require("../../controllers/bussinessOwnerControllers/rolls")





router.post("/roll/getAll", getAllAlgoritm)
router.post("/roll/discount-information" , discountInformation )






module.exports=router