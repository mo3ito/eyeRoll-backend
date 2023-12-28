const ReportsModel = require("../../models/BusinessOwners/Reports")
const moment = require('moment');

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
  
  module.exports = { seenPagesInformation };