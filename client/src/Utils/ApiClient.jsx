import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5257",
  headers: {
    "Content-Type": "application/json",
  },
});

//attach the token to each request if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
