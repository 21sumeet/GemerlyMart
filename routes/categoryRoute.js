const express = require("express");
const router = express.Router();
const {
  createcategoryController,
  updateCategoryController,
  getcategoryController,
  singlecategoryController,
  deletecategoryController,
} = require("../controllers/categoryController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

//route

//create category
//http://localhost:8080/api/v1/category/create-category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createcategoryController
);

//update category
//http://localhost:8080/api/v1/category/update-category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//get all category
//http://localhost:8080/api/v1/category/get-category
router.get("/get-category", getcategoryController);

//get single category
//http://localhost:8080/api/v1/category//single-category/:slug
router.get("/single-category/:slug", singlecategoryController);

//delete category
//http://localhost:8080/api/v1/category/delete-category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deletecategoryController
);
module.exports = router;
