import React, { useState, useEffect, useContext } from "react";
import Button from "@/components/ui/Button";
import axios from "axios";
import { UserContext } from "../contexts/UserContext"; // Import UserContext

const PostRequestModal = ({ onClose, refreshRequests }) => {
  const { userId } = useContext(UserContext); // Get the user ID from UserContext
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Fetch products from the Django backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id, increment) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + (increment ? 1 : -1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handlePostRequest = async (cartItems) => {
    try {
      console.log("Received cartItems:", cartItems);
  
      // Check if userId is available
      if (!userId) {
        console.error("User ID is not available.");
        return;  // Stop the request if userId is not available
      }
  
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        for (const item of cartItems) {
          const payload = {
            user_id: userId,  // Use the userId from the context
            product_id: item.id,  // Send the product ID
            quantity: item.quantity,  // Send the quantity
          };
  
          console.log("Payload for API request:", payload);
  
          const response = await axios.post("http://localhost:8000/api/carts/", payload);
  
          if (response && response.data) {
            console.log("Successfully added to cart:", response.data);
          } else {
            console.log("Response does not contain data.");
          }
        }
        console.log("All items added successfully.");
      } else {
        console.error("cartItems is not an array or is empty.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">Add Products to Cart</h2>

        {/* User Information */}
        <div className="mb-4">
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Contact Number"
            className="w-full p-2 border rounded mb-2 dark:border-white dark:text-white text-black dark:bg-gray-800 bg-white"

          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-2 border rounded mb-2 dark:border-white dark:text-white text-black dark:bg-gray-800 bg-white"

          />
        </div>

        {/* Product List */}
        <div className="max-h-60 overflow-y-auto mb-6">
          <h3 className="text-lg font-semibold mb-2">Available Products</h3>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>
                  {product.name} - ${product.price}  -
                  <img src={product.image} alt={product.name} />
                </span>
                <Button onClick={() => addToCart(product)} className="ml-4">
                  Add
                </Button>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>

        {/* Cart */}
        <div className="max-h-60 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Your Cart</h3>
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>
                  {item.name} - Quantity: {item.quantity} - Total: $
                  {item.price * item.quantity}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartQuantity(item.id, true)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateCartQuantity(item.id, false)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    -
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <Button
            onClick={() => handlePostRequest(cart)} // Pass the cart as an argument
            disabled={cart.length === 0}
            className={`py-2 px-4 rounded ${
              cart.length > 0
                ? "bg-red-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostRequestModal;
