const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");

const createcategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.send({
        success: false,
        message: "Name is required",
      });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.send({
        success: true,
        message: "Category already exists",
      });
    }
    const category = await categoryModel.create({
      name,
      slug: slugify(name),
    });
    if (category) {
      return res.send({
        success: true,
        category,
        message: "Category created successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Error in category controller",
      error,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while updating category",
      error,
    });
  }
};

const getcategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.send({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while getting category",
      error,
    });
  }
};

const singlecategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.send({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while getting category",
      error,
    });
  }
};

const deletecategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};

module.exports = {
  createcategoryController,
  updateCategoryController,
  getcategoryController,
  singlecategoryController,
  deletecategoryController,
};
