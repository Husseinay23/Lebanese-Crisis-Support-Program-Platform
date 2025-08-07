import React, { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import Slider from "../components/ui/Slider";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

// API utility to interact with Django backend
import axios from "axios";

export default function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [error, setError] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedSort, setSelectedSort] = useState("name");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch organizations from Django API on component mount
    axios
      .get("http://localhost:8000/api/organizations/")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setOrganizations(response.data);
        } else {
          setError("No organizations found.");
        }
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching organizations:", error);
        setError("Failed to load organizations.");
        setLoading(false); // Stop loading even if there's an error
      });
  }, []); // Empty dependency array to ensure it only runs once

  const handleSliderChange = (value) => {
    setAmount(value[0]);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount(Number(e.target.value) || 0);
  };

  const sortedOrganizations = [...organizations].sort((a, b) => {
    const nameA = a.organization_name || "";
    const nameB = b.organization_name || "";

    switch (selectedSort) {
      case "name":
        return nameA.localeCompare(nameB);
      case "publication_date":
        return new Date(b.publication_date) - new Date(a.publication_date);
      case "donation_goal":
        return b.donation_goal - a.donation_goal;
      default:
        return 0;
    }
  });

  const handleDonate = async () => {
    if (!user) {
      setError("You must be logged in to make a donation.");
      return;
    }

    const donationData = {
      amount: amount || 0,
      message: message || null,
      user_id: user.id,
      organization_name: selectedOrganization,
    };

    try {
      await axios.post('localhost:8000/api/organizations/', donationData);

      setIsModalOpen(false);
      setAmount(50);
      setCustomAmount("");
      setMessage("");
      setCurrency("USD");
      setSelectedOrganization(null);

      alert("Donation completed successfully!");
    } catch (error) {
      console.error("Error processing donation:", error);
      setError("An error occurred while processing your donation.");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner while data is being fetched
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Support Organizations</h1>
      </div>
      <h3 className="text-gray-500">
        Find and connect with organizations providing aid and support.
      </h3>
      <div className="mb-8">
        <h4 className="font-medium">Sort by:</h4>
        <div className="flex items-center gap-6">
          <div>
            <input
              type="radio"
              id="sort-by-name"
              value="name"
              checked={selectedSort === "name"}
              onChange={() => setSelectedSort("name")}
              className="mr-2"
            />
            <label htmlFor="sort-by-name" className="text-sm">
              Name
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="sort-by-donation"
              value="donation_goal"
              checked={selectedSort === "donation_goal"}
              onChange={() => setSelectedSort("donation_goal")}
              className="mr-2"
            />
            <label htmlFor="sort-by-donation" className="text-sm">
              Donation Goal
            </label>
          </div>
        </div>
      </div>
      {error && <p className="text-red-600">{error}</p>}{" "}
      {/* Display error message */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading organizations...</p> // Show loading message
        ) : error ? (
          <p className="text-red-600">{error}</p> // Show error message
        ) : sortedOrganizations.length > 0 ? (
          sortedOrganizations.map((org, index) => (
            <Card
              key={org.id || index}
              className="overflow-hidden"
              organization={org}
            >
              <div className="aspect-video relative">
                <img
                  src={org.image}
                  alt={org.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>{org.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <Button className="w-full h-5">
                  <a
                    href={org.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:underline"
                  >
                    <ExternalLink className="h-5 w-4 mr-1" />
                    Visit Website
                  </a>
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedOrganization(org.name);
                    setIsModalOpen(true);
                  }}
                >
                  Donate Now
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No organizations available to display.</p> // If no organizations found
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-3">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Make a Donation ({selectedOrganization})
              </h1>
            </div>
            <div className="space-y-5">
              <div>
                <Label htmlFor="amount">Donation Amount ({currency})</Label>
                <Slider
                  id="amount"
                  min={0}
                  max={1000}
                  step={10}
                  value={[amount]}
                  onValueChange={handleSliderChange}
                  className="my-4"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="customAmount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Custom Amount
                </label>
                <input
                  type="number"
                  id="customAmount"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="e.g., 50"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="text-sm text-white-600">
                Your donation of {currency} {amount} can provide meals for{" "}
                {Math.floor(amount / 10)} families.
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDonate}
                  disabled={amount <= 0}
                  className={`px-4 py-2 ${
                    amount <= 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Donate Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
