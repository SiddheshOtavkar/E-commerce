const couponModel = require("../models/couponModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const asynHandler = require("express-async-handler");

const createCouponController = asynHandler(async (req, res) => {
    try {
        const newCoupon = await couponModel.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCouponsController = asynHandler(async (req, res) => {
    try {
        const coupons = await couponModel.find();
        res.json(coupons);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCouponController = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatecoupon = await couponModel.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatecoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCouponController = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletecoupon = await couponModel.findByIdAndDelete(id);
        res.json({
            message: "Coupon Deleted Successfully",
            deletecoupon
        });
    } catch (error) {
        throw new Error(error);
    }
});

const getCouponController = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getAcoupon = await couponModel.findById(id);
        res.json(getAcoupon);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCouponController,
    getAllCouponsController,
    updateCouponController,
    deleteCouponController,
    getCouponController,
};