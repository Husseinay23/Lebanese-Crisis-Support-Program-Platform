import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../contexts/UserContext";

const UserProfile = () => {
  const { userId } = useContext(UserContext); // Access userId from context
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId === null) {
      setError("User is not logged in.");
    } else {
      setError(null); // Reset error if userId is present
    }
  }, [userId]);

  return (
    <div className="container py-8">
      <h1>User Profile</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          <p><strong>User ID:</strong> {userId}</p>
          {/* You can add more user information here */}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
