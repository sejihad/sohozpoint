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
const { ROLE_GROUPS, ROLES } = require("../utils/roles");

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
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP, ROLES.USER_ADMIN),
  getAdminBlogs,
);

router.post(
  "/admin/blog/new",
  isAuthenticator,
  authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP, ROLES.USER_ADMIN),
  createBlog,
);

router
  .route("/admin/blog/:id")
  .get(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP, ROLES.USER_ADMIN),
    getAdminBlogDetails,
  )
  .put(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP, ROLES.USER_ADMIN),
    updateBlog,
  )
  .delete(
    isAuthenticator,
    authorizeRoles(...ROLE_GROUPS.ADMINS_AND_UP, ROLES.USER_ADMIN),
    deleteBlog,
  );

module.exports = router;
