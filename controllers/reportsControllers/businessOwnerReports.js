const ReportsModel = require("../../models/BusinessOwners/Reports")
const moment = require('moment');

const seenPagesInformation = async (req, res) => {

  const businessOwnerId = req.headers.authorization;
  const {first_date , last_date} = req.body
  
    try {

    
      const isReports = await ReportsModel.findOne({ businessOwnerId : businessOwnerId });
      
      // if(!first_date || !last_date ){
      //   return res.status(400).json({
      //     message : "date is not valid"
      //   })
      // }

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

      // const eyeRollSeen = null
      // const onlineMenuSeen= null
      
      const eyeRollSeenInfos = await isReports.eyeRoll_all_seen_user.filter((item , index)=>{
       return moment(item.seenDate).isSame(first_date, 'day')
      })

      const onlineMenuSeenInfos = await isReports.online_menu_all_seen_user.filter(item=>{
        return moment(item.seenDate).isSame(first_date , 'day')
      })


      const eyeRollSeen = await eyeRollSeenInfos.length
      const onlineMenuSeen = await onlineMenuSeenInfos.length

      const seen = {
        eyeRollSeen,
        onlineMenuSeen
      }



      return res.status(200).json(seen);
    } catch (error) {
      // انجام عملیات مرتبط با خطا
    }
  };
  
  module.exports = { seenPagesInformation };