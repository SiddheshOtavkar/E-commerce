const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
    createBlogController,
    updateBlogController,
    getBlogController,
    getAllBlogs,
    deleteBlogController,
    likeBlogController,
    dislikeBlogController,
    uploadImages,
} = require("../controller/blogController");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImage");
const router = express.Router();

router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 2),
    blogImgResize,
    uploadImages
);

router.get("/:id", getBlogController);
router.get("/", getAllBlogs);

router.delete("/:id", authMiddleware, isAdmin, deleteBlogController);

router.post("/", authMiddleware, isAdmin, createBlogController);

router.put("/dislikes", authMiddleware, dislikeBlogController);
router.put("/likes", authMiddleware, likeBlogController);
router.put("/:id", authMiddleware, isAdmin, updateBlogController);

module.exports = router;