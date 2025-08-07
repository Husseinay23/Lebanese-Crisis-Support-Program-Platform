// src/components/layouts/AdminLayout.jsx
import { Link, Outlet } from 'react-router-dom'; // Outlet to render the child routes
import AdminNavbar from '../AdminNavbar'; // Import the AdminNavbar component

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
