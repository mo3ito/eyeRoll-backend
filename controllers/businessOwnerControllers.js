const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const BusinessOwnersModel = require("../models/BusinessOwners")
const validator = require("validator")
const crypto = require("crypto")
const { sendVerificationMail } = require("../utils/sendVerificationMail")


    const createToken = async (userInfo)=>{
    const token = await jwt.sign(userInfo,"kjcbscjsuiczuisjaojx9vu9e7uwihdiw",{expiresIn: "3d",});
    return token
    }


    const registerUser = async (req , res)=>{

        const { name, last_name, phone_number, username, password, repeat_password , email } =req.body;

        try {
            
            let user = await BusinessOwnersModel.findOne({email})

            if(user) return res.status(400).json("User already exist")

            

            user = new BusinessOwnersModel({name,last_name,phone_number,username,password,email, token_email: crypto.randomBytes(64).toString("hex")});

            if( !name || !last_name || !phone_number || !username || !password || !repeat_password  || !email ){

                res.status(400).json("All fields are required")
            }
            if(!validator.isEmail(email)){
                res.status(400).json("Email must be a valid email")
            }
            if (password.length < 6) {
                res.status(400).json("the password must be at least 4 characters long");
              }
              if (password !== repeat_password) {
                res.status(400).json("the password dosnt match with repeat password");
              }

              const salt = await bcrypt.genSalt(10)
              const hashedPassword = await bcrypt.hash(user.password , salt.toString() )
              user.password = hashedPassword;

              await user.save()

              sendVerificationMail(user)

              const userInfos = { id: user._id,name, last_name, phone_number, username, email , is_verified : user.is_verified }
              

              const token =await createToken(userInfos)

              res.status(200).json({ userInfos , token})

        } catch (error) {
            console.error(error)
            res.status(500).json(error.message)
        }

    }


    const loginUser = async (req , res)=>{

        const {email , password} = req.body;

        try {
            let user = await BusinessOwnersModel.findOne({email})

            if(!user) return res.status(400).json("Invalid email or password")
          

            const validPassword = await bcrypt.compare(password , user.password.toString());
            console.log(user);
            if(!validPassword) return res.status(400).json("Invalid email or password")

            const userObject = { id: user._id,name:user.name, last_name:user.last_name, phone_number: user.phone_number, username : user.username, password : user.password , email:user.email }
              

            const token =await createToken(userObject)

            res.status(200).json({ _id: user._id ,name : user.name ,last_name: user.last_name ,phone_number: user.phone_number ,username:user.username ,email:user.email, is_verified:user.is_verified ,token})

        } catch (error) {
            
            console.error(error)
            res.status(500).json(error.message)
        }

    }

    const findeUser = async (req , res)=>{

        const userId = req.params.userId

        try {
            const user = await BusinessOwnersModel.findById({userId})
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }


    const getUsers = async ()=>{
        try {
            const users = BusinessOwnersModel.find({});
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    const verifyEmail = async (req , res)=>{
        try {
          const token_email = req.body.token_email;
        
          if(!token_email) return res.status(404).json("email token not found ...")
          
          const user = await BusinessOwnersModel.findOne( {token_email} )
        
          if(user){
            user.token_email = null;
            user.is_verified = true;
            
            await user.save()

            const userInfos = { id: user._id,name:user.name, last_name:user.last_name, phone_number: user.phone_number, username : user.username , email:user.email , is_verified:user.is_verified }
        
            const token = await createToken(userInfos)
        
           await res.status(200).json({
              userInfos,
              token,
            })
          } else{
            res.status(404).json("Emial verification failed, invalid token")
          }
        
        } catch (error) {
          console.error(error)
          res.status(500).json(error.message)
        }
        }

        const getMe = async (req , res)=>{

            try {
                const token = req.header("Authorization")
                jwt.verify(token , "kjcbscjsuiczuisjaojx9vu9e7uwihdiw" , (err , decoded)=>{
                    if(err) {
                        console.error(err.message)
                        return res.status(400).json("token is empty or invalid")
                    }else{
                        res.json(decoded);
                    }
                } )
            } catch (error) {
                console.error(error)
                res.status(500).json(error.message)
            }
        }

    


    module.exports = {
        registerUser,
        loginUser,
        findeUser,
        getUsers,
        verifyEmail,
        getMe
    }