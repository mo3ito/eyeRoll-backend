const OnlineMenuModel = require("../../models/BusinessOwners/OnlineMenu");
const profileImageFormater = require("../../middleware/profile-image-formater")
const BusinessOwnersModel = require("../../models/BusinessOwners/BusinessOwnersRegister")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const getAllProduct = async (req, res) => {
  try {
    const products = await OnlineMenuModel.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const addProduct = async (req, res) => {
  const { productAssortment, productName, productPrice, productDescription , businessOwnerId , productPricePetty ,  } =
    req.body;

  try {
    if (
      (!productAssortment || productAssortment.trim() === "") ||
      (!productName || productName.trim() === "") ||
      (!productPrice || productPrice.trim() === "")
    )  {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

   if(!businessOwnerId){
    return res.status(400).json({
      message: "The ID of the business owner was not found",
    });
   }

    const existingProduct = await OnlineMenuModel.findOne({
      productName,
      businessOwnerId,
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "A product with the same name already exists in the online menu.",
      });
    }

    let finallyProductPricePetty = productPricePetty !== 0 ? productPricePetty : ""
    const productInformation = {
      businessOwnerId,
      productAssortment,
      productName,
      productPrice,
      productPricePetty : finallyProductPricePetty,
      productDescription,
    };
    const onlineMenu = new OnlineMenuModel(productInformation);

    await onlineMenu.save();

    res.status(200).json({
      message: "Product added to the online menu successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const updateProduct = async (req, res) => {
  const productID = req.headers.authorization;

  try {
    const { productAssortment, productName, productPrice, productDescription , productPricePetty} =
      req.body;

    if (
      (!productAssortment || productAssortment.trim() === "") ||
      (!productName || productName.trim() === "") ||
      (!productPrice || productPrice.trim() === "")
    ) {
      return res.status(400).json({
        message: "At least one field to update is required.",
      });
    }

    const product = await OnlineMenuModel.findById(productID);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (productAssortment) {
      product.productAssortment = productAssortment;
    }

    if (productName) {
      product.productName = productName;
    }

    if (productPrice) {
      product.productPrice = productPrice;
    }

    if (productPricePetty === "" || +productPricePetty === 0) {
      product.productPricePetty = "";
    } else {
      product.productPricePetty = productPricePetty;
    }

    if (productDescription || productDescription === "" ) {
      product.productDescription = productDescription;
    }

    await product.save();
    res.status(200).json({
      message: "Your product has been edited successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const businessOwnerId = req.headers.authorization;
//     const businessOwner = BusinessOwnersModel.findById(businessOwnerId)
//     cb(null, `public/images/onlineMemu/${businessOwner.username}`); 
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + file.originalname;
//     cb(null, uniqueSuffix);
//   },
// });

// const uploadProductImage = multer({ storage , fileFilter : profileImageFormater });

// const productImage = async (req , res )=>{

//   const businessOwnerId = req.headers.authorization;
//   const uploadedFileName = req.file.filename;

//   if (!businessOwnerId) {
//     return res.status(400).json({
//       message: "business owner id not found",
//     });
//   }

//   try {
//     const businessOwner = await BusinessOwnersModel.findOne({
//       _id: businessOwnerId,
//     });
//     if (!businessOwner) {
//       return res.status(404).json({
//         message: "business owner not found",
//       });
//     }

//     if (businessOwner.profile_image_path) {
//       const previousImagePath = businessOwner.profile_image_path;

//       try {
//         fs.unlinkSync(previousImagePath);
//       } catch (err) {
//         console.error(`Error deleting previous image: ${err}`);
//       }
//     }

//     businessOwner.profile_image_path = `public/images/onlineMenu/${uploadedFileName}`;

//     await businessOwner.save();


    

//     return res.status(200).json({ userInfos, token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error.message);
//   }

// }

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const businessOwnerId = req.headers.authorization;

    try {
      const businessOwner = await BusinessOwnersModel.findById(businessOwnerId);
      if (!businessOwner) {
        return cb(new Error('Business owner not found'), null);
      }

      const onlineMenuPath = path.join('public/images/onlineMenu', businessOwner.username);
      
      if (!fs.existsSync(onlineMenuPath)) {
        fs.mkdirSync(onlineMenuPath, { recursive: true });
      }

      cb(null, onlineMenuPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const uploadProductImage = multer({ storage , fileFilter : profileImageFormater });



const productImage = async (req, res) => {
  const businessOwnerId = req.headers.authorization;
  const uploadedFileName = req.file.filename;
  const productId = req.query.productId;

  if (!businessOwnerId) {
    return res.status(400).json({
      message: "Business owner id not found",
    });
  }

  try {

    const targetProduct = await OnlineMenuModel.findOne({
      businessOwnerId,
      _id: productId, 
    });

    const businessOwner = await BusinessOwnersModel.findById(businessOwnerId)


    if (!targetProduct) {
      return res.status(404).json({
        message: "target product not found",
      });
    }

    if(!businessOwner){
      return res.status(404).json({
        message: "business owner not found",
      });
    }
  
    if (targetProduct.product_image_path) {
      const previousImagePath = targetProduct.product_image_path;

      try {
       await fs.unlinkSync(previousImagePath);
      } catch (err) {
        console.error(`Error deleting previous image: ${err}`);
      }
    }

 
  
    targetProduct.product_image_path = `public/images/onlineMenu/${businessOwner.username}/${uploadedFileName}`;
    await targetProduct.save();

    return res.status(200).json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  const productID = req.headers.authorization;

  try {
    if (!productID) {
      return res.status(400).json({
        message: "Product ID is required for deletion.",
      });
    }

    const product = await OnlineMenuModel.findById(productID);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    await OnlineMenuModel.findByIdAndDelete(productID);

    res.status(200).json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

const findProduct = async (req, res) => {
  const businessOwnerId = req.headers.authorization;
  try {
    if (!businessOwnerId) {
      return res.status(400).json({
        message: "No business owner was found with this profile",
      });
    }
    const targetProduct = await OnlineMenuModel.find({businessOwnerId});
    if (!targetProduct) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }
    const reversedTargetProduct = await targetProduct.reverse();
    res.status(200).json(reversedTargetProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};



module.exports = {
  getAllProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  findProduct,
  uploadProductImage,
  productImage
};
