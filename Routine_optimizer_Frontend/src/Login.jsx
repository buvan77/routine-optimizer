import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import { API_BASE_URL } from "./apiConfig";

function Login() {
  // 2. Initialize the navigate function
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
   const response = await axios.post(`${API_BASE_URL}/user/login`, formData);
    
    // Use .trim() to prevent issues with hidden whitespace
    const status = response.data.trim();

    if (status === "User not found. Please register.") {
      alert("User not found. Please register.");
    } else if (status === "Profile Incomplete") {
      alert("Please complete your profile details.");
      localStorage.setItem("tempUsername", formData.username);
      navigate("/setup-profile"); // Ensure this path matches App.js
    } else if (status === "Login Successful") {
  alert("Login Successful");
  localStorage.setItem("tempUsername", formData.username); // Add this line
  navigate("/dashboard"); 
} else {
      alert("Invalid Credentials");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred during login");
  }
};

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        <p style={{ marginTop: "15px" }}>
          New user?{" "}
          <Link to="/register" style={{ color: "blue" }}>
            REGISTER
          </Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2"
  },
  form: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "320px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Login;
