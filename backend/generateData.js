import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive dictionary of high-resolution Unsplash food images
const foodImages = {
  // Pizzas
  pizza_veggie: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=70",
  pizza_cheese_corn: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=70",
  pizza_margherita: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=70",
  pizza_paneer: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=70",
  pizza_pepperoni: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=70",
  pizza_chicken: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=70",
  pizza_farmhouse: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=70",
  garlic_bread: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&auto=format&fit=crop&q=70",
  stuffed_garlic_bread: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=70",
  chicken_wings: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=70",
  pasta_tomato: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=500&auto=format&fit=crop&q=70",
  pasta_cheese: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&auto=format&fit=crop&q=70",
  dip_sauce: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=70",
  
  // Biryani & Rice
  biryani_chicken: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=70",
  biryani_mutton: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=70",
  biryani_egg: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500&auto=format&fit=crop&q=70",
  biryani_veg: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&auto=format&fit=crop&q=70",
  biryani_hyderabadi: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=70",
  fried_rice: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=70",
  curd_rice: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&auto=format&fit=crop&q=70",
  lemon_rice: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&auto=format&fit=crop&q=70",
  
  // South Indian
  dosa_ghee: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=70",
  dosa_masala: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=70",
  dosa_rava: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=70",
  idli: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=70",
  podi_idli: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=70",
  vada: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=70",
  poori: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=70",
  parotta: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=70",
  kothu_parotta: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=70",
  thali_meals: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=70",
  filter_coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=70",
  
  // Non-Veg Starters & BBQ
  chicken_65: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=70",
  pepper_chicken: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=70",
  chicken_tikka: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=70",
  chicken_tandoori: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=70",
  chicken_crispy: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=70",
  chicken_lollipop: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=70",
  mutton_sukka: "https://images.unsplash.com/photo-1545247181-516773cae754?w=500&auto=format&fit=crop&q=70",
  seekh_kebab: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=70",
  prawns_fry: "https://images.unsplash.com/photo-1559737558-24523a63b0b3?w=500&auto=format&fit=crop&q=70",
  fish_fry: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=70",
  curry_chicken: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=70",
  curry_mutton: "https://images.unsplash.com/photo-1545247181-516773cae754?w=500&auto=format&fit=crop&q=70",
  
  // Tandoor & Curries
  paneer_tikka: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=70",
  paneer_butter_masala: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=70",
  dal_makhani: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=70",
  naan: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=70",
  bbq_platter: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=70",
  
  // Chinese & Asian
  noodles: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=70",
  chilli_chicken: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=70",
  spring_rolls: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=70",
  momos: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=70",
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=70",
  manchurian: "https://images.unsplash.com/photo-1569058242252-623df46b5025?w=500&auto=format&fit=crop&q=70",
  
  // Burgers & Rolls
  burger_chicken: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=70",
  burger_double: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=70",
  burger_veg: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop&q=70",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=70",
  peri_peri_fries: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&auto=format&fit=crop&q=70",
  roll_frankie: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=70",
  sub_sandwich: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=70",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=70",
  
  // Desserts & Sweets
  waffle_chocolate: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=70",
  waffle_berries: "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=500&auto=format&fit=crop&q=70",
  ice_cream: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=70",
  ice_cream_sundae: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=70",
  jigarthanda: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=70",
  falooda: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=70",
  cake_chocolate: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=70",
  brownie: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&auto=format&fit=crop&q=70",
  gulab_jamun: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=70",
  sweets_indian: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=70",
  muffin: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=70",
  cookie: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=70",
  
  // Beverages
  coffee_hot: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=70",
  coffee_cold: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=70",
  tea_chai: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=70",
  iced_tea: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=70",
  shake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=70",
  lassi: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop&q=70",
  mojito: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=70",
  soda_can: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=70",
  water: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop&q=70",
  
  // Chaat & Street Food
  chaat_puri: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=70",
  samosa: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=70",
  chole_bhature: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=70",
  pav_bhaji: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=70"
};

// Intelligent image resolver for any dish item
function resolveDishImage(name, category, restaurantName) {
  const n = (name + " " + (category || "")).toLowerCase();

  // Pizzas
  if (n.includes("pepperoni") || n.includes("double chicken pizza") || n.includes("dominator")) return foodImages.pizza_pepperoni;
  if (n.includes("paneer") && n.includes("pizza")) return foodImages.pizza_paneer;
  if (n.includes("corn") && n.includes("pizza")) return foodImages.pizza_cheese_corn;
  if (n.includes("margherita")) return foodImages.pizza_margherita;
  if (n.includes("veggie") && n.includes("pizza")) return foodImages.pizza_veggie;
  if (n.includes("farmhouse")) return foodImages.pizza_farmhouse;
  if (n.includes("chicken") && n.includes("pizza")) return foodImages.pizza_chicken;
  if (n.includes("pizza")) return foodImages.pizza_farmhouse;

  // Sides for pizza
  if (n.includes("stuffed garlic bread")) return foodImages.stuffed_garlic_bread;
  if (n.includes("garlic bread")) return foodImages.garlic_bread;
  if (n.includes("wing")) return foodImages.chicken_wings;
  if (n.includes("macaroni") || (n.includes("cheese") && n.includes("pasta"))) return foodImages.pasta_cheese;
  if (n.includes("pasta")) return foodImages.pasta_tomato;
  if (n.includes("dip")) return foodImages.dip_sauce;

  // Biryani & Rice
  if (n.includes("mutton biryani") || n.includes("mutton chukka biriyani")) return foodImages.biryani_mutton;
  if (n.includes("chicken biryani") || n.includes("chicken biriyani")) return foodImages.biryani_chicken;
  if (n.includes("egg biryani") || n.includes("egg biriyani")) return foodImages.biryani_egg;
  if (n.includes("handi biryani") || n.includes("bawarchi") || n.includes("hyderabadi")) return foodImages.biryani_hyderabadi;
  if (n.includes("biryani") || n.includes("biriyani") || n.includes("kuska") || n.includes("khuska")) return foodImages.biryani_chicken;
  if (n.includes("fried rice")) return foodImages.fried_rice;
  if (n.includes("curd rice")) return foodImages.curd_rice;
  if (n.includes("lemon rice") || n.includes("tamarind") || n.includes("pulao")) return foodImages.lemon_rice;

  // South Indian Tiffin
  if (n.includes("ghee roast") || n.includes("paper roast")) return foodImages.dosa_ghee;
  if (n.includes("masala dosa") || n.includes("kari dosa")) return foodImages.dosa_masala;
  if (n.includes("rava")) return foodImages.dosa_rava;
  if (n.includes("dosa")) return foodImages.dosa_masala;
  if (n.includes("podi idli") || n.includes("thatte idli")) return foodImages.podi_idli;
  if (n.includes("idli")) return foodImages.idli;
  if (n.includes("vada") || n.includes("vadai")) return foodImages.vada;
  if (n.includes("poori")) return foodImages.poori;
  if (n.includes("kothu parotta") || n.includes("kothu roti")) return foodImages.kothu_parotta;
  if (n.includes("parotta") || n.includes("veechu") || n.includes("bun parotta")) return foodImages.parotta;
  if (n.includes("meals") || n.includes("thali")) return foodImages.thali_meals;

  // Starters & Kebabs
  if (n.includes("65")) return foodImages.chicken_65;
  if (n.includes("pepper chicken") || n.includes("chukka") || n.includes("varuval")) return foodImages.pepper_chicken;
  if (n.includes("chicken tikka") || n.includes("malai tikka")) return foodImages.chicken_tikka;
  if (n.includes("tandoori chicken") || n.includes("tangdi")) return foodImages.chicken_tandoori;
  if (n.includes("crispy chicken") || n.includes("popcorn") || n.includes("strips") || n.includes("hot & crispy")) return foodImages.chicken_crispy;
  if (n.includes("lollipop")) return foodImages.chicken_lollipop;
  if (n.includes("mutton sukka") || n.includes("chops") || n.includes("kola urundai") || n.includes("boti")) return foodImages.mutton_sukka;
  if (n.includes("seekh kebab")) return foodImages.seekh_kebab;
  if (n.includes("prawn")) return foodImages.prawns_fry;
  if (n.includes("fish")) return foodImages.fish_fry;
  if (n.includes("paneer tikka") || n.includes("paneer angara")) return foodImages.paneer_tikka;
  if (n.includes("barbeque platter") || n.includes("meat platter") || n.includes("platter")) return foodImages.bbq_platter;

  // Curries
  if (n.includes("butter chicken") || n.includes("tikka masala")) return foodImages.curry_chicken;
  if (n.includes("paneer butter") || n.includes("paneer makhani")) return foodImages.paneer_butter_masala;
  if (n.includes("dal makhani") || n.includes("dal tadka") || n.includes("khatti dal")) return foodImages.dal_makhani;
  if (n.includes("mutton curry") || n.includes("rogan josh") || n.includes("korma") || n.includes("salan")) return foodImages.curry_mutton;
  if (n.includes("naan") || n.includes("kulcha") || n.includes("paratha") || n.includes("roti") || n.includes("phulka")) return foodImages.naan;

  // Chinese & Asian
  if (n.includes("noodle") || n.includes("hakka") || n.includes("mei fun")) return foodImages.noodles;
  if (n.includes("momo") || n.includes("dim sum") || n.includes("siu mai") || n.includes("bao") || n.includes("wonton")) return foodImages.momos;
  if (n.includes("spring roll")) return foodImages.spring_rolls;
  if (n.includes("manchurian")) return foodImages.manchurian;
  if (n.includes("chilli chicken") || n.includes("dragon chicken") || n.includes("kung pao")) return foodImages.chilli_chicken;
  if (n.includes("soup") || n.includes("thukpa")) return foodImages.soup;

  // Burgers, Sandwiches & Rolls
  if (n.includes("whopper") || n.includes("moburg") || n.includes("double burger")) return foodImages.burger_double;
  if (n.includes("veg burger") || n.includes("veggie burger") || n.includes("paneer royale")) return foodImages.burger_veg;
  if (n.includes("burger") || n.includes("zinger")) return foodImages.burger_chicken;
  if (n.includes("peri peri fries")) return foodImages.peri_peri_fries;
  if (n.includes("fries") || n.includes("wedges") || n.includes("hash brown") || n.includes("shots")) return foodImages.fries;
  if (n.includes("sub ") || n.includes("subway") || n.includes("salad bowl") || n.includes("sandwich")) return foodImages.sub_sandwich;
  if (n.includes("frankie") || n.includes("roll") || n.includes("wrap")) return foodImages.roll_frankie;

  // Waffles, Ice Creams, Cakes & Desserts
  if (n.includes("nutella waffle") || n.includes("death by chocolate waffle") || n.includes("chocolate waffle")) return foodImages.waffle_chocolate;
  if (n.includes("waffle") || n.includes("stroopwafel")) return foodImages.waffle_berries;
  if (n.includes("jigarthanda")) return foodImages.jigarthanda;
  if (n.includes("falooda")) return foodImages.falooda;
  if (n.includes("sundae") || n.includes("banana split")) return foodImages.ice_cream_sundae;
  if (n.includes("ice cream") || n.includes("kulfi") || n.includes("scoop") || n.includes("softie")) return foodImages.ice_cream;
  if (n.includes("brownie")) return foodImages.brownie;
  if (n.includes("lava cake") || n.includes("volcano") || n.includes("mousse") || n.includes("truffle") || n.includes("ice cream cake") || n.includes("pie")) return foodImages.cake_chocolate;
  if (n.includes("gulab jamun")) return foodImages.gulab_jamun;
  if (n.includes("halwa") || n.includes("rasgulla") || n.includes("rasmalai") || n.includes("kaju") || n.includes("laddu") || n.includes("mysore pak") || n.includes("paal kova") || n.includes("pongal") || n.includes("payasam") || n.includes("kheer") || n.includes("kesari")) return foodImages.sweets_indian;
  if (n.includes("muffin") || n.includes("croissant") || n.includes("puff") || n.includes("bun maska") || n.includes("toast") || n.includes("bread")) return foodImages.muffin;
  if (n.includes("cookie")) return foodImages.cookie;

  // Chaat & Street Food
  if (n.includes("chole bhature")) return foodImages.chole_bhature;
  if (n.includes("pav bhaji")) return foodImages.pav_bhaji;
  if (n.includes("samosa")) return foodImages.samosa;
  if (n.includes("kachori") || n.includes("puri") || n.includes("bhel") || n.includes("chaat") || n.includes("tikki")) return foodImages.chaat_puri;

  // Beverages
  if (n.includes("filter coffee") || n.includes("degree coffee") || n.includes("karuppatti")) return foodImages.filter_coffee;
  if (n.includes("cold brew") || n.includes("cold coffee") || n.includes("iced latte") || n.includes("iced caffe")) return foodImages.coffee_cold;
  if (n.includes("latte") || n.includes("cappuccino") || n.includes("macchiato") || n.includes("mocha") || n.includes("coffee") || n.includes("flat white") || n.includes("hot chocolate")) return foodImages.coffee_hot;
  if (n.includes("chai") || n.includes("tea")) return foodImages.tea_chai;
  if (n.includes("iced tea") || n.includes("cooler") || n.includes("lychee")) return foodImages.iced_tea;
  if (n.includes("frappuccino") || n.includes("frappe") || n.includes("shake") || n.includes("milkshake")) return foodImages.shake;
  if (n.includes("lassi") || n.includes("buttermilk") || n.includes("chaas")) return foodImages.lassi;
  if (n.includes("mojito") || n.includes("blue curacao") || n.includes("fizz")) return foodImages.mojito;
  if (n.includes("pepsi") || n.includes("coca-cola") || n.includes("coke") || n.includes("sprite") || n.includes("7up") || n.includes("mirinda") || n.includes("thums up") || n.includes("soda")) return foodImages.soda_can;
  if (n.includes("water")) return foodImages.water;

  // Fallback
  return foodImages.biryani_chicken;
}

// 24 Distinct Restaurant Banner Images
const restaurantBannerImages = {
  1: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=75", // Pizza Hut
  2: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=75", // Salem RR Biriyani
  3: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=75", // Sabarees Veg Restaurant
  4: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=75", // Barbeque Nation
  5: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=75", // Chinese Wok
  6: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=75", // A2B
  7: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=75", // Burger King
  8: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=75", // Madurai Famous Jigarthanda
  9: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=75", // Dindigul Thalappakatti
  10: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=75", // Dominos Pizza
  11: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=75", // Sree Saravana Bhavan
  12: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=75", // KFC
  13: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=75", // Subway
  14: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=75", // Ambur Star Biryani
  15: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=75", // Belgian Waffle
  16: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&auto=format&fit=crop&q=75", // Baskin Robbins
  17: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=75", // Haldirams
  18: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=75", // Chai Point
  19: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=75", // Tibbs Frankie
  20: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=75", // Mainland China
  21: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=75", // Murugan Idli
  22: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=75", // Wow Momo
  23: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=75", // Starbucks
  24: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=75"  // Bawarchi Biryani
};

// Import raw restaurants from previous file
import { rawRestaurants } from "./generateData.js";

// Update each restaurant and each item with its own unique resolved image
rawRestaurants.forEach(r => {
  r.image = restaurantBannerImages[r.id] || r.image;
  r.items.forEach(it => {
    it.image = resolveDishImage(it.name, it.category, r.name);
  });
});

// Let's count image uniqueness across all 528 items
const uniqueImages = new Set();
rawRestaurants.forEach(r => {
  r.items.forEach(it => uniqueImages.add(it.image));
});
console.log(`Restaurants count: ${rawRestaurants.length}`);
console.log(`Total distinct food image variants used across items: ${uniqueImages.size}`);

// Generate backend seedData.js
const categories = [
  { name: "Biryani", image: "/images/biriyani.png", slug: "biryani", displayOrder: 1 },
  { name: "South Indian", image: "/images/south-indian.png", slug: "south-indian", displayOrder: 2 },
  { name: "North Indian", image: "/images/north-indian.png", slug: "north-indian", displayOrder: 3 },
  { name: "Chinese", image: "/images/chinese.png", slug: "chinese", displayOrder: 4 },
  { name: "Parotta", image: "/images/parotta.png", slug: "parotta", displayOrder: 5 },
  { name: "Desserts", image: "/images/dessert.png", slug: "dessert", displayOrder: 6 },
  { name: "Cakes", image: "/images/cake.png", slug: "cake", displayOrder: 7 },
  { name: "Burger", image: "/images/burger.png", slug: "burger", displayOrder: 8 },
  { name: "Pizza", image: "/images/pizza.png", slug: "pizza", displayOrder: 9 },
  { name: "Ice Cream", image: "/images/icecream.png", slug: "ice-cream", displayOrder: 10 },
  { name: "Shawarma", image: "/images/shawarma.png", slug: "shawarma", displayOrder: 11 },
  { name: "Fried Rice", image: "/images/friedrice.png", slug: "fried-rice", displayOrder: 12 },
];

const seedRestaurants = rawRestaurants.map(r => ({
  name: r.name,
  image: r.image,
  rating: r.rating,
  deliveryTime: r.deliveryTime,
  timeMinutes: r.timeMinutes,
  cuisines: r.cuisines,
  food: r.food,
  place: r.place,
  address: r.address,
  offer: r.offer,
  costForTwo: r.costForTwo,
  price: r.price,
  isVegOnly: r.isVegOnly,
  isFeatured: r.isFeatured,
}));

const menuItemsByRestaurant = {};
rawRestaurants.forEach(r => {
  menuItemsByRestaurant[r.name] = r.items.map(it => ({
    name: it.name,
    price: it.price,
    isVeg: it.isVeg,
    category: it.category,
    description: it.description,
    image: it.image,
    rating: Number((4.1 + Math.random() * 0.8).toFixed(1)),
    ratingCount: Math.floor(20 + Math.random() * 150),
    isBestSeller: it.isBestSeller,
    inStock: true
  }));
});

const seedDataContent = `export const categories = ${JSON.stringify(categories, null, 2)};

export const restaurants = ${JSON.stringify(seedRestaurants, null, 2)};

export const menuItemsByRestaurant = ${JSON.stringify(menuItemsByRestaurant, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, "data", "seedData.js"), seedDataContent, "utf-8");
console.log("Updated backend/data/seedData.js with distinct item images");

// Generate frontend restaurantData.js
const frontendRestaurants = rawRestaurants.map(r => ({
  id: r.id,
  name: r.name,
  image: r.image,
  rating: r.rating,
  time: r.time,
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

const restaurantDataContent = `const restaurantData = ${JSON.stringify(frontendRestaurants, null, 2)};

export default restaurantData;
`;

const frontendDataPath = path.resolve(__dirname, "..", "frontend", "src", "data");
fs.writeFileSync(path.join(frontendDataPath, "restaurantData.js"), restaurantDataContent, "utf-8");
console.log("Updated frontend/src/data/restaurantData.js with distinct restaurant banners");

// Generate frontend menuData.js
let globalMenuId = 1;
const frontendMenuItems = [];
rawRestaurants.forEach(r => {
  r.items.forEach(it => {
    frontendMenuItems.push({
      id: globalMenuId++,
      restaurantId: r.id,
      name: it.name,
      price: it.price,
      isVeg: it.isVeg,
      category: it.category,
      description: it.description,
      image: it.image,
      rating: Number((4.2 + (globalMenuId % 7) * 0.1).toFixed(1)),
      ratingCount: 30 + (globalMenuId % 80),
      isBestSeller: it.isBestSeller
    });
  });
});

const menuDataContent = `const menuData = ${JSON.stringify(frontendMenuItems, null, 2)};

export default menuData;
`;

fs.writeFileSync(path.join(frontendDataPath, "menuData.js"), menuDataContent, "utf-8");
console.log("Updated frontend/src/data/menuData.js with distinct item images");
