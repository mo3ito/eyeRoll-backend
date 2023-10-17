const OnlineMenuModel = require("../../models/BusinessOwners/OnlineMenu");

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
  const { productAssortment, productName, productPrice, productDescription , businessOwnerId , productPricePetty } =
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

    if (productDescription) {
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
    res.status(200).json(targetProduct);
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
};
