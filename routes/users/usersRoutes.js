const express = require("express")
const router = express.Router();
const {registerUser,loginUser,findeUser,getUsers,verifyEmail , getMe , resendEmailVerification} = require("../../controllers/userControllers")


router.post("/users/register",registerUser)
router.post("/users/login",loginUser)
router.get("/users/find/:userId",findeUser)
router.get("/users/getUser", getUsers)
router.post("/users/verify-email",verifyEmail)
router.get("/users/get-me", getMe)
router.post("/users/resend-email-verification",resendEmailVerification)


module.exports = router;