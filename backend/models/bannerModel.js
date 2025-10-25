const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  // To control where the banner appears
  deviceType: {
    type: String,
    enum: ["desktop", "mobile", "both"],
    default: "both",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banner", bannerSchema);
