const asyncHandler = require("express-async-handler");
const categoryModel = require("../models/categoryModel");
const categoryService = require("../services/categoryServices");

//1.GET ALL CATEGORY
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const listCategory = await categoryService.getAllCategory();
    return res.status(200).json({
      status: 200,
      data: listCategory,
      message: "LẤY DANH SÁCH CATEGORY THÀNH CÔNG!",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: 400, message: "LẤY DANH SÁCH CATEGORY THẤT BẠI!" });
  }
});

const createNewCategory = asyncHandler(async (req, res) => {
  const { categoryName, categoryDescription } = req.body;
  try {
    const newCategory = await categoryService.createNewCategory(
      categoryName,
      categoryDescription
    );
    return res.status(200).json({
      status: 200,
      data: newCategory,
      message: "THÊM CATEGORY MỚI THÀNH CÔNG!",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: 400, message: "THÊM CATEGORY MỚI THẤT BẠI!" });
  }
});

module.exports = {
  getAllCategory,
  createNewCategory,
};
