const express = require("express")
const router = express.Router()
const {searchInformation , getBusinessOwnerInfosSearched} = require("../../controllers/searchControllers/searchInformation")

router.get("/search-information" , searchInformation)
router.get("/get-businessOwner-infos-searched" , getBusinessOwnerInfosSearched)



module.exports = router;