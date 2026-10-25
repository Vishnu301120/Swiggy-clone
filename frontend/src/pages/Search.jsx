import { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard/RestaurantCard";
import "./Search.css";
import { restaurantApi } from "../services/api";
import staticRestaurants from "../data/restaurantData";
import { FiSearch, FiX } from "react-icons/fi";

const POPULAR_SEARCHES = [
  "Biryani",
  "Pizza",
  "Dosa",
  "Burger",
  "Chinese",
  "Barbeque",
  "Ice Cream",
  "South Indian",
];

function Search({ addToCart }) {
  const [search, setSearch] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Fetch initial 50+ restaurants on mount
  useEffect(() => {
    restaurantApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setAllRestaurants(data);
          setResults(data);
        } else {
          setAllRestaurants(staticRestaurants);
          setResults(staticRestaurants);
        }
      })
      .catch((err) => {
        console.warn("Using local fallback in search:", err.message);
        setAllRestaurants(staticRestaurants);
        setResults(staticRestaurants);
      });
  }, []);

  // Filter or search whenever search input changes
  useEffect(() => {
    if (!search.trim()) {
      setResults(allRestaurants.length > 0 ? allRestaurants : staticRestaurants);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      restaurantApi
        .getAll({ search: search.trim() })
        .then((data) => setResults(data))
        .catch(() => {
          const sLower = search.toLowerCase().trim();
          const filtered = staticRestaurants.filter(
            (r) =>
              r.name.toLowerCase().includes(sLower) ||
              (r.food && r.food.toLowerCase().includes(sLower)) ||
              (r.place && r.place.toLowerCase().includes(sLower)) ||
              (Array.isArray(r.cuisines) &&
                r.cuisines.some((c) => c.toLowerCase().includes(sLower)))
          );
          setResults(filtered);
        })
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [search, allRestaurants]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="searchPage">
      <div className="searchHero">
        <h1>Search Food & Restaurants</h1>
        <p>Craving something? Find restaurants, cuisines, and popular dishes</p>

        <div className="searchInputContainer">
          <FiSearch className="searchBarIcon" />
          <input
            type="text"
            placeholder="Search for restaurants, dishes, or cuisines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchBox"
            autoFocus
          />
          {search && (
            <button className="clearBtn" onClick={() => setSearch("")}>
              <FiX />
            </button>
          )}
        </div>

        {/* Popular searches suggestions */}
        <div className="popularSearches">
          <span>Popular Cravings:</span>
          <div className="tagCloud">
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                className={`searchTag ${search === tag ? "active" : ""}`}
                onClick={() => setSearch(search === tag ? "" : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="searchResultsArea">
        {loading ? (
          <div className="searchLoading">
            <div className="spinner"></div>
            <p>Searching for delicious food...</p>
          </div>
        ) : (
          <>
            <div className="resultsHeader">
              <h2>
                {search.trim()
                  ? `Found ${results.length} ${results.length === 1 ? "restaurant" : "restaurants"} for "${search}"`
                  : `Explore All Restaurants (${results.length} available in Madurai)`}
              </h2>
            </div>

            {results.length > 0 ? (
              <div className="searchGrid">
                {results.map((item) => (
                  <RestaurantCard
                    key={item._id || item.id}
                    item={item}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="noSearchMatch">
                <h3>No restaurants found matching "{search}"</h3>
                <p>Try searching for a different dish, cuisine, or restaurant name.</p>
                <button
                  className="resetSearchBtn"
                  onClick={() => setSearch("")}
                >
                  View All {allRestaurants.length || 52} Restaurants
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Search;