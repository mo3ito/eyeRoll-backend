const express = require("express")
const router = express.Router()
const {getAllAlgoritm , getRoll , getAllRollsList , rollAdjustedSend , rollAdjustGet } = require("../../controllers/bussinessOwnerControllers/rolls")




router.get("/roll/get-all-rolls-list",getAllRollsList)
router.post("/roll/get-roll-algoritm", getAllAlgoritm)
router.post("/roll/get-roll" , getRoll )
router.post("/roll/roll-adjusted-send",rollAdjustedSend)
router.get("/roll/roll-adjusted-get",rollAdjustGet)






module.exports=router