import React, { useState } from "react";
import axios from 'axios';

const HelpModal = ({ onClose, request, refreshRequests }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === request.items.length
        ? []
        : request.items.map((item) => item.id)
    );
  };

  const handleDonate = async () => {
    setLoading(true); // Indicate loading state
    try {
      const donatedItems = request.items.filter((item) =>
        selectedItems.includes(item.id)
      );

      // Insert donated items into the donations collection via Django API
      const response = await axios.post('/api/donations/', {
        request_id: request.id,
        donated_items: donatedItems,
      });

      // Update the product requests collection (Django API)
      await axios.put(`/api/requests/${request.id}/`, { items: donatedItems });

      // Refresh requests and close modal
      refreshRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, items: donatedItems } : r))
      );
      onClose();
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while processing the donation. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">Donate to Request</h2>

        {/* Product Listing */}
        <ul>
  {Array.isArray(request.items) && request.items.length > 0 ? (
    request.items.map((item) => (
      <li key={item.id} className="flex justify-between items-center">
        <div>
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => toggleItemSelection(item.id)}
          />
          {item.name} - {item.quantity}
        </div>
      </li>
    ))
  ) : (
    <li>No items available</li>
  )}
</ul>


        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Close
          </button>
          <button
            onClick={handleDonate}
            disabled={selectedItems.length === 0 || loading}
            className={`py-2 px-4 rounded ${
              selectedItems.length > 0 && !loading
                ? "bg-red-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            {loading ? "Donating..." : "Donate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
