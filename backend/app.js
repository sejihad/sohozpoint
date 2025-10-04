const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const user = require("./routes/userRoute");
const blog = require("./routes/blogRoute");
const logo = require("./routes/logoRoute");
const banner = require("./routes/bannerRoute");
const coupon = require("./routes/couponRoute");
const notification = require("./routes/notificationRoute");
const logoCharge = require("./routes/customLogoChargeRoute");
const charge = require("./routes/chargeRoute");

const category = require("./routes/categoryRoute");
const brand = require("./routes/brandRoute");
const type = require("./routes/typeRoute");
const subcategory = require("./routes/subcategoryRoute");
const subsubcategory = require("./routes/subsubcategoryRoute");
const product = require("./routes/productRoute");
const ship = require("./routes/shipRoute");

const order = require("./routes/orderRoute");

dotenv.config();
require("./config/passport");

app.use(passport.initialize());

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ✅ File Upload Middleware Fix
app.use(fileUpload());

// ✅ CORS Middleware Fix
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://sohozpoint.com",
      "http://www.sohozpoint.com",
    ],
    credentials: true,
  })
);

// API Routes

app.use("/api/v1", user);
app.use("/api/v1", blog);
app.use("/api/v1", category);
app.use("/api/v1", subcategory);
app.use("/api/v1", subsubcategory);
app.use("/api/v1", brand);
app.use("/api/v1", ship);
app.use("/api/v1", product);
app.use("/api/v1", type);
app.use("/api/v1", logo);
app.use("/api/v1", banner);
app.use("/api/v1", charge);
app.use("/api/v1", logoCharge);
app.use("/api/v1", order);
app.use("/api/v1", notification);
app.use("/api/v1", coupon);
// Error Middleware
app.use(errorMiddleware);

module.exports = app;
