import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },
    deliveryTime: {
      type: String,
      required: true,
      default: "25-30 mins",
    },
    timeMinutes: {
      type: Number,
      default: 25,
    },
    cuisines: {
      type: [String],
      required: true,
    },
    food: {
      type: String, // String summary (e.g. "Pizzas, Italian, Fast Food")
      required: true,
    },
    place: {
      type: String,
      required: true,
      default: "Madurai",
    },
    address: {
      type: String,
      default: "Main Road, Madurai",
    },
    offer: {
      type: String,
      default: "",
    },
    costForTwo: {
      type: Number,
      default: 300,
    },
    price: {
      type: Number,
      default: 299,
    },
    isVegOnly: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
