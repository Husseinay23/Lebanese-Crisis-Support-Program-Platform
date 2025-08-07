import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Admin/ADashboard";
import UserManagement from "./Admin/UserManagement";
import ContentModeration from "./Admin/ContentModeration";

const Admin = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userRole, setUserRole] = useState(null);  // Admin or regular user
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the user is admin (you'll need to fetch user role from Firestore or Realtime Database)
        fetchUserRole(user.uid);
      } else {
        // Redirect to login if user is not authenticated
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserRole = async (userId) => {
    // Assuming you store user roles in Firestore
    const docRef = doc(db, "users", userId); // Adjust the collection and field as per your Firestore setup
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.role === "admin") {
        setUserRole("admin");
        navigate("/admin/dashboard");
      } else {
        setUserRole("user");
        navigate("/user/dashboard");
      }
    }
  };

  return (
    <div className="flex">
      {userRole === "admin" && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="content" element={<ContentModeration />} />
        </Route>
      )}
    </div>
  );
};

export default Admin;
