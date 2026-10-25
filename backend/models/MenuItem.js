import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    // We can also store legacy numeric restaurantId or string restaurantId for ease of migration
    restaurantId: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "Prepared fresh with top-quality ingredients.",
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: "Recommended",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingCount: {
      type: Number,
      default: 25,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
