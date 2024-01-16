const {createMailTransporter} = require("../createMailTransporter")
require('dotenv').config();

const sendVerificationMailUsers = (user)=>{
    const transporter = createMailTransporter()
    const mailOptions = {
        from: '"eyeRoll app 👻"', 
        to: user.email, 
        subject: "Verify your email...", 
        text: "Hello world?", 
        html: `<p>Hello ${user.username} verify your email by checking this link... </p>
        <a style="background-color:#e879f9 ; color:black ; padding:8px ; border-radius:5px ; text-decoration:none" href='${process.env.BASE_URL}/users-verify-email?token_email=${user.token_email}'>Verify your email</a>` ,
    }

    transporter.sendMail(mailOptions , (err , info)=>{
        if(err){
            console.error(err)
        }else{
            console.log("verification email sent");
        }
    })

}

module.exports = {sendVerificationMailUsers};