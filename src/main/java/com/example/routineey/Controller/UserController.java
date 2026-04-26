package com.example.routineey.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.routineey.Model.RoutineLog;
import com.example.routineey.Model.User;
import com.example.routineey.Repository.RoutineLogRepository;
import com.example.routineey.Repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://2zbbtlct-3000.inc1.devtunnels.ms"})
@RequestMapping("/user")
public class UserController {
  
    @Autowired UserRepository repo;
    @Autowired RoutineLogRepository logRepo;

    private static final List<String> HIGH_PRIORITY = List.of("FOCUS", "WORKOUT");

    // Fix: Add generic POST mapping for registration to resolve 404
    @PostMapping
    public String registerUser(@RequestBody User user) {
        if (repo.existsById(user.getUsername())) return "User already exists. Please login.";
        repo.save(user);
        return "Registration Successful";
    }

    // Fix: Set to @PostMapping to match frontend Login.jsx
    @PostMapping("/login") 
    public String loginUser(@RequestBody User user) {
        Optional<User> existingUser = repo.findById(user.getUsername());
        if (existingUser.isEmpty()) return "User not found. Please register.";
        
        User foundUser = existingUser.get();
        if (foundUser.getPassword().equals(user.getPassword())) {
            if (foundUser.getWakeUpTime() == null || foundUser.getWorkStart() == null) {
                return "Profile Incomplete";
            }
            return "Login Successful";
        }
        return "Invalid Credentials";
    }

    @PostMapping("/logs")
    public Map<String, Object> saveLog(@RequestBody RoutineLog log) {
        log.setDate(LocalDate.now());
        Map<String, Object> response = new HashMap<>();
        
        List<RoutineLog> existingLogs = logRepo.findByUsername(log.getUsername());
        Optional<RoutineLog> existing = existingLogs.stream()
            .filter(l -> l.getDate().equals(log.getDate()) && Math.abs(l.getHour() - log.getHour()) < 0.1)
            .findFirst();

        if (existing.isPresent()) {
            RoutineLog updateLog = existing.get();
            updateLog.setStatus(log.getStatus());
            logRepo.save(updateLog);
        } else {
            logRepo.save(log);
        }

        if ("MISSED".equals(log.getStatus()) && HIGH_PRIORITY.contains(log.getBlockName())) {
            handleRescheduling(log).ifPresent(msg -> response.put("notification", msg));
        }

        response.put("status", "success");
        return response;
    }

    private Optional<String> handleRescheduling(RoutineLog missedLog) {
        User user = repo.findById(missedLog.getUsername()).orElse(null);
        if (user == null) return Optional.empty();

        int currentHour = LocalTime.now().getHour();
        int sleepH = Integer.parseInt(user.getSleepTime().split(":")[0]);

        if (currentHour >= sleepH - 1) return Optional.of("Too late to reschedule today.");
        
        boolean alreadyRescheduled = logRepo.findByUsername(user.getUsername()).stream()
            .anyMatch(l -> l.getDate().equals(LocalDate.now()) && Boolean.TRUE.equals(l.getIsRescheduled()));
        
        if (alreadyRescheduled) return Optional.of("Daily rescheduling limit reached.");

        int targetHour = Math.min(currentHour + 2, sleepH - 1);
        RoutineLog resched = new RoutineLog();
        resched.setUsername(user.getUsername());
        resched.setBlockName(missedLog.getBlockName());
        resched.setDate(LocalDate.now());
        resched.setHour((double)targetHour);
        resched.setDuration(0.75); 
        resched.setIsRescheduled(true);
        resched.setStatus("PENDING");

        logRepo.save(resched);
        return Optional.of("Task moved to " + targetHour + ":00 (Optimized to 45m)");
    }

    @PutMapping("/update-profile")
    public String updateProfile(@RequestBody User profileData) {
        Optional<User> userOpt = repo.findById(profileData.getUsername());
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            u.setWorkStart(profileData.getWorkStart());
            u.setWorkEnd(profileData.getWorkEnd());
            u.setCommuteTime(profileData.getCommuteTime());
            u.setWakeUpTime(profileData.getWakeUpTime());
            u.setSleepTime(profileData.getSleepTime());
            u.setPrimaryGoal(profileData.getPrimaryGoal());
            u.setEnergyPreference(profileData.getEnergyPreference());
            repo.save(u);
            return "Profile Updated Successfully";
        }
        return "User not found";
    }

    @GetMapping("/{username}/insights")
    public Map<String, Object> getWeeklyInsights(@PathVariable String username) {
        List<RoutineLog> logs = logRepo.findByUsername(username);
        Map<String, Object> insights = new HashMap<>();
        if (logs.isEmpty()) { insights.put("noData", true); return insights; }

        long doneCount = logs.stream().filter(l -> "DONE".equals(l.getStatus())).count();
        int rate = (int) ((double) doneCount / logs.size() * 100);
        insights.put("completionRate", rate);
        insights.put("isGrowthMode", rate > 85);
        insights.put("useShortBlocks", rate < 60);
        
        String mostSkipped = logs.stream()
            .filter(l -> "MISSED".equals(l.getStatus()))
            .collect(Collectors.groupingBy(RoutineLog::getBlockName, Collectors.counting()))
            .entrySet().stream().max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey).orElse("None");
        insights.put("mostSkipped", mostSkipped);

        insights.put("dailyLogs", logs.stream().filter(l -> l.getDate().equals(LocalDate.now())).collect(Collectors.toList()));
        return insights;
    }

    @GetMapping("/performance/weekly")
    public List<Map<String, Object>> getWeeklyPerformance(@RequestParam String username) {
        List<RoutineLog> allLogs = logRepo.findByUsername(username);
        List<Map<String, Object>> performanceData = new ArrayList<>();
        
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            List<RoutineLog> dayLogs = allLogs.stream()
                .filter(l -> l.getDate().equals(date))
                .collect(Collectors.toList());
                
            long total = dayLogs.size();
            long done = dayLogs.stream().filter(l -> "DONE".equals(l.getStatus())).count();
            int percentage = (total == 0) ? 0 : (int) (((double) done / total) * 100);
            
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("day", dayName);
            dayMap.put("percentage", percentage);
            performanceData.add(dayMap);
        }
        return performanceData;
    }

    @GetMapping("/{username}")
    public User getUser(@PathVariable String username) { return repo.findById(username).orElse(null); }
}