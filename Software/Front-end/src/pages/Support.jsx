import { useState, useEffect } from "react";
import { Phone, Car, Home, Hotel, Hospital, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

export default function Support() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);

  // Resource types for filtering
  const resourceTypes = [
    { id: 1, type: "Transportation", details: "Bus, Taxi, etc." },
    { id: 2, type: "Available Homes", details: "House, Apartment listings" },
    { id: 3, type: "Hotels", details: "Hotel information" },
    { id: 4, type: "Food", details: "Restaurants, Food delivery" },
    { id: 5, type: "Medical Facilities", details: "Hospitals, Clinics" },
  ];

  // Fetch resources from the Django API
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/serviceoffers/");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Error fetching resources: Data not being fetched from the database.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter resources based on the selected category
  const filteredResources =
    selectedType === "all"
      ? resources
      : resources.filter((resource) => resource.category === selectedType);

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Support Services</h1>
        <Link to="/resource-map">
          <Button variant="outline">View Resource Map</Button>
        </Link>
      </div>

      <h3 className="text-gray-500">
        Access emergency services, shelter, medical care, and essential resources.
      </h3>

      {/* Display error message if there is an error */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Emergency Numbers Section */}
      <div className="mb-12">
        <Card className="bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-600" />
              Emergency Numbers
            </CardTitle>
            <CardDescription>
              Important contact information for immediate assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="font-semibold">
                  <a href="tel:112" className="text-blue-600 hover:underline">
                    Emergency Services: 112
                  </a>
                </p>
                <p className="font-semibold">
                  <a href="tel:125" className="text-blue-600 hover:underline">
                    Civil Defense: 125
                  </a>
                </p>
                <p className="font-semibold">
                  <a href="tel:140" className="text-blue-600 hover:underline">
                    Red Cross: 140
                  </a>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold">
                  <a href="tel:160" className="text-blue-600 hover:underline">
                    Police: 160
                  </a>
                </p>
                <p className="font-semibold">
                  <a href="tel:175" className="text-blue-600 hover:underline">
                    Fire Department: 175
                  </a>
                </p>
                <p className="font-semibold">
                  <a href="tel:1564" className="text-blue-600 hover:underline">
                    Crisis Hotline: 1564
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dropdown for filtering resources */}
      <div className="mb-8">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-black-50 border border-black-300 text-black-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-200 dark:text-white"
        >
          <option value="all">All Resources</option>
          {resourceTypes.map((type) => (
            <option key={type.id} value={type.type}>
              {type.type}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Loading services...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredResources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {/* Conditional icons based on service category */}
                  {resource.category === "Transportation" && <Car className="h-5 w-5 text-primary" />}
                  {resource.category === "Available Homes" && <Home className="h-5 w-5 text-primary" />}
                  {resource.category === "Hotels" && <Hotel className="h-5 w-5 text-primary" />}
                  {resource.category === "Medical Facilities" && <Hospital className="h-5 w-5 text-primary" />}
                  {resource.category === "Food" && <Utensils className="h-5 w-5 text-primary" />}
                  <CardTitle>{resource.title || "No Title Available"}</CardTitle>
                </div>
                <CardDescription>{resource.description || "No description available"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Location: {resource.location || "No location provided"}</p>
              </CardContent>
              <CardContent>
                <p className="font-medium">Contact: {resource.contact_number  || "tata"}</p>
                {resource.contact_number  && (
                  <a href={`tel:${resource.contact_number .replace(/\s+/g, "")}`} className="w-full">
                    <Button className="mt-4 w-full">Request Service</Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
