import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OrderHistory.css";
import { orderApi } from "../services/api";
import { FiPackage, FiClock, FiChevronRight, FiRepeat } from "react-icons/fi";
import { toast } from "react-toastify";

function OrderHistory({ addToCart }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then((data) => {
        if (data && data.length > 0) {
          setOrders(data);
        } else {
          // fallback to localStorage
          const local = JSON.parse(localStorage.getItem("orders") || "[]");
          setOrders(local);
        }
      })
      .catch((err) => {
        console.warn("Using local orders fallback:", err.message);
        const local = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(local);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReorder = (order) => {
    if (addToCart && order.items) {
      order.items.forEach((it) => {
        addToCart(it);
      });
      toast.success("Items added to cart! Redirecting to cart...");
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="orderHistoryLoading">
        <div className="spinner"></div>
        <p>Loading your order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orderHistory">
        <div className="emptyOrdersCard">
          <div className="emptyOrdersIcon">
            <FiPackage />
          </div>
          <h1>No Orders Placed Yet</h1>
          <p>Hungry? Place your first order and track it in real-time!</p>
          <Link to="/" className="browseRestBtn">
            Explore Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orderHistory">
      <div className="orderHistoryHeader">
        <h1>Past Orders & Tracking 📦</h1>
        <p>View all your past orders and live tracking updates</p>
      </div>

      <div className="ordersList">
        {orders.map((order) => {
          const orderId = order.orderCode || order._id || order.id;
          const isDelivered = order.orderStatus === "Delivered";

          return (
            <div className="orderCard" key={orderId}>
              <div className="orderHeader">
                <div>
                  <div className="orderIdRow">
                    <h3>Order #{orderId}</h3>
                    <span
                      className={`statusBadge ${
                        isDelivered ? "delivered" : "inProgress"
                      }`}
                    >
                      {order.orderStatus || "Placed"}
                    </span>
                  </div>
                  <span className="orderDate">
                    <FiClock />{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : order.date || "Recently placed"}
                  </span>
                </div>

                <div className="orderActions">
                  <Link
                    to={`/order-track/${orderId}`}
                    className="trackOrderBtn"
                  >
                    Track Order <FiChevronRight />
                  </Link>
                </div>
              </div>

              <div className="orderItemsList">
                {order.items?.map((item, idx) => (
                  <div className="orderItem" key={idx}>
                    <span>
                      {item.name} × {item.quantity || 1}
                    </span>
                    <span>₹{item.price * (item.quantity || 1)}</span>
                  </div>
                ))}
              </div>

              <div className="orderFooter">
                <button
                  className="reorderBtn"
                  onClick={() => handleReorder(order)}
                >
                  <FiRepeat /> Reorder
                </button>

                <div className="orderTotal">
                  <span>Total Paid:</span>
                  <strong>₹{order.totalAmount || order.total}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderHistory;