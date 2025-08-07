import { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [userStats, setUserStats] = useState({ registeredUsers: 0, activeUsers: 0 });
  const history = useHistory(); // For navigation

  // Fetch recent activities from the transactions table
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await axios.get('/api/transactions/recent'); // Adjust this endpoint to match your backend
        if (response.data) {
          setRecentActivities(response.data);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };

    // Fetch user statistics
    const fetchUserStats = async () => {
      try {
        const response = await axios.get('127.0.0.1:8000/api/transactions'); // Adjust this endpoint to fetch user stats
        if (response.data) {
          setUserStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchRecentActivity();
    fetchUserStats();
  }, []);

  // Navigate to the respective pages when the quick action buttons are clicked
  const handleManageUsersClick = () => {
    history.push('/user-management'); // Navigate to User Management page
  };

  const handleModerateContentClick = () => {
    history.push('/content-moderation'); // Navigate to Content Moderation page
  };

  return (
    <div>
      <div>
        <div className="bg-gray-300 text-black p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Welcome to the Admin Panel</h2>
          <p className="text-xl mb-6">Here are the main tasks you can perform:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="font-semibold">Manage Users</h3>
              <p>View, edit, and manage all users in the system.</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="font-semibold">Content Moderation</h3>
              <p>Approve or reject user-submitted content.</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="font-semibold">Settings</h3>
              <p>Change system settings and user preferences.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-gray-300 text-black p-9 mt-10 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6">Welcome to the Dashboard</h2>
          <p className="text-xl mb-6">Here are the main tasks you can perform:</p>

          {/* Dashboard Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="font-semibold">Registered Users</h3>
              <p>{userStats.registeredUsers}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="font-semibold">Active Users</h3>
              <p>{userStats.activeUsers}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <li key={index}>{activity.description}</li>
                ))
              ) : (
                <li>No recent activity available.</li>
              )}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                className="bg-blue-500 text-white p-3 rounded shadow-md"
                onClick={handleManageUsersClick}
              >
                Manage Users
              </button>
              <button
                className="bg-green-500 text-white p-3 rounded shadow-md"
                onClick={handleModerateContentClick}
              >
                Moderate Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
