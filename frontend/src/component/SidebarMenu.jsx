import {
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
  LibraryBooks,
  ListAlt,
  People,
  PostAdd,
  RateReview,
} from "@mui/icons-material";
import { Mail } from "lucide-react";
import {
  FaBell,
  FaBoxOpen,
  FaComments,
  FaRegFlag,
  FaRegImage,
  FaRegMoneyBillAlt,
  FaShippingFast,
  FaTags,
  FaTicketAlt,
} from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { ROLE_GROUPS } from "../constants/roles";

export const SIDEBAR_MENU = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: DashboardIcon,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Blogs",
    path: "/admin/blogs",
    icon: LibraryBooks,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Add Blog",
    path: "/admin/blog",
    icon: PostAdd,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: CategoryIcon,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Sub Categories",
    path: "/admin/subcategories",
    icon: CategoryIcon,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Sub Sub Categories",
    path: "/admin/subsubcategories",
    icon: CategoryIcon,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Brands",
    path: "/admin/brands",
    icon: FaTags,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Types",
    path: "/admin/types",
    icon: FiLayers,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Genders",
    path: "/admin/genders",
    icon: FiLayers,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Shipping",
    path: "/admin/ships",
    icon: FaShippingFast,
    roles: ROLE_GROUPS.SUPER_ADMIN_ONLY,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: FaBoxOpen,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Logos",
    path: "/admin/logos",
    icon: FaRegImage,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Banners",
    path: "/admin/banners",
    icon: FaRegFlag,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Charges",
    path: "/admin/charges",
    icon: FaRegMoneyBillAlt,
    roles: ROLE_GROUPS.SUPER_ADMIN_ONLY,
  },
  {
    label: "Logo Charges",
    path: "/admin/logocharges",
    icon: FaRegMoneyBillAlt,
    roles: ROLE_GROUPS.SUPER_ADMIN_ONLY,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ListAlt,
    roles: ROLE_GROUPS.SUPER_ADMIN_ONLY,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: People,
    roles: ROLE_GROUPS.SUPER_ADMIN_ONLY,
  },
  {
    label: "Reviews",
    path: "/admin/reviews",
    icon: RateReview,
    roles: ROLE_GROUPS.ADMINS_AND_UP,
  },
  {
    label: "Coupons",
    path: "/admin/coupons",
    icon: FaTicketAlt,
    roles: ROLE_GROUPS.SUPER_ADMIN_ONLY,
  },
  {
    label: "Notification",
    path: "/admin/notification",
    icon: FaBell,
    roles: ROLE_GROUPS.SUPER_ADMIN_ONLY,
  },
  {
    label: "Messages",
    path: "/admin/messages",
    icon: FaComments,
    roles: ROLE_GROUPS.MODS_AND_UP,
  },
  {
    label: "Emails",
    path: "/admin/emails",
    icon: Mail,
    roles: ROLE_GROUPS.SUPER_ADMIN_ONLY,
  },
];
