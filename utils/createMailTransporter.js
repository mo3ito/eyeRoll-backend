const nodemailer = require("nodemailer");
require('dotenv').config();


const createMailTransporter = ()=>{
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'mo3ito.developer@outlook.com',
          pass: process.env.PASSWORD_EMAIL
        }
      });

      return transporter;
}






module.exports = {createMailTransporter}