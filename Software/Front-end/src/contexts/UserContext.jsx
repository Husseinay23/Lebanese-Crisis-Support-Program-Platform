import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setUserId(null);
      setLoading(false);
      return;
    }

    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/auth/current_user/", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserId(data.user_id_from_token || null);
        } else {
          console.error("Failed to fetch user ID:", response.status);
          setUserId(null);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ userId, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);