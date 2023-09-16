const nodemailer = require("nodemailer");
require('dotenv').config();


const createMailTransporter = ()=>{
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
        auth: {
          user: 'discountapplication30@gmail.com',
          pass: process.env.PASSWORD_EMAIL
        }
      });

      return transporter;
}

module.exports = {createMailTransporter}