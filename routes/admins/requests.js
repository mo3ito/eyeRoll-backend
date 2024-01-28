const express = require("express")
const router = express.Router()
const {registerationRequests} = require("../../controllers/adminControllers/requests")

router.get("/admin/registeration-requests" , registerationRequests)



module.exports = router