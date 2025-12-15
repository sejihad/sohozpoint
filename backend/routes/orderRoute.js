const express = require("express");
const {
  getSingleOrder,
  myOrders,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getSingleAdminOrder,
  cancelOrder,
  requestRefund,
  updatePaymentStatus,
  createOrder,
  getSingleUserOrders,
} = require("../controllers/orderController");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const router = express.Router();

/* ======================
   USER ROUTES (AUTH)
====================== */

router.post("/order/new", isAuthenticator, createOrder);
router.get("/order/:id", isAuthenticator, getSingleOrder);
router.put("/order/:id/cancel", isAuthenticator, cancelOrder);
router.put("/order/:id/refund-request", isAuthenticator, requestRefund);
router.get("/orders/me", isAuthenticator, myOrders);

/* ======================
   SUPER-ADMIN ONLY
====================== */

router.get(
  "/admin/orders",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  getAllOrders
);

router.get(
  "/admin/orders/user/:userId",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  getSingleUserOrders
);

router
  .route("/admin/order/:id")
  .get(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    getSingleAdminOrder
  )
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    updateOrder
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
    deleteOrder
  );

/* ======================
   PAYMENT (SUPER-ADMIN)
====================== */

router.put(
  "/admin/payment/:id",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.SUPER_ADMIN_ONLY),
  updatePaymentStatus
);

module.exports = router;
