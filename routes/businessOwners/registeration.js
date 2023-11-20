const express = require("express")
const router = express.Router();
const {registerUser,loginUser,findeUser,getAllBusinessOwner,verifyEmail , getMe , resendEmailVerification ,updateInformation , isPassword , businessOwnerImage ,
 upload , deleteBusinessOwnerProfileImage , validatorPassword } = require("../../controllers/bussinessOwnerControllers/businessOwnerRegister")


router.post("/business-owner/register", registerUser)
router.post("/business-owner/login",loginUser)
router.get("/business-owner/find/:userId",findeUser)
router.get("/business-owner/get-all-business-owner", getAllBusinessOwner)
router.post("/business-owner/verify-email",verifyEmail)
router.get("/business-owner/get-me", getMe)
router.post("/business-owner/resend-email-verification",resendEmailVerification)
router.patch("/business-owner/update-information" , updateInformation)
router.post("/business-owner/is-password",isPassword)
router.post("/business-owner/upload-image", upload.single("profileImage") , businessOwnerImage)
router.delete("/business-owner/delete-profile-image", deleteBusinessOwnerProfileImage)
router.post("/business-owner/validator-password",validatorPassword)


module.exports = router;