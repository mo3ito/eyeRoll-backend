const {createMailTransporter} = require("./createMailTransporter")
require('dotenv').config();

const sendVerificationMail = (user)=>{
    const transporter = createMailTransporter()
    const mailOptions = {
        from: '"discount app 👻"', // sender address
        to: user.email, // list of receivers
        subject: "Verify your email...", // Subject line
        text: "Hello world?", // plain text body
        html: `<p>Hello ${user.name} verify your email by checking this link... </p>
        <a href='http://localhost:3000/verify-email?token_email=${user.token_email}'>Verify your email</a>` ,// html body
    }

    transporter.sendMail(mailOptions , (err , info)=>{
        if(err){
            console.error(err)
        }else{
            console.log("verification email sent");
        }
    })

}

module.exports = {sendVerificationMail};