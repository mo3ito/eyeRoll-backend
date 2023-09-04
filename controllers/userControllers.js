const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/Users")
const validator = require("validator")
const crypto = require("crypto")

    const createToken = async (_id)=>{
    const token = await jwt.sign({_id},"kjcbscjsuiczuisjaojx9vu9e7uwihdiw",{expiresIn: "3d",});
    return token
    }


    const registerUser = async (req , res)=>{

        const { name, last_name, phone_number, username, password, repeat_password , email } =req.body;

        try {
            
            let user = await userModel.findOne({email})

            if(user) return res.status(400).json("User already exist")

            

            user = new userModel({name,last_name,phone_number,username,password,email, token_email: crypto.randomBytes(64).toString("hex")});

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
              user.password = await bcrypt.hash(user.password , salt.toString() )

              await user.save()

              const token = createToken(user._id)

              res.status(200).json({ _id: user._id ,name,last_name,phone_number,username,email, token})

        } catch (error) {
            console.error(error)
            res.status(500).json(error.message)
        }

    }


    const loginUser = async (req , res)=>{

        const {email , password} = req.body;

        try {
            let user = userModel.findOne({email})

            if(!user) return res.status(400).json("Invalid email or password")

            const validPassword = await bcrypt.compare(password , user.password);

            if(!validPassword) return res.status(400).json("Invalid email or password")

            const token = createToken(user._id)

            res.status(200).json({ _id: user._id ,name : user.name ,last_name: user.last_name ,phone_number: user.phone_number ,username:user.username ,email:user.email, token})

        } catch (error) {
            
            console.error(error)
            res.status(500).json(error.message)
        }

    }

    const findeUser = async (req , res)=>{

        const userId = req.params.userId

        try {
            const user = await userModel.findById({userId})
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    }


    const getUsers = async ()=>{
        try {
            const users = userModel.find({});
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    const verifyEmail = async (req , res)=>{
        try {
          const token_email = req.body.email_token;
        
          if(!token_email) return res.status(404).json("email token not found ...")
        
          const user = await userModel.findOne( token_email )
        
          if(user){
            user.token_email = null;
            user.is_verified = true;
            
            await user.save()
        
            const token = createToken()
        
            res.status(200).json({
              id: user._id,
              name: user.name,
              last_name: user.last_name,
              phone_number : user.phone_number ,
              username : user.username,
              email: user.email,
              token,
              is_verified: user?.is_verified
        
            })
          } else{
            res.status(404).json("Emial verification failed, invalid token")
          }
        
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
        verifyEmail
    }