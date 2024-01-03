const ReportsModel = require("../../models/BusinessOwners/Reports")
const moment = require('moment');
const UserModel = require("../../models/Users/UsersRegister")
const AwaitingDiscountPaymentModel = require("../../models/BusinessOwners/AwaitingDiscountPayment")

const seenPagesInformation = async (req, res) => {

  const businessOwnerId = req.headers.authorization;
  const {first_date , last_date} = req.body
  
  console.log(first_date);
    try {

    
      const isReports = await ReportsModel.findOne({ businessOwnerId : businessOwnerId });
      
      if(!first_date){
        return res.status(400).json({
          message : "date is not valid"
        })
      }

      if(!businessOwnerId){
        return res.status(400).json({
          message:"business owner id not found"
        })
      }

      if(!isReports){
        return res.status(400).json({
          message:"there are no reports"
        })
      }

     let numberSeen = {
       eye_roll_seen : null,
       online_menu_seen : null
     }

     if(first_date && (last_date === null || last_date === undefined) ){
      const eyeRollSeenInfos = await isReports.eyeRoll_all_seen_user.filter(item=>{
        const eyeRollSeenDate = moment(item.seenDate);
        return eyeRollSeenDate.isSame(first_date , 'day')
      })

      const onlineMenuSeenInfos = await isReports.online_menu_all_seen_user.filter(item=>{
        const onlineMenuSeenDate = moment(item.seenDate);
        return onlineMenuSeenDate.isSame(first_date , 'day')
      })

      numberSeen = {
        eye_roll_seen : eyeRollSeenInfos.length,
        online_menu_seen: onlineMenuSeenInfos.length
       }
  
     }

    
     if (first_date && last_date) {
      const eyeRollSeenInfos = await isReports.eyeRoll_all_seen_user.filter((item) => {
        const eyeRollSeenDate = moment(item.seenDate);
        return eyeRollSeenDate.isSameOrAfter(first_date, 'day') && eyeRollSeenDate.isSameOrBefore(last_date, 'day');
      });
    
      const onlineMenuSeenInfos = await isReports.online_menu_all_seen_user.filter(item => {
        const onlineMenuSeenDate = moment(item.seenDate);
        return onlineMenuSeenDate.isSameOrAfter(first_date, 'day') && onlineMenuSeenDate.isSameOrBefore(last_date, 'day');
      });
    
      numberSeen = {
        eye_roll_seen : eyeRollSeenInfos.length,
        online_menu_seen: onlineMenuSeenInfos.length
      }
    }
    return res.status(200).json(numberSeen)
  
    } catch (error) {
      console.error(error)
      res.status(500).json(error.message)
    }
  };







  
  const requestForDiscount = async (req , res)=>{

    const userId = req.headers.authorization
    const {discountId , businessOwnerId , discount , expiration_time }=req.body

    try {
    
      if(!userId){
        return res.status(400).json({
          message:"user id not found"
        })
      }

      const user = await UserModel.findById(userId)

      if(!user){
        return res.status(400).json({
          message:"user not found"
        })
      }

      const targetDiscount = await user.discounts_eyeRoll.find(discount=> discount.id === discountId)
      const discountInfo = {
        discountId,
        username: user.username,
        discount,
        expiration_time
       }

      if(!targetDiscount){
        return res.status(400).json({
          message:"discount not found"
        })
      }

     let targetBusinessOwner = await AwaitingDiscountPaymentModel.findOne({businessOwnerId})
     
     if (!targetBusinessOwner ) {
      targetBusinessOwner = await new AwaitingDiscountPaymentModel({
        businessOwnerId,
        awaiting_discounts: [discountInfo],
      });
      await targetBusinessOwner.save()
     await res.status(200).json({
        message: "Your discount request was registered on the seller's page",
      })
  
    } else {
      const isRequestRegistered = await targetBusinessOwner.awaiting_discounts.some(discount => discount.discountId === discountId)
      if(!isRequestRegistered){
        await targetBusinessOwner.awaiting_discounts.push(discountInfo);
      await targetBusinessOwner.save();
      await res.status(200).json({
        message: "Your discount request was registered on the seller's page",
      })
      }else{
        res.status(400).json({
          message: "You have already registered a request to use the discount, you can request again after 20 minutes",
        })
      }
     
    }

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
    

  }

  

  const getAllDiscountRequest = async (req , res)=>{

    const businessOwnerId = req.headers.authorization;

    try {
      if(!businessOwnerId){
       return res.status(400).json({
        message: "business owner id not found"
       })
      }
    const businessOwnerRequests = await AwaitingDiscountPaymentModel.findOne({businessOwnerId})
    const allRequest = await businessOwnerRequests.awaiting_discounts.reverse()
    return res.status(200).json(allRequest)

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

 
  






  module.exports = { seenPagesInformation , requestForDiscount , getAllDiscountRequest };