import React from 'react';
import { useTheme } from '../context/ThemeContext';



const ItemCard = ({ item, addToCart }) => {
  const { theme } = useTheme();
  return (
    <div className={`bg-${theme}-500 p-4 rounded-lg shadow-md`}>
      <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
      <div className="mt-4">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-gray-500 text-sm">{item.category}</p>
        <p className="font-bold text-xl mt-2">${item.price}</p>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => addToCart(item)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
