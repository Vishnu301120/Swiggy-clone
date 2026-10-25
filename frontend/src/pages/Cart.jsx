import { useState } from "react";
import "./Cart.css";
import { useNavigate, Link } from "react-router-dom";
import { FiTrash2, FiTag, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Cart({ cart = [], setCart }) {
  const navigate = useNavigate();
  const { user, openLoginDrawer } = useAuth();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = sessionStorage.getItem("appliedCoupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        (item._id || item.id) === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          (item._id || item.id) === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => (item._id || item.id) !== id));
    toast.info("Item removed from cart");
  };

  const itemTotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const deliveryFee = itemTotal > 499 ? 0 : 30;
  const platformFee = itemTotal > 0 ? 5 : 0;

  // Coupon calculations
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === "SWIGGY50") {
      discountAmount = Math.min(Math.round(itemTotal * 0.5), 100);
    } else if (appliedCoupon.code === "WELCOME20") {
      discountAmount = Math.min(Math.round(itemTotal * 0.2), 60);
    } else if (appliedCoupon.code === "FREEDEL") {
      discountAmount = deliveryFee;
    }
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + platformFee - discountAmount);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "SWIGGY50") {
      const couponObj = { code: "SWIGGY50", desc: "50% OFF up to ₹100" };
      setAppliedCoupon(couponObj);
      sessionStorage.setItem("appliedCoupon", JSON.stringify(couponObj));
      toast.success("Coupon SWIGGY50 applied successfully! 🎉");
      setCouponInput("");
    } else if (code === "WELCOME20") {
      const couponObj = { code: "WELCOME20", desc: "20% OFF up to ₹60" };
      setAppliedCoupon(couponObj);
      sessionStorage.setItem("appliedCoupon", JSON.stringify(couponObj));
      toast.success("Coupon WELCOME20 applied! 🍔");
      setCouponInput("");
    } else if (code === "FREEDEL") {
      const couponObj = { code: "FREEDEL", desc: "Free Delivery applied" };
      setAppliedCoupon(couponObj);
      sessionStorage.setItem("appliedCoupon", JSON.stringify(couponObj));
      toast.success("Free delivery coupon applied! 🛵");
      setCouponInput("");
    } else {
      toast.error("Invalid coupon code. Try SWIGGY50 or WELCOME20");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem("appliedCoupon");
    toast.info("Coupon removed");
  };

  const handleProceedToCheckout = () => {
    // Store checkout bill details in sessionStorage
    const checkoutDetails = {
      itemTotal,
      deliveryFee,
      platformFee,
      discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      grandTotal,
    };
    sessionStorage.setItem("checkoutBill", JSON.stringify(checkoutDetails));
    navigate("/checkout");
  };

  if (!user) {
    return (
      <div className="empty-cart-page">
        <div className="emptyCartCard">
          <div className="emptyIconWrapper">
            <FiShoppingBag className="emptyBagIcon" />
          </div>
          <h1>Please Sign In to View Your Cart</h1>
          <p>Sign in to your account to add items, view your cart, and complete your order.</p>
          <button onClick={openLoginDrawer} className="seeRestaurantsBtn">
            Sign In Now 🔐
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart-page">
        <div className="emptyCartCard">
          <div className="emptyIconWrapper">
            <FiShoppingBag className="emptyBagIcon" />
          </div>
          <h1>Your Cart is Empty</h1>
          <p>Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
          <Link to="/" className="seeRestaurantsBtn">
            See Restaurants Near You
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cartHeader">
        <h1>Secure Checkout ({cart.length} items)</h1>
      </div>

      <div className="cartLayout">
        {/* Left: Items list */}
        <div className="cartItemsContainer">
          <div className="itemsCard">
            <h2>Order Items</h2>

            <div className="cartList">
              {cart.map((item) => {
                const itemId = item._id || item.id;
                return (
                  <div className="cartItemRow" key={itemId}>
                    <div className="itemThumb">
                      <img
                        src={item.image || "/restaurants/pizza.jpg"}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "/restaurants/pizza.jpg";
                        }}
                      />
                    </div>

                    <div className="itemDetails">
                      <div className="itemNameRow">
                        <span
                          className={item.isVeg !== false ? "badge-veg" : "badge-nonveg"}
                        ></span>
                        <span className="cartItemName">{item.name}</span>
                      </div>
                      <span className="cartItemPrice">₹{item.price} each</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="cartQtyControls">
                      <button
                        onClick={() => decreaseQuantity(itemId)}
                        className="qtyBtn"
                      >
                        -
                      </button>
                      <span className="qtyNum">{item.quantity || 1}</span>
                      <button
                        onClick={() => increaseQuantity(itemId)}
                        className="qtyBtn"
                      >
                        +
                      </button>
                    </div>

                    <div className="itemTotalCol">
                      <span className="itemRowTotal">
                        ₹{item.price * (item.quantity || 1)}
                      </span>
                      <button
                        onClick={() => removeItem(itemId)}
                        className="deleteItemBtn"
                        title="Remove"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available coupons banner */}
          <div className="availableCouponsCard">
            <div className="couponBannerTitle">
              <FiTag className="tagIcon" />
              <span>Available Coupons</span>
            </div>
            <div className="couponPills">
              <span
                className="couponPill"
                onClick={() => setCouponInput("SWIGGY50")}
              >
                SWIGGY50 (50% OFF)
              </span>
              <span
                className="couponPill"
                onClick={() => setCouponInput("WELCOME20")}
              >
                WELCOME20 (20% OFF)
              </span>
              <span
                className="couponPill"
                onClick={() => setCouponInput("FREEDEL")}
              >
                FREEDEL (Free Delivery)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Bill Summary */}
        <div className="billSidebar">
          {/* Coupon Input Box */}
          <div className="couponCard">
            <h3>Apply Coupon</h3>
            {appliedCoupon ? (
              <div className="appliedCouponBox">
                <div>
                  <strong>{appliedCoupon.code}</strong>
                  <small>{appliedCoupon.desc}</small>
                </div>
                <button onClick={removeCoupon} className="removeCouponBtn">
                  Remove
                </button>
              </div>
            ) : (
              <div className="couponInputRow">
                <input
                  type="text"
                  placeholder="Enter Coupon Code (e.g. SWIGGY50)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button onClick={applyCoupon} className="applyBtn">
                  APPLY
                </button>
              </div>
            )}
          </div>

          {/* Bill details */}
          <div className="billDetailsCard">
            <h3>Bill Details</h3>

            <div className="billRow">
              <span>Item Total</span>
              <span>₹{itemTotal}</span>
            </div>

            <div className="billRow">
              <span>
                Delivery Fee {itemTotal > 499 && <small className="freeTag">FREE</small>}
              </span>
              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>

            <div className="billRow">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>

            {discountAmount > 0 && (
              <div className="billRow discountRow">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            <div className="billDivider"></div>

            <div className="billRow grandTotalRow">
              <span>TO PAY</span>
              <span>₹{grandTotal}</span>
            </div>

            <button
              className="checkoutProceedBtn"
              onClick={handleProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;