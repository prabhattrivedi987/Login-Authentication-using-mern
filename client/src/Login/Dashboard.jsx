import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, logoutUser } from "../Services/AuthServices";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); // Redirect if no token
          return;
        }

        const profile = await getUserProfile();
        setUser(profile);
        console.log("Fetched user profile:", profile);
      } catch (err) {
        setError(err.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);
  const handleLogout = () => {
    logoutUser(); // Clear localStorage
    navigate("/"); // Redirect to login
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {user ? (
          <div className="mb-4">
            <p>
              <strong>Name:</strong> {user.name || user.userId}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "Not Provided"}
            </p>
            <p>
              <strong>Id:</strong> {user.id || "Not Provided"}
            </p>
          </div>
        ) : (
          <p>No user data available</p>
        )}

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
