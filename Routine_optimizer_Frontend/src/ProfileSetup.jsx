import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./apiConfig";

function ProfileSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: localStorage.getItem("tempUsername") || "",
    workStart: "",
    workEnd: "",
    commuteTime: "",
    wakeUpTime: "",
    sleepTime: "",
    primaryGoal: "Increase productivity",
    energyPreference: "Morning Person"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.workStart || !formData.workEnd) {
      alert("Please fill in work timings.");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/user/update-profile`, formData);
      alert("Profile Setup Complete!");
      navigate("/dashboard"); 
    } catch (error) {
      console.error(error);
      alert("Failed to save profile.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Personalize Your Routine</h2>
        
        <div style={styles.section}>
          <label htmlFor="workStart" style={styles.label}>Work Start:</label>
          <input id="workStart" name="workStart" type="time" onChange={handleChange} required style={styles.input} />
          
          <label htmlFor="workEnd" style={styles.label}>Work End:</label>
          <input id="workEnd" name="workEnd" type="time" onChange={handleChange} required style={styles.input} />
        </div>

        <label htmlFor="commuteTime" style={styles.label}>Commute (mins):</label>
        <input id="commuteTime" name="commuteTime" type="number" onChange={handleChange} required style={styles.input} />

        <label htmlFor="sleepTime" style={styles.label}>Sleep Time:</label>
        <input id="sleepTime" name="sleepTime" type="time" onChange={handleChange} required style={styles.input} />

        <label htmlFor="wakeUpTime" style={styles.label}>Wake-up Time:</label>
        <input id="wakeUpTime" name="wakeUpTime" type="time" onChange={handleChange} required style={styles.input} />

        <label htmlFor="primaryGoal" style={styles.label}>Primary Goal:</label>
        <select id="primaryGoal" name="primaryGoal" value={formData.primaryGoal} onChange={handleChange} style={styles.input}>
          <option value="Increase productivity">Increase productivity</option>
          <option value="Fitness balance">Fitness balance</option>
        </select>

        <button type="submit" style={styles.button}>Save Profile</button>
      </form>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" },
  form: { background: "white", padding: "30px", borderRadius: "10px", width: "380px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
  label: { display: "block", textAlign: "left", fontWeight: "bold", marginBottom: "5px" },
  input: { width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { width: "100%", padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }
};

export default ProfileSetup;