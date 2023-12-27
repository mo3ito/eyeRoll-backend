const express = require("express");
const router = express.Router();
const {seenPagesInformation} = require("../../controllers/reportsControllers/businessOwnerReports")


router.get("/reports/seen-users",seenPagesInformation)






module.exports = router;