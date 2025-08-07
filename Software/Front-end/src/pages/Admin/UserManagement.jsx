import { useState, useEffect } from "react";
import { Table } from "../../components/ui/table"; // Placeholder for table component
import axios from "axios"; // To make API requests

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    location: "",
    role: "user",
  });
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users"); // Replace with your API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handle adding a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users", newUser); // Replace with your API endpoint
      setUsers([...users, response.data]);
      setNewUser({
        fullName: "",
        email: "",
        contactNumber: "",
        location: "",
        role: "user",
      });
      alert("User added successfully");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user");
    }
  };

  // Handle deleting selected users
  const handleDeleteUsers = async () => {
    try {
      await axios.delete("/api/users", {
        data: { userIds: selectedUsers }, // Send selected user IDs
      });
      setUsers(users.filter(user => !selectedUsers.includes(user.User_id)));
      setSelectedUsers([]);
      alert("Selected users deleted successfully");
    } catch (error) {
      console.error("Error deleting users:", error);
      alert("Failed to delete users");
    }
  };

  // Handle selection of users for deletion
  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

   // Filter users based on search and role
   const filteredUsers = users.filter((user) => {
    const matchesSearch = user.Full_Name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  return (
    <div>
      <div className="bg-gray-300 text-black p-8">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>

        {/* display and Filter */}
               <div className="bg-white p-4 rounded shadow-md mb-6">
          <h3 className="font-semibold mb-4">Search and Filter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-200 p-2 rounded shadow-sm w-full"
            />
            <select
              className="bg-gray-200 p-2 rounded shadow-sm w-full"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>All Roles</option>
              <option>User</option>
              <option>Admin</option>
            </select>
          </div>
        </div>



        {/* User Table */}
        <Table
          data={filteredUsers}
          onUserSelect={handleUserSelection} // Handle user selection for deletion
        />

        {/* Action Buttons */}
        <div className="mt-6 flex">
          <form onSubmit={handleAddUser} className="flex-1">
            <h3 className="font-semibold mb-4">Add New User</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={newUser.fullName}
                onChange={handleInputChange}
                className="bg-gray-200 p-2 rounded shadow-sm w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
                className="bg-gray-200 p-2 rounded shadow-sm w-full"
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={newUser.contactNumber}
                onChange={handleInputChange}
                className="bg-gray-200 p-2 rounded shadow-sm w-full"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newUser.location}
                onChange={handleInputChange}
                className="bg-gray-200 p-2 rounded shadow-sm w-full"
                required
              />
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="bg-gray-200 p-2 rounded shadow-sm w-full"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded shadow-md"
            >
              Add User
            </button>
          </form>

          {/* Delete Button */}
          <div className="ml-4">
            <h3 className="font-semibold mb-4">Delete Selected Users</h3>
            <button
              className="bg-red-500 text-white p-3 rounded shadow-md"
              onClick={handleDeleteUsers}
              disabled={selectedUsers.length === 0}
            >
              Delete Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
