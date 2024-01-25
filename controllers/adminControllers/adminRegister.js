const AdminRegisterModel = require("../../models/Admin/AdminRegister")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
require("dotenv").config();
const keyJwt = process.env.KEY_JWT;


const createToken = async (adminInfo) => {
    const token = await jwt.sign(adminInfo, keyJwt, { expiresIn: "3d" });
    return token;
  };

  const adminRegister = async (req, res) => {
    const {
      name,
      last_name,
      phone_number,
      username,
      password,
      email,
      admin_key
    } = req.body;
  
    try {
      const lowercaseEmail = await email.toLowerCase();
      let admin = await AdminRegisterModel.findOne({ email: lowercaseEmail });
      let isAdmin = await AdminRegisterModel.findOne({username})
  
      if (admin)
        return res.status(400).json({
          message: "Admin already exist",
        });
  
        if(isAdmin){
          return res.status(400).json({
            message: "Username already exist"
          })
        }

        const isValidAdminKey = await bcrypt.compare(admin_key , process.env.KEY_ADMIN)

        if(!isValidAdminKey){
          return res.status(400).json({
            message: "Your admin key is not valid"
          })
        }
  
      admin = new AdminRegisterModel({
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
     
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admin.password, salt.toString());
      admin.password = hashedPassword;
  
      await admin.save();
  
      const adminInfos = {
        id: admin._id,
        name,
        last_name,
        phone_number,
        username,
        email: lowercaseEmail,
        is_admin: admin.is_admin,
        registration_date: admin.registration_date,
      };
   
      const token = await createToken(adminInfos);
  
      res.status(200).json({ adminInfos, token });
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  };




  const loginAdmin = async (req, res) => {
    const { email, password , admin_key } = req.body;

    const isValidAdminKey = await bcrypt.compare(admin_key , process.env.KEY_ADMIN)

    if(!isValidAdminKey){
      return res.status(400).json({
        message: "Your admin key is not valid"
      })
    }
  
    try {
      const lowercaseEmail = email.toLowerCase();
      let admin = await AdminRegisterModel.findOne({ email: lowercaseEmail });
  
      if (!admin){
        return res.status(400).json({ message: "Invalid email or password" });
      }
        
  
      const validPassword = await bcrypt.compare(
        password,
        admin.password.toString()
      );
     
      if (!validPassword)
        return res.status(400).json({ message: "Invalid email or password" });
      if (!admin.is_verified)
        return res
          .status(201)
          .json({ message: "You have not verified your email" });
  
  const adminInfos = {
        id: admin._id,
        name:admin.name,
        last_name: admin.last_name,
        phone_number:admin.phone_number,
        username:admin.username,
        email: lowercaseEmail,
        is_admin: admin.is_admin,
        registration_date: admin.registration_date,
      };
  
      const token = await createToken(adminInfos);
  
      res.status(200).json({ adminInfos, token });
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  };

  module.exports = {adminRegister , loginAdmin}