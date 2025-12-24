import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

export default function RestaurantCard({ restaurant }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {restaurant.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {restaurant.description}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center">
            ⭐ {restaurant.rating.toFixed(1)}
            <span className="text-gray-500 ml-1">({restaurant.totalReviews})</span>
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{restaurant.deliveryTime} min</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.cuisines.slice(0, 3).map((cuisine, idx) => (
            <span
              key={idx}
              className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs"
            >
              {cuisine}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded text-sm ${restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </span>
          <span className="text-gray-600 text-sm">{restaurant.priceRange}</span>
        </div>
      </div>
    </div>
  );
}
