import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./Navbar.css"; // Optional: Create a separate CSS file for styling

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate(); // Access the navigation function

  // Check if the user is logged in by checking localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage and update the loggedIn state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/">MyApp</a>
      </div>
      <ul className="nav-links">
        {loggedIn ? (
          // Show logout button when logged in
          <li><a href="#" onClick={handleLogout}>Logout</a></li>
        ) : (
          // Show login and register links when not logged in
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
