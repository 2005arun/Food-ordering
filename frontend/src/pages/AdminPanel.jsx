import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    description: '',
    cuisines: [],
    rating: 4.5,
    deliveryTime: 30,
    deliveryFee: 50,
    image: '',
    address: {
      street: '',
      city: '',
      postalCode: ''
    },
    isOpen: true
  });

  const [menuForm, setMenuForm] = useState({
    restaurantId: '',
    name: '',
    description: '',
    price: '',
    category: '',
    vegetarian: false,
    isAvailable: true,
    image: ''
  });

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [cuisineInput, setCuisineInput] = useState('');

  const handleRestaurantChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setRestaurantForm(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setRestaurantForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const addCuisine = () => {
    if (cuisineInput.trim() && !restaurantForm.cuisines.includes(cuisineInput.trim())) {
      setRestaurantForm(prev => ({
        ...prev,
        cuisines: [...prev.cuisines, cuisineInput.trim()]
      }));
      setCuisineInput('');
    }
  };

  const removeCuisine = (cuisine) => {
    setRestaurantForm(prev => ({
      ...prev,
      cuisines: prev.cuisines.filter(c => c !== cuisine)
    }));
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3002/api/restaurants', restaurantForm);
      setMessage('✅ Restaurant added successfully!');
      setRestaurants([...restaurants, response.data.data]);
      
      // Reset form
      setRestaurantForm({
        name: '',
        description: '',
        cuisines: [],
        rating: 4.5,
        deliveryTime: 30,
        deliveryFee: 50,
        image: '',
        address: {
          street: '',
          city: '',
          postalCode: ''
        },
        isOpen: true
      });

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding restaurant: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuForm.restaurantId) {
      setMessage('❌ Please select a restaurant');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:3002/api/menus', menuForm);
      setMessage('✅ Menu item added successfully!');
      
      // Reset form
      setMenuForm({
        restaurantId: '',
        name: '',
        description: '',
        price: '',
        category: '',
        vegetarian: false,
        isAvailable: true,
        image: ''
      });

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding menu item: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Seed restaurants
      await axios.post('http://localhost:3002/api/restaurants/seed');
      // Seed menus
      await axios.post('http://localhost:3002/api/menus/seed');
      
      setMessage('✅ Sample data seeded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error seeding data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Panel</h1>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Quick Action Button */}
        <div className="mb-8">
          <button
            onClick={handleSeedData}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Seed Sample Data (5 Restaurants)'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Restaurant Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Restaurant</h2>
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Restaurant Name *</label>
                <input
                  type="text"
                  name="name"
                  value={restaurantForm.name}
                  onChange={handleRestaurantChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="e.g., Pizza Palace"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={restaurantForm.description}
                  onChange={handleRestaurantChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="Restaurant description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Cuisines</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={cuisineInput}
                    onChange={(e) => setCuisineInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="e.g., Italian"
                  />
                  <button
                    type="button"
                    onClick={addCuisine}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {restaurantForm.cuisines.map(cuisine => (
                    <span key={cuisine} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm">
                      {cuisine}
                      <button
                        type="button"
                        onClick={() => removeCuisine(cuisine)}
                        className="ml-2 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Rating (0-5) *</label>
                  <input
                    type="number"
                    name="rating"
                    value={restaurantForm.rating}
                    onChange={handleRestaurantChange}
                    min="0"
                    max="5"
                    step="0.1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Delivery Time (mins) *</label>
                  <input
                    type="number"
                    name="deliveryTime"
                    value={restaurantForm.deliveryTime}
                    onChange={handleRestaurantChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Delivery Fee (₹) *</label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={restaurantForm.deliveryFee}
                  onChange={handleRestaurantChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={restaurantForm.image}
                  onChange={handleRestaurantChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="https://via.placeholder.com/300x200"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold text-gray-700 mb-3">Address</h3>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Street *</label>
                  <input
                    type="text"
                    name="address.street"
                    value={restaurantForm.address.street}
                    onChange={handleRestaurantChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      name="address.city"
                      value={restaurantForm.address.city}
                      onChange={handleRestaurantChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Postal Code *</label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={restaurantForm.address.postalCode}
                      onChange={handleRestaurantChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isOpen"
                  checked={restaurantForm.isOpen}
                  onChange={handleRestaurantChange}
                  className="w-4 h-4"
                />
                <label className="ml-2 text-gray-700 font-semibold">Open Now</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Restaurant'}
              </button>
            </form>
          </div>

          {/* Add Menu Item Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Menu Item</h2>
            <form onSubmit={handleAddMenuItem} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Restaurant *</label>
                <input
                  type="text"
                  name="restaurantId"
                  value={menuForm.restaurantId}
                  onChange={handleMenuChange}
                  placeholder="Enter restaurant ObjectId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <p className="text-sm text-gray-500 mt-1">Paste the _id from restaurant you want to add items to</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Item Name *</label>
                <input
                  type="text"
                  name="name"
                  value={menuForm.name}
                  onChange={handleMenuChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="e.g., Margherita Pizza"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={menuForm.description}
                  onChange={handleMenuChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="Item description"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={menuForm.price}
                    onChange={handleMenuChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                  <select
                    name="category"
                    value={menuForm.category}
                    onChange={handleMenuChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Bread">Bread</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Sides">Sides</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={menuForm.image}
                  onChange={handleMenuChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="https://via.placeholder.com/200"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="vegetarian"
                    checked={menuForm.vegetarian}
                    onChange={handleMenuChange}
                    className="w-4 h-4"
                  />
                  <label className="ml-2 text-gray-700 font-semibold">Vegetarian</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={menuForm.isAvailable}
                    onChange={handleMenuChange}
                    className="w-4 h-4"
                  />
                  <label className="ml-2 text-gray-700 font-semibold">Available</label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Menu Item'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
