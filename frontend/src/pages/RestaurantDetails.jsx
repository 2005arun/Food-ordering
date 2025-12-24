import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { restaurantAPI } from '../api/client';
import MenuItem from '../components/MenuItem';
import CartDrawer from '../components/CartDrawer';
import { useState } from 'react';

export default function RestaurantDetails() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchRestaurant();
    fetchMenu();
  }, [restaurantId, isAuthenticated, navigate]);

  const fetchRestaurant = async () => {
    try {
      const response = await restaurantAPI.getRestaurantById(restaurantId);
      setRestaurant(response.data.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  };

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getMenuItems(restaurantId, {
        category: selectedCategory || undefined,
        limit: 50
      });
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchMenu();
    }
  }, [selectedCategory]);

  if (!restaurant) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6 items-start">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              <div className="flex gap-6 text-sm text-gray-600">
                <span>⭐ {restaurant.rating.toFixed(1)} ({restaurant.totalReviews} reviews)</span>
                <span>🚚 {restaurant.deliveryTime} min</span>
                <span>💵 Min Order: ₹{restaurant.minOrder}</span>
                <span className={restaurant.isOpen ? 'text-green-600' : 'text-red-600'}>
                  {restaurant.isOpen ? '✓ Open' : '✗ Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === ''
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                All Items
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            {loading ? (
              <div className="text-center py-12">Loading menu...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map(item => (
                  <MenuItem
                    key={item._id}
                    item={item}
                    restaurantId={restaurantId}
                    restaurantName={restaurant.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartDrawer />
          </div>
        </div>
      </div>
    </div>
  );
}
