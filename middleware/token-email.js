const JWT = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log(req);
  const token = req.header("Authorization");
  const secretKey = "kjcbscjsuiczuisjaojx9vu9e7uwihdiw";

  if (!token) {
    res.status(400).json({
      err: [{ msg: "token not found" }],
    });
  } else {
    try {
      let user = JWT.verify(token, secretKey);
      next();
      console.log("successfull");
    } catch (error) {
      return res.status(400).json({
        errors: [{ msg: "token invalid" }],
      });
    }
  }
};

module.exports = verifyToken;