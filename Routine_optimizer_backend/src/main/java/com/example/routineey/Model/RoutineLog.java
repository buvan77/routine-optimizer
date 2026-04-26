package com.example.routineey.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "routine_logs")
public class RoutineLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String blockName; 
    private LocalDate date;
    private String status;
    private Double hour; // Support for decimal hours (e.g., 17.5)
    private Integer originalHour;
    private Double duration = 1.0; 
    private Boolean isRescheduled = false;

    public RoutineLog(){}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getBlockName() { return blockName; }
    public void setBlockName(String blockName) { this.blockName = blockName; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getHour() { return hour; }
    public void setHour(Double hour) { this.hour = hour; }
    public Integer getOriginalHour() { return originalHour; }
    public void setOriginalHour(Integer originalHour) { this.originalHour = originalHour; }
    public Double getDuration() { return duration; }
    public void setDuration(Double duration) { this.duration = duration; }
    public Boolean getIsRescheduled() { return isRescheduled; }
    public void setIsRescheduled(Boolean isRescheduled) { this.isRescheduled = isRescheduled; }
}