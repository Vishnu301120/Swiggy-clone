import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Restaurant from "./models/Restaurant.js";
import MenuItem from "./models/MenuItem.js";
import Category from "./models/Category.js";
import Order from "./models/Order.js";
import { categories, restaurants, menuItemsByRestaurant } from "./data/seedData.js";
import connectDB from "./config/db.js";

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing records
    await User.deleteMany();
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();

    console.log(" Cleared existing data");

    // 1. Create demo users
    const demoUser = await User.create({
      name: "Swiggy Foodie",
      email: "demo@swiggy.com",
      password: "password123",
      phone: "+91 98765 43210",
      address: {
        street: "12, South Veli Street",
        city: "Madurai",
        pincode: "625001",
      },
      role: "user",
    });

    await User.create({
      name: "Admin Manager",
      email: "admin@swiggy.com",
      password: "adminpassword123",
      phone: "+91 99887 76655",
      address: {
        street: "Admin Block, KK Nagar",
        city: "Madurai",
        pincode: "625020",
      },
      role: "admin",
    });

    console.log(" Demo users created (demo@swiggy.com / password123)");

    // 2. Insert Categories
    await Category.insertMany(categories);
    console.log(` Created ${categories.length} categories`);

    // 3. Insert Restaurants & Menu Items
    let totalMenus = 0;
    for (let i = 0; i < restaurants.length; i++) {
      const restData = restaurants[i];
      const createdRestaurant = await Restaurant.create(restData);

      const menuList = menuItemsByRestaurant[restData.name] || [];
      const itemsToInsert = menuList.map((m) => ({
        ...m,
        restaurant: createdRestaurant._id,
        restaurantId: i + 1, // legacy numeric ID compatibility
      }));

      if (itemsToInsert.length > 0) {
        await MenuItem.insertMany(itemsToInsert);
        totalMenus += itemsToInsert.length;
      }
    }

    console.log(` Created ${restaurants.length} restaurants and ${totalMenus} menu items`);

    // 4. Create an initial sample order for the demo user
    const firstRestaurant = await Restaurant.findOne();
    const sampleItems = await MenuItem.find({ restaurant: firstRestaurant._id }).limit(2);

    if (sampleItems.length > 0) {
      const itemTotal = sampleItems.reduce((acc, it) => acc + it.price, 0);
      await Order.create({
        user: demoUser._id,
        orderCode: "SWG20268801",
        items: sampleItems.map((it) => ({
          name: it.name,
          quantity: 1,
          price: it.price,
          image: it.image,
          menuItem: it._id,
        })),
        deliveryAddress: {
          fullName: demoUser.name,
          phone: demoUser.phone,
          address: demoUser.address.street,
          city: demoUser.address.city,
          pincode: demoUser.address.pincode,
        },
        paymentMethod: "Online Payment",
        paymentStatus: "Paid",
        itemTotal,
        deliveryFee: 30,
        platformFee: 5,
        discount: 50,
        couponCode: "SWIGGY50",
        totalAmount: itemTotal + 30 + 5 - 50,
        orderStatus: "Delivered",
        estimatedDeliveryMinutes: 0,
      });
      console.log(" Created demo order history");
    }

    console.log("🎉 Database Seeded Successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    throw error;
  }
};

// If run directly from terminal: `node seeder.js`
if (process.argv[1] && process.argv[1].endsWith("seeder.js")) {
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}
