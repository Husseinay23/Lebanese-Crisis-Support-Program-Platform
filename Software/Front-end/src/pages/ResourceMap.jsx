import { useState, useEffect } from "react";
import { Phone, Car, Home, Hotel, Hospital, Utensils } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ResourceMap() {
  const [resources, setResources] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resourceTypes = [
    { id: 1, type: "Transportation", details: "Bus, Taxi, etc." },
    { id: 2, type: "Available Homes", details: "House, Apartment listings" },
    { id: 3, type: "Hotels", details: "Hotel information" },
    { id: 4, type: "Food", details: "Restaurants, Food delivery" },
    { id: 5, type: "Medical Facilities", details: "Hospitals, Clinics" },
  ];

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/serviceoffers/");
        const data = await response.json();

        const formattedData = data.map((item) => ({
          title: item.title,
          category: item.category,
          location: item.location,
          description: item.description,
          contact_number: item.contact_number,
          latitude: item.latitude,
          longitude: item.longitude,
        }));

        setResources(formattedData);
      } catch (err) {
        console.error(err.message);
        setError("Failed to fetch data from the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources =
    selectedType === "all"
      ? resources
      : resources.filter(
          (resource) => resource.category.toLowerCase() === selectedType.toLowerCase()
        );

  return (
    <div className="container px-2 py-12">
      <h1 className="text-4xl font-bold mb-8">Resource Map</h1>
      <h2 className="text-gray-1000 mb-4">
        Locate nearby support services and resources on an interactive map.
      </h2>

      <div className="mb-8">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-black-50 border border-black-300 text-black-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        >
          <option value="all">All Resources</option>
          {resourceTypes.map((type) => (
            <option key={type.id} value={type.type}>{type.type}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading resources...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <Card key={`${resource.category}-${resource.title}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {resource.category === "Transportation" && <Car className="h-5 w-5 text-primary" />}
                  {resource.category === "Available Homes" && <Home className="h-5 w-5 text-primary" />}
                  {resource.category === "Hotels" && <Hotel className="h-5 w-5 text-primary" />}
                  {resource.category === "Medical Facilities" && <Hospital className="h-5 w-5 text-primary" />}
                  {resource.category === "Food" && <Utensils className="h-5 w-5 text-primary" />}
                  <CardTitle>{resource.title}</CardTitle>
                </div>
                <CardContent>{resource.category}</CardContent>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">Location: {resource.location}</p>
                <p className="font-medium">Phone: {resource.contact_number}</p>
                {resource.latitude && resource.longitude ? (
                  <a
                    href={`https://www.google.com/maps?q=${resource.latitude},${resource.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full">Get Directions</Button>
                  </a>
                ) : (
                  <p>No location data available.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
