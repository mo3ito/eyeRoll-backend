const express = require("express")
const router = express.Router()
const {registerationRequests , confirmRegistrationRequests , memberReportsRequest} = require("../../controllers/adminControllers/requests")

router.get("/admin/registeration-requests" , registerationRequests)
router.post("/admin/confirm-registeration-request" , confirmRegistrationRequests)
router.get("/admin/member-reports-request" , memberReportsRequest)



module.exports = router