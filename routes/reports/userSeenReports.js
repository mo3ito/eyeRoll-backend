const express = require("express");
const router = express.Router();
const {getUsersSeensPages} = require("../../controllers/reportsControllers/businessOwnerReports")


router.get("/reports/seen-users",getUsersSeensPages)






module.exports = router;