import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@/components/ui/Button';

export default function DonationModal({ isOpen, onClose, selectedNeed }) {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/products'); // Assuming your Django endpoint for products is /api/products
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    if (isOpen) {
      fetchItems();
    }
  }, [isOpen]);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleDonateItems = async () => {
    try {
      // Fetching the logged-in user
      const userResponse = await axios.get('/api/auth/user'); // Assuming the endpoint for the logged-in user is /api/auth/user
      const user = userResponse.data;

      // Making donation entries
      const donationPromises = selectedItems.map(async (itemId) => {
        const response = await axios.post('/api/donations', {
          user_id: user.id,
          product_request_id: selectedNeed.PR_ID, // Link to the selected need
          product_id: itemId,
          donation_date: new Date(),
        });
        return response;
      });

      const donationResponses = await Promise.all(donationPromises);
      if (donationResponses.some((response) => response.status !== 201)) {
        console.error('Error donating items:', donationResponses);
      } else {
        // Record the transaction
        const transactionPromises = selectedItems.map(async (itemId) => {
          const transactionResponse = await axios.post('/api/transactions', {
            cart_id: selectedNeed.Cart_id, // Assuming Cart_id is available
            user_id: user.id,
            transaction_date: new Date(),
            amount: items.find(item => item.P_id === itemId).Price, // Assuming Price is available
          });
          return transactionResponse;
        });

        const transactionResponses = await Promise.all(transactionPromises);
        if (transactionResponses.some((response) => response.status !== 201)) {
          console.error('Error recording transactions:', transactionResponses);
        } else {
          // Successfully donated
          onClose(); // Close the modal
        }
      }
    } catch (error) {
      console.error('Error donating items or recording transaction:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col relative">
        <h2 className="text-2xl font-bold mb-4">Donate Items for {selectedNeed.Title}</h2>
        {items.map((item) => (
          <div key={item.P_id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.P_id)}
              onChange={() => handleSelectItem(item.P_id)}
            />
            <label className="ml-2">{item.Name} - ${item.Price}</label>
          </div>
        ))}
        <Button onClick={handleDonateItems} className="bg-green-500 text-white mt-4">Donate Items</Button>
        <Button onClick={onClose} className="mt-2">Cancel</Button>
      </div>
    </div>
  );
}
