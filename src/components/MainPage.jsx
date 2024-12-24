import React, { useState, useEffect } from "react";
import "./MainPage.css";
import Navbar from "./Navbar";

const MainPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Check if the user is logged in by checking localStorage for a token or user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setLoggedIn(true);
      setUsername(userData.username); // Set the username from localStorage
    }
  }, []);

  return (
    <div>
        <Navbar />
        <div className="main-page">
            
        {loggedIn ? (
            <div className="welcome-message">
            <h2>Welcome, {username}!</h2> {/* Display the username */}
            </div>
        ) : (
            <div className="login-register-message">
            <h2>Please log in or register</h2>
            </div>
        )}
        </div>
    </div>
  );
};

export default MainPage;
