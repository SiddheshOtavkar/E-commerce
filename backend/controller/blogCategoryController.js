const blogCategoryModel = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCategoryController = asyncHandler(async (req, res) => {
    try {
        const newCategory = await blogCategoryModel.create(req.body);
        res.json({
            message: "New Category Created",
            newCategory
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updateCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedCategory = await blogCategoryModel.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            message: "Category Updated Successfully",
            updatedCategory
        });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await blogCategoryModel.findByIdAndDelete(id);
        res.json({
            message: "Category Deleted Successfully",
            deletedCategory
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getCategory = await blogCategoryModel.findById(id);
        res.json(getCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCategoriesController = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await blogCategoryModel.find();
        res.json(getallCategory);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getCategoryController,
    getAllCategoriesController,
};