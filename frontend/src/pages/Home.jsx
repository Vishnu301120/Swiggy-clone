import { useState } from "react";
import Categories from "../components/Categories/Categories";
import TopRestaurants from "../components/TopRestaurants/TopRestaurants";
import RestaurantList from "../components/RestaurantList/RestaurantList";
import Footer from "../components/Footer/Footer";

function Home({ addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <main className="homePage">
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {!selectedCategory && <TopRestaurants addToCart={addToCart} />}
      <RestaurantList
        addToCart={addToCart}
        selectedCategory={selectedCategory}
        onClearCategory={() => setSelectedCategory("")}
      />
      <Footer />
    </main>
  );
}

export default Home;