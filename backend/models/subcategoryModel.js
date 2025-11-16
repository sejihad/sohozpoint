const mongoose = require("mongoose");
const slugify = require("slugify");

const subcategorySchema = new mongoose.Schema({
  category: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  name: {
    type: String,
    required: [true, "Please Enter Subcategory Name"],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate slug before saving
subcategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Subcategory", subcategorySchema);
