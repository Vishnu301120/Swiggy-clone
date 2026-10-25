import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginDrawer from "../LoginDrawer/LoginDrawer";
import "./Navbar.css";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

import {
  FiSearch,
  FiHelpCircle,
  FiShoppingCart,
  FiUser,
  FiUserPlus,
  FiPackage,
  FiLogOut,
} from "react-icons/fi";
import { RiDiscountPercentLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsBriefcase } from "react-icons/bs";

function Navbar({ cart = [] }) {
  const { user, logout, isLoginDrawerOpen, openLoginDrawer, closeLoginDrawer } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/");
  };

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="logo-link">
            <img
              src="/images/logo.png"
              alt="Swiggy"
              className="logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="logo-text">SWIGGY</span>
          </Link>

          <div className="location">
            <IoLocationOutline className="location-icon" />
            <span className="location-title">Madurai</span>
            <span className="location-subtitle">Tamil Nadu, India</span>
            <MdKeyboardArrowDown className="arrow" />
          </div>
        </div>

        <nav className="nav-right">
          <Link className="navItem" to="/">
            <BsBriefcase className="navIcon" />
            <span>Swiggy Corporate</span>
          </Link>

          <Link className="navItem" to="/search">
            <FiSearch className="navIcon" />
            <span>Search</span>
          </Link>

          <Link className="navItem" to="/offers">
            <RiDiscountPercentLine className="navIcon" />
            <span>Offers</span>
            <span className="navBadge">NEW</span>
          </Link>

          <Link className="navItem" to="/help">
            <FiHelpCircle className="navIcon" />
            <span>Help</span>
          </Link>

          {/* User Section */}
          {user ? (
            <div
              className="navItem userNavItem"
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <div className="userBadge">
                <FiUser className="navIcon" />
                <span className="userName">{user.name.split(" ")[0]}</span>
                <MdKeyboardArrowDown />
              </div>

              {showUserDropdown && (
                <div className="userDropdownMenu">
                  <div className="dropdownHeader">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <hr />
                  <Link
                    to="/orders"
                    className="dropdownItem"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <FiPackage />
                    <span>My Orders</span>
                  </Link>
                  <button className="dropdownItem logoutItem" onClick={handleLogout}>
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="authNavGroup">
              <Link to="/signin" className="navItem signInNavItem" title="Sign In">
                <FiUser className="navIcon" />
                <span>Sign In</span>
              </Link>
              <Link to="/signup" className="navItem signUpNavItem" title="Sign Up / Register">
                <FiUserPlus className="navIcon" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Cart - Only visible when user is signed in AND has added items */}
          {user && totalCartCount > 0 && (
            <Link className="navItem cartIcon activeCartNav" to="/cart" title="View your cart">
              <div className="cartIconWrapper">
                <FiShoppingCart className="navIcon" />
                <span className="cartCount">{totalCartCount}</span>
              </div>
              <span>Cart</span>
            </Link>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="themeBtn"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>

      <LoginDrawer isOpen={isLoginDrawerOpen} closeDrawer={closeLoginDrawer} />
    </header>
  );
}

export default Navbar;