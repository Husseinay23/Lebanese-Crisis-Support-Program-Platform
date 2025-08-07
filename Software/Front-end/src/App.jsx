// src/App.js
import { PrivateRoute } from "./components/PrivateRoute";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext"; // Import the AuthProvider\
import { UserProvider  } from "./contexts/UserContext" // Import the UserContext\
// Layouts
import Layout from "./components/Layout"; // Public layout with original navbar
import AdminLayout from "./components/layouts/AdminLayout"; // Admin layout with AdminNavbar

// Pages for the public site
import Home from "./pages/Home";
import Support from "./pages/Support";
import News from "./pages/News";
import NeedsWants from "./pages/NeedsWants";
import Organizations from "./pages/Organizations";
import ResourceMap from "./pages/ResourceMap";
import Login from "./pages/login";
import ShopChannel from "./pages/ShopChannel";

// Admin Pages
import ADashboard from "./pages/Admin/ADashboard"; // Import as ADashboard
import UserManagement from "./pages/Admin/UserManagement";
import ContentModeration from "./pages/Admin/ContentModeration";

function App() {
  return (
    <AuthProvider>
      <UserProvider> {/* Wrap the UserProvider around the app */}
        <ThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="support" element={<Support />} />
              <Route path="news" element={<News />} />
              <Route path="needs-wants" element={<NeedsWants />} />
              <Route path="shop-channel" element={<ShopChannel />} />
              <Route path="organizations" element={<Organizations />} />
              <Route path="resource-map" element={<ResourceMap />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* Admin Routes - Protected */}
            <Route
              path="admin"
              element={
                <PrivateRoute> {/* Protecting the AdminLayout with PrivateRoute */}
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<ADashboard />} /> {/* Admin Dashboard route */}
              <Route path="users" element={<UserManagement />} />
              <Route path="content" element={<ContentModeration />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
