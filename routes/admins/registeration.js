const express = require("express")
const router = express.Router()
const {adminRegister} = require("../../controllers/adminControllers/adminRegister")


router.post("/admin/register",adminRegister)





module.exports = router