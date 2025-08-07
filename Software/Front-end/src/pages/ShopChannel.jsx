import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PostRequestModal from "../components/PostRequestModal";
import HelpModal from "../components/HelpModal";
import axios from "axios";

const ShopChannel = () => {
  const [cartItems, setCartItems] = useState([]);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/carts/");
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const openHelpModal = (item) => {
    setSelectedItem(item);
    setHelpModalOpen(true);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Shop Channel 🛒</h1>
        <Button className="w-full" onClick={() => setPostModalOpen(true)}>
          Post Request
        </Button>
      </div>
      <h3 className="text-gray-500">
        Marketplace for goods and services during emergencies.
      </h3>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Cart Items</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.product.name}</CardTitle>
                  <CardDescription>Category: {item.product.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="text-gray-500 mt-2">Price: ${item.product.price}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <Button className="w-full mt-4" onClick={() => openHelpModal(item)}>
                    Help This Person
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {postModalOpen && (
        <PostRequestModal
          onClose={() => setPostModalOpen(false)}
          refreshRequests={() => {
            axios
              .get("")
              .then((response) => setCartItems(response.data))
              .catch((error) => console.error("Error fetching cart items:", error));
          }}
        />
      )}
      {helpModalOpen && selectedItem && (
        <HelpModal
          onClose={() => setHelpModalOpen(false)}
          request={selectedItem}
          refreshRequests={() => {
            axios
              .get("")
              .then((response) => setCartItems(response.data))
              .catch((error) => console.error("Error fetching cart items:", error));
          }}
        />
      )}
    </div>
  );
};

export default ShopChannel;