import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./OrderTracking.css";
import { orderApi } from "../services/api";
import {
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiMapPin,
  FiChevronRight,
  FiArrowLeft,
  FiRotateCw,
} from "react-icons/fi";
import { MdOutlineDeliveryDining, MdOutlineRestaurant } from "react-icons/md";
import { toast } from "react-toastify";

const ORDER_STAGES = [
  { key: "Placed", title: "Order Placed", desc: "We have received your order." },
  { key: "Confirmed", title: "Order Confirmed", desc: "Restaurant has accepted your order." },
  { key: "Preparing", title: "Food in Kitchen", desc: "The chef is preparing your fresh meal." },
  { key: "Out for Delivery", title: "Out for Delivery", desc: "Delivery partner is heading your way." },
  { key: "Delivered", title: "Delivered", desc: "Delivered! Enjoy your delicious food." },
];

function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const fetchOrder = async () => {
    try {
      const data = await orderApi.getById(id);
      setOrder(data);
      const stageIdx = ORDER_STAGES.findIndex((s) => s.key === data.orderStatus);
      setActiveStepIndex(stageIdx >= 0 ? stageIdx : 0);
    } catch (err) {
      console.warn("Falling back to local order for tracking:", err.message);
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const found = savedOrders.find((o) => o.orderCode === id || o._id === id);
      if (found) {
        setOrder(found);
        const stageIdx = ORDER_STAGES.findIndex((s) => s.key === found.orderStatus);
        setActiveStepIndex(stageIdx >= 0 ? stageIdx : 0);
      } else {
        // Mock sample order if accessed directly
        const sample = {
          orderCode: id || "SWG20268801",
          items: [{ name: "Veggie Supreme Pizza", quantity: 1, price: 349 }],
          totalAmount: 384,
          orderStatus: "Preparing",
          deliveryAddress: {
            fullName: "Swiggy Foodie",
            address: "12, South Veli Street",
            city: "Madurai",
          },
          createdAt: new Date().toISOString(),
        };
        setOrder(sample);
        setActiveStepIndex(2);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Handler to advance stage for demo testing
  const handleAdvanceStage = async () => {
    const nextIdx = (activeStepIndex + 1) % ORDER_STAGES.length;
    const nextStatus = ORDER_STAGES[nextIdx].key;

    try {
      await orderApi.updateStatus(id, nextStatus);
      setActiveStepIndex(nextIdx);
      setOrder((prev) => ({ ...prev, orderStatus: nextStatus }));
      toast.success(`Order status updated to: ${nextStatus}`);
    } catch {
      // update state locally
      setActiveStepIndex(nextIdx);
      setOrder((prev) => ({ ...prev, orderStatus: nextStatus }));
      toast.info(`Simulated status: ${nextStatus}`);
    }
  };

  if (loading) {
    return (
      <div className="trackingLoading">
        <div className="spinner"></div>
        <p>Loading live order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="trackingPage">
        <h2>Order Not Found</h2>
        <Link to="/orders">Go to My Orders</Link>
      </div>
    );
  }

  const isDelivered = order.orderStatus === "Delivered";

  return (
    <div className="trackingPage">
      <div className="trackingTopBar">
        <Link to="/orders" className="backToOrdersLink">
          <FiArrowLeft /> All Orders
        </Link>
        <span className="orderCodePill">Order #{order.orderCode || order._id}</span>
      </div>

      <div className="trackingLayout">
        {/* Left Column: Live Progress Stepper */}
        <div className="trackingMainCard">
          <div className="statusHeader">
            <div className="statusPulseWrapper">
              <span className={`pulseDot ${isDelivered ? "delivered" : ""}`}></span>
            </div>
            <div>
              <h1 className="liveStatusTitle">
                {isDelivered
                  ? "Order Delivered! 🎉"
                  : `Estimated Arrival: 25-30 mins`}
              </h1>
              <p className="liveStatusSubtitle">
                {ORDER_STAGES[activeStepIndex]?.desc}
              </p>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="stepperContainer">
            {ORDER_STAGES.map((stage, idx) => {
              const isCompleted = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div
                  key={stage.key}
                  className={`stepRow ${isCompleted ? "completed" : ""} ${
                    isCurrent ? "current" : ""
                  }`}
                >
                  <div className="stepIndicatorCol">
                    <div className="stepDot">
                      {isCompleted ? <FiCheckCircle /> : idx + 1}
                    </div>
                    {idx < ORDER_STAGES.length - 1 && (
                      <div
                        className={`stepLine ${
                          idx < activeStepIndex ? "filled" : ""
                        }`}
                      ></div>
                    )}
                  </div>

                  <div className="stepInfoCol">
                    <h3 className="stepTitle">{stage.title}</h3>
                    <p className="stepDesc">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Simulation Button */}
          <div className="simulationBox">
            <div className="simText">
              <strong>Interactive Demo Controls:</strong>
              <small>Click to advance delivery progress in real-time</small>
            </div>
            <button className="simBtn" onClick={handleAdvanceStage}>
              <FiRotateCw />
              <span>Simulate Next Stage ({ORDER_STAGES[(activeStepIndex + 1) % ORDER_STAGES.length].key})</span>
            </button>
          </div>

          {/* Delivery Partner Card */}
          <div className="deliveryPartnerCard">
            <div className="partnerAvatar">
              <MdOutlineDeliveryDining className="bikeIcon" />
            </div>
            <div className="partnerDetails">
              <h4>Murugan S.</h4>
              <p>Your Swiggy Delivery Partner • ⭐ 4.8</p>
              <small>Hero Splendor (TN-58-AB-1234)</small>
            </div>
            <a
              href="tel:+919876543210"
              className="callPartnerBtn"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Calling delivery partner Murugan (+91 98765 43210)... 📞");
              }}
            >
              <FiPhone /> Call
            </a>
          </div>
        </div>

        {/* Right Column: Order Details */}
        <div className="trackingSidebar">
          <div className="orderDetailsCard">
            <h2>Order Details</h2>

            <div className="deliveryAddressSection">
              <FiMapPin className="addressPin" />
              <div>
                <strong>Delivery Address</strong>
                <p>{order.deliveryAddress?.fullName}</p>
                <p className="subAddress">
                  {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                </p>
              </div>
            </div>

            <hr />

            <div className="itemsSummarySection">
              <strong>Items Ordered ({order.items?.length || 0})</strong>
              <div className="trackingItemsList">
                {order.items?.map((it, idx) => (
                  <div className="trackingItemRow" key={idx}>
                    <span>
                      {it.name} × {it.quantity}
                    </span>
                    <span>₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr />

            <div className="paymentSummarySection">
              <div className="payRow">
                <span>Payment Method</span>
                <span>{order.paymentMethod || "Cash on Delivery"}</span>
              </div>
              <div className="payRow totalPayRow">
                <span>Total Paid</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            <Link to="/" className="continueShoppingBtn">
              Order More Food <FiChevronRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
