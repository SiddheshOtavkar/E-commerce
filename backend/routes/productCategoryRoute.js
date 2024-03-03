const express = require("express");
const { 
    createCategoryController, 
    updateCategoryController,
    deleteCategoryController,
    getAllCategoriesController,
    getCategoryByIdController, 
} = require("../controller/productCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

router.post("/", authMiddleware, isAdmin, createCategoryController);

router.delete("/:id", authMiddleware, isAdmin, deleteCategoryController);

router.put("/:id", authMiddleware, isAdmin, updateCategoryController);

module.exports = router;