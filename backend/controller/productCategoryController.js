const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const productCategoryModel = require("../models/productCategoryModel");

const createCategoryController = asyncHandler(async (req, res) => {
    try {
        const newCategory = await productCategoryModel.create(req.body);
        res.json({
            message: "Category created successfully",
            newCategory,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updateCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedCatgeory = await productCategoryModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.json({ updatedCatgeory });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await productCategoryModel.findByIdAndDelete(id);
        res.json({
            message: "Category Deleted Successfully",
            deletedCategory
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getCategoryByIdController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const category = await productCategoryModel.findById(id);
        res.json({ category });
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCategoriesController = asyncHandler(async (req, res) => {
    try {
        const categories = await productCategoryModel.find();
        res.json({ categories });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getAllCategoriesController,
    getCategoryByIdController
};
