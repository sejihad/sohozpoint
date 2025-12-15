const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getAdminBlogs,
  getBlogDetails,
  updateBlog,
  deleteBlog,
  getAdminBlogDetails,
} = require("../controllers/blogController");

const { isAuthenticator, authorizeRoles } = require("../middleware/auth");
const { ROLE_GROUPS } = require("../utils/roles");

const router = express.Router();

/* ======================
   PUBLIC ROUTES
====================== */

// All blogs (public)
router.get("/blogs", getAllBlogs);

// Single blog by slug (public)
router.get("/blog/:slug", getBlogDetails);

/* ======================
   ADMIN + SUPER-ADMIN
====================== */

router.get(
  "/admin/blogs",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  getAdminBlogs
);

router.post(
  "/admin/blog/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
  createBlog
);

router
  .route("/admin/blog/:id")
  .get(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    getAdminBlogDetails
  )
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    updateBlog
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP),
    deleteBlog
  );

module.exports = router;
