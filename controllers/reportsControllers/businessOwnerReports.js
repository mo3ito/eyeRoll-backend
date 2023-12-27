const {seenUsers} = require("../../socket/pageEyeRollSocket")

const getUsersSeensPages = async (req, res) => {
    try {
      // فراخوانی تابع برای دریافت مقدار مورد نظر
      const seenUsersEyeRoll = await seenUsers();
      console.log("seen user eye roll :" ,seenUsersEyeRoll);
      return res.status(200).json(seenUsersEyeRoll);
    } catch (error) {
      // انجام عملیات مرتبط با خطا
    }
  };
  
  module.exports = { getUsersSeensPages };