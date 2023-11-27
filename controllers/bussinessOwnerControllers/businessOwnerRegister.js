const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BusinessOwnersModel = require("../../models/BusinessOwners/BusinessOwnersRegister");
const validator = require("validator");
const crypto = require("crypto");
const {
  sendVerificationMailBusinessOwner,
} = require("../../utils/senderVerificationMail/sendVerificationMailBusinessOwner");
require("dotenv").config();
const keyJwt = process.env.KEY_JWT;
const storageMulter = require("../../utils/multer/storageMulter")
const multer = require("multer");
const fs = require("fs");
const path = require("path")
const profileImageFormater = require("../../middleware/profile-image-formater")





const createToken = async (userInfo) => {
  const token = await jwt.sign(userInfo, keyJwt, { expiresIn: "3d" });
  return token;
};



const storageProfileImage = storageMulter('public/images/businessOwner'  , BusinessOwnersModel)
const uploadProfileImage = multer({ storage: storageProfileImage , fileFilter : profileImageFormater });


const businessOwnerImage = async (req, res) => {
  const businessOwnerId = req.headers.authorization;
  const uploadedFileName = req.file.filename;

  if (!businessOwnerId) {
    return res.status(400).json({
      message: "business owner id not found",
    });
  }

  try {
    const businessOwner = await BusinessOwnersModel.findOne({
      _id: businessOwnerId,
    });
    if (!businessOwner) {
      return res.status(404).json({
        message: "business owner not found",
      });
    }

    if (businessOwner.profile_image_path) {
      const previousImagePath = businessOwner.profile_image_path;

      try {
        fs.unlinkSync(previousImagePath);
      } catch (err) {
        console.error(`Error deleting previous image: ${err}`);
      }
    }

    businessOwner.profile_image_path = `public/images/businessOwner/${businessOwner.username}/${uploadedFileName}`;

    await businessOwner.save();

    const userInfos = {
      id: businessOwner.id,
      profile_image_path:`${process.env.BASE_URL_SERVER}/${businessOwner.profile_image_path}` ,
      name: businessOwner.name,
      last_name: businessOwner.last_name,
      phone_number: businessOwner.phone_number,
      username: businessOwner.username,
      email: businessOwner.email,
      is_verified: businessOwner.is_verified,
      country_name: businessOwner.country_name,
      state_name: businessOwner.state_name,
      city_name: businessOwner.city_name,
      address: businessOwner.address,
      brand_name: businessOwner.brand_name,
      is_complete_information: businessOwner.is_complete_information,
      is_businessOwner: businessOwner.is_businessOwner,
      registration_date: businessOwner.registration_date,
      password: businessOwner.password,
      postal_code: businessOwner.postal_code,
      work_phone: businessOwner.work_phone,
    };

    const token = await createToken(userInfos);

    return res.status(200).json({ userInfos, token });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};


const deleteBusinessOwnerProfileImage = async (req , res)=>{

  const businessOwnerId = req.headers.authorization;

  if(!businessOwnerId){
   return res.status(400).json({
    message : "business owner id not find"
   })
  }

  try {
    const businessOwner = await BusinessOwnersModel.findById(businessOwnerId)

    if(!businessOwner){
      return res.status(400).json({
        message : "business owner not find"
       })
    }

    const imagePath = businessOwner.profile_image_path;

    if(!imagePath){
      return res.status(400).json({
        message: "No profile image to delete"
      });
    }

    await fs.promises.unlink(imagePath);
   
    businessOwner.profile_image_path = ""

    await businessOwner.save()

    const userInfos = {
      id: businessOwner.id,
      profile_image_path: businessOwner.profile_image_path ,
      name: businessOwner.name,
      last_name: businessOwner.last_name,
      phone_number: businessOwner.phone_number,
      username: businessOwner.username,
      email: businessOwner.email,
      is_verified: businessOwner.is_verified,
      country_name: businessOwner.country_name,
      state_name: businessOwner.state_name,
      city_name: businessOwner.city_name,
      address: businessOwner.address,
      brand_name: businessOwner.brand_name,
      is_complete_information: businessOwner.is_complete_information,
      is_businessOwner: businessOwner.is_businessOwner,
      registration_date: businessOwner.registration_date,
      password: businessOwner.password,
      postal_code: businessOwner.postal_code,
      work_phone: businessOwner.work_phone,
    };

    const token = await createToken(userInfos)

   return res.status(200).json({userInfos , token})

  } catch (error) {
    console.error(error)
    return res.status(500).json(error.message)
  }

}


const registerUser = async (req, res) => {
  const {
    name,
    last_name,
    phone_number,
    username,
    password,
    repeat_password,
    email,
  } = req.body;

  try {
    const lowercaseEmail = await email.toLowerCase();
    let user = await BusinessOwnersModel.findOne({ email: lowercaseEmail });

    if (user)
      return res.status(400).json({
        message: "User already exist",
      });

    user = new BusinessOwnersModel({
      name,
      last_name,
      phone_number,
      username,
      password,
      email: lowercaseEmail,
      token_email: crypto.randomBytes(64).toString("hex"),
    });

    if (
      !name ||
      !last_name ||
      !phone_number ||
      !username ||
      !password ||
      !repeat_password ||
      !email
    ) {
      res.status(400).json({
        message: "All fields are required",
      });
    }
    if (!validator.isEmail(lowercaseEmail)) {
      res.status(400).json({
        message: "Email must be a valid email",
      });
    }
    if (password.length < 8) {
      res.status(400).json({
        message: "the password must be at least 8 characters long",
      });
    }
    if (password !== repeat_password) {
      res.status(400).json({
        message: "the password dosnt match with repeat password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt.toString());
    user.password = hashedPassword;

    await user.save();

    sendVerificationMailBusinessOwner(user);

    const userInfos = {
      id: user._id,
      name,
      last_name,
      phone_number,
      username,
      email: lowercaseEmail,
      is_verified: user.is_verified,
      country_name: user.country_name,
      state_name: user.state_name,
      city_name: user.city_name,
      address: user.address,
      brand_name: user.brand_name,
      is_complete_information: user.is_complete_information,
      is_businessOwner: user.is_businessOwner,
      registration_date: user.registration_date,
      password: user.password,
      postal_code: user.postal_code,
      work_phone: user.work_phone,
      profile_image_path: user.profile_image_path ? `${process.env.BASE_URL_SERVER}/${user.profile_image_path}` : "",
    };
 
    const token = await createToken(userInfos);

    res.status(200).json({ userInfos, token });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const lowercaseEmail = email.toLowerCase();
    let user = await BusinessOwnersModel.findOne({ email: lowercaseEmail });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(
      password,
      user.password.toString()
    );
    console.log(user);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password" });
    if (!user.is_verified)
      return res
        .status(201)
        .json({ message: "You have not verified your email" });

    const userInfos = {
      id: user._id,
      name: user.name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      username: user.username,
      password: user.password,
      email: user.email,
      is_verified: user.is_verified,
      country_name: user.country_name,
      state_name: user.state_name,
      city_name: user.city_name,
      address: user.address,
      brand_name: user.brand_name,
      is_complete_information: user.is_complete_information,
      is_businessOwner: user.is_businessOwner,
      registration_date: user.registration_date,
      password: user.password,
      postal_code: user.postal_code,
      work_phone: user.work_phone,
      profile_image_path: user.profile_image_path ? `${process.env.BASE_URL_SERVER}/${user.profile_image_path}` : "",
    };

    const token = await createToken(userInfos);

    res.status(200).json({ userInfos, token });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const updateInformation = async (req, res) => {
  const userID = req.headers.authorization;

  try {
    let user = await BusinessOwnersModel.findById(userID);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const {
      name,
      last_name,
      phone_number,
      username,
      email,
      country_name,
      state_name,
      city_name,
      address,
      brand_name,
      postal_code,
      work_phone,
      password,
    } = req.body;
    if (name !== undefined) user.name = name;
    if (last_name !== undefined) user.last_name = last_name;
    if (phone_number !== undefined) user.phone_number = phone_number;
    if (username !== undefined) user.username = username;
    if (email !== undefined) {
      const lowercaseEmail = email.toLowerCase();
      if (!validator.isEmail(lowercaseEmail)) {
        res.status(400).json({
          message: "Email must be a valid email",
        });
      }

      user.email = lowercaseEmail;
    }

    if (country_name !== undefined) user.country_name = country_name;
    if (state_name !== undefined) user.state_name = state_name;
    if (city_name !== undefined) user.city_name = city_name;
    if (address !== undefined) user.address = address;
    if (brand_name !== undefined) user.brand_name = brand_name;
    if (postal_code !== undefined) user.postal_code = postal_code;
    if (work_phone !== undefined) user.work_phone = work_phone;

    if (password && password.length >= 8) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (
      country_name &&
      state_name &&
      city_name &&
      address &&
      brand_name &&
      name &&
      last_name &&
      phone_number &&
      username &&
      email &&
      postal_code
    ) {
      user.is_complete_information = true;
    } else {
      user.is_complete_information = false;
    }

    await user.save();

    const userInfos = {
      id: user._id,
      name: user.name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      username: user.username,
      email: user.email,
      country_name: user.country_name,
      state_name: user.state_name,
      city_name: user.city_name,
      address: user.address,
      brand_name: user.brand_name,
      is_complete_information: user.is_complete_information,
      is_businessOwner: user.is_businessOwner,
      is_verified: user.is_verified,
      work_phone: user.work_phone,
      postal_code: user.postal_code,
      registration_date: user.registration_date,
      profile_image_path: user.profile_image_path ? `${process.env.BASE_URL_SERVER}/${user.profile_image_path}` : "",
    };

    const token = await createToken(userInfos);

    res.status(200).json({ userInfos, token });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const resendEmailVerification = async (req, res) => {
  const { email, password } = req.body;

  try {
    const lowercaseEmail = email.toLowerCase();
    let user = await BusinessOwnersModel.findOne({ email: lowercaseEmail });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(
      password,
      user.password.toString()
    );

    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.is_verified) {
      res
        .status(400)
        .json({ message: "The user has been verified with this email" });
    }

    res.status(200).json({ message: "we sent an email to you" });
    sendVerificationMailBusinessOwner(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const findeUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await BusinessOwnersModel.findById({ userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllBusinessOwner = async (req, res) => {
  try {
    const users = await BusinessOwnersModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token_email = req.body.token_email;

    if (!token_email)
      return res.status(404).json({ message: "email token not found ..." });

    const user = await BusinessOwnersModel.findOne({ token_email });

    if (user) {
      user.token_email = null;
      user.is_verified = true;

      await user.save();

      const userInfos = {
        id: user._id,
        name: user.name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        username: user.username,
        email: user.email,
        is_verified: user.is_verified,
        country_name: user.country_name,
        state_name: user.state_name,
        city_name: user.city_name,
        address: user.address,
        brand_name: user.brand_name,
        is_complete_information: user.is_complete_information,
        is_businessOwner: user.is_businessOwner,
        registration_date: user.registration_date,
        profile_image_path: user.profile_image_path ? `${process.env.BASE_URL_SERVER}/${user.profile_image_path}` : "",
      };

      const token = await createToken(userInfos);

      await res.status(200).json({
        userInfos,
        token,
      });
    } else {
      res
        .status(404)
        .json({ message: "Emial verification failed, invalid token" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const getMe = async (req, res) => {
  try {
    const token = req.header("Authorization");
    jwt.verify(token, keyJwt, (err, decoded) => {
      if (err) {
        console.error(err.message);
        return res.status(400).json({ message: "token is empty or invalid" });
      } else {
        res.json(decoded);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const isPassword = async (req, res) => {
  const { password } = req.body;
  const userID = req.headers.authorization;

  try {
    let user = await BusinessOwnersModel.findById(userID);

    if (!user) {
      return res.status(400).json({ message: "Your password is incorrect" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (comparePassword) {
      res.status(200).json(true);
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const validatorPassword = async (req , res)=>{

  const businessOwnerId = req.headers.authorization;
  const {password} = req.body;

  try {
    if(!businessOwnerId){
      return res.status(400).json({
        message:"businessOwner id not found"
      })
    }
    const businessOwner = await BusinessOwnersModel.findById(businessOwnerId);

    if (!businessOwner) {
      return res.status(401).json({
        success: false,
        message: "Business owner not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, businessOwner.password);

  
   if(isPasswordMatch){
  return  res.status(200).json({
      message:"Password is valid.",
      value: true
    })
   }else{
    return  res.status(200).json({
      message:"Password is not valid.",
      value: false
    })
   }
  
  } catch (error) {
    console.error(error)
    res.status(500).json(error.message);
  }

 

}


const businessInformation = async (req, res) => {
  const businessOwnerId = req.headers.authorization;
  const uploadedFileName = req.file.filename;

  if (!businessOwnerId) {
    return res.status(400).json({
      message: "business owner id not found",
    });
  }

  try {
    const businessOwner = await BusinessOwnersModel.findOne({
      _id: businessOwnerId,
    });
    if (!businessOwner) {
      return res.status(404).json({
        message: "business owner not found",
      });
    }

    if (businessOwner.workPlace_image_path) {
      const previousImagePath = businessOwner.workPlace_image_path;

      try {
        fs.unlinkSync(previousImagePath);
      } catch (err) {
        console.error(`Error deleting previous image: ${err}`);
      }
    }

    businessOwner.workPlace_image_path = `public/images/profileBusinessOwner/${uploadedFileName}`;

    await businessOwner.save();

    const userInfos = {
      id: businessOwner.id,
      profile_image_path:`${process.env.BASE_URL_SERVER}/${businessOwner.profile_image_path}` ,
      name: businessOwner.name,
      last_name: businessOwner.last_name,
      phone_number: businessOwner.phone_number,
      username: businessOwner.username,
      email: businessOwner.email,
      is_verified: businessOwner.is_verified,
      country_name: businessOwner.country_name,
      state_name: businessOwner.state_name,
      city_name: businessOwner.city_name,
      address: businessOwner.address,
      brand_name: businessOwner.brand_name,
      is_complete_information: businessOwner.is_complete_information,
      is_businessOwner: businessOwner.is_businessOwner,
      registration_date: businessOwner.registration_date,
      password: businessOwner.password,
      postal_code: businessOwner.postal_code,
      work_phone: businessOwner.work_phone,
    };

    const token = await createToken(userInfos);

    return res.status(200).json({ userInfos, token });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  findeUser,
  getAllBusinessOwner,
  verifyEmail,
  getMe,
  resendEmailVerification,
  updateInformation,
  isPassword,
  businessOwnerImage,
  uploadProfileImage,
  deleteBusinessOwnerProfileImage,
  validatorPassword
};
