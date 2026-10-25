import { Link, useLocation } from "react-router-dom";
import "./OrderSuccess.css";
import { FiCheck, FiShoppingBag, FiTruck } from "react-icons/fi";

function OrderSuccess() {
  const location = useLocation();

  // Try to get latest order code from localStorage or state
  const latestOrderCode = (() => {
    if (location.state?.orderCode) return location.state.orderCode;
    try {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      if (orders.length > 0) {
        return orders[0].orderCode || orders[0]._id;
      }
    } catch {}
    return "SWG20268801";
  })();

  return (
    <div className="successPage">
      <div className="successCard">
        <div className="successIcon">
          <FiCheck />
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="successSub">
          Thank you for ordering with Swiggy. The restaurant has confirmed your order.
        </p>

        <div className="orderBadgeBox">
          <span>Order ID</span>
          <strong>#{latestOrderCode}</strong>
        </div>

        <p className="etaNotice">
          🛵 Your fresh food is being prepared and will be delivered in <strong>25-30 minutes</strong>.
        </p>

        <div className="successCtaRow">
          <Link to={`/order-track/${latestOrderCode}`} className="trackBtn">
            <FiTruck /> Track Order Live
          </Link>

          <Link to="/orders" className="historyBtn">
            View All Orders
          </Link>

          <Link to="/" className="homeLink">
            <FiShoppingBag /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;