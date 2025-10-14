const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Please Enter product Title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  listItems: {
    type: [],
  },
  type: {
    type: String,
  },
  brand: {
    type: String,
  },
  videoLink: {
    type: String,
    default: null,
  },

  oldPrice: {
    type: Number,
    required: [true, "Please Enter Original Price"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },
  salePrice: {
    type: Number,
    required: [true, "Please Enter Sale Price"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },
  buyPrice: {
    type: Number,
    required: [true, "Please Enter Buy Price"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },

  sizes: {
    type: [],
  },
  availability: {
    type: String,
    enum: ["inStock", "outOfStock", "unavailable"],
    default: "inStock",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
  },
  colors: {
    type: [],
  },

  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  ratings: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, "Please Enter product Category"],
  },
  subCategory: {
    type: String,
  },
  subsubCategory: {
    type: String,
  },
  deliveryCharge: {
    type: String,
    enum: ["yes", "no"],
    default: "yes",
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      images: [
        {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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

// Slug generator
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
