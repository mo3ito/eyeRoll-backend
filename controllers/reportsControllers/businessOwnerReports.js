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

  // const removeExpireAwaitingRequest = async (req, res) => {
  //   const businessOwnerId = req.headers.authorization;
  
  //   try {
  //     if (!businessOwnerId) {
  //       return res.status(400).json({
  //         message: "business owner id not found",
  //       });
  //     }
      
  //     const currentTime = new Date();
      
  //     const allRequestForBusinessOwner = await AwaitingDiscountPaymentModel.findOne({ businessOwnerId });
  
  //     const expireRequest = await allRequestForBusinessOwner.awaiting_discounts.filter(
  //       (request) => new Date(request.expiration_time) <= currentTime
  //     );

  //     console.log("expireRequest" , expireRequest);
  
  //     allRequestForBusinessOwner.expire_requests = expireRequest;
  //     await allRequestForBusinessOwner.save();
  
  //     return res.status(200).json({
  //     data :  allRequestForBusinessOwner.expire_requests
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({
  //       message: "An error occurred while processing your request",
  //     });
  //   }
  // };



// const removeExpireAwaitingRequest = async (req, res) => {
//   const businessOwnerId = req.headers.authorization;

//   try {
//     if (!businessOwnerId) {
//       return res.status(400).json({
//         message: "business owner id not found",
//       });
//     }

//     const currentTime = moment();

//     // یافتن تمام تخفیف‌های مربوط به کاربر
//     const allRequestForBusinessOwner = await AwaitingDiscountPaymentModel.findOne({ businessOwnerId });

//     // حذف تخفیف‌هایی که تاریخ انقضای آن‌ها گذشته است از دیتابیس
//     const result = await AwaitingDiscountPaymentModel.updateOne(
//       { businessOwnerId },
//       {
//         $pull: {
//           "awaiting_discounts": {
//             "expiration_time": { $lt: currentTime.toISOString() }
//           }
//         }
//       }
//     );

//     // اگر تعدادی از تخفیف‌ها حذف شده باشند
//     if (result.nModified > 0) {
//       console.log("Expired Discounts Removed: ", result.nModified);

//       // ارسال تخفیف‌های باقیمانده به عنوان ریسپانس
//       return res.status(200).json({
//         remainingDiscounts: allRequestForBusinessOwner.awaiting_discounts,
//       });
//     } else {
//       // اگر هیچ تخفیفی حذف نشده باشد
//       console.log("No Expired Discounts Found");
//       return res.status(200).json({
//         message: "No expired discounts found",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "An error occurred while processing your request",
//     });
//   }
// };


  // const removeExpireAwaitingRequest = async (req, res) => {
  //   const businessOwnerId = req.headers.authorization;
  
  //   try {
  //     if (!businessOwnerId) {
  //       return res.status(400).json({
  //         message: "business owner id not found",
  //       });
  //     }
  
   
  
  //     let allRequestForBusinessOwner = await AwaitingDiscountPaymentModel.findOne({ businessOwnerId });
  
  //     // Check if awaiting_discounts is empty
    
  
  //     // Filter items with expiration_time less than the current date
  //     const allRequests = await allRequestForBusinessOwner.awaiting_discounts.map((request) => {
  //       return request;
  //   });
  //   const dateNow = moment()
  
  //   const validRequest = allRequests.filter(item => {
  //     return item.awaiting_discounts.some(discount => {
  //         return discount.expiration_time && moment(discount.expiration_time).isSameOrAfter(dateNow);
  //     });
  // })
  

  //   console.log("allRequests", allRequests);
  //   console.log("validRequest", validRequest);
    
  //   allRequestForBusinessOwner.awaiting_discounts = validRequest
  //   await allRequestForBusinessOwner.save()

  //       return res.status(200).json({
  //         validRequest
  //     });

    

  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({
  //       message: "An error occurred while processing your request",
  //     });
  //   }
  // };

//   const removeExpireAwaitingRequest = async (req, res) => {
//     const businessOwnerId = req.headers.authorization;
  
//     try {
//         if (!businessOwnerId) {
//             return res.status(400).json({
//                 message: "business owner id not found",
//             });
//         }
        
//         let allRequestForBusinessOwner = await AwaitingDiscountPaymentModel.findOne({ businessOwnerId });
        
       
//         // Check if awaiting_discounts is empty
//         if (!allRequestForBusinessOwner || !allRequestForBusinessOwner.awaiting_discounts || allRequestForBusinessOwner.awaiting_discounts.length === 0) {
//             return res.status(200).json({
//                 validRequest: [],
//             });
//         }

//         console.log("allRequestForBusinessOwner" , allRequestForBusinessOwner);
        
//         // Filter items with expiration_time less than the current date
//         const dateNow = moment();
  
//         // const validRequest = allRequestForBusinessOwner.awaiting_discounts.filter(discount => {
//         //     return discount.expiration_time && moment(discount.expiration_time).isSameOrBefore(dateNow);
//         // });

//         const validRequest = allRequestForBusinessOwner.awaiting_discounts.filter(discount => {
//           if (discount.expiration_time) {
//               const discountExpiration = moment(discount.expiration_time);
//               console.log("discountExpiration", discountExpiration.format());
//               console.log("isBefore", discountExpiration.isBefore(dateNow));
//               return discountExpiration.isBefore(dateNow);
//           }
//           return false;
//       });
  
//         console.log("allRequests", allRequestForBusinessOwner.awaiting_discounts);
//         console.log("validRequest", validRequest);
  
//         allRequestForBusinessOwner.awaiting_discounts = validRequest;
//         await allRequestForBusinessOwner.save();
  
//         return res.status(200).json({
//             validRequest,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "An error occurred while processing your request",
//         });
//     }
// };

const removeExpireAwaitingRequest = async (req, res) => {
  const businessOwnerId = req.headers.authorization;

  try {
      if (!businessOwnerId) {
          return res.status(400).json({
              message: "business owner id not found",
          });
      }

      let allRequestForBusinessOwner = await AwaitingDiscountPaymentModel.findOne({ businessOwnerId });

      if (!allRequestForBusinessOwner || !allRequestForBusinessOwner.awaiting_discounts || allRequestForBusinessOwner.awaiting_discounts.length === 0) {
          return res.status(200).json({
              validRequest: [],
          });
      }

      const dateNow = moment();

      // Filter items with expiration_time less than the current date
      const validRequest = allRequestForBusinessOwner.awaiting_discounts.filter(discount => {
          if (discount.expiration_time) {
              const discountExpiration = moment(discount.expiration_time);
              return discountExpiration.isSameOrAfter(dateNow);
          }
          return false;
      });

      // Save valid discounts in the database
      // اینجا بسته به نحوه ذخیره داده‌ها در دیتابیس شما، کد را تغییر دهید
      await AwaitingDiscountPaymentModel.findOneAndUpdate(
          { businessOwnerId },
          { awaiting_discounts: validRequest },
          { new: true }
      );
      

      return res.status(200).json({
          validRequest,
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "An error occurred while processing your request",
      });
  }
};
  
  

  const deleteAwaitingRequest = async (req, res) => {
    const businessOwnerId = req.headers.authorization;
    const { awaiting_request_ids_for_delete } = await req.body;
  
    try {
      if (!businessOwnerId) {
        return res.status(400).json({
          message: "business owner not found",
        });
      }
  
      const businessOwnerRequests = await AwaitingDiscountPaymentModel.findOne({ businessOwnerId });
      const remainingDiscounts = businessOwnerRequests.awaiting_discounts.filter(
        (item) => !awaiting_request_ids_for_delete.includes(item.discountId)
      );  

      
      businessOwnerRequests.awaiting_discounts = remainingDiscounts;
      await businessOwnerRequests.save();
  
      return res.status(200).json({
        remainingDiscounts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  };
  
  

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

 
  






  module.exports = { seenPagesInformation , requestForDiscount , getAllDiscountRequest , removeExpireAwaitingRequest , deleteAwaitingRequest };