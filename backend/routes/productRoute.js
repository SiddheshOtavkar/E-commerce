const express = require("express");
const {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    ratingController,
    uploadImages,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const router = express.Router();

router.post("/create-product", authMiddleware, isAdmin, createProduct);

router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    productImgResize,
    uploadImages
);

router.get("/get-product/:id", getProduct);
router.get("/all-products", getAllProduct);

router.put("/update-product/:id", authMiddleware, isAdmin, updateProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, ratingController);

router.delete("/delete-product/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
