const RollOptionModel = require("../../models/Roll/Roll");
const UsersModel = require("../../models/Users/UsersRegister")
const BusinessOwnersModel = require("../../models/BusinessOwners/BusinessOwnersRegister") 
const RollAdjustedModel = require("../../models/Roll/RollAdjusted")
require("dotenv").config();
const moment = require("moment");



const getAllAlgoritm = async (req, res) => {
  const businessOwnerId = req.headers.authorization;

  const {
    businessOwner_name,
    businessOwner_last_name,
    businessOwner_id,
    min_percentage,
    max_percentage,
    start_day,
    finish_day,
    start_day_time,
    end_day_time,
    start_day_peak_time,
    end_day_peak_time,
    min_percentage_peak,
    max_percentage_peak,
    special_product_discount,
    gift,
    number_Purchase_gift,
  } = req.body;

  try {
    if (!businessOwnerId) {
      return res.status(400).json({
        message: "No business owner was found with this profile",
      });
    }

    let existingSetting = await RollOptionModel.findOne({
      businessOwner_id: businessOwnerId,
    });

    if (
      (start_day && min_percentage ) ||
      (start_day && special_product_discount)
    ) {

      if (existingSetting) {
        existingSetting.businessOwner_name = businessOwner_name;
        existingSetting.businessOwner_last_name = businessOwner_last_name;
        existingSetting.businessOwner_id = businessOwner_id;
        existingSetting.min_percentage = min_percentage;
        existingSetting.max_percentage = max_percentage;
        existingSetting.start_day = start_day;
        existingSetting.finish_day = finish_day;
        existingSetting.start_day_time = start_day_time;
        existingSetting.end_day_time = end_day_time;
        existingSetting.start_day_peak_time = start_day_peak_time;
        existingSetting.end_day_peak_time = end_day_peak_time;
        existingSetting.min_percentage_peak = min_percentage_peak;
        existingSetting.max_percentage_peak = max_percentage_peak;
        existingSetting.special_product_discount = special_product_discount;
        existingSetting.gift = gift;
        existingSetting.number_Purchase_gift = number_Purchase_gift;

        await existingSetting.save();

        res.status(200).json({ message: "Information updated successfully" });
      } else {
       
        existingSetting = new RollOptionModel({
          businessOwner_name,
          businessOwner_last_name,
          businessOwner_id,
          min_percentage,
          max_percentage,
          start_day,
          finish_day,
          start_day_time,
          end_day_time,
          start_day_peak_time,
          end_day_peak_time,
          min_percentage_peak,
          max_percentage_peak,
          special_product_discount,
          gift,
          number_Purchase_gift,
        });

        await existingSetting.save();

        res.status(200).json({ message: "Information created successfully" });
      }
    } else {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const getAllRollsList = async (req , res) =>{

  const allRolls = await RollOptionModel.find({})
  res.status(200).json(allRolls)

}


// const rollAdjusted = async (req, res) => {
//   const businessOwnerId = await req.headers.authorization;
//   const businessOwner = await BusinessOwnersModel.findById(businessOwnerId);
//   const rollAdjusted = await RollOptionModel.findOne({ businessOwner_id: businessOwnerId });
//   const {
// minPercentageAllProducts,
// maxPercentageAllProducts,
// minPercentagePeak,
// maxPercentagePeak,
// giftValue,
// numberPurchaseGift,
// startDateWithoutTime,
// endDateWithoutTime,
// firstHour,
// firstMins,
// lastHour,
// lastMins,
// startDate,
// firstHourPeak,
// firstMinsPeak,
// lastHourPeak,
// lastMinsPeak,
//   } = req.body


//   try {
//     if (!businessOwnerId) {
//       return res.status(400).json({
//         message: "No business owner was found with this profile",
//       });
//     }

//     let existingAdjustedRoll = await RollOptionModel.findOne({
     

//       if(existingAdjustedRoll){
//         existingAdjustedRoll.minPercentageAllProducts = minPercentageAllProducts;
//         existingAdjustedRoll.maxPercentageAllProducts = maxPercentageAllProducts;
//         existingAdjustedRoll.minPercentagePeak = minPercentagePeak;
//         existingAdjustedRoll.maxPercentagePeak = maxPercentagePeak;
//         existingAdjustedRoll.giftValue = giftValue;
//         existingAdjustedRoll.numberPurchaseGift = numberPurchaseGift;
//         existingAdjustedRoll.startDateWithoutTime = startDateWithoutTime;
//         existingAdjustedRoll.endDateWithoutTime = endDateWithoutTime;
//         existingAdjustedRoll.firstHour = firstHour,
//         existingAdjustedRoll.firstMins =firstMins;
//         existingAdjustedRoll.lastHour =lastHour;
//         existingAdjustedRoll.lastMins =lastMins;
//         existingAdjustedRoll.startDate =startDate;
//         existingAdjustedRoll.firstHourPeak =firstHourPeak;
//         existingAdjustedRoll.firstMinsPeak =firstMinsPeak;
//         existingAdjustedRoll.lastHourPeak =lastHourPeak;
//         existingAdjustedRoll.lastMinsPeak =lastMinsPeak;

//         await existingAdjustedRoll.save();

        
//       } else {
//         existingAdjustedRoll = new RollOptionModel({
//           minPercentageAllProducts,
//           maxPercentageAllProducts,
//           minPercentagePeak,
//           maxPercentagePeak,
//           giftValue,
//           numberPurchaseGift,
//           startDateWithoutTime,
//           endDateWithoutTime,
//           firstHour,
//           firstMins,
//           lastHour,
//           lastMins,
//           startDate,
//           firstHourPeak,
//           firstMinsPeak,
//           lastHourPeak,
//           lastMinsPeak,
//         });
  
//         await existingAdjustedRoll.save();
//       }
  

       
   

//     });
   
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Internal server error"
//     });
//   }
// }

const rollAdjustedSend = async (req, res) => {
  const businessOwnerId = await req.headers.authorization;
  const businessOwner = await BusinessOwnersModel.findById(businessOwnerId);

  const {
    businessOwner_id,
    minPercentageAllProducts,
    maxPercentageAllProducts,
    minPercentagePeak,
    maxPercentagePeak,
    giftValue,
    numberPurchaseGift,
    startDateWithoutTime,
    endDateWithoutTime,
    firstHour,
    firstMins,
    lastHour,
    lastMins,
    startDate,
    firstHourPeak,
    firstMinsPeak,
    lastHourPeak,
    lastMinsPeak,
  } = req.body;

  try {
    if (!businessOwnerId) {
      return res.status(400).json({
        message: "No business owner was found with this profile",
      });
    }

    let existingAdjustedRoll = await RollAdjustedModel.findOne({businessOwner_id : businessOwnerId});

    if (existingAdjustedRoll) {
        existingAdjustedRoll.businessOwner_id = businessOwner_id,
        existingAdjustedRoll.minPercentageAllProducts = minPercentageAllProducts;
        existingAdjustedRoll.maxPercentageAllProducts = maxPercentageAllProducts;
        existingAdjustedRoll.minPercentagePeak = minPercentagePeak;
        existingAdjustedRoll.maxPercentagePeak = maxPercentagePeak;
        existingAdjustedRoll.giftValue = giftValue;
        existingAdjustedRoll.numberPurchaseGift = numberPurchaseGift;
        existingAdjustedRoll.startDateWithoutTime = startDateWithoutTime;
        existingAdjustedRoll.endDateWithoutTime = endDateWithoutTime;
        existingAdjustedRoll.firstHour = firstHour,
        existingAdjustedRoll.firstMins =firstMins;
        existingAdjustedRoll.lastHour =lastHour;
        existingAdjustedRoll.lastMins =lastMins;
        existingAdjustedRoll.startDate =startDate;
        existingAdjustedRoll.firstHourPeak =firstHourPeak;
        existingAdjustedRoll.firstMinsPeak =firstMinsPeak;
        existingAdjustedRoll.lastHourPeak =lastHourPeak;
        existingAdjustedRoll.lastMinsPeak =lastMinsPeak;

      await existingAdjustedRoll.save();
      res.status(200).json({
        message: "Roll option has been adjusted successfully",
      });
    } else {
      existingAdjustedRoll = new RollAdjustedModel({
        businessOwner_id,
        minPercentageAllProducts,
        maxPercentageAllProducts,
        minPercentagePeak,
        maxPercentagePeak,
        giftValue,
        numberPurchaseGift,
        startDateWithoutTime,
        endDateWithoutTime,
        firstHour,
        firstMins,
        lastHour,
        lastMins,
        startDate,
        firstHourPeak,
        firstMinsPeak,
        lastHourPeak,
        lastMinsPeak,
      });

      await existingAdjustedRoll.save();
    }

    res.status(200).json({
      message: "Roll option has been adjusted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const rollAdjustGet = async (req , res)=>{

  const businessOwnerId = req.headers.authorization;

  
  if(!businessOwnerId){
    res.status(400).json({
      "message":"business owner not found"
    })
  }

  try {
    const RollAdjusted = await RollAdjustedModel.findOne({ businessOwner_id: businessOwnerId });
    res.status(200).json(RollAdjusted);
  } catch (error) {
    console.error(error); // چاپ پیام خطا در کنسول
    res.status(500).json({
      message: "Internal server error",
    });
  }
}


const getRoll = async (req, res) => {
  const { user_id, businessOwner_id } = req.body;

  const user = await UsersModel.findOne({ _id: user_id });
  const businessOwner = await BusinessOwnersModel.findById(businessOwner_id);
  const rollOptionBusinessOwner = await RollOptionModel.findOne({ businessOwner_id });

  console.log(user);
  console.log(rollOptionBusinessOwner);

  try {
    let selectedPercentage;
    const currentDate = moment();
    const startDay = moment(rollOptionBusinessOwner.start_day);
    const finishDay = moment(rollOptionBusinessOwner.finish_day);
    const startDayTime = rollOptionBusinessOwner.start_day_time
    const endDayTime = rollOptionBusinessOwner.end_day_time
    const startDayPeakTime = rollOptionBusinessOwner.start_day_peak_time
    const endDayPeakTime = rollOptionBusinessOwner.end_day_peak_time
  
    console.log(startDayTime);
    console.log(endDayTime);
    console.log(startDayPeakTime);
    console.log(endDayPeakTime);
  
    if (currentDate.isBetween(startDay, finishDay)) {
      const currentTime = currentDate.format("HH:mm");
    
      if ((currentTime >= startDayTime && currentTime <= endDayTime) && (currentTime >= startDayPeakTime && currentTime <= endDayPeakTime)) {
        console.log("peak");
        selectedPercentage = {
          minPercentage: rollOptionBusinessOwner.min_percentage_peak,
          maxPercentage: rollOptionBusinessOwner.max_percentage_peak
        };
      } else if (currentTime >= startDayTime && currentTime <= endDayTime) {
        console.log("normal");
        selectedPercentage = {
          minPercentage: rollOptionBusinessOwner.min_percentage,
          maxPercentage: rollOptionBusinessOwner.max_percentage
        };
      } else if (currentTime >= startDayPeakTime && currentTime <= endDayPeakTime) {
        console.log("peak");
        selectedPercentage = {
          minPercentage: rollOptionBusinessOwner.min_percentage_peak,
          maxPercentage: rollOptionBusinessOwner.max_percentage_peak
        };
      } else {
        console.log("null");
        selectedPercentage = {
          minPercentage : null,
          maxPercentage : null
        }
      }
    } else{
      console.log("out of date");
    }
  
    const informationRoll = {
      minPercentageDiscount:selectedPercentage.minPercentage,
      maxPercentageDiscount:selectedPercentage.maxPercentage,
      special_product_discount:rollOptionBusinessOwner.special_product_discount,
      gift:rollOptionBusinessOwner.gift,
      number_Purchase_gift:rollOptionBusinessOwner.number_Purchase_gift
    }
    res.status(200).json(informationRoll)
  } catch (error) {
    res.status(500).json(error.message)
  }

};



module.exports = { getAllAlgoritm , getRoll , getAllRollsList , rollAdjustedSend , rollAdjustGet};
