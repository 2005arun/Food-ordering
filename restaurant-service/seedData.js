const mongoose = require('mongoose');
require('dotenv').config();

const restaurantSchema = new mongoose.Schema({
  name: String,
  description: String,
  cuisines: [String],
  rating: Number,
  deliveryTime: Number,
  deliveryFee: Number,
  image: String,
  address: {
    street: String,
    city: String,
    postalCode: String
  },
  isOpen: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const menuItemSchema = new mongoose.Schema({
  restaurantId: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  vegetarian: Boolean,
  isAvailable: Boolean,
  createdAt: { type: Date, default: Date.now }
});

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB Atlas');

    const Restaurant = mongoose.model('Restaurant', restaurantSchema, 'restaurants');
    const MenuItem = mongoose.model('MenuItem', menuItemSchema, 'menu_items');

    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    console.log('Cleared existing data');

    // Create sample restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Pizza Palace',
        description: 'Delicious Italian pizzas and pastas',
        cuisines: ['Italian', 'Fast Food'],
        rating: 4.5,
        deliveryTime: 30,
        deliveryFee: 50,
        image: 'https://via.placeholder.com/300x200?text=Pizza+Palace',
        address: {
          street: '123 Food Street',
          city: 'Mumbai',
          postalCode: '400001'
        },
        isOpen: true
      },
      {
        name: 'Taj Indian Kitchen',
        description: 'Authentic Indian cuisine with aromatic spices',
        cuisines: ['Indian'],
        rating: 4.7,
        deliveryTime: 35,
        deliveryFee: 40,
        image: 'https://via.placeholder.com/300x200?text=Taj+Indian+Kitchen',
        address: {
          street: '456 Spice Lane',
          city: 'Mumbai',
          postalCode: '400002'
        },
        isOpen: true
      },
      {
        name: 'Dragon Wok',
        description: 'Chinese cuisine with fresh ingredients',
        cuisines: ['Chinese'],
        rating: 4.3,
        deliveryTime: 25,
        deliveryFee: 60,
        image: 'https://via.placeholder.com/300x200?text=Dragon+Wok',
        address: {
          street: '789 Asia Plaza',
          city: 'Mumbai',
          postalCode: '400003'
        },
        isOpen: true
      },
      {
        name: 'Burger Bliss',
        description: 'Premium burgers and fast food',
        cuisines: ['Fast Food'],
        rating: 4.2,
        deliveryTime: 20,
        deliveryFee: 30,
        image: 'https://via.placeholder.com/300x200?text=Burger+Bliss',
        address: {
          street: '321 Quick Bites Road',
          city: 'Mumbai',
          postalCode: '400004'
        },
        isOpen: true
      },
      {
        name: 'Cafe Fresh',
        description: 'Healthy salads, sandwiches and smoothies',
        cuisines: ['Italian', 'Fast Food'],
        rating: 4.6,
        deliveryTime: 15,
        deliveryFee: 40,
        image: 'https://via.placeholder.com/300x200?text=Cafe+Fresh',
        address: {
          street: '654 Health Lane',
          city: 'Mumbai',
          postalCode: '400005'
        },
        isOpen: true
      }
    ]);

    console.log('Created restaurants:', restaurants.length);

    // Create menu items for each restaurant
    const menuItems = [];
    
    // Pizza Palace menu
    menuItems.push(
      { restaurantId: restaurants[0]._id, name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella and basil', price: 250, category: 'Pizza', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Margherita' },
      { restaurantId: restaurants[0]._id, name: 'Pepperoni Pizza', description: 'Pizza with pepperoni slices', price: 350, category: 'Pizza', vegetarian: false, isAvailable: true, image: 'https://via.placeholder.com/200?text=Pepperoni' },
      { restaurantId: restaurants[0]._id, name: 'Garlic Bread', description: 'Crispy bread with garlic butter', price: 150, category: 'Appetizers', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Garlic+Bread' }
    );

    // Taj Indian Kitchen menu
    menuItems.push(
      { restaurantId: restaurants[1]._id, name: 'Butter Chicken', description: 'Tender chicken in creamy tomato sauce', price: 350, category: 'Main Course', vegetarian: false, isAvailable: true, image: 'https://via.placeholder.com/200?text=Butter+Chicken' },
      { restaurantId: restaurants[1]._id, name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 280, category: 'Main Course', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Paneer+Tikka' },
      { restaurantId: restaurants[1]._id, name: 'Biryani', description: 'Fragrant rice with meat and spices', price: 400, category: 'Main Course', vegetarian: false, isAvailable: true, image: 'https://via.placeholder.com/200?text=Biryani' },
      { restaurantId: restaurants[1]._id, name: 'Naan', description: 'Traditional Indian bread', price: 50, category: 'Breads', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Naan' }
    );

    // Dragon Wok menu
    menuItems.push(
      { restaurantId: restaurants[2]._id, name: 'Kung Pao Chicken', description: 'Spicy chicken with peanuts', price: 300, category: 'Main Course', vegetarian: false, isAvailable: true, image: 'https://via.placeholder.com/200?text=Kung+Pao' },
      { restaurantId: restaurants[2]._id, name: 'Vegetable Fried Rice', description: 'Fried rice with seasonal vegetables', price: 200, category: 'Main Course', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Veg+Fried+Rice' },
      { restaurantId: restaurants[2]._id, name: 'Chow Mein', description: 'Stir-fried noodles with vegetables', price: 220, category: 'Noodles', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Chow+Mein' }
    );

    // Burger Bliss menu
    menuItems.push(
      { restaurantId: restaurants[3]._id, name: 'Cheese Burger', description: 'Juicy beef patty with melted cheese', price: 200, category: 'Burgers', vegetarian: false, isAvailable: true, image: 'https://via.placeholder.com/200?text=Cheese+Burger' },
      { restaurantId: restaurants[3]._id, name: 'Veggie Burger', description: 'Plant-based patty with fresh vegetables', price: 180, category: 'Burgers', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Veggie+Burger' },
      { restaurantId: restaurants[3]._id, name: 'French Fries', description: 'Crispy golden fries', price: 100, category: 'Sides', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Fries' }
    );

    // Cafe Fresh menu
    menuItems.push(
      { restaurantId: restaurants[4]._id, name: 'Caesar Salad', description: 'Fresh greens with caesar dressing', price: 220, category: 'Salads', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Caesar+Salad' },
      { restaurantId: restaurants[4]._id, name: 'Grilled Sandwich', description: 'Multi-grain bread with grilled vegetables', price: 250, category: 'Sandwiches', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Sandwich' },
      { restaurantId: restaurants[4]._id, name: 'Fruit Smoothie', description: 'Fresh fruit blend with yogurt', price: 150, category: 'Beverages', vegetarian: true, isAvailable: true, image: 'https://via.placeholder.com/200?text=Smoothie' }
    );

    await MenuItem.insertMany(menuItems);
    console.log('Created menu items:', menuItems.length);

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
