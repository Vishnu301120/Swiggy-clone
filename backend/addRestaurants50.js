import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { categories, restaurants as existingRestaurants, menuItemsByRestaurant as existingMenuItems } from "./data/seedData.js";
import connectDB from "./config/db.js";
import { seedDatabase } from "./seeder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Distinct high-resolution Unsplash food photography images
const foodImages = {
  biryani: [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?w=500&auto=format&fit=crop&q=70"
  ],
  parotta: [
    "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1610057099433-d532123d4c0f?w=500&auto=format&fit=crop&q=70"
  ],
  southIndian: [
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=500&auto=format&fit=crop&q=70"
  ],
  northIndian: [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=70"
  ],
  shawarma: [
    "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?w=500&auto=format&fit=crop&q=70"
  ],
  chinese: [
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=70"
  ],
  burger: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop&q=70"
  ],
  pizza: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=70"
  ],
  desserts: [
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=70"
  ],
  iceCream: [
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1560008511-11c63416e52d?w=500&auto=format&fit=crop&q=70"
  ],
  beverages: [
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=70"
  ]
};

// 28 New authentic restaurants
const newRestaurantsList = [
  {
    name: "Kumar Mess",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=75",
    rating: 4.6,
    deliveryTime: "20-25 mins",
    timeMinutes: 22,
    cuisines: ["South Indian", "Biryani", "Parotta", "Chettinad", "Non-Veg Thali"],
    food: "South Indian, Biryani, Parotta, Chettinad, Non-Veg Thali",
    place: "Simmakkal",
    address: "12, Workshop Road, Simmakkal, Madurai",
    offer: "FLAT ₹100 OFF",
    costForTwo: 450,
    price: 380,
    isVegOnly: false,
    isFeatured: true,
    theme: "chettinad"
  },
  {
    name: "Amma Mess",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=75",
    rating: 4.5,
    deliveryTime: "20-25 mins",
    timeMinutes: 20,
    cuisines: ["South Indian", "Biryani", "Parotta", "Seafood", "Street Food"],
    food: "South Indian, Biryani, Parotta, Seafood, Street Food",
    place: "Mattuthavani",
    address: "Alagar Kovil Main Road, Mattuthavani, Madurai",
    offer: "ITEMS AT ₹149",
    costForTwo: 400,
    price: 350,
    isVegOnly: false,
    isFeatured: true,
    theme: "chettinad"
  },
  {
    name: "Konar Mess",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&auto=format&fit=crop&q=75",
    rating: 4.6,
    deliveryTime: "15-20 mins",
    timeMinutes: 18,
    cuisines: ["South Indian", "Parotta", "Biryani", "Street Food"],
    food: "South Indian, Parotta, Kari Dosa, Biryani, Street Food",
    place: "Sellur",
    address: "North Veli Street, Sellur, Madurai",
    offer: "20% OFF UPTO ₹80",
    costForTwo: 350,
    price: 299,
    isVegOnly: false,
    isFeatured: true,
    theme: "chettinad"
  },
  {
    name: "Muniyandi Vilas",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=75",
    rating: 4.3,
    deliveryTime: "25-30 mins",
    timeMinutes: 25,
    cuisines: ["South Indian", "Biryani", "Parotta", "Chettinad", "Fast Food"],
    food: "South Indian, Biryani, Parotta, Chettinad, Fast Food",
    place: "Town Hall Road",
    address: "Town Hall Road, Madurai Junction, Madurai",
    offer: "₹40 OFF ABOVE ₹199",
    costForTwo: 300,
    price: 250,
    isVegOnly: false,
    isFeatured: false,
    theme: "chettinad"
  },
  {
    name: "Modern Restaurant",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=75",
    rating: 4.4,
    deliveryTime: "15-20 mins",
    timeMinutes: 17,
    cuisines: ["South Indian", "Desserts", "Filter Coffee"],
    food: "South Indian, Pure Veg, Tiffin, Filter Coffee, Desserts",
    place: "Netaji Road",
    address: "102, Netaji Road, Near Meenakshi Temple, Madurai",
    offer: "FLAT ₹50 OFF",
    costForTwo: 250,
    price: 200,
    isVegOnly: true,
    isFeatured: false,
    theme: "veg"
  },
  {
    name: "Gopu Iyengars Tiffin",
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&auto=format&fit=crop&q=75",
    rating: 4.5,
    deliveryTime: "15-20 mins",
    timeMinutes: 16,
    cuisines: ["South Indian", "Desserts", "Filter Coffee"],
    food: "South Indian, Pure Veg, Tiffin, Brahmin Food, Filter Coffee",
    place: "West Chitrai Street",
    address: "West Tower, Near Temple, Madurai",
    offer: "15% OFF",
    costForTwo: 200,
    price: 180,
    isVegOnly: true,
    isFeatured: false,
    theme: "veg"
  },
  {
    name: "Annapoorna Gowrishankar",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=75",
    rating: 4.4,
    deliveryTime: "20-25 mins",
    timeMinutes: 22,
    cuisines: ["South Indian", "North Indian", "Chinese", "Desserts", "Fried Rice"],
    food: "South Indian, Pure Veg, North Indian, Chinese, Desserts",
    place: "Bypass Road",
    address: "Bypass Road, Ponmeni, Madurai",
    offer: "ITEMS AT ₹99",
    costForTwo: 350,
    price: 280,
    isVegOnly: true,
    isFeatured: false,
    theme: "veg"
  },
  {
    name: "Temple City Restaurant",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=75",
    rating: 4.3,
    deliveryTime: "25-30 mins",
    timeMinutes: 26,
    cuisines: ["South Indian", "Biryani", "Parotta", "Chinese", "North Indian", "Fried Rice"],
    food: "South Indian, Biryani, Parotta, Chinese, North Indian",
    place: "Koodal Nagar",
    address: "Dindigul Four Way Track, Madurai",
    offer: "FLAT ₹75 OFF",
    costForTwo: 380,
    price: 320,
    isVegOnly: false,
    isFeatured: false,
    theme: "multi"
  },
  {
    name: "Zaitoon Restaurant",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=75",
    rating: 4.5,
    deliveryTime: "25-30 mins",
    timeMinutes: 24,
    cuisines: ["Shawarma", "Biryani", "North Indian", "Desserts"],
    food: "Arabian, Shawarma, Biryani, Barbeque, North Indian, Desserts",
    place: "KK Nagar",
    address: "80 Feet Road, Anna Nagar Junction, Madurai",
    offer: "20% OFF UPTO ₹120",
    costForTwo: 550,
    price: 480,
    isVegOnly: false,
    isFeatured: true,
    theme: "arabian"
  },
  {
    name: "Arabian Delights",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=75",
    rating: 4.2,
    deliveryTime: "20-25 mins",
    timeMinutes: 20,
    cuisines: ["Shawarma", "Burger", "Fast Food"],
    food: "Arabian, Shawarma, Fast Food, Grill, Burger",
    place: "Goripalayam",
    address: "Goripalayam Main Road, Madurai",
    offer: "FLAT ₹50 OFF",
    costForTwo: 300,
    price: 260,
    isVegOnly: false,
    isFeatured: false,
    theme: "arabian"
  },
  {
    name: "Hotel Supreme - Surya Rooftop",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=75",
    rating: 4.3,
    deliveryTime: "30-35 mins",
    timeMinutes: 30,
    cuisines: ["North Indian", "South Indian", "Chinese", "Desserts", "Fried Rice"],
    food: "North Indian, South Indian, Tandoori, Chinese, Desserts",
    place: "West Perumal Maistry Street",
    address: "Hotel Supreme, Perumal Maistry Street, Madurai",
    offer: "10% OFF",
    costForTwo: 480,
    price: 400,
    isVegOnly: true,
    isFeatured: false,
    theme: "veg"
  },
  {
    name: "Meenakshi Bhavan",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&auto=format&fit=crop&q=75",
    rating: 4.3,
    deliveryTime: "15-20 mins",
    timeMinutes: 18,
    cuisines: ["South Indian", "Desserts"],
    food: "South Indian, Pure Veg, Tiffin, Thali, Sweets",
    place: "Town Hall Road",
    address: "Opp. Madurai Junction Station, Madurai",
    offer: "ITEMS AT ₹89",
    costForTwo: 220,
    price: 190,
    isVegOnly: true,
    isFeatured: false,
    theme: "veg"
  },
  {
    name: "Junior Kuppanna",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=75",
    rating: 4.4,
    deliveryTime: "25-30 mins",
    timeMinutes: 25,
    cuisines: ["Biryani", "South Indian", "Parotta"],
    food: "Biryani, South Indian, Kongu Cuisine, Parotta, Seafood",
    place: "Anna Nagar",
    address: "Kuruvikaran Salai, Anna Nagar, Madurai",
    offer: "FLAT ₹125 OFF",
    costForTwo: 500,
    price: 420,
    isVegOnly: false,
    isFeatured: true,
    theme: "chettinad"
  },
  {
    name: "Copper Chimney",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=75",
    rating: 4.5,
    deliveryTime: "30-35 mins",
    timeMinutes: 28,
    cuisines: ["North Indian", "Biryani", "Desserts"],
    food: "North Indian, Mughlai, Biryani, Kebabs, Desserts",
    place: "KK Nagar",
    address: "East 5th Street, KK Nagar, Madurai",
    offer: "20% OFF UPTO ₹100",
    costForTwo: 600,
    price: 520,
    isVegOnly: false,
    isFeatured: false,
    theme: "northIndian"
  },
  {
    name: "Paradise Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=75",
    rating: 4.3,
    deliveryTime: "25-30 mins",
    timeMinutes: 24,
    cuisines: ["Biryani", "North Indian", "Desserts"],
    food: "Biryani, Hyderabadi, North Indian, Mughlai, Kebabs",
    place: "Kalavasal",
    address: "Bypass Road, Kalavasal, Madurai",
    offer: "ITEMS AT ₹199",
    costForTwo: 450,
    price: 380,
    isVegOnly: false,
    isFeatured: true,
    theme: "biryani"
  },
  {
    name: "Ibaco",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=75",
    rating: 4.7,
    deliveryTime: "15-20 mins",
    timeMinutes: 15,
    cuisines: ["Ice Cream", "Desserts", "Cakes"],
    food: "Ice Cream, Desserts, Cakes, Sundae",
    place: "KK Nagar",
    address: "80 Feet Road, Near Apollo Hospital, Madurai",
    offer: "FLAT ₹50 OFF",
    costForTwo: 300,
    price: 250,
    isVegOnly: true,
    isFeatured: true,
    theme: "iceCream"
  },
  {
    name: "Polar Bear Ice Cream Sundaes",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&auto=format&fit=crop&q=75",
    rating: 4.6,
    deliveryTime: "15-20 mins",
    timeMinutes: 18,
    cuisines: ["Ice Cream", "Desserts"],
    food: "Ice Cream, Desserts, Sundae, Shakes",
    place: "Anna Nagar",
    address: "Sathamangalam, Anna Nagar, Madurai",
    offer: "BUY 1 GET 1 AT ₹49",
    costForTwo: 280,
    price: 240,
    isVegOnly: true,
    isFeatured: false,
    theme: "iceCream"
  },
  {
    name: "WarmOven Cake & Desserts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=75",
    rating: 4.4,
    deliveryTime: "20-25 mins",
    timeMinutes: 22,
    cuisines: ["Cakes", "Desserts"],
    food: "Cakes, Bakery, Desserts, Pastries",
    place: "KK Nagar",
    address: "Mellur Main Road, KK Nagar, Madurai",
    offer: "60% OFF UPTO ₹120",
    costForTwo: 350,
    price: 299,
    isVegOnly: false,
    isFeatured: false,
    theme: "cakes"
  },
  {
    name: "Bakingo",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=75",
    rating: 4.5,
    deliveryTime: "25-30 mins",
    timeMinutes: 25,
    cuisines: ["Cakes", "Desserts"],
    food: "Cakes, Desserts, Pastries, Bakery",
    place: "Anna Nagar",
    address: "Ambika Theater Road, Anna Nagar, Madurai",
    offer: "FLAT ₹100 OFF",
    costForTwo: 400,
    price: 349,
    isVegOnly: false,
    isFeatured: true,
    theme: "cakes"
  },
  {
    name: "Chai Sutta Bar",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=75",
    rating: 4.3,
    deliveryTime: "15-20 mins",
    timeMinutes: 16,
    cuisines: ["Burger", "Fast Food", "Desserts"],
    food: "Beverages, Fast Food, Burger, Snacks, Street Food",
    place: "Goripalayam",
    address: "Near American College, Goripalayam, Madurai",
    offer: "ITEMS AT ₹49",
    costForTwo: 180,
    price: 150,
    isVegOnly: true,
    isFeatured: false,
    theme: "cafe"
  },
  {
    name: "Tea Villa Cafe",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=75",
    rating: 4.4,
    deliveryTime: "20-25 mins",
    timeMinutes: 22,
    cuisines: ["Burger", "Pizza", "Desserts"],
    food: "Cafe, Beverages, Desserts, Italian, Burger, Pizza",
    place: "Bypass Road",
    address: "Ponmeni, Bypass Road, Madurai",
    offer: "15% OFF",
    costForTwo: 380,
    price: 320,
    isVegOnly: false,
    isFeatured: false,
    theme: "cafe"
  },
  {
    name: "Taco Bell",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=75",
    rating: 4.2,
    deliveryTime: "25-30 mins",
    timeMinutes: 24,
    cuisines: ["Burger", "Fast Food"],
    food: "Mexican, Fast Food, Burger, Snacks",
    place: "Vishaal de Mal",
    address: "3rd Floor, Vishaal de Mal, Gokhale Road, Madurai",
    offer: "MEALS STARTING AT ₹129",
    costForTwo: 350,
    price: 299,
    isVegOnly: false,
    isFeatured: false,
    theme: "burger"
  },
  {
    name: "Wendy's Burgers",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=75",
    rating: 4.3,
    deliveryTime: "20-25 mins",
    timeMinutes: 22,
    cuisines: ["Burger", "Fast Food", "Desserts"],
    food: "Burger, Fast Food, American, Beverages, Desserts",
    place: "KK Nagar",
    address: "Near Mattuthavani Bus Stand, KK Nagar, Madurai",
    offer: "FLAT ₹80 OFF",
    costForTwo: 320,
    price: 280,
    isVegOnly: false,
    isFeatured: true,
    theme: "burger"
  },
  {
    name: "Wow! China",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=75",
    rating: 4.2,
    deliveryTime: "20-25 mins",
    timeMinutes: 23,
    cuisines: ["Chinese", "Fried Rice"],
    food: "Chinese, Fried Rice, Noodles, Fast Food",
    place: "Vishaal de Mal",
    address: "Food Court, Vishaal de Mal, Madurai",
    offer: "ITEMS AT ₹119",
    costForTwo: 320,
    price: 270,
    isVegOnly: false,
    isFeatured: false,
    theme: "chinese"
  },
  {
    name: "Beijing Bites",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=75",
    rating: 4.3,
    deliveryTime: "25-30 mins",
    timeMinutes: 25,
    cuisines: ["Chinese", "Fried Rice", "Desserts"],
    food: "Chinese, Fried Rice, Asian, Seafood, Street Food, Desserts",
    place: "Anna Nagar",
    address: "Melur Road, Anna Nagar, Madurai",
    offer: "20% OFF UPTO ₹100",
    costForTwo: 360,
    price: 300,
    isVegOnly: false,
    isFeatured: false,
    theme: "chinese"
  },
  {
    name: "Thalassery Biryani Centre",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=75",
    rating: 4.4,
    deliveryTime: "20-25 mins",
    timeMinutes: 21,
    cuisines: ["Biryani", "South Indian", "Parotta", "Shawarma"],
    food: "Biryani, Malabar, South Indian, Parotta, Shawarma",
    place: "Sellur",
    address: "50 Feet Road, Sellur, Madurai",
    offer: "FLAT ₹60 OFF",
    costForTwo: 380,
    price: 310,
    isVegOnly: false,
    isFeatured: false,
    theme: "malabar"
  },
  {
    name: "Marrybrown",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=75",
    rating: 4.2,
    deliveryTime: "20-25 mins",
    timeMinutes: 22,
    cuisines: ["Burger", "Fast Food", "Desserts"],
    food: "Fast Food, Burger, Fried Chicken, Beverages, Desserts",
    place: "Town Hall Road",
    address: "Near Madurai Railway Junction, Madurai",
    offer: "COMBO AT ₹199",
    costForTwo: 350,
    price: 290,
    isVegOnly: false,
    isFeatured: false,
    theme: "burger"
  },
  {
    name: "Meat and Eat",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=75",
    rating: 4.1,
    deliveryTime: "25-30 mins",
    timeMinutes: 24,
    cuisines: ["Burger", "Shawarma", "Fast Food"],
    food: "Burger, Fast Food, Fried Chicken, Wraps, Shawarma",
    place: "Teppakulam",
    address: "Kamarajar Salai, Teppakulam, Madurai",
    offer: "ITEMS AT ₹99",
    costForTwo: 300,
    price: 250,
    isVegOnly: false,
    isFeatured: false,
    theme: "burger"
  }
];

// Helper to generate 20 authentic menu items for a restaurant
function generateMenuItemsForRestaurant(rest, startImgIdx = 0) {
  const items = [];
  const theme = rest.theme;

  const templates = {
    chettinad: [
      { name: `${rest.name} Special Chicken Biryani`, price: 240, isVeg: false, category: "Biryani", desc: "Aromatic Seeraga Samba rice dum cooked with succulent chicken and Chettinad spices.", img: foodImages.biryani[0] },
      { name: "Special Mutton Chukka Biryani", price: 340, isVeg: false, category: "Biryani", desc: "Tender boneless mutton tossed in pepper chukka layered over fragrant biryani rice.", img: foodImages.biryani[1] },
      { name: "Chettinad Egg Biryani", price: 180, isVeg: false, category: "Biryani", desc: "Classic dum biryani served with double golden fried eggs and spicy salna.", img: foodImages.biryani[2] },
      { name: "Madurai Bun Parotta (2 Pcs)", price: 90, isVeg: true, category: "Parotta", desc: "Crispy outer layer, fluffy soft inside, served with hot aromatic salna.", img: foodImages.parotta[0] },
      { name: "Kothu Parotta (Chicken)", price: 210, isVeg: false, category: "Parotta", desc: "Shredded layered parotta beaten with tender chicken pieces, egg and spicy gravy on tawa.", img: foodImages.parotta[1] },
      { name: "Chilli Parotta", price: 160, isVeg: true, category: "Parotta", desc: "Deep fried parotta pieces tossed with capsicum, onion and special spicy sauce.", img: foodImages.parotta[2] },
      { name: "Famous Madurai Kari Dosa (Mutton)", price: 280, isVeg: false, category: "South Indian", desc: "Three-layered thick dosa topped with fluffy egg omelette and seasoned minced mutton.", img: foodImages.southIndian[0] },
      { name: "Ghee Podi Roast Dosa", price: 140, isVeg: true, category: "South Indian", desc: "Golden thin crispy crepe smeared with pure aromatic cow ghee and spicy gun powder.", img: foodImages.southIndian[1] },
      { name: "Chicken Chukka Varuval", price: 220, isVeg: false, category: "Starters", desc: "Traditional dry roasted country chicken infused with shallots, curry leaves and pepper.", img: foodImages.chettinad ? foodImages.northIndian[0] : foodImages.biryani[3] },
      { name: "Mutton Bone Marrow Omelette", price: 190, isVeg: false, category: "Starters", desc: "Fluffy beaten eggs topped with juicy mutton nalli bone marrow gravy.", img: foodImages.southIndian[2] },
      { name: "Coin Parotta with Chicken Salna (3 Pcs)", price: 110, isVeg: false, category: "Parotta", desc: "Mini flaky coin parottas soaked in fiery Madras style chicken salna.", img: foodImages.parotta[3] },
      { name: "Chicken 65 (Boneless)", price: 190, isVeg: false, category: "Starters", desc: "Crunchy batter fried chicken chunks infused with ginger garlic and curry leaves.", img: foodImages.biryani[4] },
      { name: "Chicken Fried Rice", price: 210, isVeg: false, category: "Fried Rice", desc: "Wok tossed long grain basmati with shredded chicken, scrambled egg and spring onions.", img: foodImages.chinese[0] },
      { name: "Egg Fried Rice", price: 170, isVeg: false, category: "Fried Rice", desc: "Fluffy rice tossed with golden eggs, finely chopped carrots and pepper.", img: foodImages.chinese[1] },
      { name: "Roll Shawarma (Chicken)", price: 140, isVeg: false, category: "Shawarma", desc: "Fresh rumali wrap rolled with shredded rotisserie chicken, garlic toum and pickles.", img: foodImages.shawarma[0] },
      { name: "Plate Shawarma (Chicken)", price: 220, isVeg: false, category: "Shawarma", desc: "Generous serving of spiced juicy chicken with pita bread and house mayo.", img: foodImages.shawarma[1] },
      { name: "Madurai Special Jigarthanda", price: 90, isVeg: true, category: "Desserts", desc: "Traditional royal coolant made with almond gum, reduced milk, nannari and ice cream.", img: foodImages.iceCream[0] },
      { name: "Gulab Jamun with Ice Cream", price: 110, isVeg: true, category: "Desserts", desc: "Warm melt in mouth mawa dumplings served alongside chilled vanilla scoop.", img: foodImages.desserts[0] },
      { name: "Madurai Filter Coffee", price: 40, isVeg: true, category: "Beverages", desc: "Freshly brewed chicory infused decoction with frothy hot creamy milk.", img: foodImages.beverages[0] },
      { name: "Fresh Nannari Sarbath", price: 50, isVeg: true, category: "Beverages", desc: "Refreshing sweet root syrup drink spiked with freshly squeezed lemon juice.", img: foodImages.beverages[1] }
    ],
    veg: [
      { name: "Special Ghee Gobi Roast Dosa", price: 150, isVeg: true, category: "South Indian", desc: "Crispy golden fermented crepe stuffed with spiced tandoori cauliflower florets.", img: foodImages.southIndian[0] },
      { name: "Medu Vada Sambar Dip (2 Pcs)", price: 70, isVeg: true, category: "South Indian", desc: "Crisp golden lentil fritters submerged in piping hot spiced drumstick sambar.", img: foodImages.southIndian[1] },
      { name: "Ghee Pongal with Chutney", price: 100, isVeg: true, category: "South Indian", desc: "Creamy rice and moong dal tempered with crushed black pepper, cumin and cashews.", img: foodImages.southIndian[2] },
      { name: "Mini Tiffin Thali Combo", price: 180, isVeg: true, category: "South Indian", desc: "Mini masala dosa, 1 idli, 1 medu vada, kesari and hot filter coffee.", img: foodImages.southIndian[3] },
      { name: "Paneer Dum Biryani", price: 230, isVeg: true, category: "Biryani", desc: "Fragrant basmati rice dum cooked with marinated cottage cheese cubes and saffron.", img: foodImages.biryani[0] },
      { name: "Veg Hyderabadi Biryani", price: 190, isVeg: true, category: "Biryani", desc: "Fresh garden vegetables infused with mint, fried onions and aromatic whole spices.", img: foodImages.biryani[1] },
      { name: "Paneer Butter Masala", price: 240, isVeg: true, category: "North Indian", desc: "Soft cottage cheese simmered in rich velvety tomato, butter and cashew nut gravy.", img: foodImages.northIndian[0] },
      { name: "Dal Makhani", price: 210, isVeg: true, category: "North Indian", desc: "Slow cooked whole black lentils finished with cream, butter and mild aromatic spices.", img: foodImages.northIndian[1] },
      { name: "Butter Naan (2 Pcs)", price: 90, isVeg: true, category: "North Indian", desc: "Leavened clay oven baked flatbread brushed generously with salted butter.", img: foodImages.northIndian[2] },
      { name: "Veg Schezwan Fried Rice", price: 180, isVeg: true, category: "Fried Rice", desc: "Wok tossed long grain rice with colourful veggies in fiery spicy Schezwan sauce.", img: foodImages.chinese[0] },
      { name: "Veg Hakka Noodles", price: 170, isVeg: true, category: "Chinese", desc: "Thin noodles tossed with crisp cabbage, julienned bell peppers and soy sauce.", img: foodImages.chinese[1] },
      { name: "Crispy Chilli Baby Corn", price: 190, isVeg: true, category: "Chinese", desc: "Golden fried tender baby corn fingers tossed in spicy sweet garlic soya glaze.", img: foodImages.chinese[2] },
      { name: "Madurai Parotta with Veg Kurma (2 Pcs)", price: 100, isVeg: true, category: "Parotta", desc: "Flaky layered parotta served with fragrant coconut vegetable kurma.", img: foodImages.parotta[0] },
      { name: "Paneer Kothu Parotta", price: 180, isVeg: true, category: "Parotta", desc: "Shredded layered parotta tossed with soft paneer chunks, onion and tomato gravy.", img: foodImages.parotta[1] },
      { name: "Falafel Shawarma Roll", price: 130, isVeg: true, category: "Shawarma", desc: "Crispy chickpea herb patties wrapped with fresh salad, tahini and garlic cream.", img: foodImages.shawarma[0] },
      { name: "Rava Kesari with Cashews", price: 80, isVeg: true, category: "Desserts", desc: "Traditional semolina dessert cooked with ghee, roasted cashews and saffron.", img: foodImages.desserts[0] },
      { name: "Carrot Halwa with Pistachio", price: 110, isVeg: true, category: "Desserts", desc: "Slow simmered grated Delhi carrots in sweet condensed milk, ghee and nuts.", img: foodImages.desserts[1] },
      { name: "Royal Falooda Ice Cream", price: 130, isVeg: true, category: "Ice Cream", desc: "Layered rose milk dessert with basil seeds, vermicelli and double ice cream scoop.", img: foodImages.iceCream[0] },
      { name: "Madurai Degree Coffee", price: 45, isVeg: true, category: "Beverages", desc: "Authentic first-decoction degree coffee served steaming hot in steel dabarah.", img: foodImages.beverages[0] },
      { name: "Badam Milk (Hot / Cold)", price: 70, isVeg: true, category: "Beverages", desc: "Rich almond infused saffron milk garnished with crushed slivered almonds.", img: foodImages.beverages[1] }
    ],
    arabian: [
      { name: "Classic Chicken Shawarma Roll", price: 140, isVeg: false, category: "Shawarma", desc: "Juicy marinated slow-roasted chicken rolled in kuboos with creamy garlic toum.", img: foodImages.shawarma[0] },
      { name: "Mexican Spicy Chicken Shawarma", price: 160, isVeg: false, category: "Shawarma", desc: "Smoky spicy chicken loaded with jalapenos, Mexican salsa and peri peri sauce.", img: foodImages.shawarma[1] },
      { name: "BBQ Cheese Shawarma Roll", price: 170, isVeg: false, category: "Shawarma", desc: "Rotisserie chicken loaded with smoky barbecue glaze, melted mozzarella and garlic.", img: foodImages.shawarma[2] },
      { name: "Open Plate Chicken Shawarma", price: 230, isVeg: false, category: "Shawarma", desc: "Large portion of shaved chicken served with 2 warm pita breads, toum and fries.", img: foodImages.shawarma[3] },
      { name: "Alfaham Chicken (Half)", price: 260, isVeg: false, category: "Starters", desc: "Arabian charcoal grilled bone-in chicken infused with Arabian whole spices and yogurt.", img: foodImages.northIndian[0] },
      { name: "Arabian Chicken Mandi Biryani", price: 320, isVeg: false, category: "Biryani", desc: "Fragrant spiced basmati cooked in tandoor steam, served with tender slow-cooked chicken.", img: foodImages.biryani[0] },
      { name: "Zaitoon Special Mutton Biryani", price: 380, isVeg: false, category: "Biryani", desc: "Rich and aromatic Arabic dum biryani layered with soft mutton shanks and nuts.", img: foodImages.biryani[1] },
      { name: "Kerala Coin Parotta (3 Pcs)", price: 90, isVeg: true, category: "Parotta", desc: "Soft flaky mini coin parottas cooked on hot griddle with pure butter.", img: foodImages.parotta[0] },
      { name: "Crispy Chicken Zinger Burger", price: 180, isVeg: false, category: "Burger", desc: "Crispy fried chicken breast fillet with iceberg lettuce and secret herb mayo.", img: foodImages.burger[0] },
      { name: "Double Cheese Chicken Burger", price: 210, isVeg: false, category: "Burger", desc: "Grilled chicken patty topped with double molten cheese and caramelized onions.", img: foodImages.burger[1] },
      { name: "Garlic Butter Naan (2 Pcs)", price: 110, isVeg: true, category: "North Indian", desc: "Tandoori baked fluffy bread topped with minced roasted garlic and fresh coriander.", img: foodImages.northIndian[1] },
      { name: "Butter Chicken Masala", price: 270, isVeg: false, category: "North Indian", desc: "Tandoori chicken pieces simmered in silky tomato cashew sauce with butter.", img: foodImages.northIndian[2] },
      { name: "Schezwan Chicken Fried Rice", price: 220, isVeg: false, category: "Fried Rice", desc: "Flavourful wok tossed basmati with spicy chicken pieces and fiery red schezwan.", img: foodImages.chinese[0] },
      { name: "Hummus with Warm Pita Bread", price: 180, isVeg: true, category: "Starters", desc: "Creamy blended chickpeas, tahini, garlic and extra virgin olive oil.", img: foodImages.southIndian[0] },
      { name: "BBQ Chicken Wings (6 Pcs)", price: 210, isVeg: false, category: "Starters", desc: "Smoky glazed tender chicken wings tossed in tangy barbecue dressing.", img: foodImages.burger[2] },
      { name: "Kunafa with Cream and Pistachio", price: 220, isVeg: true, category: "Desserts", desc: "Golden shredded filo pastry soaked in sugar syrup, filled with thick cream and nuts.", img: foodImages.desserts[0] },
      { name: "Baklava Assorted Box (4 Pcs)", price: 190, isVeg: true, category: "Desserts", desc: "Layered crisp pastry sweetened with honey syrup and crushed pistachios.", img: foodImages.desserts[1] },
      { name: "Saffron Ice Cream Scoop", price: 90, isVeg: true, category: "Ice Cream", desc: "Exotic Arabian saffron infused creamy dessert scoop.", img: foodImages.iceCream[0] },
      { name: "Mint Lime Mojito", price: 90, isVeg: true, category: "Beverages", desc: "Crushed fresh garden mint and zesty lime muddled with sparkling soda.", img: foodImages.beverages[0] },
      { name: "Blue Curacao Lemonade", price: 100, isVeg: true, category: "Beverages", desc: "Vibrant tropical blue citrus cooler served ice chilled.", img: foodImages.beverages[1] }
    ],
    burger: [
      { name: "Classic Crispy Veg Burger", price: 130, isVeg: true, category: "Burger", desc: "Crunchy herb potato patty with fresh lettuce, sliced tomatoes and tangy mayo.", img: foodImages.burger[0] },
      { name: "Spicy Crispy Chicken Burger", price: 180, isVeg: false, category: "Burger", desc: "Crispy breaded spicy chicken patty topped with jalapenos and fiery chilli mayo.", img: foodImages.burger[1] },
      { name: "Double Patty Monster Burger", price: 250, isVeg: false, category: "Burger", desc: "Twin juicy grilled chicken patties with melted cheddar cheese slice and barbecue sauce.", img: foodImages.burger[2] },
      { name: "Paneer Supreme Burger", price: 170, isVeg: true, category: "Burger", desc: "Crispy crumb coated cottage cheese steak with mint mayonnaise and onions.", img: foodImages.burger[3] },
      { name: "Loaded Cheese Peri Peri Fries", price: 130, isVeg: true, category: "Fast Food", desc: "Golden fried French fries dusted with peri peri spice and drizzled with molten cheese.", img: foodImages.burger[0] },
      { name: "Crispy Chicken Popcorn (Large)", price: 180, isVeg: false, category: "Fast Food", desc: "Bite sized crunchy fried chicken nuggets with garlic dip.", img: foodImages.burger[1] },
      { name: "Tandoori Chicken Wrap", price: 160, isVeg: false, category: "Shawarma", desc: "Soft tortilla roll filled with smoky tandoori chicken, sliced onions and spicy mint mayo.", img: foodImages.shawarma[0] },
      { name: "Crispy Chicken Shawarma Roll", price: 150, isVeg: false, category: "Shawarma", desc: "Rumali bread wrapped with crispy fried chicken strips and house garlic spread.", img: foodImages.shawarma[1] },
      { name: "Cheesy Farmhouse Pizza (8 Inch)", price: 260, isVeg: true, category: "Pizza", desc: "Crispy thin crust baked with capsicum, onion, sweet corn and stringy mozzarella.", img: foodImages.pizza[0] },
      { name: "Spicy Chicken Pepperoni Pizza", price: 320, isVeg: false, category: "Pizza", desc: "Classic hand stretched pizza topped with seasoned chicken pepperoni and melted cheese.", img: foodImages.pizza[1] },
      { name: "Chicken Fried Rice & Wings Combo", price: 240, isVeg: false, category: "Fried Rice", desc: "Aromatic wok tossed egg fried rice served with 2 crispy chicken wings.", img: foodImages.chinese[0] },
      { name: "Chicken Hakka Noodles", price: 190, isVeg: false, category: "Chinese", desc: "Stir fried long noodles with juicy chicken strips, shredded cabbage and pepper.", img: foodImages.chinese[1] },
      { name: "Hyderabadi Chicken Biryani Bowl", price: 220, isVeg: false, category: "Biryani", desc: "Convenient single-serve dum biryani loaded with boneless chicken pieces.", img: foodImages.biryani[0] },
      { name: "Coin Parotta Roll (Chicken)", price: 140, isVeg: false, category: "Parotta", desc: "Flaky parotta roll packed with spicy chicken roast and scrambled eggs.", img: foodImages.parotta[0] },
      { name: "Chocolate Lava Cake", price: 99, isVeg: true, category: "Cakes", desc: "Warm chocolate sponge cake with rich molten cocoa center oozing out.", img: foodImages.desserts[0] },
      { name: "Red Velvet Jar Cake", price: 120, isVeg: true, category: "Cakes", desc: "Crumbly red velvet sponge layered with smooth sweet cream cheese frosting.", img: foodImages.desserts[1] },
      { name: "Belgian Chocolate Sundae", price: 140, isVeg: true, category: "Ice Cream", desc: "Two scoops of dark chocolate ice cream drizzled with hot fudge sauce and nuts.", img: foodImages.iceCream[0] },
      { name: "Oreo Cookie Milkshake", price: 120, isVeg: true, category: "Beverages", desc: "Creamy thick shake blended with crunchy Oreo cookies and vanilla ice cream.", img: foodImages.beverages[0] },
      { name: "Cold Coffee with Ice Cream", price: 110, isVeg: true, category: "Beverages", desc: "Chilled espresso blended with full cream milk and topped with vanilla scoop.", img: foodImages.beverages[1] },
      { name: "Iced Lemon Tea", price: 70, isVeg: true, category: "Beverages", desc: "Refreshing brew of black tea with lemon extract, mint and crushed ice.", img: foodImages.beverages[2] }
    ],
    cakes: [
      { name: "Dutch Truffle Chocolate Cake (500g)", price: 450, isVeg: true, category: "Cakes", desc: "Rich moist dark chocolate sponge enveloped in smooth bittersweet chocolate ganache.", img: foodImages.desserts[0] },
      { name: "Red Velvet Cream Cheese Cake (500g)", price: 499, isVeg: true, category: "Cakes", desc: "Velvety crimson cake sponge filled and topped with sweet Philadelphia cream cheese.", img: foodImages.desserts[1] },
      { name: "Black Forest Classic Cake (500g)", price: 420, isVeg: true, category: "Cakes", desc: "Layered chocolate sponge loaded with whipped cream, cherries and dark chocolate curls.", img: foodImages.desserts[2] },
      { name: "Pineapple Fresh Cream Cake (500g)", price: 380, isVeg: true, category: "Cakes", desc: "Light vanilla sponge infused with fresh sweet pineapple chunks and airy dairy cream.", img: foodImages.desserts[3] },
      { name: "New York Baked Cheesecake Slice", price: 190, isVeg: false, category: "Cakes", desc: "Dense, smooth baked cream cheese over buttery graham cracker biscuit crust.", img: foodImages.desserts[0] },
      { name: "Fudge Brownie with Walnuts", price: 110, isVeg: true, category: "Cakes", desc: "Gooey chocolate fudge brownie baked with crunchy roasted Californian walnuts.", img: foodImages.desserts[1] },
      { name: "Choco Chip Pastry Slice", price: 90, isVeg: true, category: "Cakes", desc: "Indulgent single pastry slice coated in chocolate frosting and mini chocolate chips.", img: foodImages.desserts[2] },
      { name: "Blueberry Jar Cake", price: 140, isVeg: true, category: "Cakes", desc: "Decadent dessert jar layered with vanilla sponge and tart Canadian blueberry compote.", img: foodImages.desserts[3] },
      { name: "Death By Chocolate Sundae", price: 180, isVeg: true, category: "Ice Cream", desc: "Layers of hot brownie, dark chocolate ice cream, whipped cream and chocolate fudge.", img: foodImages.iceCream[0] },
      { name: "Almond Praline Ice Cream Tub (500ml)", price: 260, isVeg: true, category: "Ice Cream", desc: "Velvety caramel base packed with roasted almond praline pieces.", img: foodImages.iceCream[1] },
      { name: "Belgian Waffle with Melted Nutella", price: 160, isVeg: true, category: "Desserts", desc: "Golden crisp waffle freshly pressed and smeared with warm hazelnut cocoa spread.", img: foodImages.desserts[0] },
      { name: "Gourmet Cupcake Box (4 Pcs)", price: 210, isVeg: true, category: "Cakes", desc: "Assorted vanilla, chocolate, blueberry and red velvet frosted mini cupcakes.", img: foodImages.desserts[1] },
      { name: "Cheese Garlic Bread (4 Pcs)", price: 140, isVeg: true, category: "Fast Food", desc: "Toasted baguette slices topped with garlic butter and melted golden mozzarella.", img: foodImages.pizza[0] },
      { name: "Veggie Club Sandwich", price: 150, isVeg: true, category: "Fast Food", desc: "Triple layered toasted sandwich with fresh cucumber, tomato, cheese and coleslaw.", img: foodImages.burger[0] },
      { name: "Crispy French Fries (Salted)", price: 100, isVeg: true, category: "Fast Food", desc: "Light and crispy golden potato fries served with tomato ketchup.", img: foodImages.burger[1] },
      { name: "Hot Cappuccino Coffee", price: 90, isVeg: true, category: "Beverages", desc: "Rich espresso topped with velvety steamed milk foam and cocoa dusting.", img: foodImages.beverages[0] },
      { name: "Hazelnut Cold Coffee", price: 130, isVeg: true, category: "Beverages", desc: "Chilled blended coffee flavoured with aromatic roasted hazelnut syrup.", img: foodImages.beverages[1] },
      { name: "Dark Chocolate Thick Shake", price: 140, isVeg: true, category: "Beverages", desc: "Rich and creamy thickshake blended with 70% dark Belgian chocolate.", img: foodImages.beverages[0] },
      { name: "Red Velvet Thick Shake", price: 150, isVeg: true, category: "Beverages", desc: "Decadent milkshake blended with real red velvet cake sponge and ice cream.", img: foodImages.beverages[1] },
      { name: "Mango Mania Milkshake", price: 120, isVeg: true, category: "Beverages", desc: "Sun ripened Alphonso mango pulp blended with rich vanilla ice cream.", img: foodImages.beverages[2] }
    ],
    iceCream: [
      { name: "Death By Chocolate Sundae (Signature)", price: 199, isVeg: true, category: "Ice Cream", desc: "Two scoops of dark chocolate ice cream layered with hot gooey brownie, fudge and nuts.", img: foodImages.iceCream[0] },
      { name: "Madurai Special Jigarthanda Ice Cream", price: 110, isVeg: true, category: "Ice Cream", desc: "Authentic basundi and almond gum flavour blended into rich creamy scoop.", img: foodImages.iceCream[1] },
      { name: "Belgian Dark Chocolate Ice Cream Scoop", price: 85, isVeg: true, category: "Ice Cream", desc: "Deep rich 70% cocoa ice cream made with pure dairy cream.", img: foodImages.iceCream[2] },
      { name: "Alphonso Mango Delight Ice Cream", price: 85, isVeg: true, category: "Ice Cream", desc: "Made with 100% natural Alphonso mango pulp and fresh cream.", img: foodImages.iceCream[3] },
      { name: "Blackcurrant with Raisins Scoop", price: 80, isVeg: true, category: "Ice Cream", desc: "Creamy purple blackcurrant ice cream loaded with sweet soft raisins.", img: foodImages.iceCream[0] },
      { name: "Tender Coconut Ice Cream Scoop", price: 90, isVeg: true, category: "Ice Cream", desc: "Natural and subtle flavour made with fresh tender coconut malai pulp.", img: foodImages.iceCream[1] },
      { name: "Roasted Almond Ice Cream Cake Slice", price: 160, isVeg: true, category: "Cakes", desc: "Layer of moist vanilla cake topped with praline ice cream and toasted almonds.", img: foodImages.desserts[0] },
      { name: "Black Forest Ice Cream Cake Slice", price: 170, isVeg: true, category: "Cakes", desc: "Chocolate sponge topped with vanilla ice cream and dark cherry compote.", img: foodImages.desserts[1] },
      { name: "Nutty Nutella Waffle Sundae", price: 180, isVeg: true, category: "Desserts", desc: "Crisp hot waffle served with scoop of vanilla ice cream, Nutella and nuts.", img: foodImages.desserts[2] },
      { name: "Hot Sizzling Brownie with Vanilla", price: 160, isVeg: true, category: "Desserts", desc: "Served on a cast iron sizzler plate with warm chocolate sauce boiling over vanilla scoop.", img: foodImages.desserts[3] },
      { name: "Fruit Salad with Ice Cream", price: 140, isVeg: true, category: "Desserts", desc: "Seasonal fresh fruit cocktail topped with scoop of natural strawberry ice cream.", img: foodImages.iceCream[2] },
      { name: "Cassata Slice Ice Cream", price: 90, isVeg: true, category: "Ice Cream", desc: "Traditional multi-layered frozen rainbow dessert with sponge cake base.", img: foodImages.iceCream[3] },
      { name: "Gudbud Sundae (Special)", price: 170, isVeg: true, category: "Ice Cream", desc: "Famous tall glass sundae with 3 assorted scoops, dry fruits, jelly and fresh fruits.", img: foodImages.iceCream[0] },
      { name: "Swiss Chocolate Milkshake", price: 130, isVeg: true, category: "Beverages", desc: "Thick chilled shake made with melted Swiss chocolate and milk.", img: foodImages.beverages[0] },
      { name: "Strawberry Thick Shake", price: 120, isVeg: true, category: "Beverages", desc: "Sweet and creamy shake blended with strawberries and rich vanilla cream.", img: foodImages.beverages[1] },
      { name: "Oreo Crunch Thick Shake", price: 140, isVeg: true, category: "Beverages", desc: "Loaded with chocolate sandwich biscuit crumbs and thick ice cream.", img: foodImages.beverages[0] },
      { name: "Kesar Pista Kulfi Stick", price: 60, isVeg: true, category: "Ice Cream", desc: "Traditional slow-boiled reduced milk kulfi infused with royal saffron and pistachios.", img: foodImages.iceCream[1] },
      { name: "Malai Matka Kulfi", price: 80, isVeg: true, category: "Ice Cream", desc: "Served in traditional earthen clay pot with rich clotted cream topping.", img: foodImages.iceCream[2] },
      { name: "Chocolate Ice Cream Roll", price: 120, isVeg: true, category: "Ice Cream", desc: "Fresh tawa rolled ice cream with chocolate chips and chocolate drizzle.", img: foodImages.iceCream[3] },
      { name: "Cold Bournvita Milk", price: 60, isVeg: true, category: "Beverages", desc: "Childhood favourite malt chocolate drink served ice chilled.", img: foodImages.beverages[1] }
    ],
    chinese: [
      { name: "Chicken Schezwan Fried Rice", price: 220, isVeg: false, category: "Fried Rice", desc: "Fiery wok tossed long grain rice with spicy chicken cubes and Schezwan paste.", img: foodImages.chinese[0] },
      { name: "Classic Egg Fried Rice", price: 170, isVeg: false, category: "Fried Rice", desc: "Aromatic basmati tossed with golden scrambled eggs, scallions and white pepper.", img: foodImages.chinese[1] },
      { name: "Veg Schezwan Fried Rice", price: 180, isVeg: true, category: "Fried Rice", desc: "Flavourful rice tossed with baby corn, carrots, beans and fiery house sauce.", img: foodImages.chinese[2] },
      { name: "Mixed Meat Fried Rice (Chicken & Prawn)", price: 260, isVeg: false, category: "Fried Rice", desc: "Special Cantonese style rice with chicken pieces, juicy baby prawns and egg.", img: foodImages.chinese[3] },
      { name: "Chicken Hakka Noodles", price: 210, isVeg: false, category: "Chinese", desc: "Thin stir-fried noodles with julienned vegetables and tender seasoned chicken.", img: foodImages.chinese[4] },
      { name: "Veg Chilli Garlic Noodles", price: 170, isVeg: true, category: "Chinese", desc: "Spicy tossed noodles flavoured with burnt garlic, red chillies and spring onion.", img: foodImages.chinese[0] },
      { name: "Dragon Chicken (Dry)", price: 230, isVeg: false, category: "Chinese", desc: "Crispy fried chicken strips tossed with crunchy cashews, dried red chillies and honey.", img: foodImages.chinese[1] },
      { name: "Chilli Chicken Gravy", price: 220, isVeg: false, category: "Chinese", desc: "Battered chicken chunks in dark savory soya sauce with onions and green bell peppers.", img: foodImages.chinese[2] },
      { name: "Veg Manchurian Dry", price: 170, isVeg: true, category: "Chinese", desc: "Deep fried vegetable balls tossed in fragrant garlic, ginger, coriander and soy.", img: foodImages.chinese[3] },
      { name: "Chicken Steamed Momos (6 Pcs)", price: 150, isVeg: false, category: "Chinese", desc: "Delicate thin wrappers filled with juicy minced chicken, served with spicy red chutney.", img: foodImages.chinese[4] },
      { name: "Crispy Spring Rolls (Veg)", price: 140, isVeg: true, category: "Chinese", desc: "Golden fried rolls stuffed with crunchy seasoned cabbage and glass noodles.", img: foodImages.chinese[0] },
      { name: "Chicken Manchow Soup", price: 120, isVeg: false, category: "Chinese", desc: "Hot and spicy thick broth topped with crispy fried noodles and cilantro.", img: foodImages.chinese[1] },
      { name: "Chicken Dum Biryani", price: 230, isVeg: false, category: "Biryani", desc: "Long grain basmati slow dum cooked with marinated chicken and aromatic spices.", img: foodImages.biryani[0] },
      { name: "Chicken Shawarma Wrap", price: 140, isVeg: false, category: "Shawarma", desc: "Pita wrap stuffed with seasoned chicken strips, garlic sauce and pickled veggies.", img: foodImages.shawarma[0] },
      { name: "Chicken Burger", price: 160, isVeg: false, category: "Burger", desc: "Crispy chicken patty with lettuce and thousand island dressing in toasted bun.", img: foodImages.burger[0] },
      { name: "Malabar Parotta (2 Pcs)", price: 70, isVeg: true, category: "Parotta", desc: "Flaky circular Kerala style layered bread cooked crisp on iron skillet.", img: foodImages.parotta[0] },
      { name: "Honey Chilli Potato", price: 160, isVeg: true, category: "Chinese", desc: "Crispy fried potato fingers coated in sticky honey chilli sauce and sesame seeds.", img: foodImages.chinese[2] },
      { name: "Fried Ice Cream with Chocolate Drizzle", price: 140, isVeg: true, category: "Desserts", desc: "Warm crispy breaded shell enclosing a frozen ball of rich vanilla ice cream.", img: foodImages.iceCream[0] },
      { name: "Chocolate Brownie Pastry", price: 90, isVeg: true, category: "Cakes", desc: "Rich chocolate brownie slice topped with silky chocolate ganache.", img: foodImages.desserts[0] },
      { name: "Iced Peach Tea", price: 80, isVeg: true, category: "Beverages", desc: "Freshly brewed iced black tea with natural sweet peach flavours.", img: foodImages.beverages[0] }
    ],
    cafe: [
      { name: "Classic Crispy Veg Burger", price: 110, isVeg: true, category: "Burger", desc: "Crispy golden potato patty with lettuce, onion and creamy mayonnaise.", img: foodImages.burger[0] },
      { name: "Crispy Chicken Cheese Burger", price: 160, isVeg: false, category: "Burger", desc: "Juicy golden fried chicken patty topped with molten cheddar slice.", img: foodImages.burger[1] },
      { name: "Peri Peri French Fries", price: 90, isVeg: true, category: "Fast Food", desc: "Crispy potato fries dusted with spicy and tangy African peri peri seasoning.", img: foodImages.burger[2] },
      { name: "Cheese Burst Pizza (7 Inch)", price: 210, isVeg: true, category: "Pizza", desc: "Gooey mozzarella cheese stuffed inside the crust, topped with herbs and corn.", img: foodImages.pizza[0] },
      { name: "Chicken Tikka Pizza (7 Inch)", price: 260, isVeg: false, category: "Pizza", desc: "Loaded with spiced roasted chicken tikka, capsicum, red onion and cheese.", img: foodImages.pizza[1] },
      { name: "Chicken Shawarma Roll", price: 130, isVeg: false, category: "Shawarma", desc: "Thin flatbread rolled with spiced chicken slices, garlic mayo and onions.", img: foodImages.shawarma[0] },
      { name: "Egg Fried Rice Bowl", price: 150, isVeg: false, category: "Fried Rice", desc: "Quick wok tossed basmati rice with scrambled egg and spring onions.", img: foodImages.chinese[0] },
      { name: "Chilli Chicken Dry", price: 190, isVeg: false, category: "Chinese", desc: "Crispy chicken pieces tossed with green chillies, garlic and dark soya.", img: foodImages.chinese[1] },
      { name: "Malabar Parotta with Egg Curry (2 Pcs)", price: 110, isVeg: false, category: "Parotta", desc: "Two flaky layered parottas served with rich aromatic egg masala gravy.", img: foodImages.parotta[0] },
      { name: "Mini Chicken Biryani", price: 180, isVeg: false, category: "Biryani", desc: "Wholesome single portion dum biryani with one succulent chicken piece.", img: foodImages.biryani[0] },
      { name: "Kulhad Elaichi Chai", price: 30, isVeg: true, category: "Beverages", desc: "Steaming hot fragrant cardamom tea served in traditional clay pot.", img: foodImages.beverages[0] },
      { name: "Kulhad Masala Chai", price: 35, isVeg: true, category: "Beverages", desc: "Spicy Indian milk tea infused with ginger, cloves and black pepper.", img: foodImages.beverages[1] },
      { name: "Bun Maska with Jam", price: 50, isVeg: true, category: "Fast Food", desc: "Soft Mumbai style bun slathered with pure butter and mixed fruit jam.", img: foodImages.burger[0] },
      { name: "Cheese Maggi", price: 70, isVeg: true, category: "Fast Food", desc: "Everyone's favourite instant 2-minute noodles loaded with grated cheddar.", img: foodImages.chinese[2] },
      { name: "Chicken Club Sandwich", price: 150, isVeg: false, category: "Fast Food", desc: "Grilled triple decker sandwich with chicken shreds, boiled egg and cheese.", img: foodImages.burger[3] },
      { name: "Chocolate Truffle Pastry", price: 80, isVeg: true, category: "Cakes", desc: "Moist chocolate cake slice with dark ganache layer.", img: foodImages.desserts[0] },
      { name: "Belgian Chocolate Ice Cream", price: 85, isVeg: true, category: "Ice Cream", desc: "Scoop of creamy ice cream made with imported Belgian cocoa.", img: foodImages.iceCream[0] },
      { name: "Hot Sizzling Brownie Sundae", price: 150, isVeg: true, category: "Desserts", desc: "Warm walnut brownie served with vanilla ice cream and hot chocolate fudge.", img: foodImages.desserts[1] },
      { name: "Cold Coffee with Vanilla Scoop", price: 90, isVeg: true, category: "Beverages", desc: "Rich creamy blended iced coffee topped with sweet vanilla ice cream.", img: foodImages.beverages[0] },
      { name: "Virgin Mint Mojito", price: 80, isVeg: true, category: "Beverages", desc: "Fizzy lime and mint cooler served over crushed ice.", img: foodImages.beverages[2] }
    ],
    malabar: [
      { name: "Thalassery Chicken Dum Biryani", price: 230, isVeg: false, category: "Biryani", desc: "Authentic Malabar style small grain Kaima rice cooked with tender chicken and ghee.", img: foodImages.biryani[0] },
      { name: "Thalassery Mutton Dum Biryani", price: 340, isVeg: false, category: "Biryani", desc: "Traditional Kerala Muslim wedding style biryani with soft mutton and fried onions.", img: foodImages.biryani[1] },
      { name: "Kerala Coin Parotta (3 Pcs)", price: 80, isVeg: true, category: "Parotta", desc: "Famous soft flaky Kerala layered parotta cooked golden with pure ghee.", img: foodImages.parotta[0] },
      { name: "Chicken Kothu Parotta", price: 200, isVeg: false, category: "Parotta", desc: "Shredded layered parotta stir fried on tawa with chicken curry and eggs.", img: foodImages.parotta[1] },
      { name: "Malabar Chicken Roast", price: 220, isVeg: false, category: "Starters", desc: "Spicy semi-dry chicken roast prepared with Kerala spices, coconut slices and curry leaves.", img: foodImages.southIndian[0] },
      { name: "Chicken Roll Shawarma", price: 130, isVeg: false, category: "Shawarma", desc: "Rumali wrap with rotisserie chicken shreds, garlic sauce and crisp cucumber.", img: foodImages.shawarma[0] },
      { name: "Plate Chicken Shawarma with Kuboos", price: 210, isVeg: false, category: "Shawarma", desc: "Generous mound of seasoned chicken served with 2 kuboos and house mayonnaise.", img: foodImages.shawarma[1] },
      { name: "Chicken 65 Malabar Style", price: 180, isVeg: false, category: "Starters", desc: "Crispy fried boneless chicken bites with spicy red masala and fried green chillies.", img: foodImages.biryani[2] },
      { name: "Chicken Fried Rice", price: 190, isVeg: false, category: "Fried Rice", desc: "Fragrant basmati rice tossed with shredded chicken, eggs and green onions.", img: foodImages.chinese[0] },
      { name: "Egg Fried Rice", price: 160, isVeg: false, category: "Fried Rice", desc: "Simple yet delicious wok tossed rice with eggs, pepper and soy.", img: foodImages.chinese[1] },
      { name: "Chicken Hakka Noodles", price: 190, isVeg: false, category: "Chinese", desc: "Stir fried noodles with tender chicken strips and julienned vegetables.", img: foodImages.chinese[2] },
      { name: "Crispy Chicken Burger", price: 150, isVeg: false, category: "Burger", desc: "Fried chicken patty layered with cheese and garlic herb spread in toasted bun.", img: foodImages.burger[0] },
      { name: "Ghee Dosa with Coconut Chutney", price: 110, isVeg: true, category: "South Indian", desc: "Crispy thin rice crepe roasted with pure desi ghee, served with 3 chutneys.", img: foodImages.southIndian[1] },
      { name: "Erachi Pathiri (2 Pcs)", price: 120, isVeg: false, category: "Starters", desc: "Traditional Malabar rice pancakes stuffed with spiced minced meat.", img: foodImages.southIndian[2] },
      { name: "Chicken Pepper Fry", price: 210, isVeg: false, category: "Starters", desc: "Tender chicken cooked with crushed black peppercorns and aromatic curry leaves.", img: foodImages.biryani[3] },
      { name: "Madurai Special Jigarthanda", price: 80, isVeg: true, category: "Desserts", desc: "Cooling traditional Madurai dessert drink with almond gum and ice cream.", img: foodImages.iceCream[0] },
      { name: "Payasam of the Day", price: 70, isVeg: true, category: "Desserts", desc: "Rich Kerala style sweet pudding made with jaggery, coconut milk and cashews.", img: foodImages.desserts[0] },
      { name: "Black Forest Pastry", price: 80, isVeg: true, category: "Cakes", desc: "Classic chocolate sponge pastry with fresh cream and cherries.", img: foodImages.desserts[1] },
      { name: "Sulaimani Black Tea", price: 30, isVeg: true, category: "Beverages", desc: "Traditional Malabar spiced black tea brewed with cardamom, lemon and mint.", img: foodImages.beverages[0] },
      { name: "Fresh Tender Coconut Shake", price: 90, isVeg: true, category: "Beverages", desc: "Thick creamy shake made from fresh tender coconut flesh and milk.", img: foodImages.beverages[1] }
    ],
    northIndian: [
      { name: "Murgh Makhani (Butter Chicken)", price: 290, isVeg: false, category: "North Indian", desc: "Tandoori chicken pieces cooked in rich tomato, butter and cashew cream gravy.", img: foodImages.northIndian[0] },
      { name: "Paneer Tikka Masala", price: 250, isVeg: true, category: "North Indian", desc: "Charcoal grilled paneer cubes simmered in spiced onion tomato gravy.", img: foodImages.northIndian[1] },
      { name: "Dal Makhani", price: 210, isVeg: true, category: "North Indian", desc: "Slow cooked black lentils simmered overnight with cream and butter.", img: foodImages.northIndian[2] },
      { name: "Butter Garlic Naan (2 Pcs)", price: 110, isVeg: true, category: "North Indian", desc: "Fluffy tandoori bread topped with crushed garlic and fresh coriander.", img: foodImages.northIndian[3] },
      { name: "Tandoori Roti (2 Pcs)", price: 60, isVeg: true, category: "North Indian", desc: "Whole wheat bread baked in clay tandoor oven, brushed with butter.", img: foodImages.northIndian[4] },
      { name: "Dum Pukht Chicken Biryani", price: 270, isVeg: false, category: "Biryani", desc: "Slow cooked Royal Awadhi style basmati rice layered with spiced chicken.", img: foodImages.biryani[0] },
      { name: "Mutton Rogan Josh", price: 360, isVeg: false, category: "North Indian", desc: "Kashmiri style aromatic slow braised mutton curry infused with रतनजोत.", img: foodImages.northIndian[0] },
      { name: "Tandoori Chicken (Half)", price: 260, isVeg: false, category: "Starters", desc: "Bone-in chicken marinated in yogurt and tandoori spices, grilled in clay oven.", img: foodImages.northIndian[1] },
      { name: "Chicken Malai Tikka (6 Pcs)", price: 280, isVeg: false, category: "Starters", desc: "Melt in mouth boneless chicken kebabs coated with cream, cheese and mild spices.", img: foodImages.northIndian[2] },
      { name: "Paneer Malai Tikka (6 Pcs)", price: 240, isVeg: true, category: "Starters", desc: "Tender cottage cheese cubes marinated in rich cashew cream and char grilled.", img: foodImages.northIndian[3] },
      { name: "Chicken Shawarma Roll", price: 150, isVeg: false, category: "Shawarma", desc: "Soft flatbread wrap stuffed with tandoori spiced chicken and garlic yogurt dip.", img: foodImages.shawarma[0] },
      { name: "Crispy Parotta with Gravy (2 Pcs)", price: 90, isVeg: true, category: "Parotta", desc: "Multi-layered flaky griddled flatbread served with rich dal makhani.", img: foodImages.parotta[0] },
      { name: "Chicken Fried Rice", price: 210, isVeg: false, category: "Fried Rice", desc: "Fragrant rice tossed with stir-fried chicken pieces and spring onions.", img: foodImages.chinese[0] },
      { name: "Veg Fried Rice", price: 170, isVeg: true, category: "Fried Rice", desc: "Wok tossed long grain rice with colourful diced garden vegetables.", img: foodImages.chinese[1] },
      { name: "Gulab Jamun (2 Pcs)", price: 80, isVeg: true, category: "Desserts", desc: "Golden fried milk solid dumplings dipped in warm saffron cardamom sugar syrup.", img: foodImages.desserts[0] },
      { name: "Rasmalai (2 Pcs)", price: 110, isVeg: true, category: "Desserts", desc: "Spongy cottage cheese patties steeped in thickened sweetened saffron milk.", img: foodImages.desserts[1] },
      { name: "Kulfi Falooda with Rabdi", price: 140, isVeg: true, category: "Ice Cream", desc: "Kesar pista kulfi served over sweet vermicelli, rose syrup and thickened rabdi.", img: foodImages.iceCream[0] },
      { name: "Warm Chocolate Fudge Cake", price: 110, isVeg: true, category: "Cakes", desc: "Rich slice of dense chocolate fudge cake served warm.", img: foodImages.desserts[2] },
      { name: "Sweet Lassi in Kulhad", price: 80, isVeg: true, category: "Beverages", desc: "Thick chilled churned sweet yogurt topped with malai and pistachios.", img: foodImages.beverages[0] },
      { name: "Mango Lassi", price: 95, isVeg: true, category: "Beverages", desc: "Rich and creamy yogurt smoothie blended with ripe mango puree.", img: foodImages.beverages[1] }
    ]
  };

  const chosenList = templates[theme] || templates.chettinad;

  return chosenList.map((item, idx) => ({
    name: item.name,
    price: item.price,
    isVeg: item.isVeg,
    category: item.category,
    description: item.desc,
    image: item.img,
    rating: Number((4.1 + (idx % 8) * 0.1).toFixed(1)),
    ratingCount: 15 + (idx * 3),
    isBestSeller: idx < 3,
    inStock: true
  }));
}

async function run() {
  console.log("🚀 Starting 52 Restaurants & 1,100+ Menu Items expansion...");

  // Combine restaurants: 24 existing + 28 new = 52 restaurants
  const allRestaurants = [...existingRestaurants];
  const allMenuItems = { ...existingMenuItems };

  for (const newRest of newRestaurantsList) {
    const { theme, ...restData } = newRest;
    allRestaurants.push(restData);
    allMenuItems[restData.name] = generateMenuItemsForRestaurant(newRest);
  }

  console.log(`✅ Total restaurants configured: ${allRestaurants.length}`);
  let totalItemsCount = 0;
  for (const name in allMenuItems) {
    totalItemsCount += allMenuItems[name].length;
  }
  console.log(`✅ Total menu items configured: ${totalItemsCount}`);

  // 1. Write backend/data/seedData.js
  const seedDataCode = `// Generated 52 Restaurants with 1100+ Menu Items
export const categories = ${JSON.stringify(categories, null, 2)};

export const restaurants = ${JSON.stringify(allRestaurants, null, 2)};

export const menuItemsByRestaurant = ${JSON.stringify(allMenuItems, null, 2)};
`;
  fs.writeFileSync(path.join(__dirname, "data/seedData.js"), seedDataCode, "utf8");
  console.log("💾 Updated backend/data/seedData.js");

  // 2. Prepare frontend/src/data/restaurantData.js
  const frontendRestaurants = allRestaurants.map((r, i) => ({
    id: i + 1,
    name: r.name,
    image: r.image,
    rating: r.rating,
    time: r.deliveryTime || `${r.timeMinutes || 25} mins`,
    timeMinutes: r.timeMinutes || 25,
    cuisines: r.cuisines,
    food: r.food,
    place: r.place,
    address: r.address,
    offer: r.offer,
    costForTwo: r.costForTwo,
    price: r.price,
    isVegOnly: r.isVegOnly
  }));

  const restaurantDataCode = `const restaurantData = ${JSON.stringify(frontendRestaurants, null, 2)};\n\nexport default restaurantData;\n`;
  fs.writeFileSync(path.join(__dirname, "../frontend/src/data/restaurantData.js"), restaurantDataCode, "utf8");
  console.log("💾 Updated frontend/src/data/restaurantData.js");

  // 3. Prepare frontend/src/data/menuData.js
  let globalMenuId = 1;
  const frontendMenuItems = [];
  for (let rIdx = 0; rIdx < allRestaurants.length; rIdx++) {
    const rest = allRestaurants[rIdx];
    const items = allMenuItems[rest.name] || [];
    for (const it of items) {
      frontendMenuItems.push({
        id: globalMenuId++,
        restaurantId: rIdx + 1,
        name: it.name,
        price: it.price,
        isVeg: it.isVeg,
        category: it.category,
        description: it.description,
        image: it.image,
        rating: it.rating,
        ratingCount: it.ratingCount,
        isBestSeller: it.isBestSeller,
        inStock: it.inStock
      });
    }
  }

  const menuDataCode = `const menuData = ${JSON.stringify(frontendMenuItems, null, 2)};\n\nexport default menuData;\n`;
  fs.writeFileSync(path.join(__dirname, "../frontend/src/data/menuData.js"), menuDataCode, "utf8");
  console.log(`💾 Updated frontend/src/data/menuData.js (${frontendMenuItems.length} items)`);

  // 4. Reseed MongoDB with all 52 restaurants
  console.log("🌱 Reseeding MongoDB Database now...");
  await connectDB();
  await seedDatabase();
  console.log("🎉 ALL 52 RESTAURANTS AND 1,100+ ITEMS SEEDED SUCCESSFULLY!");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Error in addRestaurants50:", err);
  process.exit(1);
});
