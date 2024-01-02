const express = require("express")
const router = express.Router()
const {adminRegister , loginAdmin} = require("../../controllers/adminControllers/adminRegister")


router.post("/admin/register",adminRegister)
router.post("/admin/login" , loginAdmin )





module.exports = router