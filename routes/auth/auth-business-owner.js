const router = require("express").Router()
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const nodemailer = require("nodemailer")




router.post("/signup" , (req , res)=>{
    const { password,  email } =req.body;

    console.log(password , email);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mostafa.en1400@gmail.com', // آدرس ایمیل شما
          pass: 'mostafa9919022106' // رمز عبور ایمیل شما
        }
      })

      const mailOptions = {
        from: 'mostafa.tar90@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });

    


})

module.exports = router