const express = require("express")
const router = express.Router()
const {searchInformation} = require("../../controllers/searchControllers/searchInformation")

router.get("/eyeRoll/search-information" , searchInformation)



module.exports = router;