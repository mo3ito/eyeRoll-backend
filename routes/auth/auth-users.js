const router = require("express").Router();
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const UserModel = require("../../models/Users")
const crypto = require("crypto")

router.post("/signup", async (req, res) => {
  const { name, last_name, phone_number, username, password, repeat_password , email } =req.body;
console.log(req.body);
  if (password.length < 6) {
    res.send("the password must be at least 4 characters long");
  }
  if (password !== repeat_password) {
    res.send("the password dosnt match with repeat password");
  }

  let isUser = await UserModel.findOne({ phone_number: phone_number });
  
  if (isUser) {
    return res.status(201).json({
      errors: [{ msg: "please provide a vilid phone number" }],
    });
  }

  const hashPassword = await bcrypt.hash(password.toString(), 10);

 

  const token = await JWT.sign(
    { name, last_name, username, phone_number , email },
    "kjcbscjsuiczuisjaojx9vu9e7uwihdiw",
    {
      expiresIn: 3600000,
    }
  );
  const information = {
    name,
    last_name,
    username,
    phone_number,
    email,
    password:hashPassword
    
  };
  const response = {
    user: information,
    accessToken: token,
  };
  const newUser = {
    name,
    last_name,
    phone_number,
    username,
    password: hashPassword,
    email,
  };

  
  const addUser = new UserModel(newUser);

  const emailToken = JWT.sign({ email: newUser.email }, "kjcbscjsuiczuisjaojx9vu9e7uwihdiw", { expiresIn: 3000 });

  addUser.token_email = emailToken;
  await addUser.save();

  /// token 
  await addUser.save().then((result) => {

    res.json(response);
  });
});

router.post("/login", async (req, res) => {

  const { phone_number, password , email } = req.body;

  try {
  
    const user = await UserModel.findOne({
        $or: [
          { phone_number: phone_number },
          { email: email }
        ]
      });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        const information = {
          id:user._id,
          name: user.name,
          last_name: user.last_name,
          username: user.username,
          phone_number: user.phone_number,
          email:user.email
        };
        const id = user._id;
        const name = user.name;
        const last_name = user.last_name;
        const username = user.username;
        const email = user.email

        const token = await JWT.sign(
          { id ,name, last_name, username, phone_number , email },"kjcbscjsuiczuisjaojx9vu9e7uwihdiw",{expiresIn: 3600000,}
        );

        const response = {
          accessToken: token,
          user: information,
        };
        res.json(response);



      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all", (req, res) => {
  UserModel.find({}).then((allUser=> res.json(allUser)))
  
});

router.get("/me", (req, res) => {
  const token = req.header("Authorization");
  
  JWT.verify(token, "kjcbscjsuiczuisjaojx9vu9e7uwihdiw", (err, decoded) => {
    if (err) {
      console.error(err.message);
      return res.status(400).json({
        errors: [{ msg: "token is empty or invalid" }],
      });
    } else {
      res.json(decoded);
    }
  });
});

module.exports = router;