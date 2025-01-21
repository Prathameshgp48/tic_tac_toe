import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setUserDetails({
            username: response.data.username,
            email: response.data.email,
            password: "",
          });
        }
      } catch (error) {
        setError("Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "http://localhost:5000/api/v1/user/update-profile",
        {
          username: userDetails.username,
          email: userDetails.email,
          password: userDetails.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Profile updated successfully");
        setTimeout(() => navigate("/"), 2000); // Redirect after a delay
      }
    } catch (error) {
      setError(error.response.data.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

      {error && <div className="bg-red-200 text-red-700 p-2 mb-4">{error}</div>}
      {success && (
        <div className="bg-green-200 text-green-700 p-2 mb-4">{success}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={userDetails.username}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={userDetails.password}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
