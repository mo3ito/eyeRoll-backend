const express = require("express");
const router = express.Router();
const {seenPagesInformation , requestForDiscount , getAllDiscountRequest} = require("../../controllers/reportsControllers/businessOwnerReports")


router.post("/reports/seen-users",seenPagesInformation)
router.post("/reports/request-for-discount",requestForDiscount)
router.get("/reports/get-all-discount-request",getAllDiscountRequest)






module.exports = router;