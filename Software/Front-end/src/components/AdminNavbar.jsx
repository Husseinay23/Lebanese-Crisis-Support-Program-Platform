import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const handleLogout = () => {
    // Logic to handle logout, e.g., clearing authentication token or state
    localStorage.removeItem("adminLoggedIn"); // Example, adjust to your auth flow
    window.location.href = "/"; // Redirect to the home page after logout
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        {/* Logo or title */}
        <div className="text-xl font-semibold">
          <Link to="/admin/dashboard">Admin Panel</Link>
        </div>

        {/* Links */}
        <div className="space-x-6">
          <Link to="/admin/dashboard" className="hover:text-gray-400">
            Dashboard
          </Link>
          <Link to="/admin/users" className="hover:text-gray-400">
            User Management
          </Link>
          <Link to="/admin/content" className="hover:text-gray-400">
            Content Moderation
          </Link>
        </div>

        {/* Exit Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Exit Admin Panel
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
