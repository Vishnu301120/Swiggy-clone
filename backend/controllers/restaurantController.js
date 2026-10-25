import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Fetch all restaurants with flexible filtering and sorting
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res) => {
  try {
    const {
      search,
      cuisine,
      category,
      isVeg,
      minRating,
      maxDeliveryTime,
      minPrice,
      maxPrice,
      hasOffer,
      featured,
      sortBy,
    } = req.query;

    let query = {};
    const conditions = [];

    // Text search on name, cuisines, food, place, or menu items
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      const menuRestIds = await MenuItem.find({
        $or: [
          { name: searchRegex },
          { category: searchRegex },
          { description: searchRegex },
        ],
      }).distinct("restaurant");

      conditions.push({
        $or: [
          { _id: { $in: menuRestIds } },
          { name: searchRegex },
          { food: searchRegex },
          { cuisines: { $in: [searchRegex] } },
          { place: searchRegex },
        ],
      });
    }

    // Cuisine / Category filter (matches cuisines, food, name, OR any dishes served by the restaurant)
    const activeCategory = category || cuisine;
    if (activeCategory && activeCategory !== "All") {
      const catRegex = new RegExp(activeCategory.trim(), "i");
      const matchingMenuRestIds = await MenuItem.find({
        $or: [
          { name: catRegex },
          { category: catRegex },
          { description: catRegex },
        ],
      }).distinct("restaurant");

      conditions.push({
        $or: [
          { _id: { $in: matchingMenuRestIds } },
          { cuisines: { $in: [catRegex] } },
          { food: catRegex },
          { name: catRegex },
        ],
      });
    }

    if (conditions.length === 1) {
      Object.assign(query, conditions[0]);
    } else if (conditions.length > 1) {
      query.$and = conditions;
    }

    // Pure Veg filter
    if (isVeg === "true" || isVeg === true) {
      query.isVegOnly = true;
    }

    // Rating filter (e.g. 4.0+)
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Delivery time filter (e.g. fast delivery under 25 mins)
    if (maxDeliveryTime) {
      query.timeMinutes = { $lte: Number(maxDeliveryTime) };
    }

    // Price / Cost filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Has Offer filter
    if (hasOffer === "true" || hasOffer === true) {
      query.offer = { $exists: true, $ne: "" };
    }

    // Featured
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Sorting
    let sort = {};
    if (sortBy === "rating_desc") {
      sort = { rating: -1 };
    } else if (sortBy === "cost_asc") {
      sort = { price: 1 };
    } else if (sortBy === "cost_desc") {
      sort = { price: -1 };
    } else if (sortBy === "delivery_asc" || sortBy === "delivery_time_asc") {
      sort = { timeMinutes: 1 };
    } else {
      sort = { isFeatured: -1, rating: -1 };
    }

    const restaurants = await Restaurant.find(query).sort(sort);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single restaurant with its full menu
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    let restaurant;
    // Check if valid ObjectId or fallback by numeric/custom lookup
    if (mongoose.Types.ObjectId.isValid(id)) {
      restaurant = await Restaurant.findById(id);
    }

    // If not found by ObjectId, check if searching by numeric id (legacy 1, 2, 3...)
    if (!restaurant && !isNaN(Number(id))) {
      const sampleItem = await MenuItem.findOne({ restaurantId: Number(id) });
      if (sampleItem && sampleItem.restaurant) {
        restaurant = await Restaurant.findById(sampleItem.restaurant);
      }
    }

    if (!restaurant) {
      restaurant = await Restaurant.findOne();
    }

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Fetch related menu items
    const queryConditions = [{ restaurant: restaurant._id }];
    if (!isNaN(Number(id))) {
      queryConditions.push({ restaurantId: Number(id) });
    }
    const menuItems = await MenuItem.find({ $or: queryConditions });

    res.json({
      ...restaurant.toObject(),
      menu: menuItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch menu items for a restaurant with category breakdown
// @route   GET /api/restaurants/:id/menu
// @access  Public
export const getRestaurantMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVeg, search, category } = req.query;

    let query = {};

    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or = [{ restaurant: id }];
    } else {
      query.$or = [{ restaurantId: Number(id) }];
    }

    if (isVeg === "true") {
      query.isVeg = true;
    }

    if (category && category !== "All") {
      query.category = new RegExp(category, "i");
    }

    if (search) {
      query.name = new RegExp(search, "i");
    }

    const items = await MenuItem.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
