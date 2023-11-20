

const profileImageFormater = (req, file, cb) => {
    if (file.mimetype.startsWith("image/jpeg") || file.mimetype.startsWith("image/jpg") ||  file.mimetype.startsWith("image/png")) {
     
      return cb(null, true);
    } else {
     
      return cb(new Error("Only photos in jpg and jpeg and png format are allowed."));
    }
  };


  module.exports = profileImageFormater;