import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceGraph = ({ data }) => {
  const getInsight = () => {
    if (!data || data.length < 3) return "Consistency is key. Keep going!";
    const last3 = data.slice(-3);
    if (last3[2].percentage > last3[1].percentage && last3[1].percentage > last3[0].percentage) {
      return "📈 Performance trending upward.";
    } else if (last3[2].percentage < last3[1].percentage && last3[1].percentage < last3[0].percentage) {
      return "📉 Performance declining. Consider recovery.";
    }
    return "Consistency is key. Keep going!";
  };

  return (
    <div style={{ 
      background: 'white', padding: '20px', borderRadius: '15px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px',
      minHeight: '300px' // Fix for "height greater than 0" error
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>📈 Weekly Performance Trend</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="day" tick={{fontSize: 12, fill: '#7f8c8d'}} />
            <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#7f8c8d'}} />
            <Tooltip />
            <Line type="monotone" dataKey="percentage" stroke="#8854d0" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#8854d0', fontWeight: '600', marginTop: '15px', textAlign: 'center' }}>
        {getInsight()}
      </p>
    </div>
  );
};

export default PerformanceGraph;