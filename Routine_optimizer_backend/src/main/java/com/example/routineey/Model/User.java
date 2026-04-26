package com.example.routineey.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Users")
public class User {
    public User(){}
    @Id
    private String username;
    private String password;
    private String email;  
    private String fullName;
    private Integer age;
    private String occupation;
    
    // New and Updated Fields
    private String workStart;      // Work timing start
    private String workEnd;        // Work timing end
    private String commuteTime;    // Commute duration
    private String wakeUpTime;     // Part of Sleep Window
    private String sleepTime;      // Part of Sleep Window
    private String primaryGoal;    // Goal
    private String energyPreference; // Energy preference (Morning/Night owl)

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getWorkStart() { return workStart; }
    public void setWorkStart(String workStart) { this.workStart = workStart; }
    public String getWorkEnd() { return workEnd; }
    public void setWorkEnd(String workEnd) { this.workEnd = workEnd; }
    public String getCommuteTime() { return commuteTime; }
    public void setCommuteTime(String commuteTime) { this.commuteTime = commuteTime; }
    public String getWakeUpTime() { return wakeUpTime; }
    public void setWakeUpTime(String wakeUpTime) { this.wakeUpTime = wakeUpTime; }
    public String getSleepTime() { return sleepTime; }
    public void setSleepTime(String sleepTime) { this.sleepTime = sleepTime; }
    public String getPrimaryGoal() { return primaryGoal; }
    public void setPrimaryGoal(String primaryGoal) { this.primaryGoal = primaryGoal; }
    public String getEnergyPreference() { return energyPreference; }
    public void setEnergyPreference(String energyPreference) { this.energyPreference = energyPreference; }
    public boolean isOvernightSleep() {
        if (sleepTime == null || wakeUpTime == null) return false;
        return sleepTime.compareTo(wakeUpTime) > 0;
    }
}