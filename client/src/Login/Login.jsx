import React, { useState } from "react";
import { loginUser } from "../Services/AuthServices";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  // Form State
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Error States
  const [userError, setUserError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    // Reset errors
    setUserError("");
    setPasswordError("");
    setApiError("");

    let valid = true;
    if (!userId.trim()) {
      setUserError("Username is required");
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!valid) return;

    try {
      const data = await loginUser({ userId, password });
      console.log("API response:", data);

      // Store token & user
      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setApiError(err.message || "Login failed");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-center text-primary">
        Login
      </h2>
      <form
        onSubmit={submitHandler}
        className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Username"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        {userError && <p className="text-red-500 mb-4">{userError}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}

        {apiError && <p className="text-red-500 mb-2">{apiError}</p>}

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          Remember me
        </label>

        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
