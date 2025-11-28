const mongoose = require("mongoose");
const slugify = require("slugify");

const genderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Gender Name"],
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

// Slug generate before save
genderSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Gender", genderSchema);
