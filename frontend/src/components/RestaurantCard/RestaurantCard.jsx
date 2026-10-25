import "./RestaurantCard.css";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function RestaurantCard({ item, favorites = [], toggleFavorite, addToCart }) {
  const navigate = useNavigate();
  const itemId = item._id || item.id;
  const isFavorite = favorites.includes(itemId);

  const handleCardClick = () => {
    navigate(`/restaurant/${itemId}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (toggleFavorite) {
      toggleFavorite(itemId);
    }
  };

  return (
    <div className="restaurantCard" onClick={handleCardClick}>
      <div className="imageContainer">
        <img
          src={item.image}
          alt={item.name}
          onError={(e) => {
            e.target.src = "/restaurants/pizza.jpg";
          }}
        />

        <div className="imageOverlay"></div>

        {item.offer && <div className="offerBadge">{item.offer}</div>}

        <button
          className={`favoriteBtn ${isFavorite ? "active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label="Toggle Favorite"
        >
          {isFavorite ? (
            <FaHeart className="heartIcon filled" />
          ) : (
            <FaRegHeart className="heartIcon" />
          )}
        </button>
      </div>

      <div className="cardInfo">
        <h3 className="restaurantName">{item.name}</h3>

        <div className="ratingTimeRow">
          <span className="ratingBadge">
            <FaStar className="starIcon" /> {item.rating}
          </span>
          <span className="dotSeparator">•</span>
          <span className="deliveryTime">{item.deliveryTime || `${item.timeMinutes || 25} mins`}</span>
        </div>

        <p className="cuisines">
          {Array.isArray(item.cuisines) ? item.cuisines.join(", ") : item.food}
        </p>

        <div className="bottomRow">
          <span className="place">{item.place}</span>
          <span className="price">₹{item.costForTwo || item.price} for two</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;