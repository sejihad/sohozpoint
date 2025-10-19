const express = require("express");
const {
  getSingleOrder,
  myOrders,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getSingleAdminOrder,
  createOrder,
} = require("../controllers/orderController");
const router = express.Router();
const { isAuthenticator, authorizeRoles } = require("../middleware/auth");

router.get("/order/new", isAuthenticator, createOrder);
router.get("/order/:id", isAuthenticator, getSingleOrder);
router.get("/orders/me", isAuthenticator, myOrders);

router.get(
  "/admin/orders",
  isAuthenticator,
  authorizeRoles("admin"),
  getAllOrders
);

router
  .route("/admin/order/:id")
  .get(isAuthenticator, authorizeRoles("admin"), getSingleAdminOrder)
  .put(isAuthenticator, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticator, authorizeRoles("admin"), deleteOrder);

module.exports = router;
