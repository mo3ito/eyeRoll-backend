const express = require("express")
const router = express.Router()
const {getAllAlgoritm , getRoll , getAllRollsList } = require("../../controllers/bussinessOwnerControllers/rolls")




router.get("/roll/get-all-rolls-list",getAllRollsList)
router.post("/roll/get-roll-algoritm", getAllAlgoritm)
router.post("/roll/get-roll" , getRoll )






module.exports=router