import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./apiConfig";
import DailyTimeline from "./components/DailyTimeline";
import PerformanceGraph from "./components/PerformanceGraph";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]); 
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const username = localStorage.getItem("tempUsername");

  const fetchData = useCallback(async () => {
    if (!username) return;
    try {
      const uRes = await axios.get(`${API_BASE_URL}/user/${username}`);
      const iRes = await axios.get(`${API_BASE_URL}/user/${username}/insights`);
      const pRes = await axios.get(`${API_BASE_URL}/user/performance/weekly?username=${username}`);
      
      setUserData(uRes.data);
      setInsights(iRes.data);
      setWeeklyData(pRes.data);
    } catch (e) { console.error("Error fetching data:", e); }
  }, [username]);

  useEffect(() => {
    fetchData();
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, [fetchData]);

  const onStatusUpdate = async (block, status) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/user/logs`, { 
        username, 
        blockName: block.type, 
        status, 
        hour: block.start,
        isRescheduled: block.isRescheduled || false
      });

      if (res.data.notification) alert(res.data.notification);
      fetchData(); 
    } catch (e) { console.error("Update failed:", e); }
  };

  if (!userData) return <div style={{textAlign: 'center', marginTop: '50px'}}>Initializing Adaptive Optimizer...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "850px", margin: "0 auto", background: "#f9fbfa", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <div style={{display: 'flex', gap: '10px'}}>
          {insights?.isGrowthMode && <span style={styles.badge}>⚡ GROWTH MODE</span>}
          <span style={{...styles.badge, background: '#2d3436'}}>🧩 {insights?.useShortBlocks ? "SHORT BLOCKS" : "DEEP FOCUS"}</span>
        </div>
      </div>

      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", alignItems: "center" }}>
        <h1 style={{margin: 0, fontSize: '2.5rem', fontWeight: '800'}}>Routineey</h1>
        <button onClick={() => navigate("/setup-profile")} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>⚙️</button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "30px" }}>
        <div style={styles.card}><span>Productivity</span><strong>{insights?.completionRate || 0}%</strong></div>
        <div style={styles.card}><span>Most Skipped</span><strong>{insights?.mostSkipped || "None"}</strong></div>
        <div style={styles.card}><span>Status</span><strong>{insights?.isGrowthMode ? "Excelled" : "Adaptive"}</strong></div>
      </div>

      <PerformanceGraph data={weeklyData} />

      <h2 style={{marginBottom: "20px", fontWeight: '700'}}>Today's Optimized Flow</h2>
      <DailyTimeline 
        userData={userData} 
        currentHour={currentTime.getHours()} 
        onStatusUpdate={onStatusUpdate} 
        insights={insights} 
      />
    </div>
  );
}

const styles = {
  card: { background: "white", padding: "20px", borderRadius: "15px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" },
  badge: { background: "#26de81", color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "bold" }
};

export default Dashboard;