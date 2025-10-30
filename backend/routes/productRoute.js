const express = require("express");
const {
  createProduct,
  updateProduct,
  getAllProducts,
  getAdminProducts,
  getProductDetails,
  getAdminProductDetails,
  deleteProduct,
  getProductCart,
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} = require("../controllers/productController");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// 📚 Public Routes
router.get("/products", getAllProducts);
router.get("/products/:id", getProductCart);

router.get("/product/:slug", getProductDetails);

// 🔐 Admin Routes
router.get(
  "/admin/products",
  isAuthenticator,
  authorizeRoles("admin"),
  getAdminProducts
);

router.post(
  "/admin/product/new",
  isAuthenticator,
  authorizeRoles("admin"),
  createProduct
);

router
  .route("/admin/product/:id")
  .get(isAuthenticator, authorizeRoles("admin"), getAdminProductDetails)
  .put(isAuthenticator, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteProduct);

// ⭐️ Review Routes
router.put("/review", isAuthenticator, createReview);
router.put("/review/:reviewId", isAuthenticator, updateReview);
router.route("/reviews/:id").get(isAuthenticator, getReviews);
router
  .route("/review/:productId/:reviewId")
  .delete(isAuthenticator, deleteReview);

module.exports = router;
