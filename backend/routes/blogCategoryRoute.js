const express = require("express");
const {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getCategoryController,
    getAllCategoriesController,
} = require("../controller/blogCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategoryController);

router.put("/:id", authMiddleware, isAdmin, updateCategoryController);

router.delete("/:id", authMiddleware, isAdmin, deleteCategoryController);

router.get("/:id", getCategoryController);
router.get("/", getAllCategoriesController);

module.exports = router;
