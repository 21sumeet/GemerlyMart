const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
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
} = require("../controllers/productController");
const formidable = require("formidable");
const router = express.Router();

const parseForm = (req, res, next) => {
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.send({
        success: false,
        message: "Error parsing form data",
        error: err.message,
      });
    }
    req.fields = fields;
    req.files = files;
    next();
  });
};

//create product
//http://localhost:8080/api/v1/product/create-product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  parseForm,
  createProductController
);

//get all products
//http://localhost:8080/api/v1/product/get-product
router.get("/get-product", getproductController);

//get single product
//http://localhost:8080/api/v1/product/get-product/:slug
router.get("/get-product/:slug", getsingleproductController);

//get photo
//http://localhost:8080/api/v1/product/product-photo/:pid
router.get("/product-photo/:pid", getproductphotoController);

//delete product
//http://localhost:8080/api/v1/product/delete-product/:pid
router.delete("/delete-product/:pid", deleteproductController);

//update product
//http://localhost:8080/api/v1/product/update-product/:pid
router.put(
  "/update-product/:pid",

  requireSignIn,
  parseForm,
  updateProductController
);

//filter product
//http://localhost:8080/api/v1/product/filter-products
router.post("/filter-products", filterProductController);

//product count
//http://localhost:8080/api/v1/product/product-count
router.get("/product-count", productcountController);

//product per page
//http://localhost:8080/api/v1/product/product-list/:page
router.get("/product-list/:page", productlistController);

//search product
//http://localhost:8080/api/v1/product/search/:keyword
router.get("/search/:keyword", searchProductController);

//similar product
//http://localhost:8080/api/v1/product/related-product/:pid/:cid
router.get("/related-product/:pid/:cid", relatedProductsController);

//category wise product
//http://localhost:8080/api/v1/product/category-product/:slug
router.get("/category-product/:slug", productCategoryController);

//payment routes // token
router.get("/braintree/token", braintreeTokenController);
//payment
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

module.exports = router;
