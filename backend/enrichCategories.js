import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { categories, restaurants, menuItemsByRestaurant } from "./data/seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Add Shawarma dishes and ensure cuisine tags
const shawarmaDishes = [
  {
    name: "Classic Chicken Shawarma Roll",
    price: 150,
    isVeg: false,
    category: "Shawarma",
    description: "Tender roasted marinated chicken shaved off vertical rotisserie, wrapped in rumali with garlic toum mayo and pickled veggies.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=70",
    rating: 4.6,
    ratingCount: 110,
    isBestSeller: true,
    inStock: true
  },
  {
    name: "Special Plate Shawarma with Kubbus",
    price: 210,
    isVeg: false,
    category: "Shawarma",
    description: "Generous portion of succulent diced chicken served with warm Arabic kubbus bread, fries, garlic dip and hummus.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=70",
    rating: 4.8,
    ratingCount: 145,
    isBestSeller: true,
    inStock: true
  },
  {
    name: "Peri Peri Chicken Shawarma",
    price: 165,
    isVeg: false,
    category: "Shawarma",
    description: "Juicy shawarma chicken tossed in spicy African bird's eye peri-peri spice dust with zesty mayo.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=70",
    rating: 4.5,
    ratingCount: 88,
    isBestSeller: false,
    inStock: true
  },
  {
    name: "Falafel Veggie Shawarma",
    price: 130,
    isVeg: true,
    category: "Shawarma",
    description: "Crispy fried spiced chickpea falafel patties wrapped with tahini sauce, fresh cucumber and tomatoes.",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop&q=70",
    rating: 4.3,
    ratingCount: 52,
    isBestSeller: false,
    inStock: true
  }
];

// Add Shawarma to Tibbs Frankie & Rolls
if (menuItemsByRestaurant["Tibbs Frankie & Rolls"]) {
  menuItemsByRestaurant["Tibbs Frankie & Rolls"].push(...shawarmaDishes);
}

// Add Shawarma to Salem RR Biriyani
if (menuItemsByRestaurant["Salem RR Biriyani"]) {
  menuItemsByRestaurant["Salem RR Biriyani"].push(
    shawarmaDishes[0],
    shawarmaDishes[1]
  );
}

// Add Shawarma to Barbeque Nation
if (menuItemsByRestaurant["Barbeque Nation"]) {
  menuItemsByRestaurant["Barbeque Nation"].push(
    shawarmaDishes[1],
    shawarmaDishes[2]
  );
}

// Add Shawarma to Ambur Star Biryani
if (menuItemsByRestaurant["Ambur Star Biryani"]) {
  menuItemsByRestaurant["Ambur Star Biryani"].push(
    shawarmaDishes[0],
    shawarmaDishes[2]
  );
}

// 2. Ensure each restaurant has proper cuisine tags for all 12 categories
restaurants.forEach(r => {
  const name = r.name;
  const currentCuisines = new Set(r.cuisines || []);

  // Shawarma restaurants
  if (["Tibbs Frankie & Rolls", "Salem RR Biriyani", "Barbeque Nation", "Ambur Star Biryani"].includes(name)) {
    currentCuisines.add("Shawarma");
    if (!r.food.includes("Shawarma")) r.food += ", Shawarma";
  }

  // Parotta restaurants
  if (["Salem RR Biriyani", "Dindigul Thalappakatti", "Ambur Star Biryani", "Sabarees Veg Restaurant", "Sree Saravana Bhavan", "Murugan Idli Shop"].includes(name)) {
    currentCuisines.add("Parotta");
    if (!r.food.includes("Parotta")) r.food += ", Parotta";
  }

  // Fried Rice restaurants
  if (["Chinese Wok", "Mainland China", "Wow! Momo & Chinese", "Salem RR Biriyani", "Dindigul Thalappakatti"].includes(name)) {
    currentCuisines.add("Fried Rice");
    if (!r.food.includes("Fried Rice")) r.food += ", Fried Rice";
  }

  // Cakes restaurants
  if (["The Belgian Waffle Co.", "Baskin Robbins", "Starbucks Coffee", "Pizza Hut", "Dominos Pizza", "KFC - Kentucky Fried Chicken"].includes(name)) {
    currentCuisines.add("Cakes");
    if (!r.food.includes("Cakes")) r.food += ", Cakes";
  }

  // Ice Cream restaurants
  if (["Baskin Robbins", "Madurai Famous Jigarthanda", "The Belgian Waffle Co.", "Barbeque Nation", "Burger King"].includes(name)) {
    currentCuisines.add("Ice Cream");
    if (!r.food.includes("Ice Cream")) r.food += ", Ice Cream";
  }

  // Burger restaurants
  if (["Burger King", "KFC - Kentucky Fried Chicken", "Wow! Momo & Chinese", "Pizza Hut"].includes(name)) {
    currentCuisines.add("Burger");
    if (!r.food.includes("Burger")) r.food += ", Burger";
  }

  // Pizza restaurants
  if (["Pizza Hut", "Dominos Pizza", "KFC - Kentucky Fried Chicken"].includes(name)) {
    currentCuisines.add("Pizza");
    if (!r.food.includes("Pizza")) r.food += ", Pizza";
  }

  // Biryani restaurants
  if (["Salem RR Biriyani", "Dindigul Thalappakatti", "Ambur Star Biryani", "Bawarchi Dum Biryani", "Barbeque Nation", "Sree Saravana Bhavan", "A2B - Adyar Ananda Bhavan"].includes(name)) {
    currentCuisines.add("Biryani");
    if (!r.food.includes("Biryani")) r.food += ", Biryani";
  }

  // North Indian restaurants
  if (["Barbeque Nation", "Haldirams Sweets & Namkeen", "Bawarchi Dum Biryani", "Sabarees Veg Restaurant", "A2B - Adyar Ananda Bhavan", "Chai Point & Snacks"].includes(name)) {
    currentCuisines.add("North Indian");
    if (!r.food.includes("North Indian")) r.food += ", North Indian";
  }

  // Chinese restaurants
  if (["Chinese Wok", "Mainland China", "Wow! Momo & Chinese", "Salem RR Biriyani", "Tibbs Frankie & Rolls"].includes(name)) {
    currentCuisines.add("Chinese");
    if (!r.food.includes("Chinese")) r.food += ", Chinese";
  }

  // Desserts restaurants
  if (["Madurai Famous Jigarthanda", "The Belgian Waffle Co.", "Baskin Robbins", "Haldirams Sweets & Namkeen", "A2B - Adyar Ananda Bhavan", "Starbucks Coffee", "Dominos Pizza", "Pizza Hut"].includes(name)) {
    currentCuisines.add("Desserts");
    if (!r.food.includes("Desserts")) r.food += ", Desserts";
  }

  r.cuisines = Array.from(currentCuisines);
});

// Write updated backend seedData.js
const seedDataPath = path.join(__dirname, "data", "seedData.js");
const updatedSeedContent = `export const categories = ${JSON.stringify(categories, null, 2)};

export const restaurants = ${JSON.stringify(restaurants, null, 2)};

export const menuItemsByRestaurant = ${JSON.stringify(menuItemsByRestaurant, null, 2)};
`;
fs.writeFileSync(seedDataPath, updatedSeedContent, "utf-8");
console.log("Updated backend/data/seedData.js with enriched cuisines and Shawarma dishes");

// Write updated frontend restaurantData.js
const frontendRestaurants = restaurants.map((r, idx) => ({
  id: idx + 1,
  name: r.name,
  image: r.image,
  rating: r.rating,
  time: r.deliveryTime || "25-30 mins",
  timeMinutes: r.timeMinutes,
  cuisines: r.cuisines,
  food: r.food,
  place: r.place,
  address: r.address,
  offer: r.offer,
  costForTwo: r.costForTwo,
  price: r.price,
  isVegOnly: r.isVegOnly
}));

const frontendDataPath = path.resolve(__dirname, "..", "frontend", "src", "data");
fs.writeFileSync(
  path.join(frontendDataPath, "restaurantData.js"),
  `const restaurantData = ${JSON.stringify(frontendRestaurants, null, 2)};\n\nexport default restaurantData;\n`,
  "utf-8"
);

// Write updated frontend menuData.js
let globalId = 1;
const frontendMenuItems = [];
restaurants.forEach((r, rIdx) => {
  const rItems = menuItemsByRestaurant[r.name] || [];
  rItems.forEach(it => {
    frontendMenuItems.push({
      id: globalId++,
      restaurantId: rIdx + 1,
      name: it.name,
      price: it.price,
      isVeg: it.isVeg,
      category: it.category,
      description: it.description,
      image: it.image,
      rating: it.rating,
      ratingCount: it.ratingCount,
      isBestSeller: it.isBestSeller
    });
  });
});

fs.writeFileSync(
  path.join(frontendDataPath, "menuData.js"),
  `const menuData = ${JSON.stringify(frontendMenuItems, null, 2)};\n\nexport default menuData;\n`,
  "utf-8"
);

console.log(`Updated frontend restaurantData.js (${frontendRestaurants.length} restaurants) and menuData.js (${frontendMenuItems.length} items)`);
