const RollSettingModel = require("../../models/BusinessOwners/Roll");

const getAllAlgoritm = async (req, res) => {
  const businessOwnerId = req.headers.authorization;

  const {
    businessOwner_name,
    businessOwner_last_name,
    businessOwner_id,
    minـpercentage,
    maxـpercentage,
    first_date,
    last_date,
    first_date_peak,
    last_date_peak,
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

    const existingSetting = await RollSettingModel.findOne({
      businessOwner_id: businessOwnerId,
    });

    if (
      (first_date && minـpercentage) ||
      (first_date && special_product_discount)
    ) {
      if (existingSetting) {
        existingSetting.businessOwner_name = businessOwner_name;
        existingSetting.businessOwner_last_name = businessOwner_last_name;
        existingSetting.minـpercentage = minـpercentage;
        existingSetting.maxـpercentage = maxـpercentage;
        existingSetting.first_date = first_date;
        existingSetting.last_date = last_date;
        existingSetting.first_date_peak = first_date_peak;
        existingSetting.last_date_peak = last_date_peak;
        existingSetting.min_percentage_peak = min_percentage_peak;
        existingSetting.max_percentage_peak = max_percentage_peak;
        existingSetting.special_product_discount = special_product_discount;
        existingSetting.gift = gift;
        existingSetting.number_Purchase_gift= number_Purchase_gift

        await existingSetting.save();

        res.status(200).json({ message: "Information updated successfully" });
      } else {
        // اگر اطلاعات وجود نداشت، یک مدل جدید ایجاد کنید و اطلاعات را ذخیره کنید
        const newRollSetting = new RollSettingModel({
          businessOwner_name,
          businessOwner_last_name,
          businessOwner_id,
          minـpercentage,
          maxـpercentage,
          first_date,
          last_date,
          first_date_peak,
          last_date_peak,
          min_percentage_peak,
          max_percentage_peak,
          special_product_discount,
          gift,
          number_Purchase_gift
        });

        await newRollSetting.save();

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

const getDiscount = async (req, res) => {


};

module.exports = { getAllAlgoritm };