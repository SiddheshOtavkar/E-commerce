const brandModel = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrandController = asyncHandler(async (req, res) => {
    try {
        const newBrand = await brandModel.create(req.body);
        res.json({
            message: "Brand Created Successfully",
            newBrand
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updateBrandController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedBrand = await brandModel.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            message: "Brand Updated Successfully",
            updatedBrand
        });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBrandController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedBrand = await brandModel.findByIdAndDelete(id);
        res.json({
            message: "Brand Deleted Successfully",
            deletedBrand
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getBrandController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaBrand = await brandModel.findById(id);
        res.json(getaBrand);
    } catch (error) {
        throw new Error(error);
    }
});

const getallBrandsController = asyncHandler(async (req, res) => {
    try {
        const getallBrand = await brandModel.find();
        res.json(getallBrand);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createBrandController,
    updateBrandController,
    deleteBrandController,
    getBrandController,
    getallBrandsController,
};