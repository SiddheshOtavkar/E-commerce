const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const { cloudinaryUploadImg } = require("../utils/cloudinary");
const fs = require("fs");

// Create Product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await productModel.create(req.body);
        res.json({
            newProduct
        })
    } catch (error) {
        throw new Error(error);
    }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await productModel.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        res.json(updatedProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedProduct = await productModel.findOneAndDelete({ _id: id });

        if (!deletedProduct) {
            return res.status(404).json({ status: 'fail', message: 'Product not found for deletion' });
        }

        res.json({ status: 'success', message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Get One Product
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findProduct = await productModel.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Get all products
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = productModel.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        // pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await productModel.countDocuments();
            if (skip >= productCount) throw new Error("This Page does not exists");
        }
        const product = await query;
        res.json(product);
    }
    catch (error) {
        throw new Error(error);
    }
});

// addToWishlist Controller
const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;
    try {
        const user = await userModel.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === productId);
        if (alreadyAdded) {
            let user = await userModel.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: productId }
                },
                { new: true }
            );
            res.json({ user });
        }
        else {
            let user = await userModel.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: productId }
                },
                { new: true }
            );
            res.json({ user });
        }
    } catch (error) {
        throw new Error(error);
    }
});

const ratingController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, productId, comment } = req.body;
    try {
        const product = await productModel.findById(productId);
        let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString());
        if (alreadyRated) {
            const updateRating = await productModel.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated }
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment }
                },
                { new: true }
            );
            // res.json(updateRating);
        }
        else {
            const rateProduct = await productModel.findByIdAndUpdate(
                productId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                { new: true }
            );
            // res.json(rateProduct);
        }

        const getallratings = await productModel.findById(productId);
        let totalRating = getallratings.ratings.length;

        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0); // 0 is accumulator

        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await productModel.findByIdAndUpdate(
            productId,
            {
                totalrating: actualRating,
            },
            { new: true }
        );

        res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    // console.log(req.files);
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            try {
                // Use a try-catch block for unlinkSync to handle potential errors
                fs.unlinkSync(path);
            } catch (unlinkError) {
                // Log the error, but continue with the loop
                console.error('Error deleting file:', unlinkError.message);
            }
        }
        const findProduct = await productModel.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            })
        }, { new: true });
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    ratingController,
    uploadImages
}
