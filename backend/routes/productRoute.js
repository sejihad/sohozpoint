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
  getOrderProductDetails,
} = require("../controllers/productController");
const Product = require("../models/productModel");
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All products (public)
router.get("/products", getAllProducts);
// countController.js
router.get(
  "/count",

  async (req, res) => {
    try {
      // শুধু show: "yes" যেগুলো আছে
      const count = await Product.countDocuments();

      res.json({
        success: true,
        count: count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get("/products/:id", getProductCart);
router.get("/product/:slug", getProductDetails);
router.get("/product/id/:id", getOrderProductDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.get(
  "/admin/products",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  getAdminProducts
);

router.post(
  "/admin/product/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createProduct
);

router
  .route("/admin/product/:id")
  .get(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    getAdminProductDetails
  )
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateProduct
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteProduct
  );

/* ======================
   REVIEWS (AUTH USERS)
====================== */

router.put("/review", isAuthenticator, createReview);
router.put("/review/:reviewId", isAuthenticator, updateReview);
router.get("/reviews/:id", isAuthenticator, getReviews);
router.delete("/review/:productId/:reviewId", isAuthenticator, deleteReview);

module.exports = router;
