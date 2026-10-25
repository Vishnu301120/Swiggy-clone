import { useRef, useState, useEffect } from "react";
import "./Categories.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { categoryApi } from "../../services/api";
import staticCategories from "../../data/categoryData";

const PRIORITY_ORDER = [
  "Biryani",
  "Parotta",
  "Shawarma",
  "Pizza",
  "Burger",
  "South Indian",
  "Ice Cream",
  "Chinese",
  "Fried Rice",
  "North Indian",
  "Cakes",
  "Desserts",
];

function Categories({ selectedCategory, onSelectCategory }) {
  const sliderRef = useRef(null);
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    categoryApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.warn("Using local categories fallback:", err.message);
      });
  }, []);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  const handleCategoryClick = (catName) => {
    if (onSelectCategory) {
      // Toggle if already selected
      if (selectedCategory === catName) {
        onSelectCategory("");
      } else {
        onSelectCategory(catName);
        setTimeout(() => {
          const element = document.getElementById("restaurant-list-section");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    }
  };

  // Sort by priority so the top favorites are first
  const sortedCategories = [...categories].sort((a, b) => {
    const idxA = PRIORITY_ORDER.indexOf(a.name);
    const idxB = PRIORITY_ORDER.indexOf(b.name);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  return (
    <section className="categories">
      <div className="categoryHeader">
        <h2>What's on your mind?</h2>

        {/* Only < > slider buttons as requested */}
        <div className="sliderButtons">
          <button onClick={scrollLeft} aria-label="Scroll Left" title="Scroll Left">
            <FiChevronLeft />
          </button>

          <button onClick={scrollRight} aria-label="Scroll Right" title="Scroll Right">
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="categoryContainer" ref={sliderRef}>
        {sortedCategories.map((item) => {
          const isSelected = selectedCategory === item.name;
          return (
            <div
              className={`categoryCard ${isSelected ? "selected" : ""}`}
              key={item._id || item.id || item.name}
              onClick={() => handleCategoryClick(item.name)}
              title={item.name}
            >
              <div className="categoryImageWrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "/restaurants/pizza.jpg";
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Categories;