import "./TopRestaurants.css";
import { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { restaurantApi } from "../../services/api";
import staticRestaurants from "../../data/restaurantData";
import RestaurantCard from "../RestaurantCard/RestaurantCard";

function TopRestaurants({ addToCart }) {
  const sliderRef = useRef(null);
  const [restaurants, setRestaurants] = useState(staticRestaurants);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    restaurantApi
      .getAll({ sortBy: "rating_desc" })
      .then((data) => {
        if (data && data.length > 0) {
          setRestaurants(data);
        }
      })
      .catch((err) => {
        console.warn("Using local top restaurants fallback:", err.message);
      });
  }, []);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <section className="topRestaurants">
      <div className="topHeader">
        <h2>Top restaurant chains in Madurai</h2>

        <div className="sliderButtons">
          <button onClick={scrollLeft} aria-label="Scroll Left">
            <FiChevronLeft />
          </button>

          <button onClick={scrollRight} aria-label="Scroll Right">
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="restaurantSlider" ref={sliderRef}>
        {restaurants.map((item) => (
          <div className="topRestItemWrapper" key={item._id || item.id}>
            <RestaurantCard
              item={item}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              addToCart={addToCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopRestaurants;