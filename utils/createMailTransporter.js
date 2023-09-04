const nodemailer = require("nodemailer");

const createMailTransporter = ()=>{
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'mo3ito.developer@outlook.com',
          pass: 'mostafa8188'
        }
      });

      return transporter;
}






module.exports = {createMailTransporter}