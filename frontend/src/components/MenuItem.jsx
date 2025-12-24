import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

export default function MenuItem({ item, restaurantId, restaurantName }) {
  const [quantity, setQuantity] = React.useState(1);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      restaurantId,
      restaurantName
    }));
    setQuantity(1);
    alert('Added to cart!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      
      <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
        {item.description}
      </p>

      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm">{item.rating || 0}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {[1, 2, 3, 4, 5].map(q => <option key={q} value={q}>{q}</option>)}
        </select>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition text-sm font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
