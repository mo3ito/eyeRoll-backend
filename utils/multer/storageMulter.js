const multer = require("multer");
const fs = require("fs");
const path = require("path")


// const storageMulter = (pathDir  , model)=>{

//     const storage = multer.diskStorage({
//         destination: async (req, file, cb) => {
//           const businessOwnerId = req.headers.authorization;
      
//           try {
//             const businessOwner = await model.findById(businessOwnerId);
//             if (!businessOwner) {
//               return cb(new Error('Business owner not found'), null);
//             }
      
//             const businessOwnerPath = path.join(pathDir, businessOwner.username);
            
//             if (!fs.existsSync(businessOwnerPath)) {
//               fs.mkdirSync(businessOwnerPath, { recursive: true });
//             }
      
//             cb(null, businessOwnerPath);
//           } catch (error) {
//             cb(error, null);
//           }
//         },
//         filename: (req, file, cb) => {
//           const uniqueSuffix = Date.now() + file.originalname;
//           cb(null, uniqueSuffix);
//         },
//       });

//       console.log('businessOwnerId:', businessOwnerId);
// console.log('businessOwner:', businessOwner);
// console.log('businessOwnerPath:', businessOwnerPath);

//       return storage;

// }

  
//   module.exports = storageMulter;

const storageMulter = (pathDir, model) => {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const businessOwnerId = req.headers.authorization;
        if (!businessOwnerId) {
          return cb(new Error('Business owner id not found'), null);
        }

        const businessOwner = await model.findById(businessOwnerId);
        if (!businessOwner) {
          return cb(new Error('Business owner not found'), null);
        }

        const businessOwnerPath = path.join(pathDir, businessOwner.username);

        if (!fs.existsSync(businessOwnerPath)) {
          fs.mkdirSync(businessOwnerPath, { recursive: true });
        }

        cb(null, businessOwnerPath);
      } catch (error) {
        cb(error, null);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + file.originalname;
      cb(null, uniqueSuffix);
    },
  });

  return storage;
};

module.exports = storageMulter;