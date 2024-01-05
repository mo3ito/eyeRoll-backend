const express = require("express");
const router = express.Router();
const {seenPagesInformation , requestForDiscount , getAllDiscountRequest , removeExpireAwaitingRequest , deleteAwaitingRequest} = require("../../controllers/reportsControllers/businessOwnerReports")


router.post("/reports/seen-users",seenPagesInformation)
router.post("/reports/request-for-discount",requestForDiscount)
router.get("/reports/get-all-discount-request",getAllDiscountRequest)
router.delete("/reports/remove-expire-awaiting-request" , removeExpireAwaitingRequest)
router.post("/reports/remove-request-by-businessOwner" , deleteAwaitingRequest)






module.exports = router;