import { useState, useEffect } from "react";
import { Table } from "../../components/ui/table"; // Placeholder for content moderation table
import axios from "axios"; // To make API requests

const ContentModeration = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [formData, setFormData] = useState({});
  const [content, setContent] = useState([]);
  const [error, setError] = useState(null);

  // Handle table selection
  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
    setFormData({}); // Reset form data when table is changed
    setContent([]); // Reset content when table is changed
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch content for the selected table
  useEffect(() => {
    if (selectedTable) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/${selectedTable}`);
          setContent(response.data);
        } catch (error) {
          setError("Error fetching data.");
        }
      };

      fetchData();
    }
  }, [selectedTable]);

  // Submit data to the selected table
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to the respective table via an API call
      const response = await axios.post(`/api/${selectedTable}/add`, formData);
      alert("Data submitted successfully");
      setContent([...content, formData]); // Update content with newly added data
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data");
    }
  };

  // Render form based on selected table
  const renderForm = () => {
    switch (selectedTable) {
      case "products":
        return (
          <>
            <input
              type="text"
              name="Category"
              placeholder="Category"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="text"
              name="Name"
              placeholder="Product Name"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="number"
              name="Price"
              placeholder="Price"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="number"
              name="Available_Quantity"
              placeholder="Available Quantity"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="date"
              name="Expiration_date"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
          </>
        );
      case "news":
        return (
          <>
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <textarea
              name="content"
              placeholder="Content"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="url"
              name="url"
              placeholder="URL"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="date"
              name="publication_date"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
          </>
        );
      case "organizations":
        return (
          <>
            <input
              type="text"
              name="name"
              placeholder="Organization Name"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="url"
              name="official_website"
              placeholder="Official Website"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
          </>
        );
      case "service_offer":
        return (
          <>
            <input
              type="text"
              name="title"
              placeholder="Service Title"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="text"
              name="Category"
              placeholder="Category"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <textarea
              name="Description"
              placeholder="Description"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="text"
              name="Contact_Number"
              placeholder="Contact Number"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="text"
              name="Location"
              placeholder="Location"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="date"
              name="Creation_Date"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <select
              name="Status"
              onChange={handleInputChange}
              className="p-2 mb-2"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input
              type="number"
              name="Longitude"
              placeholder="Longitude"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
            <input
              type="number"
              name="Latitude"
              placeholder="Latitude"
              onChange={handleInputChange}
              className="p-2 mb-2"
            />
          </>
        );
      default:
        return <p>Select a table to add data</p>;
    }
  };

  return (
    <div>
      <div className="bg-gray-300 text-black p-8">
        <h2 className="text-2xl font-semibold mb-4">Content Moderation</h2>

        {/* Dropdown for table selection */}
        <select
          onChange={handleTableChange}
          className="p-2 mb-4"
        >
          <option value="">Select Table to Add Data</option>
          <option value="products">Products</option>
          <option value="news">News</option>
          <option value="organizations">Organizations</option>
          <option value="service_offer">Service Offer</option>
        </select>

        {/* Form for adding data */}
        <form onSubmit={handleSubmit} className="mb-6">
          {renderForm()}
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded shadow-md"
          >
            Submit
          </button>
        </form>

        {/* Display any errors */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Content Table */}
        {selectedTable && content.length > 0 ? (
          <Table data={content} />
        ) : (
          <p>No data to display for the selected table</p>
        )}
      </div>
    </div>
  );
};

export default ContentModeration;
