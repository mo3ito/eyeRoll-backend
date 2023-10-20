const express = require("express")
const router = express.Router()
const {getAllAlgoritm} = require("../../controllers/bussinessOwnerControllers/rolls")




router.post("/roll-setting/getAll", getAllAlgoritm)






module.exports=router