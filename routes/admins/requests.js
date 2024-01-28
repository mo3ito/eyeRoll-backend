const express = require("express")
const router = express.Router()
const {registerationRequests , confirmRegistrationRequests} = require("../../controllers/adminControllers/requests")

router.get("/admin/registeration-requests" , registerationRequests)
router.post("/admin/confirm-registeration-request" , confirmRegistrationRequests)



module.exports = router