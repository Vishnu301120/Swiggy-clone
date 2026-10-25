import Order from "../models/Order.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Public or Private (supports guest or authenticated users)
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod,
      itemTotal,
      deliveryFee = 30,
      platformFee = 5,
      discount = 0,
      couponCode = "",
      totalAmount,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided in order" });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.address) {
      return res.status(400).json({ message: "Delivery address details are required" });
    }

    const orderCode = `SWG${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    const order = new Order({
      user: req.user ? req.user._id : null,
      orderCode,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      deliveryAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      itemTotal: Number(itemTotal),
      deliveryFee: Number(deliveryFee),
      platformFee: Number(platformFee),
      discount: Number(discount),
      couponCode: couponCode || "",
      totalAmount: Number(totalAmount),
      orderStatus: "Placed",
      estimatedDeliveryMinutes: 28,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const query = req.user ? { user: req.user._id } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order details by orderCode or ObjectId
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let order = await Order.findOne({
      $or: [
        { orderCode: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : []),
      ],
    }).populate("user", "name email phone");

    if (!order) {
      // Return the most recent order if searching for last placed
      if (id === "latest") {
        order = await Order.findOne().sort({ createdAt: -1 });
      }
    }

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Public (for demo tracking progression)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Placed",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({
      $or: [
        { orderCode: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : []),
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
