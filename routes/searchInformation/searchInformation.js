const express = require("express")
const router = express.Router()
const {searchInformation} = require("../../controllers/searchControllers/searchInformation")

router.get("/search-information" , searchInformation)



module.exports = router;