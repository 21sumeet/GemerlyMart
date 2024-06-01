const { default: slugify } = require("slugify");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel");
const fs = require("fs");
const { error } = require("console");
const braintree = require("braintree");
const dotenv = require("dotenv");

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.send({
        success: false,
        message: "Name is required",
      });
    }
    if (!description) {
      return res.send({
        success: false,
        message: "Description is required",
      });
    }
    if (!price) {
      return res.send({
        success: false,
        message: "Price is required",
      });
    }
    if (!quantity) {
      return res.send({
        success: false,
        message: "Quantity is required",
      });
    }
    if (!category) {
      return res.send({
        success: false,
        message: "Category is required",
      });
    }
    if (!shipping) {
      return res.send({
        success: false,
        message: "Shipping is required",
      });
    }
    if (photo && photo.size > 1000000) {
      return res.send({
        success: false,
        message: "photo is required and should be less than 1mb",
      });
    }
    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price,
      quantity,
      category,
      shipping,
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while creating product",
      error: error.message,
    });
  }
};

//get all products
const getproductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while getting products",
      error: error.message,
    });
  }
};

const getsingleproductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.send({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while getting single product",
      error: error.message,
    });
  }
};

const getproductphotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while getting photo",
      error: error.message,
    });
  }
};

const deleteproductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.pid);
    res.send({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while deleting product",
      error: error.message,
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category, shipping } =
      req.fields;
    const { photo } = req.files;
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        name,
        slug: slugify(name),
        description,
        price,
        quantity,
        category,
        shipping,
      },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while updating product",
      error: error.message,
    });
  }
};

const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.send({
      success: true,
      products,
    });
  } catch {
    console.log(error);
    res.send({
      success: false,
      message: "Error while filtering product",
      error: error.message,
    });
  }
};

const productcountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while product count",
      error: error.message,
    });
  }
};

const productlistController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while product list",
      error: error.message,
    });
  }
};

const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    res.json(results);
    res.send({
      success: true,
      results,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while search product",
      error: error.message,
    });
  }
};

const relatedProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while search related product",
      error: error.message,
    });
  }
};

const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category: category._id });
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while category wise product",
      error: error.message,
    });
  }
};

//payment gateway api
//token
const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createProductController,
  getproductController,
  getsingleproductController,
  getproductphotoController,
  deleteproductController,
  updateProductController,
  filterProductController,
  productcountController,
  productlistController,
  searchProductController,
  relatedProductsController,
  productCategoryController,
  braintreeTokenController,
  brainTreePaymentController,
};
