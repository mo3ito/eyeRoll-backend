const express = require("express");
const router = express.Router();
const {seenPagesInformation , requestForDiscount} = require("../../controllers/reportsControllers/businessOwnerReports")


router.post("/reports/seen-users",seenPagesInformation)
router.post("/reports/request-for-discount",requestForDiscount)






module.exports = router;