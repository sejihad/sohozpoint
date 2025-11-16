const mongoose = require("mongoose");
const slugify = require("slugify");

const subsubcategorySchema = new mongoose.Schema({
  subcategory: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
  },
  name: {
    type: String,
    required: [true, "Please Enter Subsubcategory Name"],
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
subsubcategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Subsubcategory", subsubcategorySchema);
