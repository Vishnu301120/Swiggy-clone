import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../services/api";
import { toast } from "react-toastify";
import { FiMapPin, FiCreditCard, FiCheckCircle } from "react-icons/fi";

function Checkout({ cart = [], setCart, clearCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Retrieve calculated bill from sessionStorage or fallback
  const billInfo = (() => {
    try {
      const saved = sessionStorage.getItem("checkoutBill");
      return saved
        ? JSON.parse(saved)
        : {
            itemTotal: cart.reduce((acc, i) => acc + i.price * (i.quantity || 1), 0),
            deliveryFee: 30,
            platformFee: 5,
            discountAmount: 0,
            couponCode: "",
            grandTotal: cart.reduce((acc, i) => acc + i.price * (i.quantity || 1), 0) + 35,
          };
    } catch {
      return {
        itemTotal: 0,
        deliveryFee: 30,
        platformFee: 5,
        discountAmount: 0,
        couponCode: "",
        grandTotal: 35,
      };
    }
  })();

  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [address, setAddress] = useState(user?.address?.street || "12, South Veli Street, Periyar");
  const [city, setCity] = useState(user?.address?.city || "Madurai");
  const [pincode, setPincode] = useState(user?.address?.pincode || "625001");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/cart");
      return;
    }

    if (!fullName || !phone || !address) {
      toast.error("Please fill in your delivery details.");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image,
      })),
      deliveryAddress: {
        fullName,
        phone,
        address,
        city,
        pincode,
      },
      paymentMethod,
      itemTotal: billInfo.itemTotal,
      deliveryFee: billInfo.deliveryFee,
      platformFee: billInfo.platformFee,
      discount: billInfo.discountAmount,
      couponCode: billInfo.couponCode,
      totalAmount: billInfo.grandTotal,
    };

    try {
      const createdOrder = await orderApi.create(orderPayload);
      toast.success("🎉 Order placed successfully!");
      if (clearCart) clearCart();
      else setCart([]);
      sessionStorage.removeItem("appliedCoupon");
      sessionStorage.removeItem("checkoutBill");

      // Redirect to interactive order tracking page!
      const trackId = createdOrder.orderCode || createdOrder._id;
      navigate(`/order-track/${trackId}`);
    } catch (error) {
      console.warn("Backend order creation fallback:", error.message);
      // Fallback local order creation
      const mockOrderCode = `SWG${Date.now().toString().slice(-6)}`;
      const localOrder = {
        ...orderPayload,
        orderCode: mockOrderCode,
        _id: mockOrderCode,
        createdAt: new Date().toISOString(),
        orderStatus: "Placed",
      };

      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([localOrder, ...existingOrders]));

      if (clearCart) clearCart();
      else setCart([]);
      toast.success("Order Placed Successfully!");
      navigate(`/order-track/${mockOrderCode}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkoutHeader">
        <h1>Checkout</h1>
        <p>Complete your delivery and payment details</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-container">
        {/* Delivery Details Form */}
        <div className="delivery-form-card">
          <div className="cardHeaderRow">
            <FiMapPin className="sectionIcon" />
            <h2>1. Delivery Address</h2>
          </div>

          <div className="formGrid">
            <div className="inputField">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Receiver's name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="inputField">
              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="inputField fullWidth">
              <label>Complete Street Address *</label>
              <textarea
                placeholder="Flat / House no., Street, Area, Landmark"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="inputField">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="inputField">
              <label>Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
          </div>

          <div className="cardHeaderRow paymentHeader">
            <FiCreditCard className="sectionIcon" />
            <h2>2. Payment Option</h2>
          </div>

          <div className="paymentOptions">
            <label className={`paymentCard ${paymentMethod === "Cash on Delivery" ? "selected" : ""}`}>
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="paymentInfo">
                <strong>Cash on Delivery (COD)</strong>
                <small>Pay with cash or UPI scanner upon arrival</small>
              </div>
            </label>

            <label className={`paymentCard ${paymentMethod === "Online Payment" ? "selected" : ""}`}>
              <input
                type="radio"
                name="payment"
                value="Online Payment"
                checked={paymentMethod === "Online Payment"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="paymentInfo">
                <strong>Online Payment / UPI / Cards</strong>
                <small>Instant simulated mock payment gateway</small>
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary-card">
          <h2>Order Summary</h2>

          <div className="summaryItemsList">
            {cart.map((item) => (
              <div className="summary-item" key={item._id || item.id}>
                <div className="summaryItemTitle">
                  <span className={item.isVeg !== false ? "badge-veg" : "badge-nonveg"}></span>
                  <span>
                    {item.name} × {item.quantity || 1}
                  </span>
                </div>
                <span className="summaryItemPrice">
                  ₹{item.price * (item.quantity || 1)}
                </span>
              </div>
            ))}
          </div>

          <div className="summaryBill">
            <div className="billLine">
              <span>Item Total</span>
              <span>₹{billInfo.itemTotal}</span>
            </div>
            <div className="billLine">
              <span>Delivery Fee</span>
              <span>{billInfo.deliveryFee === 0 ? "FREE" : `₹${billInfo.deliveryFee}`}</span>
            </div>
            <div className="billLine">
              <span>Platform Fee</span>
              <span>₹{billInfo.platformFee}</span>
            </div>
            {billInfo.discountAmount > 0 && (
              <div className="billLine discountLine">
                <span>Coupon ({billInfo.couponCode})</span>
                <span>-₹{billInfo.discountAmount}</span>
              </div>
            )}
            <hr />
            <div className="billLine totalLine">
              <span>Total Amount</span>
              <span>₹{billInfo.grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            className="placeOrderSubmitBtn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Placing Order..."
            ) : (
              <>
                <FiCheckCircle />
                <span>Place Order • ₹{billInfo.grandTotal}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;