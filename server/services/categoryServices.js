const asyncHandler = require("express-async-handler");
const categoryModel = require("../models/categoryModel");

//1.GET ALL CATEGORY
const getAllCategory = asyncHandler(async (req, res) => {
    const listCategory = await categoryModel.find({});
    if (listCategory) {
        return listCategory;
    } else {
        throw Error("KHÔNG TÌM THẤY DANH SÁCH CATEGORY!");
    }
});

//2.CREATE NEW CATEGORY
const createNewCategory = asyncHandler(async (categoryName, categoryDescription) => {
    const newCategory = await categoryModel.create({ categoryName, categoryDescription });
    if (newCategory) {
        return newCategory;
    } else {
        throw Error("TẠO CATEGORY MỚI THẤT BẠI!");
    }
})

module.exports = { getAllCategory, createNewCategory }