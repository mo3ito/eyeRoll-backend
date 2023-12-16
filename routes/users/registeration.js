const express = require("express")
const router = express.Router();
const {registerUser,loginUser,findeUser,getAllUser,verifyEmail , getMe , resendEmailVerification , updateInformation , isPassword , getDiscountEyeRoll} = require("../../controllers/userControllers/userRegister")


router.post("/users/register",registerUser)
router.post("/users/login",loginUser)
router.get("/users/find/:userId",findeUser)
router.get("/users/get-all-user", getAllUser)
router.post("/users/verify-email",verifyEmail)
router.get("/users/get-me", getMe)
router.post("/users/resend-email-verification",resendEmailVerification)
router.patch("/users/update-information" , updateInformation)
router.post("/users/is-password",isPassword)
router.put("/users/get-discount-eyeRoll",getDiscountEyeRoll)

module.exports = router;