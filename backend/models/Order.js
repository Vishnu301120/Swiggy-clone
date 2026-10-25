import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  image: { type: String },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: false,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // can also allow guest checkout if needed
    },
    orderCode: {
      type: String,
      unique: true,
      required: true,
    },
    items: [orderItemSchema],
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, default: "Madurai" },
      pincode: { type: String, default: "625001" },
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Online Payment", "UPI"],
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    itemTotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 30,
    },
    platformFee: {
      type: Number,
      default: 5,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: "",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },
    estimatedDeliveryMinutes: {
      type: Number,
      default: 30,
    },
    deliveryPartner: {
      name: { type: String, default: "Murugan S." },
      phone: { type: String, default: "+91 98765 43210" },
      rating: { type: Number, default: 4.8 },
      vehicle: { type: String, default: "Hero Splendor (TN-58-AB-1234)" },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
