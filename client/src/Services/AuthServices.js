import apiClient from "../Utils/ApiClient";

// Login API
export const loginUser = async (loginData) => {
  try {
    const response = await apiClient.post("/login", loginData);
    return response.data; // Expect { token, user }
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/profile");
    return response.data; // Expect user profile object
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch profile" };
  }
};
// Logout API

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await apiClient.post(
      "/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return response.data; // success message
  } catch (err) {
    throw err.response?.data || { message: "Logout failed" };
  }
};
