const express = require("express");
const {
    createBrandController,
    updateBrandController,
    deleteBrandController,
    getBrandController,
    getallBrandsController,
} = require("../controller/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrandController);

router.put("/:id", authMiddleware, isAdmin, updateBrandController);

router.delete("/:id", authMiddleware, isAdmin, deleteBrandController);

router.get("/:id", getBrandController);
router.get("/", getallBrandsController);

module.exports = router;
