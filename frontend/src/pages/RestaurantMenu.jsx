import { useState, useEffect } from "react";
import "./RestaurantMenu.css";
import { Link, useParams } from "react-router-dom";
import { restaurantApi } from "../services/api";
import staticRestaurants from "../data/restaurantData";
import staticMenu from "../data/menuData";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

function RestaurantMenu({ addToCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isVeg, setIsVeg] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    restaurantApi
      .getById(id)
      .then((data) => {
        setRestaurant(data);
        if (data.menu && data.menu.length > 0) {
          setMenu(data.menu);
        } else {
          restaurantApi.getMenu(id).then((m) => setMenu(m));
        }
      })
      .catch((err) => {
        console.warn("Using local fallback:", err.message);
        const rest = staticRestaurants.find((r) => String(r.id) === String(id));
        setRestaurant(rest || staticRestaurants[0]);
        const m = staticMenu.filter((it) => String(it.restaurantId) === String(id));
        setMenu(m.length > 0 ? m : staticMenu.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="menuLoading">
        <div className="spinner"></div>
        <p>Loading full menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="menuPage">
        <h2>Restaurant Not Found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  // Get distinct categories from menu
  const categories = ["All", ...new Set(menu.map((item) => item.category || "Dishes"))];

  const filteredItems = menu.filter((item) => {
    if (isVeg && !item.isVeg) return false;
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="menuPage">
      <div className="menuTopBar">
        <Link to={`/restaurant/${restaurant._id || restaurant.id}`} className="backLink">
          <FiArrowLeft /> Back to Details
        </Link>
        <h1>{restaurant.name} - Full Menu</h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="menuFilterBar">
        <div className="menuSearchInputWrapper">
          <FiSearch className="searchIcon" />
          <input
            type="text"
            placeholder="Search within menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className={`vegBtn ${isVeg ? "active" : ""}`}
          onClick={() => setIsVeg(!isVeg)}
        >
          <span className="badge-veg"></span> Pure Veg
        </button>
      </div>

      {/* Category Tabs */}
      <div className="categoryTabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`catTab ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="menuGrid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div className="menuItemCard" key={item._id || item.id}>
              <div className="menuItemContent">
                <span className={item.isVeg ? "badge-veg" : "badge-nonveg"}></span>
                <h3>{item.name}</h3>
                <span className="menuPrice">₹{item.price}</span>
                <p className="menuDesc">
                  {item.description || "Freshly cooked to order with finest spices."}
                </p>
              </div>

              <div className="menuItemImgWrapper">
                <img
                  src={item.image || "/restaurants/pizza.jpg"}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "/restaurants/pizza.jpg";
                  }}
                />
                <button
                  className="addDishBtn"
                  onClick={() => addToCart(item)}
                >
                  ADD +
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="noDishes">
            <h3>No dishes found</h3>
            <p>Try searching for a different dish name or changing category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantMenu;