const express = require("express");
const {
    createUser,
    loginUserController,
    getUser,
    deleteUserController,
    updateUserController,
    getAllUsers,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logoutController,
    updatePasswordController,
    forgotPasswordToken,
    resetPassword,
    loginAdminController,
    getWishlist,
    saveAddress,
    userCartController,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getAllOrders,
    getOrders,
    getOrderByUserId,
    updateOrderStatus
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserController);
router.post("/admin-login", loginAdminController);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/cart", authMiddleware, userCartController);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.put(
    "/order/update-order/:id",
    authMiddleware,
    isAdmin,
    updateOrderStatus
);
router.get("/orders/:id", authMiddleware, isAdmin, getOrderByUserId);

router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutController);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getUser);

router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUserController);

router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePasswordController);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/edit-user", authMiddleware, updateUserController);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);


module.exports = router;
