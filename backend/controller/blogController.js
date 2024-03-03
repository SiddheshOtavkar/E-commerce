const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const fs = require("fs");
const { cloudinaryUploadImg } = require("../utils/cloudinary");

const createBlogController = asyncHandler(async (req, res) => {
    try {
        const newBlog = await blogModel.create(req.body);
        res.json({ newBlog });
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlogController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedBlog = await blogModel.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updatedBlog) {
            return res.status(404).json({
                status: "fail",
                message: `Blog not found with ID: ${_id}`,
            });
        }

        res.json({ updatedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
});

const getBlogController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await blogModel.findById(id)
            .populate("likes")
            .populate("dislikes");
        const updateViews = await blogModel.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            },
            { new: true }
        )
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const allBlogs = await blogModel.find();
        res.json({ allBlogs });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlogController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteBlog = await blogModel.findByIdAndDelete(id);
        res.json({
            message: "Blog Deleted Successfully",
            deleteBlog
        });
    } catch (error) {
        throw new Error(error);
    }
});

const likeBlogController = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // First find the Blog that we want to get liked
    const blog = await blogModel.findById(blogId);

    //Find the Login user
    const loginUserId = req?.user?._id;

    // Find if the user has liked the blog
    const isLiked = blog?.isLiked;

    // Find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );

    console.log("already disliked: ", alreadyDisliked);

    if (alreadyDisliked) {
        const blog = await blogModel.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false
            },
            { new: true }
        );
        // res.json({ blog });
    }

    if (isLiked) {
        const blog = await blogModel.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json({ blog });
    }
    else {
        const blog = await blogModel.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true
            },
            { new: true }
        );
        res.json({
            message: "Blog has been liked",
            blog
        });
    }
});

const dislikeBlogController = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // Find the blog that we want to  get disliked
    const blog = await blogModel.findById(blogId);

    // Find the login user
    const loginUserId = req?.user?._id;

    // Find if the user has disliked the blog
    const isDisliked = blog?.isDisliked;

    // Find if the user that has already liked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );

    console.log("already Liked: ", alreadyLiked);

    if (alreadyLiked) {
        const blog = await blogModel.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false
            },
            { new: true }
        );
        // res.json({ blog });
    }

    if (isDisliked) {
        const blog = await blogModel.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false
            },
            { new: true }
        );
        res.json({ blog });
    }
    else {
        const blog = await blogModel.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
                isDisliked: true
            },
            { new: true }
        );
        res.json({
            message: "Blog has been dis-liked",
            blog
        });
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
        const findBlog = await blogModel.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            })
        }, { new: true });
        res.json(findBlog);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createBlogController,
    updateBlogController,
    getBlogController,
    getAllBlogs,
    deleteBlogController,
    likeBlogController,
    dislikeBlogController,
    uploadImages
};