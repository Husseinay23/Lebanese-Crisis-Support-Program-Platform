import { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // For making API requests
import { UserContext } from '../contexts/UserContext'; // Import UserContext

export default function PostNeedForm({ isOpen, onClose, onAddNeed }) {
  const { userId } = useContext(UserContext); // Get the user ID from UserContext
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [error, setError] = useState(null);

  

  const handleSubmit = async () => {
    if (!userId) {
      setError("You must be logged in to post a need.");
      return;
    }
  
    try {
      const payload = {
        user_id: userId, // Required by perform_create
        title, // Ensure title is provided
        description: description || '', // Default to empty string if not provided
        location: location || '', // Default to empty string
        price: parseFloat(price) || 0, // Convert price to number, default to 0
        category: category || 'Uncategorized', // Provide default category
        date: date || new Date().toISOString().split('T')[0], // Default to today's date
        contact_number: phoneNumber || null, // Allow null for optional phone number
      };
  
      const response = await axios.post(
        "http://127.0.0.1:8000/api/servicerequests/create/",
        payload
      );
  
      if (response.status === 201) {
        setConfirmationMessage("Your need has been successfully posted!");
        resetForm();
        onAddNeed(response.data); // Use response data to update parent state
        onClose();
      } else {
        setError("Failed to post your need.");
      }
    } catch (error) {
      console.error("Error posting need:", error);
      setError(
        error.response?.data?.detail || "An error occurred while posting your need."
      );
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setPrice('');
    setCategory('');
    setPhoneNumber('');
    setDate('');
    setError(null);
    setConfirmationMessage('');
  };
  return (
    <div
      id="post-need-modal"
      className={`fixed top-0 right-0 left-0 z-50 w-full h-[calc(100%-1rem)] max-h-full flex justify-center items-center overflow-y-auto ${
        isOpen ? '' : 'hidden'
      }`}
      tabIndex="-1"
      aria-hidden={!isOpen}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Post a Need</h3>
          </div>

          <form className="p-4 md:p-5" onSubmit={(e) => e.preventDefault()}>
            {confirmationMessage && <div className="text-green-600 mb-4">{confirmationMessage}</div>}
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., Medical Supplies Needed"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Description
                </label>
                <textarea
                  id="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Detailed description of your need"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., New York"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., 100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., 123-456-7890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end mt-4">
              <button
                type="button"
                className="text-gray-500 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm px-5 py-2.5 mr-2 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
