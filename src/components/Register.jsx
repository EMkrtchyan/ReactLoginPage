import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Navbar from "./Navbar";

const Register = () => {
  const [name, setName] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Check if password meets the requirements
    if (!passwordRegex.test(password)) {
      setMessage("Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, and a special character.");
      return;
    }

    const userData = {
      username: name,
      lastname: lname,
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful!");
        navigate("/login"); // Navigate to login page
      } else {
        setMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setMessage("Error connecting to the server");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Register</h2>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Poxos"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            placeholder="Poxosyan"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            required
          />


          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Poxos@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
