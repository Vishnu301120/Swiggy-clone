import { useState, useEffect } from "react";
import Skeleton from "../Skeleton/Skeleton";
import "./RestaurantList.css";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import { restaurantApi } from "../../services/api";
import staticRestaurants from "../../data/restaurantData";
import staticMenu from "../../data/menuData";
import { FiFilter, FiX } from "react-icons/fi";

function RestaurantList({ addToCart, selectedCategory, onClearCategory }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Active Filter States
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [rating4Plus, setRating4Plus] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(""); // 'less300', '300-600', ''
  const [sortBy, setSortBy] = useState("");

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (isVegOnly) params.isVeg = true;
      if (rating4Plus) params.minRating = 4.0;
      if (fastDelivery) params.maxDeliveryTime = 25;
      if (offersOnly) params.hasOffer = true;
      if (sortBy) params.sortBy = sortBy;

      if (priceRange === "less300") {
        params.maxPrice = 300;
      } else if (priceRange === "300-600") {
        params.minPrice = 300;
        params.maxPrice = 600;
      }

      const data = await restaurantApi.getAll(params);
      setRestaurants(data);
    } catch (err) {
      console.warn("Using local restaurants fallback:", err.message);
      // Filter locally as fallback
      let list = [...staticRestaurants];
      if (search.trim()) {
        const sLower = search.toLowerCase().trim();
        list = list.filter((r) =>
          r.name.toLowerCase().includes(sLower) ||
          (r.food && r.food.toLowerCase().includes(sLower))
        );
      }
      if (selectedCategory) {
        const catLower = selectedCategory.toLowerCase().trim();
        const matchingMenuRestIds = staticMenu
          ? staticMenu
              .filter(
                (m) =>
                  m.name.toLowerCase().includes(catLower) ||
                  (m.category && m.category.toLowerCase().includes(catLower)) ||
                  (m.description && m.description.toLowerCase().includes(catLower))
              )
              .map((m) => m.restaurantId)
          : [];

        list = list.filter((r) => {
          const inFood = (r.food || "").toLowerCase().includes(catLower);
          const inName = (r.name || "").toLowerCase().includes(catLower);
          const inCuisines = Array.isArray(r.cuisines)
            ? r.cuisines.some((c) => c.toLowerCase().includes(catLower))
            : false;
          const inMenu = matchingMenuRestIds.includes(r.id);
          return inFood || inName || inCuisines || inMenu;
        });
      }
      if (rating4Plus) {
        list = list.filter((r) => r.rating >= 4.0);
      }
      if (isVegOnly) {
        list = list.filter((r) => r.isVegOnly);
      }
      if (fastDelivery) {
        list = list.filter((r) => (r.timeMinutes || 30) <= 25);
      }
      if (offersOnly) {
        list = list.filter((r) => Boolean(r.offer));
      }
      setRestaurants(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [
    search,
    selectedCategory,
    isVegOnly,
    rating4Plus,
    fastDelivery,
    offersOnly,
    priceRange,
    sortBy,
  ]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const hasActiveFilters =
    isVegOnly ||
    rating4Plus ||
    fastDelivery ||
    offersOnly ||
    priceRange !== "" ||
    sortBy !== "" ||
    selectedCategory;

  const resetFilters = () => {
    setIsVegOnly(false);
    setRating4Plus(false);
    setFastDelivery(false);
    setOffersOnly(false);
    setPriceRange("");
    setSortBy("");
    if (onClearCategory) onClearCategory();
  };

  return (
    <section className="restaurantList" id="restaurant-list-section">
      <div className="listHeader">
        <h2>
          {selectedCategory
            ? `Restaurants serving "${selectedCategory}" in Madurai`
            : "Restaurants with online food delivery in Madurai"}
        </h2>
        <span className="restaurantCount">
          {restaurants.length} {restaurants.length === 1 ? "restaurant" : "restaurants"} available
        </span>
      </div>

      {/* Search and Filters Bar */}
      <div className="controlsContainer">
        <div className="searchWrapper">
          <input
            type="text"
            placeholder="Search restaurants or cuisines..."
            className="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clearSearchBtn" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filterSection">
          {/* Active Category Filter Chip */}
          {selectedCategory && (
            <button
              className="filterBtn active selectedCategoryChip"
              onClick={onClearCategory}
              title="Click to show all restaurants"
            >
              🍽️ {selectedCategory} <FiX style={{ marginLeft: "4px" }} />
            </button>
          )}

          {/* Sort Selector */}
          <div className="sortDropdownWrapper">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`sortSelect ${sortBy ? "active" : ""}`}
            >
              <option value="">Sort By: Relevance</option>
              <option value="rating_desc">Rating: High to Low</option>
              <option value="delivery_time_asc">Delivery Time: Fastest</option>
              <option value="cost_asc">Cost: Low to High</option>
              <option value="cost_desc">Cost: High to Low</option>
            </select>
          </div>

          {/* Fast Delivery */}
          <button
            className={`filterBtn ${fastDelivery ? "active" : ""}`}
            onClick={() => setFastDelivery(!fastDelivery)}
          >
            ⚡ Fast Delivery (&lt;25 mins)
          </button>

          {/* Ratings 4.0+ */}
          <button
            className={`filterBtn ${rating4Plus ? "active" : ""}`}
            onClick={() => setRating4Plus(!rating4Plus)}
          >
            ⭐ Ratings 4.0+
          </button>

          {/* Pure Veg */}
          <button
            className={`filterBtn ${isVegOnly ? "active" : ""}`}
            onClick={() => setIsVegOnly(!isVegOnly)}
          >
            <span className="vegIconMini">🟢</span> Pure Veg
          </button>

          {/* Offers */}
          <button
            className={`filterBtn ${offersOnly ? "active" : ""}`}
            onClick={() => setOffersOnly(!offersOnly)}
          >
            🏷️ Offers
          </button>

          {/* Price Range buttons */}
          <button
            className={`filterBtn ${priceRange === "less300" ? "active" : ""}`}
            onClick={() =>
              setPriceRange(priceRange === "less300" ? "" : "less300")
            }
          >
            Less than ₹300
          </button>

          <button
            className={`filterBtn ${priceRange === "300-600" ? "active" : ""}`}
            onClick={() =>
              setPriceRange(priceRange === "300-600" ? "" : "300-600")
            }
          >
            ₹300 - ₹600
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button className="resetFiltersBtn" onClick={resetFilters}>
              <FiX /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Content Grid / Skeleton */}
      {loading ? (
        <Skeleton />
      ) : (
        <div className="restaurantGrid">
          {restaurants.length > 0 ? (
            restaurants.map((item) => (
              <RestaurantCard
                key={item._id || item.id}
                item={item}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addToCart={addToCart}
              />
            ))
          ) : (
            <div className="noResultsContainer">
              <h3>No restaurants match your filters 🔍</h3>
              <p>Try clearing some filters or searching for something else.</p>
              <button className="resetBigBtn" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default RestaurantList;