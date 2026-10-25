import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiShoppingCart } from "react-icons/fi";

import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Offers from "./pages/Offers";
import Help from "./pages/Help";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import RestaurantDetails from "./pages/RestauranDetails";
import RestaurantMenu from "./pages/RestaurantMenu";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";

function App() {
  const { darkMode } = useTheme();
  const { user, openLoginDrawer } = useAuth();

  // CART STATE
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });

  // SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ADD TO CART (Requires Sign In)
  const addToCart = (item) => {
    if (!user) {
      toast.warning("Please Sign In first to add items to your cart! 🔐", {
        autoClose: 3000,
      });
      openLoginDrawer();
      return;
    }

    const itemId = item._id || item.id;
    setCart((previousCart) => {
      const exists = previousCart.find(
        (cartItem) => (cartItem._id || cartItem.id) === itemId
      );

      if (exists) {
        return previousCart.map((cartItem) =>
          (cartItem._id || cartItem.id) === itemId
            ? {
                ...cartItem,
                quantity: (cartItem.quantity || 1) + 1,
              }
            : cartItem
        );
      }

      return [
        ...previousCart,
        {
          ...item,
          quantity: 1,
        },
      ];
    });

    toast.success(`${item.name} added to cart! 🛒`);
  };

  // REMOVE ITEM
  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => (item._id || item.id) !== id)
    );
  };

  // INCREASE QUANTITY
  const increaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        (item._id || item.id) === id
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      )
    );
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          (item._id || item.id) === id
            ? {
                ...item,
                quantity: (item.quantity || 1) - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // CLEAR CART
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // TOTALS
  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalCartAmount = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className={darkMode ? "dark" : "light"}>
      <BrowserRouter>
        <Navbar cart={cart} />

        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <Home
                addToCart={addToCart}
                cart={cart}
              />
            }
          />

          {/* SEARCH */}
          <Route
            path="/search"
            element={<Search addToCart={addToCart} />}
          />

          {/* OFFERS */}
          <Route
            path="/offers"
            element={<Offers />}
          />

          {/* HELP */}
          <Route
            path="/help"
            element={<Help />}
          />

          {/* SIGN IN */}
          <Route
            path="/signin"
            element={<SignIn />}
          />

          {/* SIGN UP / REGISTER */}
          <Route
            path="/signup"
            element={<SignUp />}
          />
          <Route
            path="/register"
            element={<SignUp />}
          />

          {/* RESTAURANT DETAILS */}
          <Route
            path="/restaurant/:id"
            element={
              <RestaurantDetails
                addToCart={addToCart}
              />
            }
          />

          {/* RESTAURANT FULL MENU */}
          <Route
            path="/restaurant/:id/menu"
            element={
              <RestaurantMenu
                addToCart={addToCart}
              />
            }
          />

          {/* CART */}
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                removeFromCart={removeFromCart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                clearCart={clearCart}
              />
            }
          />

          {/* CHECKOUT */}
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                setCart={setCart}
                clearCart={clearCart}
              />
            }
          />

          {/* ORDER SUCCESS */}
          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          {/* ORDER HISTORY */}
          <Route
            path="/orders"
            element={<OrderHistory addToCart={addToCart} />}
          />

          {/* LIVE ORDER TRACKING */}
          <Route
            path="/order-track/:id"
            element={<OrderTracking />}
          />
        </Routes>

        {/* FLOATING BOTTOM CART BAR - Appears only when signed in and items are added */}
        {user && totalCartCount > 0 && (
          <div className="floatingBottomCartBar">
            <div className="cartBarInfo">
              <span className="cartBarCount">
                {totalCartCount} {totalCartCount === 1 ? "ITEM" : "ITEMS"}
              </span>
              <span className="cartBarDivider">|</span>
              <span className="cartBarTotal">₹{totalCartAmount}</span>
            </div>
            <Link to="/cart" className="cartBarAction">
              <span>VIEW CART</span>
              <FiShoppingCart className="cartBarIcon" />
            </Link>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={2200}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          theme={darkMode ? "dark" : "light"}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;