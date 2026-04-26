import React from 'react';

const DailyTimeline = ({ userData, currentHour, onStatusUpdate, insights }) => {
  if (!userData) return null;

  const priorities = { FOCUS: "🔥", WORKOUT: "🔥", WORK: "💼", PERSONAL: "🍱", RELAX: "🧘", BREAK: "☕", SLEEP: "🌙", COMMUTE: "🚗" };

  const goalTemplates = {
    "Increase productivity": [{ type: "FOCUS", weight: 0.4 }, { type: "BREAK", weight: 0.1 }, { type: "FOCUS", weight: 0.3 }, { type: "RELAX", weight: 0.2 }],
    "Fitness balance": [{ type: "WORKOUT", weight: 0.3 }, { type: "BREAK", weight: 0.1 }, { type: "FOCUS", weight: 0.3 }, { type: "PERSONAL", weight: 0.3 }],
    "Study optimization": [{ type: "FOCUS", weight: 0.5 }, { type: "BREAK", weight: 0.1 }, { type: "PERSONAL", weight: 0.2 }, { type: "RELAX", weight: 0.2 }],
    "Work-life balance": [{ type: "WORK", weight: 0.4 }, { type: "PERSONAL", weight: 0.3 }, { type: "WORKOUT", weight: 0.1 }, { type: "RELAX", weight: 0.2 }]
  };

  const generateTimeline = () => {
    const workS = parseInt(userData.workStart?.split(':')[0]);
    const workE = parseInt(userData.workEnd?.split(':')[0]);
    const sleepS = parseInt(userData.sleepTime?.split(':')[0]);
    const wakeU = parseInt(userData.wakeUpTime?.split(':')[0]);
    
    let base = [];
    for (let i = 0; i < 24; i++) {
      const isSleep = sleepS > wakeU ? (i >= sleepS || i < wakeU) : (i >= sleepS && i < wakeU);
      if (isSleep) base[i] = { type: "SLEEP" };
      else if (i >= workS && i < workE) base[i] = { type: "WORK" };
      else base[i] = { type: "FREE" };
    }

    let granular = [];
    let h = 0;
    while (h < 24) {
      if (base[h].type !== "FREE") {
        granular.push({ type: base[h].type, start: h, end: h + 1 });
        h++;
        continue;
      }
      let freeStart = h;
      while (h < 24 && base[h].type === "FREE") h++;
      let duration = h - freeStart;
      const template = goalTemplates[userData.primaryGoal] || goalTemplates["Increase productivity"];
      let pointer = freeStart;

      template.forEach(task => {
        let taskDur = Math.round((task.weight * duration) * 2) / 2;
        if (taskDur > 0 && pointer < h) {
          granular.push({ type: task.type, start: pointer, end: Math.min(pointer + taskDur, h) });
          pointer += taskDur;
        }
      });
    }

    const dbLogs = insights?.dailyLogs || [];
    dbLogs.filter(l => l.isRescheduled).forEach(res => {
        const idx = granular.findIndex(b => Math.abs(b.start - res.hour) < 0.1);
        if (idx !== -1) {
            granular[idx] = { type: res.blockName, start: res.hour, end: res.hour + res.duration, isRescheduled: true };
        }
    });

    const merged = [];
    if (granular.length > 0) {
      let c = { ...granular[0] };
      for (let j = 1; j < granular.length; j++) {
        if (granular[j].type === c.type && granular[j].start === c.end && !granular[j].isRescheduled && !c.isRescheduled) {
          c.end = granular[j].end;
        } else {
          merged.push(c);
          c = { ...granular[j] };
        }
      }
      merged.push(c);
    }
    return merged;
  };

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = t % 1 === 0 ? "00" : "30";
    return `${h}:${m}`;
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {generateTimeline().map((block, i) => {
        const isActive = currentHour >= block.start && currentHour < block.end;
        const log = insights?.dailyLogs?.find(l => Math.abs(l.hour - block.start) < 0.1);
        const progress = isActive ? ((new Date().getMinutes() / 60) * 100) : 0;
        const isFuture = block.start > currentHour;

        return (
          <div key={i} style={{ 
            display: "flex", flexDirection: "column", marginBottom: "12px", 
            border: isActive ? "3px solid #2d3436" : block.isRescheduled ? "2px dashed #8854d0" : "1px solid #eee",
            borderRadius: "12px", background: log?.status === 'DONE' ? "#f0fff4" : log?.status === 'MISSED' ? "#fff5f5" : "white", overflow: "hidden"
          }}>
            {isActive && <div style={{ height: "4px", background: "#2ecc71", width: `${progress}%`, transition: "width 1s" }} />}
            <div style={{ display: "flex", alignItems: "center", padding: "16px 20px" }}>
              <div style={{ width: "110px", fontSize: "0.8rem", color: "#7f8c8d" }}>{formatTime(block.start)}-{formatTime(block.end)}</div>
              <div style={{ flex: 1, fontWeight: "bold" }}>
                {priorities[block.type]} {block.type}
                {block.isRescheduled && <span style={{fontSize: "0.7rem", marginLeft: "10px", color: "#8854d0", background: "#f3eaff", padding: "2px 6px", borderRadius: "4px"}}>🔁 MOVED</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {log?.status && <span style={{ fontWeight: "800", color: log.status === 'DONE' ? "#2ecc71" : "#e74c3c", fontSize: "0.8rem" }}>{log.status}</span>}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => onStatusUpdate(block, 'DONE')} style={styles.btnDone} disabled={isFuture}>✔</button>
                  <button onClick={() => onStatusUpdate(block, 'MISSED')} style={styles.btnMiss} disabled={isFuture}>❌</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  btnDone: { background: "#2ecc71", color: "white", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: 'pointer' },
  btnMiss: { background: "#e74c3c", color: "white", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: 'pointer' }
};

export default DailyTimeline;