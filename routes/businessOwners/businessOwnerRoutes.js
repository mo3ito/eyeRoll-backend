const express = require("express")
const router = express.Router();
const {registerUser,loginUser,findeUser,getUsers,verifyEmail , getMe} = require("../../controllers/businessOwnerControllers")


router.post("/register", registerUser)
router.post("/login",loginUser)
router.get("/find/:userId",findeUser)
router.get("/getUser", getUsers)
router.post("/verify-email",verifyEmail)
router.get("/get-me", getMe)


module.exports = router;