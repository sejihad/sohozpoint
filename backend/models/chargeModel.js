const mongoose = require("mongoose");

const ChargeSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Charge", ChargeSchema);
